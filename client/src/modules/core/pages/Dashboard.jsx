import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Loader2, Server, CheckCircle, AlertCircle, Wrench, Key, Calendar, XCircle } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState({
        total: 0,
        ready: 0,
        deployed: 0,
        maintenance: 0,
        licenses: 0,
        recent_maintenance: []
    });
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const errorMessage = location.state?.error;

    useEffect(() => {
        if (errorMessage) {
            setShowError(true);
            // Clear the error from location state
            window.history.replaceState({}, document.title);
            // Auto-hide after 5 seconds
            const timer = setTimeout(() => setShowError(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    const cards = [
        { label: 'Total Assets', value: stats.total, icon: Server, color: 'bg-blue-500' },
        { label: 'Ready to Deploy', value: stats.ready, icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Deployed', value: stats.deployed, icon: AlertCircle, color: 'bg-orange-500' },
        { label: 'In Maintenance', value: stats.maintenance, icon: Wrench, color: 'bg-yellow-500' },
        { label: 'Total Licenses', value: stats.licenses, icon: Key, color: 'bg-purple-500' },
    ];

    const chartData = {
        labels: ['Ready to Deploy', 'Deployed', 'In Maintenance'],
        datasets: [
            {
                label: 'Asset Status',
                data: [stats.ready, stats.deployed, stats.maintenance],
                backgroundColor: ['#22c55e', '#f97316', '#eab308'],
                borderColor: ['#16a34a', '#ea580c', '#ca8a04'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>

            {/* Permission Error Alert */}
            {showError && errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">Access Denied</h3>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{errorMessage}</p>
                    </div>
                    <button
                        onClick={() => setShowError(false)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                    >
                        <XCircle size={18} />
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                            <div className={`p-4 rounded-lg ${card.color} text-white mr-4`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Asset Distribution Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Asset Distribution</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                {/* Recent Maintenance List */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                        <Wrench size={20} className="text-yellow-500" />
                        Recent Maintenance
                    </h3>
                    <div className="space-y-4">
                        {stats.recent_maintenance && stats.recent_maintenance.length > 0 ? (
                            stats.recent_maintenance.map((record, index) => (
                                <div key={index} className="flex items-start border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-3">
                                        <Wrench size={16} className="text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-medium text-gray-800 dark:text-white">{record.title}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${record.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                record.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Asset: <span className="font-medium text-gray-700 dark:text-gray-300">{record.asset_name}</span>
                                        </p>
                                        <div className="flex items-center mt-1 text-xs text-gray-400">
                                            <Calendar size={12} className="mr-1" />
                                            {new Date(record.start_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No recent maintenance records.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
