import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, FileText, Eye, LogOut, LogIn, Search } from 'lucide-react';

const Licenses = () => {
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);
    const [checkoutForm, setCheckoutForm] = useState({
        assigned_to: '',
        notes: ''
    });
    const [checkoutType, setCheckoutType] = useState('user');
    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [licenseToDelete, setLicenseToDelete] = useState(null);

    useEffect(() => {
        fetchLicenses();
        fetchUsers();
        fetchAssets();
    }, []);

    const fetchLicenses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/licenses');
            setLicenses(res.data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
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

    const handleDelete = (id) => {
        setLicenseToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!licenseToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/licenses/${licenseToDelete}`);
            setLicenses(licenses.filter((license) => license.id !== licenseToDelete));
            alert('License deleted successfully!');
        } catch (error) {
            console.error('Error deleting license:', error);
            alert(error.response?.data?.message || 'Error deleting license. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setLicenseToDelete(null);
        }
    };

    const handleCheckout = (license) => {
        setSelectedLicense(license);
        setShowCheckoutModal(true);
        setCheckoutForm({ assigned_to: '', notes: '' });
        setCheckoutType('user');
    };

    const submitCheckout = async () => {
        if (!checkoutForm.assigned_to) {
            alert('Please select a user or asset');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/licenses/${selectedLicense.id}/checkout`, {
                ...checkoutForm,
                assigned_type: checkoutType
            });
            setShowCheckoutModal(false);
            fetchLicenses();
        } catch (error) {
            console.error('Error checking out license:', error);
            alert(error.response?.data?.message || 'Error assigning license');
        }
    };

    const getCheckoutOptions = () => {
        if (checkoutType === 'user') {
            return users.map(user => ({ value: user.email, label: `${user.name} (${user.email})` }));
        } else {
            return assets.map(asset => ({ value: asset.name, label: `${asset.name} (${asset.serial_number})` }));
        }
    };

    // Filter licenses based on search query
    const filteredLicenses = licenses.filter(license => {
        const query = searchQuery.toLowerCase();
        return (
            license.software_name.toLowerCase().includes(query) ||
            license.product_key.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Licenses</h2>
                <Link
                    to="/licenses/create"
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
                        placeholder="Search by software name or product key..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">Loading...</div>
                ) : filteredLicenses.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p>{searchQuery ? 'No licenses match your search.' : 'No licenses found.'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <tr>
                                    <th className="p-4">Software Name</th>
                                    <th className="p-4">Product Key</th>
                                    <th className="p-4">Seats</th>
                                    <th className="p-4">Available</th>
                                    <th className="p-4">Expiration Date</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredLicenses.map((license) => (
                                    <tr key={license.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800 dark:text-white flex items-center">
                                            <FileText size={18} className="mr-2 text-blue-500" />
                                            {license.software_name}
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-sm">{license.product_key}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{license.seats}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${license.available_seats > 0
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {license.available_seats}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            {license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                {license.available_seats > 0 && (
                                                    <button
                                                        onClick={() => handleCheckout(license)}
                                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                        title="Assign Seat"
                                                    >
                                                        <LogOut size={18} />
                                                    </button>
                                                )}
                                                <Link
                                                    to={`/licenses/detail/${license.id}`}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`/licenses/edit/${license.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(license.id)}
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
                ) : filteredLicenses.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No licenses match your search.' : 'No licenses found.'}
                    </div>
                ) : (
                    filteredLicenses.map((license) => (
                        <div
                            key={license.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-start mb-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                        <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{license.software_name}</h3>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p><span className="font-medium">Key:</span> <span className="font-mono">{license.product_key}</span></p>
                                            <p><span className="font-medium">Seats:</span> {license.seats}
                                                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${license.available_seats > 0
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {license.available_seats} available
                                                </span>
                                            </p>
                                            <p><span className="font-medium">Expires:</span> {license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center">
                                <div className="flex space-x-2">
                                    {license.available_seats > 0 && (
                                        <button
                                            onClick={() => handleCheckout(license)}
                                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                        >
                                            <LogOut size={18} />
                                        </button>
                                    )}
                                    <Link
                                        to={`/licenses/detail/${license.id}`}
                                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/licenses/edit/${license.id}`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(license.id)}
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
                            Assign License: {selectedLicense?.software_name}
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
                                    {checkoutType === 'user' ? 'Select User' : 'Select Asset'}
                                </label>
                                <select
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.assigned_to}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, assigned_to: e.target.value })}
                                >
                                    <option value="">-- Select {checkoutType === 'user' ? 'User' : 'Asset'} --</option>
                                    {getCheckoutOptions().map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
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
                                    setCheckoutForm({ assigned_to: '', notes: '' });
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
                                Assign Seat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this license? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setLicenseToDelete(null);
                                }}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Licenses;
