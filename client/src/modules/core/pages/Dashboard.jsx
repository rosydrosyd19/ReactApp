import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { Loader2, Server, CheckCircle, AlertCircle } from 'lucide-react';

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
    const [stats, setStats] = useState({ total: 0, ready: 0, deployed: 0 });
    const [loading, setLoading] = useState(true);

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
    ];

    const chartData = {
        labels: ['Ready to Deploy', 'Deployed'],
        datasets: [
            {
                label: 'Asset Status',
                data: [stats.ready, stats.deployed],
                backgroundColor: ['#22c55e', '#f97316'],
                borderColor: ['#16a34a', '#ea580c'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Asset Distribution</h3>
                    <div className="h-64 flex justify-center">
                        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
