import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package, FileText, LogIn, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const ComponentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComponent();
    }, [id]);

    const fetchComponent = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/components/${id}`);
            setComponent(res.data);
        } catch (error) {
            console.error('Error fetching component:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (assignmentId) => {
        if (window.confirm('Are you sure you want to check in this component?')) {
            try {
                await axios.post(`http://localhost:5000/api/components/${id}/checkin`, {
                    assignment_id: assignmentId
                });
                fetchComponent();
            } catch (error) {
                console.error('Error checking in component:', error);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!component) return <div className="p-8 text-center text-gray-500">Component not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/components')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Components
                </button>
                <Link
                    to={`/components/edit/${id}`}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Edit size={18} className="mr-2" />
                    Edit Component
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start mb-6">
                            <div className="mr-6">
                                {component.image_url ? (
                                    <img
                                        src={`http://localhost:5000${component.image_url}`}
                                        alt={component.name}
                                        className="w-32 h-32 rounded-xl object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <Package size={48} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{component.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{component.category}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Model Number</label>
                                    <p className="font-medium text-gray-800 dark:text-white font-mono">{component.model_number || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Total Quantity</label>
                                    <p className="font-medium text-gray-800 dark:text-white">{component.total_quantity}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Available Quantity</label>
                                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${component.available_quantity > 0
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {component.available_quantity}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Minimum Quantity</label>
                                    <p className="font-medium text-gray-800 dark:text-white">{component.min_quantity || '0'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Notes</label>
                                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{component.notes || '-'}</p>
                                </div>
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
                                        <th className="p-4">Asset</th>
                                        <th className="p-4">Quantity</th>
                                        <th className="p-4">Assigned Date</th>
                                        <th className="p-4">Notes</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {component.assignments && component.assignments.map((assignment) => (
                                        <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-800 dark:text-white">
                                                {assignment.assigned_to}
                                                {assignment.asset_name && (
                                                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                                                        SN: {assignment.serial_number}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">{assignment.quantity}</td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">
                                                {new Date(assignment.assigned_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-gray-600 dark:text-gray-300">{assignment.notes || '-'}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleCheckin(assignment.id)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                    title="Check In"
                                                >
                                                    <LogIn size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!component.assignments || component.assignments.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                                No assignment history found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info (Stats) */}
                <div className="space-y-6">
                    {/* QR Code Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 text-center">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
                            <QrCode size={20} />
                            Component QR Code
                        </h3>
                        <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-sm border border-gray-100">
                            <QRCodeCanvas
                                value={`http://localhost:3000/components/detail/${component.id}`}
                                size={150}
                                level={"H"}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
                            {component.model_number || 'No Model Number'}
                        </p>
                        <button
                            onClick={() => {
                                const canvas = document.querySelector('canvas');
                                const url = canvas.toDataURL('image/png');
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `qr-${component.name.replace(/\s+/g, '-').toLowerCase()}.png`;
                                a.click();
                            }}
                            className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium"
                        >
                            Download QR Code
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400">Total Units</span>
                                <span className="font-bold text-gray-800 dark:text-white">{component.total_quantity}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <span className="text-green-700 dark:text-green-400">Available</span>
                                <span className="font-bold text-green-700 dark:text-green-400">{component.available_quantity}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <span className="text-blue-700 dark:text-blue-400">Assigned</span>
                                <span className="font-bold text-blue-700 dark:text-blue-400">
                                    {component.total_quantity - component.available_quantity}
                                </span>
                            </div>
                            {component.min_quantity > 0 && (
                                <div className={`flex justify-between items-center p-3 rounded-lg ${component.available_quantity <= component.min_quantity
                                    ? 'bg-red-50 dark:bg-red-900/20'
                                    : 'bg-gray-50 dark:bg-gray-700/50'
                                    }`}>
                                    <span className={component.available_quantity <= component.min_quantity
                                        ? 'text-red-700 dark:text-red-400'
                                        : 'text-gray-600 dark:text-gray-400'
                                    }>
                                        Min. Quantity
                                    </span>
                                    <span className={`font-bold ${component.available_quantity <= component.min_quantity
                                        ? 'text-red-700 dark:text-red-400'
                                        : 'text-gray-800 dark:text-white'
                                        }`}>
                                        {component.min_quantity}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentDetail;
