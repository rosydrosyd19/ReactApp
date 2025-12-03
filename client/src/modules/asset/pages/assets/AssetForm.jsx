import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { useLayout } from '../../../core/context/LayoutContext';

const AssetForm = () => {
    const { setTitle } = useLayout();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        serial_number: '',
        status: 'Ready to Deploy',
        purchase_date: '',
        notes: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchAsset();
        } else {
            setTitle('Create New Asset');
        }
    }, [id, isEditMode, setTitle]);

    const fetchAsset = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/assets/${id}`);
            const data = res.data;
            if (data.purchase_date) {
                data.purchase_date = data.purchase_date.split('T')[0];
            }
            setFormData({
                name: data.name,
                category: data.category,
                serial_number: data.serial_number,
                status: data.status,
                purchase_date: data.purchase_date || '',
                notes: data.notes || '',
            });
            if (data.image_url) {
                setExistingImage(`http://localhost:5000${data.image_url}`);
            }
            setTitle(`Edit ${data.name}`);
        } catch (error) {
            console.error('Error fetching asset:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('serial_number', formData.serial_number);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('purchase_date', formData.purchase_date);
            formDataToSend.append('notes', formData.notes);

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/assets/${id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('http://localhost:5000/api/assets', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/assets');
        } catch (error) {
            console.error('Error saving asset:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/assets')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {isEditMode ? 'Edit Asset' : 'Create New Asset'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Asset Name
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            name="category"
                            required
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Serial Number
                        </label>
                        <input
                            type="text"
                            name="serial_number"
                            required
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.serial_number}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Ready to Deploy">Ready to Deploy</option>
                            <option value="Deployed">Deployed</option>
                            <option value="Archived">Archived</option>
                            <option value="Broken">Broken</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Purchase Date
                        </label>
                        <input
                            type="date"
                            name="purchase_date"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.purchase_date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Asset Image
                        </label>
                        <div className="space-y-3">
                            {!imagePreview && !existingImage && (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}

                            {(imagePreview || existingImage) && (
                                <div className="relative">
                                    <img
                                        src={imagePreview || existingImage}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                    {!imagePreview && existingImage && (
                                        <label className="absolute bottom-2 right-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                            Change Image
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            rows="4"
                            className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any additional notes about this asset..."
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors"
                    >
                        <Save size={20} className="mr-2" />
                        Save Asset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssetForm;
