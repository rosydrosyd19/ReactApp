import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, LogOut, Search, User } from 'lucide-react';

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [checkoutForm, setCheckoutForm] = useState({
        assigned_to: '',
        assigned_type: 'asset',
        notes: ''
    });
    const [assets, setAssets] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);

    useEffect(() => {
        fetchAccounts();
        fetchAssets();
        fetchLicenses();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/accounts');
            setAccounts(res.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
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

    const fetchLicenses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/licenses');
            setLicenses(res.data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
        }
    };

    const handleDelete = (id) => {
        setAccountToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!accountToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/accounts/${accountToDelete}`);
            setAccounts(accounts.filter((acc) => acc.id !== accountToDelete));
            alert('Account deleted successfully!');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.response?.data?.message || 'Error deleting account. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setAccountToDelete(null);
        }
    };

    const handleCheckout = (account) => {
        setSelectedAccount(account);
        setShowCheckoutModal(true);
        setCheckoutForm({ assigned_to: '', assigned_type: 'asset', notes: '' });
    };

    const submitCheckout = async () => {
        if (!checkoutForm.assigned_to) {
            alert('Please select an asset or license');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/accounts/${selectedAccount.id}/checkout`, checkoutForm);
            setShowCheckoutModal(false);
            fetchAccounts();
        } catch (error) {
            console.error('Error checking out account:', error);
            alert(error.response?.data?.message || 'Error assigning account');
        }
    };

    const getCheckoutOptions = () => {
        if (checkoutForm.assigned_type === 'asset') {
            return assets.map(asset => ({ value: asset.name, label: `${asset.name} (${asset.serial_number})` }));
        } else {
            return licenses.map(license => ({ value: license.id, label: `${license.software_name} (${license.product_key})` }));
        }
    };

    const filteredAccounts = accounts.filter(acc => {
        const query = searchQuery.toLowerCase();
        return (
            acc.account_name.toLowerCase().includes(query) ||
            acc.account_type.toLowerCase().includes(query) ||
            (acc.username && acc.username.toLowerCase().includes(query))
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Accounts</h2>
                <Link
                    to="/accounts/create"
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
                        placeholder="Search by name, type, or username..."
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
                ) : filteredAccounts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                        <p>{searchQuery ? 'No accounts match your search.' : 'No accounts found.'}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                <tr>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Account Name</th>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredAccounts.map((acc) => (
                                    <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize">
                                                {acc.account_type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-gray-800 dark:text-white">{acc.account_name}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-sm">{acc.username}</td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleCheckout(acc)}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Check Out"
                                                >
                                                    <LogOut size={18} />
                                                </button>
                                                <Link
                                                    to={`/accounts/detail/${acc.id}`}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    to={`/accounts/edit/${acc.id}`}
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
                ) : filteredAccounts.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No accounts match your search.' : 'No accounts found.'}
                    </div>
                ) : (
                    filteredAccounts.map((acc) => (
                        <div
                            key={acc.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex items-start mb-3">
                                    <div className="mr-3">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <User size={24} className="text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{acc.account_name}</h3>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p><span className="font-medium">Type:</span> <span className="capitalize">{acc.account_type}</span></p>
                                            <p><span className="font-medium">Username:</span> {acc.username}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleCheckout(acc)}
                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                    <Link
                                        to={`/accounts/detail/${acc.id}`}
                                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                    <Link
                                        to={`/accounts/edit/${acc.id}`}
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
                            Check Out: {selectedAccount?.account_name}
                        </h3>

                        <div className="space-y-4">
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() => setCheckoutForm({ ...checkoutForm, assigned_to: '', assigned_type: 'asset' })}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${checkoutForm.assigned_type === 'asset'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    Asset
                                </button>
                                <button
                                    onClick={() => setCheckoutForm({ ...checkoutForm, assigned_to: '', assigned_type: 'license' })}
                                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${checkoutForm.assigned_type === 'license'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    License
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Select {checkoutForm.assigned_type === 'asset' ? 'Asset' : 'License'}
                                </label>
                                <select
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.assigned_to}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, assigned_to: e.target.value })}
                                >
                                    <option value="">-- Select {checkoutForm.assigned_type === 'asset' ? 'Asset' : 'License'} --</option>
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
                                    setCheckoutForm({ assigned_to: '', assigned_type: 'asset', notes: '' });
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this account? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setAccountToDelete(null);
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

export default AccountList;
