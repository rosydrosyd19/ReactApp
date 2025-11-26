import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Briefcase, Building } from 'lucide-react';

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${id}`);
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">User not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/users')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <User size={32} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{user.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">User ID: #{user.id}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Contact Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start text-gray-600 dark:text-gray-300">
                                        <Mail size={18} className="mr-2 mt-1" />
                                        <div>
                                            <span className="text-sm font-medium">Email:</span>
                                            <p className="text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                                            <Phone size={18} className="mr-2 mt-1" />
                                            <div>
                                                <span className="text-sm font-medium">Phone:</span>
                                                <p className="text-sm">{user.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Work Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.department && (
                                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                                            <Building size={18} className="mr-2 mt-1" />
                                            <div>
                                                <span className="text-sm font-medium">Department:</span>
                                                <p className="text-sm">
                                                    <span className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs">
                                                        {user.department}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {user.position && (
                                        <div className="flex items-start text-gray-600 dark:text-gray-300">
                                            <Briefcase size={18} className="mr-2 mt-1" />
                                            <div>
                                                <span className="text-sm font-medium">Position:</span>
                                                <p className="text-sm">
                                                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                                                        {user.position}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Summary:</h5>
                                <p className="text-gray-800 dark:text-white">
                                    {user.name} {user.position && `works as ${user.position}`} {user.department && `in the ${user.department} department`}.
                                    {user.phone && ` Contact: ${user.phone}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actions</h4>
                        <div className="space-y-3">
                            <Link
                                to={`/users/edit/${user.id}`}
                                className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                            >
                                Edit User
                            </Link>
                            <button
                                onClick={() => navigate('/users')}
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
                                <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                                <span className="font-mono text-gray-800 dark:text-white">#{user.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                <span className="text-gray-800 dark:text-white">{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
