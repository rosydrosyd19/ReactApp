import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Package, Eye, LogOut, LogIn, Search, QrCode, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const AccessoryList = () => {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedAccessory, setSelectedAccessory] = useState(null);
    const [qrItem, setQrItem] = useState(null);
    const [checkoutForm, setCheckoutForm] = useState({
        assigned_to: '',
        quantity: 1,
        notes: ''
    });
    const [checkoutType, setCheckoutType] = useState('user');
    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);
    const [locations, setLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAccessories();
        fetchUsers();
        fetchAssets();
        fetchLocations();
    }, []);

    const fetchAccessories = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/accessories');
            setAccessories(res.data);
        } catch (error) {
            console.error('Error fetching accessories:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
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

    const fetchLocations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/locations');
            setLocations(res.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this accessory?')) {
            try {
                await axios.delete(`http://localhost:5000/api/accessories/${id}`);
                setAccessories(accessories.filter((acc) => acc.id !== id));
            } catch (error) {
                console.error('Error deleting accessory:', error);
            }
        }
    };

    const handleCheckout = (accessory) => {
        setSelectedAccessory(accessory);
        setShowCheckoutModal(true);
        setCheckoutForm({ assigned_to: '', quantity: 1, notes: '' });
        setCheckoutType('user');
    };

    const handleShowQr = (item) => {
        setQrItem(item);
        setShowQrModal(true);
    };

    const submitCheckout = async () => {
        if (!checkoutForm.assigned_to) {
            alert('Please select a user, asset, or location');
            return;
        }
        if (checkoutForm.quantity > selectedAccessory.available_quantity) {
            alert('Quantity exceeds available stock');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/accessories/${selectedAccessory.id}/checkout`, {
                ...checkoutForm,
                assigned_type: checkoutType
            });
            setShowCheckoutModal(false);
            fetchAccessories();
        } catch (error) {
            console.error('Error checking out accessory:', error);
            alert(error.response?.data?.message || 'Error assigning accessory');
        }
    };

    const getCheckoutOptions = () => {
        if (checkoutType === 'user') {
            return users.map(user => ({ value: user.email, label: `${user.name} (${user.email})` }));
        } else if (checkoutType === 'location') {
            return locations.map(loc => ({ value: loc.name, label: loc.name }));
        } else {
            return assets.map(asset => ({ value: asset.name, label: `${asset.name} (${asset.serial_number})` }));
        }
    };

    // Filter accessories based on search query
    const filteredAccessories = accessories.filter(acc => {
        const query = searchQuery.toLowerCase();
        return (
            acc.name.toLowerCase().includes(query) ||
            (acc.category && acc.category.toLowerCase().includes(query)) ||
            (acc.model_number && acc.model_number.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-row justify-between items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Accessories</h1>
                <Link
                    to="/accessories/create"
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
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                ) : filteredAccessories.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p>{searchQuery ? 'No accessories match your search.' : 'No accessories found.'}</p>
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
                                {filteredAccessories.map((acc) => (
                                    <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4">
                                            {acc.image_url ? (
                                                <img
                                                    src={`http://localhost:5000${acc.image_url}`}
                                                    alt={acc.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                    <Package size={20} className="text-gray-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium text-gray-800 dark:text-white">
                                            {acc.name}
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{acc.category || '-'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-sm">{acc.model_number || '-'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{acc.total_quantity}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${acc.available_quantity > 0
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {acc.available_quantity}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                {acc.available_quantity > 0 && (
                                                    <button
                                                        onClick={() => handleCheckout(acc)}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Check Out"
                                                    >
                                                        <LogOut size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleShowQr(acc)}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="Show QR Code"
                                                >
                                                    <QrCode size={18} />
                                                </button>
                                                <Link
                                                    to={`/accessories/detail/${acc.id}`}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`/accessories/edit/${acc.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(acc.id)}
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
                ) : filteredAccessories.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No accessories match your search.' : 'No accessories found.'}
                    </div>
                ) : (
                    filteredAccessories.map((acc) => (
                        <div
                            key={acc.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-start mb-3">
                                    <div className="mr-3">
                                        {acc.image_url ? (
                                            <img
                                                src={`http://localhost:5000${acc.image_url}`}
                                                alt={acc.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <Package size={24} className="text-blue-600 dark:text-blue-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{acc.name}</h3>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p><span className="font-medium">Category:</span> {acc.category || '-'}</p>
                                            <p><span className="font-medium">Model:</span> {acc.model_number || '-'}</p>
                                            <p><span className="font-medium">Quantity:</span> {acc.available_quantity} / {acc.total_quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center">
                                <div className="flex space-x-2">
                                    {acc.available_quantity > 0 && (
                                        <button
                                            onClick={() => handleCheckout(acc)}
                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleShowQr(acc)}
                                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <QrCode size={18} />
                                    </button>
                                    <Link
                                        to={`/accessories/detail/${acc.id}`}
                                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/accessories/edit/${acc.id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(acc.id)}
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
                            Check Out: {selectedAccessory?.name}
                        </h3>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => {
                                    setCheckoutType('user');
                                    setCheckoutForm({ ...checkoutForm, assigned_to: '' });
                                }}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${checkoutType === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                User
                            </button>
                            <button
                                onClick={() => {
                                    setCheckoutType('location');
                                    setCheckoutForm({ ...checkoutForm, assigned_to: '' });
                                }}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${checkoutType === 'location'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Location
                            </button>
                            <button
                                onClick={() => {
                                    setCheckoutType('asset');
                                    setCheckoutForm({ ...checkoutForm, assigned_to: '' });
                                }}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${checkoutType === 'asset'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Asset
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {checkoutType === 'user' ? 'Select User' : checkoutType === 'location' ? 'Select Location' : 'Select Asset'}
                                </label>
                                <select
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.assigned_to}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, assigned_to: e.target.value })}
                                >
                                    <option value="">-- Select {checkoutType === 'user' ? 'User' : checkoutType === 'location' ? 'Location' : 'Asset'} --</option>
                                    {getCheckoutOptions().map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Quantity (Max: {selectedAccessory?.available_quantity})
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedAccessory?.available_quantity}
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

            {/* QR Code Modal */}
            {showQrModal && qrItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 relative">
                        <button
                            onClick={() => setShowQrModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X size={24} />
                        </button>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Accessory QR Code</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">{qrItem.name}</p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm border border-gray-100">
                                <QRCodeCanvas
                                    value={`http://localhost:3000/accessories/detail/${qrItem.id}`}
                                    size={200}
                                    level={"H"}
                                />
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono">
                                {qrItem.model_number || 'No Model Number'}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowQrModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        const canvas = document.querySelector('canvas');
                                        const url = canvas.toDataURL('image/png');
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `qr-${qrItem.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                                        a.click();
                                    }}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessoryList;
