import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, LogIn, Calendar, Key, Users, Edit } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';

import { useLayout } from '../../../core/context/LayoutContext';

const LicenseDetail = () => {
    const { hasPermission } = useAuth();
    const { setTitle } = useLayout();
    const { id } = useParams();
    const navigate = useNavigate();
    const [license, setLicense] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLicenseDetails();
        fetchAssignments();
        fetchAccounts();
    }, [id]);

    useEffect(() => {
        if (license) {
            setTitle(license.software_name);
        }
    }, [license, setTitle]);

    const fetchLicenseDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/licenses/${id}`);
            setLicense(res.data);
        } catch (error) {
            console.error('Error fetching license:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/licenses/${id}/assignments`);
            setAssignments(res.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleCheckin = async (assignmentId) => {
        if (window.confirm('Are you sure you want to return this license seat?')) {
            try {
                await axios.post(`http://localhost:5000/api/licenses/${id}/checkin/${assignmentId}`);
                fetchLicenseDetails();
                fetchAssignments();
            } catch (error) {
                console.error('Error checking in license:', error);
            }
        }
    };

    const fetchAccounts = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/licenses/${id}/accounts`);
            setAccounts(res.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const currentAssignments = assignments.filter(a => !a.returned_at);
    const history = assignments.filter(a => a.returned_at);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!license) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">License not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/licenses')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{license.software_name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FileText size={32} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{license.software_name}</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${license.available_seats > 0
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        <Users size={16} className="mr-1.5" />
                                        {license.available_seats} of {license.seats} seats available
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">License Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Key size={18} className="mr-2" />
                                        <span className="text-sm">Product Key: <strong className="font-mono">{license.product_key}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Users size={18} className="mr-2" />
                                        <span className="text-sm">Total Seats: <strong>{license.seats}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Calendar size={18} className="mr-2" />
                                        <span className="text-sm">Purchase Date: <strong>{license.purchase_date ? new Date(license.purchase_date).toLocaleDateString() : 'N/A'}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Calendar size={18} className="mr-2" />
                                        <span className="text-sm">Expiration Date: <strong>{license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : 'N/A'}</strong></span>
                                    </div>
                                </div>
                                {license.notes && (
                                    <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                                            <FileText size={18} className="mr-2 mt-1" />
                                            <div>
                                                <span className="text-sm font-medium">Notes:</span>
                                                <p className="text-sm mt-1">{license.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Current Assignments */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Current Assignments</h4>
                        {currentAssignments.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No current assignments</p>
                        ) : (
                            <div className="space-y-3">
                                {currentAssignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 dark:text-white">{assignment.assigned_to}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                <span className="capitalize">{assignment.assigned_type}</span> • Assigned {new Date(assignment.assigned_at).toLocaleString()}
                                            </p>
                                            {assignment.notes && (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{assignment.notes}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleCheckin(assignment.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm"
                                            title="Return License Seat"
                                        >
                                            <LogIn size={16} />
                                            <span className="hidden sm:inline">Check In</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assigned Accounts */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Assigned Accounts</h4>
                        {accounts.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No accounts assigned to this license</p>
                        ) : (
                            <div className="space-y-3">
                                {accounts.map((account, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-orange-500"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 dark:text-white mb-1">{account.account_name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                    Type: {account.account_type}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                                                    Username: {account.username}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Assigned: {new Date(account.assigned_at).toLocaleString()}
                                                </p>
                                                {account.notes && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">{account.notes}</p>
                                                )}
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Assignment History */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Assignment History</h4>
                        {history.length > 0 ? (
                            <div className="space-y-3">
                                {history.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                    >
                                        <p className="font-medium text-gray-800 dark:text-white">{assignment.assigned_to}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {assignment.assigned_type} •
                                            Assigned {new Date(assignment.assigned_at).toLocaleString()} •
                                            Returned {new Date(assignment.returned_at).toLocaleString()}
                                        </p>
                                        {assignment.notes && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{assignment.notes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No assignment history available.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actions</h4>
                        <div className="space-y-3">
                            {hasPermission('licenses.update') && (
                                <Link
                                    to={`/licenses/edit/${license.id}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                                >
                                    Edit License
                                </Link>
                            )}
                            <button
                                onClick={() => navigate('/licenses')}
                                className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Metadata</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">License ID:</span>
                                <span className="font-mono text-gray-800 dark:text-white">#{license.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                <span className="text-gray-800 dark:text-white">{new Date(license.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LicenseDetail;
