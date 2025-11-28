import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, LogIn, Calendar, Key, Users } from 'lucide-react';

const LicenseDetail = () => {
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
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (!license) {
        return <div className="p-6 text-center">License not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/licenses')}
                    className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">License Details</h1>
            </div>

            {/* License Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <div className="flex items-start mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
                        <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{license.software_name}</h2>

                        {/* Available Seats Badge */}
                        <div className="mb-4">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${license.available_seats > 0
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                <Users size={16} className="mr-1.5" />
                                {license.available_seats} of {license.seats} seats available
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center mb-1">
                                    <Key size={16} className="mr-2" />
                                    Product Key
                                </p>
                                <p className="font-mono text-gray-800 dark:text-white">{license.product_key}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center mb-1">
                                    <Users size={16} className="mr-2" />
                                    Total Seats
                                </p>
                                <p className="text-gray-800 dark:text-white">
                                    {license.seats} {license.seats === 1 ? 'seat' : 'seats'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center mb-1">
                                    <Calendar size={16} className="mr-2" />
                                    Purchase Date
                                </p>
                                <p className="text-gray-800 dark:text-white">
                                    {license.purchase_date ? new Date(license.purchase_date).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center mb-1">
                                    <Calendar size={16} className="mr-2" />
                                    Expiration Date
                                </p>
                                <p className="text-gray-800 dark:text-white">
                                    {license.expiration_date ? new Date(license.expiration_date).toLocaleDateString() : '-'}
                                </p>
                            </div>
                        </div>
                        {license.notes && (
                            <div className="mt-4">
                                <p className="text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                                <p className="text-gray-800 dark:text-white">{license.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Current Assignments */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Current Assignments</h3>
                {currentAssignments.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No current assignments</p>
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
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                                    title="Return License Seat"
                                >
                                    <LogIn size={18} />
                                    <span className="hidden sm:inline">Check In</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Assigned Accounts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Assigned Accounts</h3>
                {accounts.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No accounts assigned to this license</p>
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
            {history.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Assignment History</h3>
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
                </div>
            )}
        </div>
    );
};

export default LicenseDetail;
