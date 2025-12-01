import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleList = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sysadmin/roles');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setRoleToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!roleToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/sysadmin/roles/${roleToDelete}`);
            setRoles(roles.filter((role) => role.id !== roleToDelete));
            alert('Role deleted successfully!');
        } catch (error) {
            console.error('Error deleting role:', error);
            alert(error.response?.data?.message || 'Error deleting role. Please try again.');
        } finally {
            setShowDeleteModal(false);
            setRoleToDelete(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading roles...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Role Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 hidden md:block">
                        Manage system roles and their access levels
                    </p>
                </div>
                <Link
                    to="/sysadmin/roles/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap ml-4"
                >
                    + Add
                </Link>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="p-4">Role Name</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{role.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{role.description}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/sysadmin/roles/edit/${role.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(role.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="3" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No roles found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-start mb-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                    <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{role.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{role.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center">
                            <div className="flex space-x-2">
                                <Link
                                    to={`/sysadmin/roles/edit/${role.id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(role.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {roles.length === 0 && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        No roles found. Create one to get started.
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this role? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setRoleToDelete(null);
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
        </div>
    );
};

export default RoleList;
