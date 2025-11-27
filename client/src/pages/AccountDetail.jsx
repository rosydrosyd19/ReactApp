import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, LogIn, Package, Key, Eye, EyeOff } from 'lucide-react';

const AccountDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchAccount();
    }, [id]);

    const fetchAccount = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/accounts/${id}`);
            setAccount(res.data);
        } catch (error) {
            console.error('Error fetching account:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckin = async (assignmentId) => {
        if (window.confirm('Are you sure you want to check in this account?')) {
            try {
                await axios.post(`http://localhost:5000/api/accounts/${id}/checkin`, {
                    assignment_id: assignmentId
                });
                fetchAccount();
            } catch (error) {
                console.error('Error checking in account:', error);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!account) return <div className="p-8 text-center text-gray-500">Account not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/accounts')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Accounts
                </button>
                <Link
                    to={`/accounts/edit/${id}`}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Edit size={18} className="mr-2" />
                    Edit Account
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start mb-6">
                            <div className="mr-6">
                                <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <User size={48} className="text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{account.account_name}</h1>
                                <p className="text-gray-500 dark:text-gray-400 capitalize">{account.account_type}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Account Type</label>
                                    <p className="font-medium text-gray-800 dark:text-white capitalize">{account.account_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Username/Email</label>
                                    <p className="font-medium text-gray-800 dark:text-white font-mono">{account.username}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Password</label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-800 dark:text-white font-mono flex-1">
                                            {account.password ? (showPassword ? account.password : '••••••••') : '-'}
                                        </p>
                                        {account.password && (
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Notes</label>
                                    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{account.notes || '-'}</p>
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
                                        <th className="p-4">Assigned Date</th>
                                        <th className="p-4">Notes</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {account.assignments && account.assignments.map((assignment) => (
                                        <tr key={assignment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-800 dark:text-white">
                                                {assignment.assigned_name || assignment.assigned_to}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center text-gray-600 dark:text-gray-300 capitalize">
                                                    {assignment.assigned_type === 'asset' && <Package size={16} className="mr-2" />}
                                                    {assignment.assigned_type === 'license' && <Key size={16} className="mr-2" />}
                                                    {assignment.assigned_type}
                                                </div>
                                            </td>
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
                                    {(!account.assignments || account.assignments.length === 0) && (
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

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-gray-600 dark:text-gray-400">Total Assignments</span>
                                <span className="font-bold text-gray-800 dark:text-white">
                                    {account.assignments ? account.assignments.length : 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <span className="text-purple-700 dark:text-purple-400">Account Type</span>
                                <span className="font-bold text-purple-700 dark:text-purple-400 capitalize">
                                    {account.account_type}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Metadata</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Account ID:</span>
                                <span className="font-mono text-gray-800 dark:text-white">#{account.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                <span className="text-gray-800 dark:text-white">
                                    {new Date(account.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetail;
