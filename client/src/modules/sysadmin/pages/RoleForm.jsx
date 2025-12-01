import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Shield, Package } from 'lucide-react';

const RoleForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchModules();
        if (isEditing) {
            fetchRoleData();
        }
    }, [id]);

    const fetchModules = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/sysadmin/modules');
            setModules(response.data);
        } catch (err) {
            console.error('Error fetching modules:', err);
        }
    };

    const fetchRoleData = async () => {
        try {
            const [roleRes, modulesRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/sysadmin/roles/${id}`),
                axios.get(`http://localhost:5000/api/sysadmin/roles/${id}/modules`)
            ]);

            setFormData({ name: roleRes.data.name, description: roleRes.data.description });
            setSelectedModules(modulesRes.data.map(m => m.id));
        } catch (err) {
            console.error('Error fetching role data:', err);
            setError('Failed to load role data');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let roleId = id;
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/sysadmin/roles/${id}`, formData);
            } else {
                const res = await axios.post('http://localhost:5000/api/sysadmin/roles', formData);
                roleId = res.data.id;
            }

            // Update Module Assignments
            await axios.post(`http://localhost:5000/api/sysadmin/roles/${roleId}/modules`, {
                moduleIds: selectedModules
            });

            navigate('/sysadmin/roles');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save role');
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (moduleId) => {
        setSelectedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/sysadmin/roles')}
                    className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditing ? 'Edit Role' : 'Create New Role'}
                </h1>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Shield className="mr-2" size={20} />
                        Basic Information
                    </h2>
                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Role Name
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Module Access */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Package className="mr-2" size={20} />
                        Module Access
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Select which modules this role can access.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map((module) => (
                            <div
                                key={module.id}
                                onClick={() => toggleModule(module.id)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedModules.includes(module.id)
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedModules.includes(module.id)}
                                        onChange={() => { }} // Handled by div click
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <div className="ml-3">
                                        <span className={`block text-sm font-medium ${selectedModules.includes(module.id) ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {module.name}
                                        </span>
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                                            {module.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/sysadmin/roles')}
                        className="mr-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} className="mr-2" />
                        {loading ? 'Saving...' : 'Save Role'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoleForm;
