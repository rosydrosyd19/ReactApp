import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLayout } from '../../../core/context/LayoutContext';

const UserForm = () => {
    const { setTitle } = useLayout();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchUser();
        } else {
            setTitle('Create New User');
        }
    }, [id, isEditMode, setTitle]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/users/${id}`);
            setFormData({ ...res.data, password: '', confirmPassword: '' });
            setTitle(`Edit ${res.data.name}`);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear password error when user types
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const validatePassword = () => {
        if (!isEditMode && !formData.password) {
            setPasswordError('Password is required for new users');
            return false;
        }

        if (formData.password && formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) {
            return;
        }

        try {
            const submitData = { ...formData };
            delete submitData.confirmPassword;

            // If editing and password is empty, don't send password field
            if (isEditMode && !submitData.password) {
                delete submitData.password;
            }

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/users/${id}`, submitData);
            } else {
                await axios.post('http://localhost:5000/api/users', submitData);
            }
            navigate('/users');
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user. Please try again.');
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength, label: 'Medium', color: 'bg-yellow-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/users')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {isEditMode ? 'Edit User' : 'Create New User'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none [&:-webkit-autofill]:!bg-gray-50 dark:[&:-webkit-autofill]:!bg-gray-700 [&:-webkit-autofill]:!text-gray-800 dark:[&:-webkit-autofill]:!text-white"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Department
                        </label>
                        <input
                            type="text"
                            name="department"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Position
                        </label>
                        <input
                            type="text"
                            name="position"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.position}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Section */}
                    <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            {isEditMode ? 'Change Password (Optional)' : 'Set Password'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password {!isEditMode && '*'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required={!isEditMode}
                                        autoComplete={isEditMode ? 'new-password' : 'new-password'}
                                        className="w-full p-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none [&:-webkit-autofill]:!bg-gray-50 dark:[&:-webkit-autofill]:!bg-gray-700 [&:-webkit-autofill]:!text-gray-800 dark:[&:-webkit-autofill]:!text-white"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={isEditMode ? 'Leave blank to keep current password' : 'Enter password'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Password Strength: <span className={`font-semibold ${passwordStrength.label === 'Weak' ? 'text-red-600' :
                                                    passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    }`}>{passwordStrength.label}</span>
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm Password {!isEditMode && '*'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        required={!isEditMode || formData.password !== ''}
                                        autoComplete="new-password"
                                        className="w-full p-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none [&:-webkit-autofill]:!bg-gray-50 dark:[&:-webkit-autofill]:!bg-gray-700 [&:-webkit-autofill]:!text-gray-800 dark:[&:-webkit-autofill]:!text-white"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {passwordError && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-800 dark:text-red-200 text-sm">
                                    {passwordError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                    >
                        <Save size={20} className="mr-2" />
                        Save User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
