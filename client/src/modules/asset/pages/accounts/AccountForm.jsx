import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLayout } from '../../../core/context/LayoutContext';

const AccountForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useLayout();
    const [formData, setFormData] = useState({
        account_type: 'email',
        account_name: '',
        username: '',
        password: '',
        notes: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const accountTypes = ['email', 'dropbox', 'instagram', 'facebook', 'twitter', 'linkedin', 'github', 'other'];

    useEffect(() => {
        if (id) {
            fetchAccount();
        } else {
            setTitle('Add New Account');
        }
    }, [id, setTitle]);

    const fetchAccount = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/accounts/${id}`);
            const data = res.data;
            setFormData({
                account_type: data.account_type || 'email',
                account_name: data.account_name || '',
                username: data.username || '',
                password: data.password || '',
                url: data.url || '',
                notes: data.notes || ''
            });
            setTitle(`Edit ${data.account_name}`);
        } catch (error) {
            console.error('Error fetching account:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await axios.put(`http://localhost:5000/api/accounts/${id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/accounts', formData);
            }
            navigate('/accounts');
        } catch (error) {
            console.error('Error saving account:', error);
            alert(error.response?.data?.message || 'Error saving account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/accounts')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Accounts
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    {id ? 'Edit Account' : 'Add New Account'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Account Type *
                            </label>
                            <select
                                name="account_type"
                                required
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none capitalize"
                                value={formData.account_type}
                                onChange={handleChange}
                            >
                                {accountTypes.map(type => (
                                    <option key={type} value={type} className="capitalize">{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Account Name *
                            </label>
                            <input
                                type="text"
                                name="account_name"
                                required
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.account_name}
                                onChange={handleChange}
                                placeholder="e.g., Company Email, Marketing Instagram"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Username/Email *
                            </label>
                            <input
                                type="text"
                                name="username"
                                required
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="w-full p-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            rows="4"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} className="mr-2" />
                            {loading ? 'Saving...' : 'Save Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountForm;
