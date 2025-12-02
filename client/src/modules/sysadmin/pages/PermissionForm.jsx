import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Save, ArrowLeft, Lock } from 'lucide-react';

const PermissionForm = () => {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', description: '', module_id: null });
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchModules();
        if (isEditing) fetchPermission();
    }, [id]);

    const fetchModules = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/sysadmin/modules');
            setModules(res.data);
        } catch (err) {
            console.error('Error fetching modules:', err);
        }
    };

    const fetchPermission = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/sysadmin/permissions/${id}`);
            setFormData({ name: res.data.name, description: res.data.description || '', module_id: res.data.module_id });
        } catch (err) {
            console.error('Error fetching permission:', err);
            setError('Failed to load permission');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/sysadmin/permissions/${id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/sysadmin/permissions', formData);
            }
            navigate('/sysadmin/permissions');
        } catch (err) {
            console.error('Error saving permission:', err);
            setError(err.response?.data?.message || 'Failed to save permission');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('/sysadmin/permissions')} className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Permission' : 'Create Permission'}</h1>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><Lock size={18} className="mr-2"/> Permission Info</h2>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission Name</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Module</label>
                            <select value={formData.module_id ?? ''} onChange={(e) => setFormData({ ...formData, module_id: e.target.value ? Number(e.target.value) : null })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white">
                                <option value="">-- Select Module --</option>
                                {modules.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="button" onClick={() => navigate('/sysadmin/permissions')} className="mr-4 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"><Save size={18} className="mr-2" />{loading ? 'Saving...' : 'Save Permission'}</button>
                </div>
            </form>
        </div>
    );
};

export default PermissionForm;
