import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package, Calendar, DollarSign, FileText, User, MapPin, LogIn, QrCode, Layers } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../../../core/context/AuthContext';

import { useLayout } from '../../../core/context/LayoutContext';

const AccessoryDetail = () => {
    const { hasPermission } = useAuth();
    const { setTitle } = useLayout();
    const { id } = useParams();
    const navigate = useNavigate();
    const [accessory, setAccessory] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccessory();
        fetchAssignments();
    }, [id]);

    useEffect(() => {
        if (accessory) {
            setTitle(accessory.name);
        }
    }, [accessory, setTitle]);

    const fetchAccessory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/accessories/${id}`);
            setAccessory(res.data);
        } catch (error) {
            console.error('Error fetching accessory:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/accessories/${id}/assignments`);
            setAssignments(res.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleCheckin = async (assignmentId) => {
        if (window.confirm('Are you sure you want to check in this item?')) {
            try {
                await axios.post(`http://localhost:5000/api/accessories/${id}/checkin/${assignmentId}`);
                fetchAccessory();
                fetchAssignments();
            } catch (error) {
                console.error('Error checking in accessory:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!accessory) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Accessory not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/accessories')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{accessory.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start gap-6 mb-6">
                            {accessory.image_url ? (
                                <img
                                    src={`http://localhost:5000${accessory.image_url}`}
                                    alt={accessory.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Package size={48} className="text-blue-600 dark:text-blue-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{accessory.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                                        {accessory.category}
                                    </span>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${accessory.available_quantity > 0
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {accessory.available_quantity} Available
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">General Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Layers size={18} className="mr-2" />
                                        <span className="text-sm">Manufacturer: <strong>{accessory.manufacturer || '-'}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <FileText size={18} className="mr-2" />
                                        <span className="text-sm">Model No: <strong className="font-mono">{accessory.model_number || '-'}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Calendar size={18} className="mr-2" />
                                        <span className="text-sm">Purchased: <strong>{accessory.purchase_date ? new Date(accessory.purchase_date).toLocaleDateString() : '-'}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <DollarSign size={18} className="mr-2" />
                                        <span className="text-sm">Cost: <strong>{accessory.cost || '-'}</strong></span>
                                    </div>
                                </div>
                                {accessory.notes && (
                                    <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                                            <FileText size={18} className="mr-2 mt-1" />
                                            <div>
                                                <span className="text-sm font-medium">Notes:</span>
                                                <p className="text-sm mt-1">{accessory.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Assignment History */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">Assignment History</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                    <tr>
                                        <th className="p-4">Assigned To</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Quantity</th>
                                        <th className="p-4">Assigned Date</th>
                                        <th className="p-4">Returned Date</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {assignments.map((assignment) => (
                                        <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-800 dark:text-white">
                                                {assignment.assigned_to}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center text-gray-600 dark:text-gray-300 capitalize">
                                                    {assignment.assigned_type === 'user' && <User size={16} className="mr-2" />}
                                                    {assignment.assigned_type === 'asset' && <Package size={16} className="mr-2" />}
                                                    {assignment.assigned_type === 'location' && <MapPin size={16} className="mr-2" />}
                                                    {assignment.assigned_type}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">{assignment.quantity}</td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">
                                                {new Date(assignment.assigned_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">
                                                {assignment.returned_at ? (
                                                    <span className="text-green-600 dark:text-green-400">
                                                        {new Date(assignment.returned_at).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-orange-500">Active</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {!assignment.returned_at && (
                                                    <button
                                                        onClick={() => handleCheckin(assignment.id)}
                                                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                        title="Check In"
                                                    >
                                                        <LogIn size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {assignments.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                No assignment history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actions</h4>
                        <div className="space-y-3">
                            {hasPermission('accessories.update') && (
                                <Link
                                    to={`/accessories/edit/${id}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                                >
                                    Edit Accessory
                                </Link>
                            )}
                            <button
                                onClick={() => navigate('/accessories')}
                                className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    {/* QR Code Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
                            <QrCode size={20} />
                            Accessory QR Code
                        </h3>
                        <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm border border-gray-100">
                            <QRCodeCanvas
                                value={`http://localhost:3000/accessories/detail/${accessory.id}`}
                                size={150}
                                level={"H"}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
                            {accessory.model_number || 'No Model Number'}
                        </p>
                        <button
                            onClick={() => {
                                const canvas = document.querySelector('canvas');
                                const url = canvas.toDataURL('image/png');
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `qr-${accessory.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                                a.click();
                            }}
                            className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium"
                        >
                            Download QR Code
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400">Total Units</span>
                                <span className="font-bold text-gray-800 dark:text-white">{accessory.total_quantity}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="text-green-700 dark:text-green-400">Available</span>
                                <span className="font-bold text-green-700 dark:text-green-400">{accessory.available_quantity}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <span className="text-blue-700 dark:text-blue-400">Assigned</span>
                                <span className="font-bold text-blue-700 dark:text-blue-400">
                                    {accessory.total_quantity - accessory.available_quantity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Metadata</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Accessory ID:</span>
                                <span className="font-mono text-gray-800 dark:text-white">#{accessory.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                <span className="text-gray-800 dark:text-white">{new Date(accessory.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessoryDetail;
