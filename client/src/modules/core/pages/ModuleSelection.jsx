import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Shield, ArrowRight, LogOut } from 'lucide-react';

const ModuleSelection = () => {
    const { user, accessibleModules, selectModule, logout } = useAuth();
    const navigate = useNavigate();

    const handleSelectModule = (module) => {
        selectModule(module);
        navigate(module.route || '/');
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Package': return <Package size={48} className="text-blue-500" />;
            case 'Shield': return <Shield size={48} className="text-purple-500" />;
            default: return <Package size={48} className="text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Select Module</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Welcome back, {user?.name}. Please select a module to continue.
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-red-600 rounded-lg shadow hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <LogOut size={20} className="mr-2" />
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accessibleModules.map((module) => (
                        <button
                            key={module.id}
                            onClick={() => handleSelectModule(module)}
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group border border-transparent hover:border-blue-500"
                        >
                            <div className="mb-6">
                                {getIcon(module.icon)}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {module.name}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {module.description || 'Access this module to manage resources.'}
                            </p>
                            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                                Enter Module <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>

                {accessibleModules.length === 0 && (
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <p className="text-red-500">No modules assigned. Please contact your administrator.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleSelection;
