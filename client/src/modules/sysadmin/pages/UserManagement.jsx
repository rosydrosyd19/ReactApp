import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Edit, Save, X, Key, Shield, Search } from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [rolePermissions, setRolePermissions] = useState([]); // All role-permission mappings
    const [tab, setTab] = useState('roles');
    const [roleSearch, setRoleSearch] = useState(''); // Search for roles
    const [permissionSearch, setPermissionSearch] = useState(''); // Search for permissions

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, rolesRes, permissionsRes, rolePermissionsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/sysadmin/users'),
                axios.get('http://localhost:5000/api/sysadmin/roles'),
                axios.get('http://localhost:5000/api/sysadmin/permissions'),
                axios.get('http://localhost:5000/api/sysadmin/role-permissions')
            ]);
            setUsers(usersRes.data);
            setRoles(rolesRes.data);
            setPermissions(permissionsRes.data);
            setRolePermissions(rolePermissionsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setSelectedRoles(user.role_ids || []);
        // fetch user's direct permissions
        fetchUserPermissions(user.id);
    };

    const fetchUserPermissions = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/sysadmin/users/${userId}/permissions`);
            setSelectedPermissions(res.data.map(p => p.id));
        } catch (err) {
            // if 500 or not present, just default to empty
            console.error('Error fetching user permissions:', err);
            setSelectedPermissions([]);
        }
    };

    const handleSave = async () => {
        try {
            // Save roles
            await axios.post(`http://localhost:5000/api/sysadmin/users/${editingUser.id}/roles`, {
                roleIds: selectedRoles
            });

            // Save direct permissions
            await axios.post(`http://localhost:5000/api/sysadmin/users/${editingUser.id}/permissions`, {
                permissionIds: selectedPermissions
            });

            setEditingUser(null);
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Error saving roles/permissions:', error);
            alert(error.response?.data?.message || 'Failed to save changes');
        }
    };

    const toggleRole = (roleId) => {
        setSelectedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const togglePermission = (permissionId) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]
        );
    };

    // Check if a permission is inherited from selected roles
    const getInheritedFrom = (permissionId) => {
        const grantingRoles = [];
        selectedRoles.forEach(roleId => {
            // Check if this role has the permission
            const hasPerm = rolePermissions.some(rp => rp.role_id === roleId && rp.permission_id === permissionId);
            if (hasPerm) {
                const role = roles.find(r => r.id === roleId);
                if (role) grantingRoles.push(role.name);
            }
        });
        return grantingRoles;
    };

    // Filter roles based on search query
    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(roleSearch.toLowerCase())
    );

    // Filter permissions based on search query
    const filteredPermissions = permissions.filter(perm =>
        perm.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        (perm.description && perm.description.toLowerCase().includes(permissionSearch.toLowerCase()))
    );

    const { hasPermission } = useAuth();

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
                                        {hasPermission('users.update') && (
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full p-6">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Roles Column */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Shield size={16} />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Assign Roles</h4>
                                    <span className="text-xs text-gray-400">(select user roles)</span>
                                </div>

                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search roles..."
                                        value={roleSearch || ''}
                                        onChange={(e) => setRoleSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredRoles.map((role) => (
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
                                    {filteredRoles.length === 0 && (
                                        <div className="text-sm text-gray-400 italic text-center py-4">
                                            No roles found matching "{roleSearch}"
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Permissions Column */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Key size={16} />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Direct Permissions</h4>
                                    <span className="text-xs text-gray-400">(assign permissions directly)</span>
                                </div>

                                {/* Search Input for Permissions */}
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search permissions..."
                                        value={permissionSearch || ''}
                                        onChange={(e) => setPermissionSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 gap-2">
                                    {filteredPermissions.map((perm) => {
                                        const inheritedFrom = getInheritedFrom(perm.id);
                                        const isInherited = inheritedFrom.length > 0;

                                        return (
                                            <div key={perm.id} onClick={() => !isInherited && togglePermission(perm.id)} className={`flex items-center p-3 rounded-lg border transition-colors ${selectedPermissions.includes(perm.id) || isInherited ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'} ${isInherited ? 'cursor-default' : 'cursor-pointer'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(perm.id) || isInherited}
                                                    onChange={() => { }}
                                                    disabled={isInherited}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{perm.name}</div>
                                                        {isInherited && (
                                                            <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full" title={`Inherited from: ${inheritedFrom.join(', ')}`}>
                                                                Inherited
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{perm.description}</div>
                                                    {isInherited && (
                                                        <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
                                                            From: {inheritedFrom.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {filteredPermissions.length === 0 && (
                                        <div className="text-sm text-gray-400 italic text-center py-4">
                                            {permissionSearch ? `No permissions found matching "${permissionSearch}"` : 'No permissions defined'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            {hasPermission('users.update') ? (
                                <button
                                    onClick={handleSave}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={18} className="mr-2" />
                                    Save Changes
                                </button>
                            ) : (
                                <button disabled className="flex items-center px-4 py-2 bg-gray-300 text-white rounded-lg opacity-60 cursor-not-allowed" title="You don't have permission to update users">
                                    <Save size={18} className="mr-2" />
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
