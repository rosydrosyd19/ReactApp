import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Edit, Save, X } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/sysadmin/users'),
                axios.get('http://localhost:5000/api/sysadmin/roles')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setSelectedRoles(user.role_ids || []);
    };

    const handleSave = async () => {
        try {
            await axios.post(`http://localhost:5000/api/sysadmin/users/${editingUser.id}/roles`, {
                roleIds: selectedRoles
            });
            setEditingUser(null);
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Error saving roles:', error);
            alert('Failed to save roles');
        }
    };

    const toggleRole = (roleId) => {
        setSelectedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    if (loading) return <div className="p-8 text-center">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Role Assignment</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage user access by assigning roles
                </p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Assigned Roles</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4">
                                        <span className="font-medium text-gray-800 dark:text-white">
                                            {user.name}
                                        </span>
                                        <div className="text-xs text-gray-500">{user.position}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {user.email}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {user.role_names.length > 0 ? (
                                                user.role_names.map((role, idx) => (
                                                    <span key={idx} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                                        {role}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">No roles</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-start mb-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                                    <Users size={20} className="text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{user.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                    {user.position && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{user.position}</p>}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {user.role_names.length > 0 ? (
                                            user.role_names.map((role, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                                    {role}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No roles assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-end items-center">
                            <button
                                onClick={() => handleEdit(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {users.length === 0 && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        No users found.
                    </div>
                )}
            </div>

            {/* Edit Roles Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Assign Roles to {editingUser.name}
                            </h3>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    onClick={() => toggleRole(role.id)}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedRoles.includes(role.id)
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role.id)}
                                        onChange={() => { }}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-3 font-medium text-gray-900 dark:text-white">
                                        {role.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
