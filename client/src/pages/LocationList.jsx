import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, MapPin, Eye, LogIn, LogOut } from 'lucide-react';

const LocationList = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [checkoutForm, setCheckoutForm] = useState({
        checked_out_to: '',
        notes: '',
        expected_checkin_date: ''
    });
    const [checkoutType, setCheckoutType] = useState('user');
    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        fetchLocations();
        fetchUsers();
        fetchAssets();
    }, []);

    const fetchLocations = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/locations');
            setLocations(res.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchAssets = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/assets');
            setAssets(res.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            try {
                await axios.delete(`http://localhost:5000/api/locations/${id}`);
                setLocations(locations.filter((location) => location.id !== id));
            } catch (error) {
                console.error('Error deleting location:', error);
            }
        }
    };

    const handleCheckout = (location) => {
        setSelectedLocation(location);
        setShowCheckoutModal(true);
        setCheckoutForm({
            checked_out_to: '',
            notes: '',
            expected_checkin_date: ''
        });
        setCheckoutType('user');
    };

    const submitCheckout = async () => {
        if (!checkoutForm.checked_out_to) {
            alert('Please select a user or asset');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/locations/${selectedLocation.id}/checkout`, {
                ...checkoutForm,
                checked_out_type: checkoutType
            });
            setShowCheckoutModal(false);
            fetchLocations();
        } catch (error) {
            console.error('Error checking out location:', error);
        }
    };

    const handleCheckin = async (id) => {
        if (window.confirm('Are you sure you want to check in this location?')) {
            try {
                await axios.post(`http://localhost:5000/api/locations/${id}/checkin`);
                fetchLocations();
            } catch (error) {
                console.error('Error checking in location:', error);
            }
        }
    };

    const filteredLocations = locations.filter((location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (location.city && location.city.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getCheckoutOptions = () => {
        if (checkoutType === 'user') {
            return users.map(user => ({ value: user.email, label: `${user.name} (${user.email})` }));
        } else {
            return assets.map(asset => ({ value: asset.name, label: `${asset.name} (${asset.serial_number})` }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Locations</h2>
                <Link
                    to="/locations/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    + Add
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search locations..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">City</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Checked Out To</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredLocations.map((location) => (
                                <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{location.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{location.address || '-'}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{location.city || '-'}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${location.status === 'Available'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : location.status === 'Occupied'
                                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                                }`}
                                        >
                                            {location.status || 'Available'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        {location.checked_out_to ? (
                                            <div>
                                                <span className="font-medium">{location.checked_out_to}</span>
                                                <span className="text-xs text-gray-500 block">({location.checked_out_type})</span>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            {!location.checked_out_to ? (
                                                <button
                                                    onClick={() => handleCheckout(location)}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Check Out"
                                                >
                                                    <LogOut size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleCheckin(location.id)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                    title="Check In"
                                                >
                                                    <LogIn size={18} />
                                                </button>
                                            )}
                                            <Link
                                                to={`/locations/detail/${location.id}`}
                                                className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <Link
                                                to={`/locations/edit/${location.id}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(location.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLocations.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        No locations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredLocations.map((location) => (
                    <div
                        key={location.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-start mb-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                    <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{location.name}</h3>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${location.status === 'Available'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : location.status === 'Occupied'
                                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                                }`}
                                        >
                                            {location.status || 'Available'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{location.address}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {[location.city, location.state].filter(Boolean).join(', ')}
                                    </p>
                                    {location.checked_out_to && (
                                        <div className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-100 dark:border-gray-600">
                                            <span className="text-gray-500 dark:text-gray-400 block">Checked out to:</span>
                                            <span className="font-medium text-gray-800 dark:text-white">{location.checked_out_to}</span>
                                            <span className="text-gray-500 dark:text-gray-400 ml-1">({location.checked_out_type})</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                            <div className="flex space-x-2">
                                {!location.checked_out_to ? (
                                    <button
                                        onClick={() => handleCheckout(location)}
                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleCheckin(location.id)}
                                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                    >
                                        <LogIn size={18} />
                                    </button>
                                )}
                                <Link
                                    to={`/locations/detail/${location.id}`}
                                    className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Eye size={18} />
                                </Link>
                                <Link
                                    to={`/locations/edit/${location.id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                >
                                    <Edit size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(location.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredLocations.length === 0 && !loading && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center text-gray-500 dark:text-gray-400">
                        No locations found.
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                            Check Out Location: {selectedLocation?.name}
                        </h3>

                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => {
                                    setCheckoutType('user');
                                    setCheckoutForm({ ...checkoutForm, checked_out_to: '' });
                                }}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${checkoutType === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                User
                            </button>
                            <button
                                onClick={() => {
                                    setCheckoutType('asset');
                                    setCheckoutForm({ ...checkoutForm, checked_out_to: '' });
                                }}
                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${checkoutType === 'asset'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Asset
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {checkoutType === 'user' ? 'Select User' : 'Select Asset'}
                                </label>
                                <select
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.checked_out_to}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, checked_out_to: e.target.value })}
                                >
                                    <option value="">-- Select {checkoutType === 'user' ? 'User' : 'Asset'} --</option>
                                    {getCheckoutOptions().map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Expected Checkin Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.expected_checkin_date}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, expected_checkin_date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    rows="3"
                                    className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={checkoutForm.notes}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCheckoutModal(false);
                                    setCheckoutForm({ checked_out_to: '', notes: '', expected_checkin_date: '' });
                                }}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitCheckout}
                                disabled={!checkoutForm.checked_out_to}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Check Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationList;
