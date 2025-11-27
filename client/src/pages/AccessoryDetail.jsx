import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package, Calendar, DollarSign, FileText, User, MapPin, LogIn } from 'lucide-react';

const AccessoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [accessory, setAccessory] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccessory();
        fetchAssignments();
    }, [id]);

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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!accessory) return <div className="p-8 text-center text-gray-500">Accessory not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/accessories')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Accessories
                </button>
                <Link
                    to={`/accessories/edit/${id}`}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Edit size={18} className="mr-2" />
                    Edit Accessory
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start mb-6">
                            <div className="mr-6">
                                {accessory.image_url ? (
                                    <img
                                        src={`http://localhost:5000${accessory.image_url}`}
                                        alt={accessory.name}
                                        className="w-32 h-32 rounded-xl object-cover shadow-sm"
                                    />
                                ) : (
                                    <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                        <Package size={48} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{accessory.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{accessory.category}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Manufacturer</label>
                                    <p className="font-medium text-gray-800 dark:text-white">{accessory.manufacturer || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Model Number</label>
                                    <p className="font-medium text-gray-800 dark:text-white font-mono">{accessory.model_number || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Total Quantity</label>
                                    <p className="font-medium text-gray-800 dark:text-white">{accessory.total_quantity}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Available Quantity</label>
                                    <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${accessory.available_quantity > 0
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {accessory.available_quantity}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Purchase Date</label>
                                    <div className="flex items-center text-gray-800 dark:text-white">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        {accessory.purchase_date ? new Date(accessory.purchase_date).toLocaleDateString() : '-'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Cost</label>
                                    <div className="flex items-center text-gray-800 dark:text-white">
                                        <DollarSign size={16} className="mr-2 text-gray-400" />
                                        {accessory.cost || '-'}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Notes</label>
                                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{accessory.notes || '-'}</p>
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

                {/* Sidebar Info (Stats) */}
                <div className="space-y-6">
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
                </div>
            </div>
        </div>
    );
};

export default AccessoryDetail;
