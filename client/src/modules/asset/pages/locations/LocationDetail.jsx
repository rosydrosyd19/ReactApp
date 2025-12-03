import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Building, Mail, Phone, Edit } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';

import { useLayout } from '../../../core/context/LayoutContext';

const LocationDetail = () => {
    const { hasPermission } = useAuth();
    const { setTitle } = useLayout();
    const { id } = useParams();
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLocation();
    }, [id]);

    useEffect(() => {
        if (location) {
            setTitle(location.name);
        }
    }, [location, setTitle]);

    const fetchLocation = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/locations/${id}`);
            setLocation(res.data);
        } catch (error) {
            console.error('Error fetching location:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 dark:text-gray-400">Location not found</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/locations')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{location.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <MapPin size={48} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{location.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs font-medium">
                                        Location ID: #{location.id}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Address Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {location.address && (
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <Building size={18} className="mr-2" />
                                            <span className="text-sm">Street: <strong>{location.address}</strong></span>
                                        </div>
                                    )}
                                    {location.city && (
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <MapPin size={18} className="mr-2" />
                                            <span className="text-sm">City: <strong>{location.city}</strong></span>
                                        </div>
                                    )}
                                    {location.state && (
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <MapPin size={18} className="mr-2" />
                                            <span className="text-sm">State: <strong>{location.state}</strong></span>
                                        </div>
                                    )}
                                    {location.zip && (
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <Mail size={18} className="mr-2" />
                                            <span className="text-sm">Zip Code: <strong>{location.zip}</strong></span>
                                        </div>
                                    )}
                                    {location.country && (
                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                            <MapPin size={18} className="mr-2" />
                                            <span className="text-sm">Country: <strong>{location.country}</strong></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Full Address Display */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Address:</h5>
                                <p className="text-gray-800 dark:text-white">
                                    {[location.address, location.city, location.state, location.zip, location.country]
                                        .filter(Boolean)
                                        .join(', ') || 'No address information available'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Actions</h4>
                        <div className="space-y-3">
                            {hasPermission('locations.update') && (
                                <Link
                                    to={`/locations/edit/${location.id}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-center transition-colors"
                                >
                                    Edit Location
                                </Link>
                            )}
                            <button
                                onClick={() => navigate('/locations')}
                                className="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Back to List
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Metadata</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Location ID:</span>
                                <span className="font-mono text-gray-800 dark:text-white">#{location.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                <span className="text-gray-800 dark:text-white">{new Date(location.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationDetail;
