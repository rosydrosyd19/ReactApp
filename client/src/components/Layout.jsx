import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Moon, Sun, Menu, X, MapPin, Users, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    // Mobile bottom nav items
    const mobileNavItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/assets', label: 'Assets', icon: Package },
        { path: '/licenses', label: 'Licenses', icon: FileText },
        { path: '/accessories', label: 'Accessories', icon: Package },
    ];

    // Desktop sidebar items
    const desktopNavItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/assets', label: 'Assets', icon: Package },
        { path: '/licenses', label: 'Licenses', icon: FileText },
        { path: '/accessories', label: 'Accessories', icon: Package },
        { path: '/locations', label: 'Locations', icon: MapPin },
        { path: '/users', label: 'Users', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Desktop Sidebar - Hidden on mobile */}
            <aside
                className={`hidden md:flex ${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex-col`}
            >
                <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
                    <h1 className={`font-bold text-xl text-blue-600 dark:text-blue-400 ${!isSidebarOpen && 'hidden'}`}>
                        ReactApp
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {desktopNavItems.map((item) => {
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

                <div className="p-4 border-t dark:border-gray-700">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        {isSidebarOpen && (
                            <span className="ml-3 font-medium">
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </span>
                        )}
                    </button>
                </div>
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
                <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
                    <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400">
                        ReactApp
                    </h1>
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {desktopNavItems.map((item) => {
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

                <div className="p-4 border-t dark:border-gray-700">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        <span className="ml-3 font-medium">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto pb-20 md:pb-0">
                {/* Mobile Top Header */}
                <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-40 flex items-center">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 mr-3"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="font-bold text-xl text-blue-600 dark:text-blue-400 flex-1 text-center">
                        ReactApp
                    </h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>

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
