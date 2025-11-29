import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, Package, LogIn, LogOut, Eye, QrCode, X, Printer } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import BulkQRPrintModal from '../../components/BulkQRPrintModal';

const AssetList = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showQrModal, setShowQrModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [qrAsset, setQrAsset] = useState(null);
    const [checkoutForm, setCheckoutForm] = useState({
        checked_out_to: '',
        notes: '',
        checkout_date: '',
        expected_checkin_date: ''
    });
    const [checkoutType, setCheckoutType] = useState('user');
    const [users, setUsers] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [showBulkPrintModal, setShowBulkPrintModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);

    useEffect(() => {
        fetchAssets();
        fetchUsers();
        fetchLocations();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/assets');
            setAssets(res.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
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

    const fetchLocations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/locations');
            setLocations(res.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleDelete = (id) => {
        console.log('DELETE BUTTON CLICKED! ID:', id);
        setAssetToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!assetToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/assets/${assetToDelete}`);
            setAssets(assets.filter((asset) => asset.id !== assetToDelete));
            alert('Asset deleted successfully!');
        } catch (error) {
            console.error('Error deleting asset:', error);
            alert(error.response?.data?.message || 'Error deleting asset. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setAssetToDelete(null);
        }
    };

    const handleCheckout = (asset) => {
        setSelectedAsset(asset);
        setShowCheckoutModal(true);
        setCheckoutForm({
            checked_out_to: '',
            notes: '',
            checkout_date: new Date().toISOString().split('T')[0],
            expected_checkin_date: ''
        });
        setCheckoutType('user');
    };

    const submitCheckout = async () => {
        if (!checkoutForm.checked_out_to) {
            alert('Please select a user, location, or asset');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/assets/${selectedAsset.id}/checkout`, checkoutForm);
            setShowCheckoutModal(false);
            setCheckoutForm({
                checked_out_to: '',
                notes: '',
                checkout_date: '',
                expected_checkin_date: ''
            });
            fetchAssets();
        } catch (error) {
            console.error('Error checking out asset:', error);
        }
    };

    const handleCheckin = async (id) => {
        if (window.confirm('Are you sure you want to check in this asset?')) {
            try {
                await axios.post(`http://localhost:5000/api/assets/${id}/checkin`);
                fetchAssets();
            } catch (error) {
                console.error('Error checking in asset:', error);
            }
        }
    };

    const handleShowQr = (asset) => {
        setQrAsset(asset);
        setShowQrModal(true);
    };

    const handleSelectAsset = (assetId) => {
        setSelectedAssets(prev => {
            if (prev.includes(assetId)) {
                return prev.filter(id => id !== assetId);
            } else {
                return [...prev, assetId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedAssets.length === filteredAssets.length) {
            setSelectedAssets([]);
        } else {
            setSelectedAssets(filteredAssets.map(asset => asset.id));
        }
    };

    const handleBulkPrint = () => {
        setShowBulkPrintModal(true);
    };

    const getSelectedAssetsData = () => {
        return assets.filter(asset => selectedAssets.includes(asset.id));
    };

    const filteredAssets = assets.filter((asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCheckoutOptions = () => {
        if (checkoutType === 'user') {
            return users.map(user => ({ value: user.email, label: `${user.name} (${user.email})` }));
        } else if (checkoutType === 'location') {
            return locations.map(loc => ({ value: loc.name, label: loc.name }));
        } else {
            return assets
                .filter(asset => asset.id !== selectedAsset?.id)
                .map(asset => ({ value: asset.name, label: `${asset.name} (${asset.serial_number})` }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assets</h2>
                <div className="flex gap-3">
                    {selectedAssets.length > 0 && (
                        <button
                            onClick={handleBulkPrint}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Printer size={18} />
                            Print QR ({selectedAssets.length})
                        </button>
                    )}
                    <Link
                        to="/assets/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        + Add
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                    />
                                </th>
                                <th className="p-4">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Serial Number</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Checked Out To</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selectedAssets.includes(asset.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedAssets.includes(asset.id)}
                                            onChange={() => handleSelectAsset(asset.id)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                        />
                                    </td>
                                    <td className="p-4">
                                        {asset.image_url ? (
                                            <img
                                                src={`http://localhost:5000${asset.image_url}`}
                                                alt={asset.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                <Package size={20} className="text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{asset.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{asset.category}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300 font-mono text-sm">{asset.serial_number}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${asset.status === 'Ready to Deploy'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : asset.status === 'Deployed'
                                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                                }`}
                                        >
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {asset.checked_out_to || '-'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            {!asset.checked_out_to ? (
                                                <button
                                                    onClick={() => handleCheckout(asset)}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Check Out"
                                                >
                                                    <LogOut size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleCheckin(asset.id)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                    title="Check In"
                                                >
                                                    <LogIn size={18} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleShowQr(asset)}
                                                className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="Show QR Code"
                                            >
                                                <QrCode size={18} />
                                            </button>
                                            <Link
                                                to={`/assets/detail/${asset.id}`}
                                                className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/assets/edit/${asset.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(asset.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAssets.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No assets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredAssets.map((asset) => (
                    <div
                        key={asset.id}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${selectedAssets.includes(asset.id) ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <div className="flex">
                            <div className="flex items-center justify-center px-3 bg-gray-50 dark:bg-gray-700/50">
                                <input
                                    type="checkbox"
                                    checked={selectedAssets.includes(asset.id)}
                                    onChange={() => handleSelectAsset(asset.id)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                />
                            </div>
                            {asset.image_url ? (
                                <img
                                    src={`http://localhost:5000${asset.image_url}`}
                                    alt={asset.name}
                                    className="w-24 h-24 object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <Package size={32} className="text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1 p-4">
                                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{asset.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{asset.category}</p>
                                {asset.checked_out_to && (
                                    <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                                        Checked out to: {asset.checked_out_to}
                                    </p>
                                )}
                                <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${asset.status === 'Ready to Deploy'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : asset.status === 'Deployed'
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                        }`}
                                >
                                    {asset.status}
                                </span>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">{asset.serial_number}</span>
                            <div className="flex space-x-2">
                                {!asset.checked_out_to ? (
                                    <button
                                        onClick={() => handleCheckout(asset)}
                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleCheckin(asset.id)}
                                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                    >
                                        <LogIn size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleShowQr(asset)}
                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <QrCode size={18} />
                                </button>
                                <Link
                                    to={`/assets/detail/${asset.id}`}
                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Eye size={18} />
                                </Link>
                                <Link
                                    to={`/assets/edit/${asset.id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(asset.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredAssets.length === 0 && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        No assets found.
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Check Out Asset: {selectedAsset?.name}
                        </h3>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => {
                                    setCheckoutType('user');
                                    setCheckoutForm({ ...checkoutForm, checked_out_to: '' });
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
                                    setCheckoutForm({ ...checkoutForm, checked_out_to: '' });
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
                                    setCheckoutForm({ ...checkoutForm, checked_out_to: '' });
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
                                    value={checkoutForm.checked_out_to}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, checked_out_to: e.target.value })}
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
                                    Checkout Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.checkout_date}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, checkout_date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Expected Checkin Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.expected_checkin_date}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, expected_checkin_date: e.target.value })}
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
                                    setCheckoutForm({ checked_out_to: '', notes: '', checkout_date: '', expected_checkin_date: '' });
                                }}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitCheckout}
                                disabled={!checkoutForm.checked_out_to}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Code Modal */}
            {showQrModal && qrAsset && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 relative">
                        <button
                            onClick={() => setShowQrModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X size={24} />
                        </button>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Asset QR Code</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">{qrAsset.name}</p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm border border-gray-100">
                                <QRCodeCanvas
                                    value={`http://localhost:3000/assets/detail/${qrAsset.id}`}
                                    size={200}
                                    level={"H"}
                                />
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-mono">
                                {qrAsset.serial_number}
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
                                        a.download = `qr-${qrAsset.name.replace(/\s+/g, '-').toLowerCase()}.png`;
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this asset? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setAssetToDelete(null);
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

            {/* Bulk QR Print Modal */}
            <BulkQRPrintModal
                items={getSelectedAssetsData()}
                itemType="asset"
                isOpen={showBulkPrintModal}
                onClose={() => {
                    setShowBulkPrintModal(false);
                    setSelectedAssets([]);
                }}
                getItemUrl={(asset) => `http://localhost:3000/assets/detail/${asset.id}`}
            />
        </div>
    );
};

export default AssetList;
