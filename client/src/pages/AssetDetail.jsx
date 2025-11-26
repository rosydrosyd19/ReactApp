import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, Tag, Hash, FileText, Clock, User as UserIcon, Key } from 'lucide-react';

const AssetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [history, setHistory] = useState([]);
    const [licenses, setLicenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAsset();
        fetchHistory();
        fetchLicenses();
    }, [id]);

    const fetchAsset = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/assets/${id}`);
            setAsset(res.data);
        } catch (error) {
            console.error('Error fetching asset:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/assets/${id}/history`);
            setHistory(res.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const fetchLicenses = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/assets/${id}/licenses`);
            setLicenses(res.data);
        } catch (error) {
            console.error('Error fetching licenses:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!asset) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Asset not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/assets')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Asset Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start gap-6">
                            {asset.image_url ? (
                                <img
                                    src={`http://localhost:5000${asset.image_url}`}
                                    alt={asset.name}
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <Package size={48} className="text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{asset.name}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Tag size={18} className="mr-2" />
                                        <span className="text-sm">Category: <strong>{asset.category}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Hash size={18} className="mr-2" />
                                        <span className="text-sm font-mono">SN: <strong>{asset.serial_number}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Calendar size={18} className="mr-2" />
                                        <span className="text-sm">Purchased: <strong>{asset.purchase_date || 'N/A'}</strong></span>
                                    </div>
                                    <div>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${asset.status === 'Ready to Deploy'
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
                            </div>
                        </div>
                    </div>

                    {/* Checkout Info */}
                    {asset.checked_out_to && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Checkout Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <UserIcon size={18} className="mr-2" />
                                    <span className="text-sm">Checked Out To: <strong>{asset.checked_out_to}</strong></span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <Clock size={18} className="mr-2" />
                                    <span className="text-sm">Checked Out At: <strong>{asset.checked_out_at ? new Date(asset.checked_out_at).toLocaleString() : 'N/A'}</strong></span>
                                </div>
                                {asset.checkout_date && (
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Calendar size={18} className="mr-2" />
                                        <span className="text-sm">Checkout Date: <strong>{asset.checkout_date}</strong></span>
                                    </div>
                                )}
                                {asset.expected_checkin_date && (
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Calendar size={18} className="mr-2" />
                                        <span className="text-sm">Expected Return: <strong>{asset.expected_checkin_date}</strong></span>
                                    </div>
                                )}
                            </div>
                            {asset.notes && (
                                <div className="mt-4">
                                    <div className="flex items-start text-gray-600 dark:text-gray-300">
                                        <FileText size={18} className="mr-2 mt-1" />
                                        <div>
                                            <span className="text-sm font-medium">Notes:</span>
                                            <p className="text-sm mt-1">{asset.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Assigned Licenses */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Assigned Licenses</h4>
                        {licenses.length > 0 ? (
                            <div className="space-y-3">
                                {licenses.map((license, index) => (
                                    <div key={index} className="border-l-4 border-purple-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-1">
                                                    <Key size={16} className="mr-2 text-purple-600 dark:text-purple-400" />
                                                    <p className="font-medium text-gray-800 dark:text-white">{license.software_name}</p>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                    Key: {license.product_key}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Assigned: {new Date(license.assigned_at).toLocaleString()}
                                                </p>
                                                {license.expiration_date && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Expires: {new Date(license.expiration_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                                {license.notes && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">{license.notes}</p>
                                                )}
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No licenses assigned to this asset.</p>
                        )}
                    </div>

                    {/* Checkout History */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Checkout History</h4>
                        {history.length > 0 ? (
                            <div className="space-y-3">
                                {history.map((item, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">{item.checked_out_to}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Checked out: {new Date(item.checked_out_at).toLocaleString()}
                                                </p>
                                                {item.checked_in_at && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Checked in: {new Date(item.checked_in_at).toLocaleString()}
                                                    </p>
                                                )}
                                                {item.notes && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">{item.notes}</p>
                                                )}
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${item.checked_in_at ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                                {item.checked_in_at ? 'Returned' : 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No checkout history available.</p>
                        )}
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actions</h4>
                        <div className="space-y-3">
                            <Link
                                to={`/assets/edit/${asset.id}`}
                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                            >
                                Edit Asset
                            </Link>
                            <button
                                onClick={() => navigate('/assets')}
                                className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Metadata</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Asset ID:</span>
                                <span className="font-mono text-gray-800 dark:text-white">#{asset.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                <span className="text-gray-800 dark:text-white">{new Date(asset.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetDetail;
