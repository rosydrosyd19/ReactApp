import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Search } from 'lucide-react';

const PermissionList = () => {
    const [permissions, setPermissions] = useState([]);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setError(null);
            const [permissionsRes, modulesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/sysadmin/permissions'),
                axios.get('http://localhost:5000/api/sysadmin/modules')
            ]);
            setPermissions(permissionsRes.data);
            setModules(modulesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load permissions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get module name by ID
    const getModuleName = (moduleId) => {
        const module = modules.find(m => m.id === moduleId);
        return module ? module.name : `Module ${moduleId}`;
    };

    // Filter permissions based on search
    const filteredPermissions = permissions.filter((perm) =>
        perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getModuleName(perm.module_id).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group permissions by module
    const groupedPermissions = filteredPermissions.reduce((acc, perm) => {
        const moduleName = getModuleName(perm.module_id);
        if (!acc[moduleName]) {
            acc[moduleName] = [];
        }
        acc[moduleName].push(perm);
        return acc;
    }, {});

    if (loading) return <div className="p-8 text-center">Loading permissions...</div>;

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Permission Registry</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 hidden md:block">
                        View all available system permissions
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search permissions..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop Table View - Grouped by Module */}
            <div className="hidden md:block space-y-4">
                {Object.keys(groupedPermissions).length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        No permissions found.
                    </div>
                ) : (
                    Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                        <div key={moduleName} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center">
                                    <Lock size={18} className="mr-2 text-purple-600 dark:text-purple-400" />
                                    {moduleName}
                                    <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full">
                                        {perms.length} {perms.length === 1 ? 'permission' : 'permissions'}
                                    </span>
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="p-4">Permission Name</th>
                                            <th className="p-4">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {perms.map((perm) => (
                                            <tr key={perm.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="p-4 font-medium text-gray-800 dark:text-white">{perm.name}</td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">{perm.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Mobile Card View - Grouped by Module */}
            <div className="md:hidden space-y-4">
                {Object.keys(groupedPermissions).length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        No permissions found.
                    </div>
                ) : (
                    Object.entries(groupedPermissions).map(([moduleName, perms]) => (
                        <div key={moduleName} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-800 dark:text-white text-sm flex items-center">
                                    <Lock size={16} className="mr-2 text-purple-600 dark:text-purple-400" />
                                    {moduleName}
                                    <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">
                                        {perms.length}
                                    </span>
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {perms.map((perm) => (
                                    <div key={perm.id} className="p-4">
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm">{perm.name}</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{perm.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PermissionList;
