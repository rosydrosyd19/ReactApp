import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Moon, Sun, Menu, X, MapPin, Users, FileText, Box, Puzzle, UserCircle, LogOut, User as UserIcon, Shield, Grid } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const { logout, user, currentModule, accessibleModules } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    // Navigation Items Configuration
    const navConfigs = {
        'Asset Management': [
            { path: '/', label: 'Dashboard', icon: LayoutDashboard },
            { path: '/assets', label: 'Assets', icon: Package },
            { path: '/licenses', label: 'Licenses', icon: FileText },
            { path: '/accessories', label: 'Accessories', icon: Box },
            { path: '/components', label: 'Components', icon: Puzzle },
            { path: '/accounts', label: 'Accounts', icon: UserCircle },
            { path: '/locations', label: 'Locations', icon: MapPin },
        ],
        'System Administrator': [
            { path: '/sysadmin/roles', label: 'Roles', icon: Shield },
            { path: '/sysadmin/permissions', label: 'Permissions', icon: FileText },
            { path: '/users', label: 'Users', icon: Users },
            { path: '/sysadmin/users', label: 'User Role Assignment', icon: Users },
        ]
    };

    // Get items for current module, default to empty or dashboard if undefined
    const currentNavItems = currentModule ? (navConfigs[currentModule.name] || []) : [];

    // Mobile bottom nav items (Simplified for mobile)
    const mobileNavItems = currentNavItems.slice(0, 4);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Desktop Sidebar - Hidden on mobile */}
            <aside
                className={`hidden md:flex ${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex-col z-20`}
            >
                <div className="p-4 flex items-center justify-between border-b dark:border-gray-700 h-16">
                    <h1 className={`font-bold text-xl text-blue-600 dark:text-blue-400 truncate ${!isSidebarOpen && 'hidden'}`}>
                        {currentModule?.name || 'ReactApp'}
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {currentNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center p-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Icon size={20} />
                                {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-4 flex items-center justify-between border-b dark:border-gray-700 h-16">
                    <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400">
                        {currentModule?.name || 'ReactApp'}
                    </h1>
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {currentNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileSidebarOpen(false)}
                                className={`flex items-center p-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="ml-3 font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t dark:border-gray-700 space-y-2">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="ml-3 font-medium">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                    <button
                        onClick={logout}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="ml-3 font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 px-6">
                    {/* Left side */}
                    <div className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                        {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/').pop().replace(/-/g, ' ')}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {accessibleModules.length > 1 && (
                            <button
                                onClick={() => navigate('/modules')}
                                className="flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium"
                            >
                                <Grid size={18} className="mr-2" />
                                Switch Module
                            </button>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.name || 'User'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.position || 'Member'}
                                </span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <UserIcon size={18} />
                            </div>

                            <button
                                onClick={logout}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors ml-2"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Mobile Top Header */}
                <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center h-16">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 mr-3"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400 flex-1 text-center truncate">
                        {currentModule?.name || 'ReactApp'}
                    </h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
                <div className="flex justify-around items-center h-16">
                    {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${isActive
                                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <Icon size={24} />
                                <span className="text-xs mt-1">{item.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={toggleTheme}
                        className="flex flex-col items-center justify-center flex-1 h-full text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                        <span className="text-xs mt-1">Theme</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
