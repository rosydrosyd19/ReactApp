import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { useLayout } from '../../../core/context/LayoutContext';

const AccessoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useLayout();
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        manufacturer: '',
        model_number: '',
        total_quantity: 1,
        purchase_date: '',
        cost: '',
        notes: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchAccessory();
        } else {
            setTitle('Add New Accessory');
        }
    }, [id, setTitle]);

    const fetchAccessory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/accessories/${id}`);
            const data = res.data;
            // Format date for input
            if (data.purchase_date) {
                data.purchase_date = new Date(data.purchase_date).toISOString().split('T')[0];
            }
            setFormData(data);
            if (data.image_url) {
                setExistingImage(`http://localhost:5000${data.image_url}`);
            }
            setTitle(`Edit ${data.name}`);
        } catch (error) {
            console.error('Error fetching accessory:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('manufacturer', formData.manufacturer);
            formDataToSend.append('model_number', formData.model_number);
            formDataToSend.append('total_quantity', formData.total_quantity);
            formDataToSend.append('purchase_date', formData.purchase_date);
            formDataToSend.append('cost', formData.cost);
            formDataToSend.append('notes', formData.notes);

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            if (id) {
                await axios.put(`http://localhost:5000/api/accessories/${id}`, formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('http://localhost:5000/api/accessories', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/accessories');
        } catch (error) {
            console.error('Error saving accessory:', error);
            alert(error.response?.data?.message || 'Error saving accessory');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/accessories')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Accessories
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    {id ? 'Edit Accessory' : 'Add New Accessory'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name *
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
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Manufacturer
                            </label>
                            <input
                                type="text"
                                name="manufacturer"
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.manufacturer}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Model Number
                            </label>
                            <input
                                type="text"
                                name="model_number"
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.model_number}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Total Quantity *
                            </label>
                            <input
                                type="number"
                                name="total_quantity"
                                required
                                min="1"
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.total_quantity}
                                onChange={handleChange}
                            />
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Cost
                            </label>
                            <input
                                type="number"
                                name="cost"
                                step="0.01"
                                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.cost}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Accessory Image
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
                                    <div className="relative w-full md:w-1/2">
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
                            {loading ? 'Saving...' : 'Save Accessory'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccessoryForm;
