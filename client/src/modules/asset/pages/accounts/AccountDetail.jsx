import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, User, LogIn, Package, Key, Eye, EyeOff, FileText, Calendar, Layers } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';

import { useLayout } from '../../../core/context/LayoutContext';

const AccountDetail = () => {
    const { hasPermission } = useAuth();
    const { setTitle } = useLayout();
    const { id } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchAccount();
    }, [id]);

    useEffect(() => {
        if (account) {
            setTitle(account.account_name);
        }
    }, [account, setTitle]);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Account not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/accounts')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{account.account_name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <User size={48} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{account.account_name}</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium capitalize">
                                        {account.account_type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Account Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <User size={18} className="mr-2" />
                                        <span className="text-sm">Username: <strong className="font-mono">{account.username}</strong></span>
                                    </div>
                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                        <Layers size={18} className="mr-2" />
                                        <span className="text-sm">Type: <strong className="capitalize">{account.account_type}</strong></span>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                                <Key size={18} className="mr-2" />
                                                Password:
                                            </span>
                                            <div className="flex items-center gap-2 flex-1">
                                                <span className="font-medium text-gray-800 dark:text-white font-mono">
                                                    {account.password ? (showPassword ? account.password : '••••••••') : '-'}
                                                </span>
                                                {account.password && (
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        title={showPassword ? 'Hide password' : 'Show password'}
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {account.notes && (
                                    <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                                            <FileText size={18} className="mr-2 mt-1" />
                                            <div>
                                                <span className="text-sm font-medium">Notes:</span>
                                                <p className="text-sm mt-1">{account.notes}</p>
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
                    {/* Actions */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actions</h4>
                        <div className="space-y-3">
                            {hasPermission('accounts.update') && (
                                <Link
                                    to={`/accounts/edit/${id}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                                >
                                    Edit Account
                                </Link>
                            )}
                            <button
                                onClick={() => navigate('/accounts')}
                                className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
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

                    {/* Metadata */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Metadata</h4>
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
