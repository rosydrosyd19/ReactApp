import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Package, Eye, LogOut, Search } from 'lucide-react';

const ComponentList = () => {
    const [components, setComponents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [checkoutForm, setCheckoutForm] = useState({
        assigned_to: '',
        quantity: 1,
        notes: ''
    });
    const [assets, setAssets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchComponents();
        fetchAssets();
    }, []);

    const fetchComponents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/components');
            setComponents(res.data);
        } catch (error) {
            console.error('Error fetching components:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/assets');
            setAssets(res.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this component?')) {
            try {
                await axios.delete(`http://localhost:5000/api/components/${id}`);
                setComponents(components.filter((comp) => comp.id !== id));
            } catch (error) {
                console.error('Error deleting component:', error);
            }
        }
    };

    const handleCheckout = (component) => {
        setSelectedComponent(component);
        setShowCheckoutModal(true);
        setCheckoutForm({ assigned_to: '', quantity: 1, notes: '' });
    };

    const submitCheckout = async () => {
        if (!checkoutForm.assigned_to) {
            alert('Please select an asset');
            return;
        }
        if (checkoutForm.quantity > selectedComponent.available_quantity) {
            alert('Quantity exceeds available stock');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/components/${selectedComponent.id}/checkout`, checkoutForm);
            setShowCheckoutModal(false);
            fetchComponents();
        } catch (error) {
            console.error('Error checking out component:', error);
            alert(error.response?.data?.message || 'Error assigning component');
        }
    };

    const filteredComponents = components.filter(comp => {
        const query = searchQuery.toLowerCase();
        return (
            comp.name.toLowerCase().includes(query) ||
            (comp.category && comp.category.toLowerCase().includes(query)) ||
            (comp.model_number && comp.model_number.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Components</h2>
                <Link
                    to="/components/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    + Add
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, category, or model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                ) : filteredComponents.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p>{searchQuery ? 'No components match your search.' : 'No components found.'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <tr>
                                    <th className="p-4">Image</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Model No.</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Available</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredComponents.map((comp) => (
                                    <tr key={comp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4">
                                            {comp.image_url ? (
                                                <img
                                                    src={`http://localhost:5000${comp.image_url}`}
                                                    alt={comp.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                    <Package size={20} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium text-gray-800 dark:text-white">
                                            {comp.name}
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{comp.category || '-'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-sm">{comp.model_number || '-'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{comp.total_quantity}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${comp.available_quantity > 0
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {comp.available_quantity}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                {comp.available_quantity > 0 && (
                                                    <button
                                                        onClick={() => handleCheckout(comp)}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Check Out"
                                                    >
                                                        <LogOut size={18} />
                                                    </button>
                                                )}
                                                <Link
                                                    to={`/components/detail/${comp.id}`}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`/components/edit/${comp.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(comp.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="text-center text-gray-500 dark:text-gray-400">Loading...</div>
                ) : filteredComponents.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No components match your search.' : 'No components found.'}
                    </div>
                ) : (
                    filteredComponents.map((comp) => (
                        <div
                            key={comp.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-start mb-3">
                                    <div className="mr-3">
                                        {comp.image_url ? (
                                            <img
                                                src={`http://localhost:5000${comp.image_url}`}
                                                alt={comp.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <Package size={24} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{comp.name}</h3>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p><span className="font-medium">Category:</span> {comp.category || '-'}</p>
                                            <p><span className="font-medium">Model:</span> {comp.model_number || '-'}</p>
                                            <p><span className="font-medium">Quantity:</span> {comp.available_quantity} / {comp.total_quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center">
                                <div className="flex space-x-2">
                                    {comp.available_quantity > 0 && (
                                        <button
                                            onClick={() => handleCheckout(comp)}
                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    )}
                                    <Link
                                        to={`/components/detail/${comp.id}`}
                                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/components/edit/${comp.id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(comp.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Check Out: {selectedComponent?.name}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Select Asset
                                </label>
                                <select
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.assigned_to}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, assigned_to: e.target.value })}
                                >
                                    <option value="">-- Select Asset --</option>
                                    {assets.map((asset) => (
                                        <option key={asset.id} value={asset.name}>
                                            {asset.name} ({asset.serial_number})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Quantity (Max: {selectedComponent?.available_quantity})
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedComponent?.available_quantity}
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.quantity}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, quantity: parseInt(e.target.value) || 1 })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    rows="3"
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.notes}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCheckoutModal(false);
                                    setCheckoutForm({ assigned_to: '', quantity: 1, notes: '' });
                                }}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitCheckout}
                                disabled={!checkoutForm.assigned_to}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComponentList;
