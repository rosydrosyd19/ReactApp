import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentModule, setCurrentModule] = useState(null);
    const [accessibleModules, setAccessibleModules] = useState([]);
    const [accessiblePermissions, setAccessiblePermissions] = useState([]);

    useEffect(() => {
        // Check for token in localStorage or sessionStorage
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        const savedModule = localStorage.getItem('currentModule') || sessionStorage.getItem('currentModule');

        if (token && savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setAccessibleModules(parsedUser.modules || []);
            setAccessiblePermissions(parsedUser.permissions ? parsedUser.permissions.map(p => p.name) : []);

            if (savedModule) {
                setCurrentModule(JSON.parse(savedModule));
            } else if (parsedUser.modules && parsedUser.modules.length === 1) {
                // Auto-select if only one module
                setCurrentModule(parsedUser.modules[0]);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token, rememberMe) => {
        setUser(userData);
        setAccessibleModules(userData.modules || []);
        setAccessiblePermissions(userData.permissions ? userData.permissions.map(p => p.name) : []);

        // If only one module, select it automatically
        let moduleToSelect = null;
        if (userData.modules && userData.modules.length === 1) {
            moduleToSelect = userData.modules[0];
            setCurrentModule(moduleToSelect);
        }

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', token);
        storage.setItem('user', JSON.stringify(userData));

        if (moduleToSelect) {
            storage.setItem('currentModule', JSON.stringify(moduleToSelect));
        }
    };

    const selectModule = (module) => {
        setCurrentModule(module);
        // Update storage based on where token is stored
        if (localStorage.getItem('token')) {
            localStorage.setItem('currentModule', JSON.stringify(module));
        } else {
            sessionStorage.setItem('currentModule', JSON.stringify(module));
        }
    };

    const logout = () => {
        setUser(null);
        setCurrentModule(null);
        setAccessibleModules([]);
        setAccessiblePermissions([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('currentModule');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('currentModule');
    };

    const hasPermission = (permName) => {
        if (!accessiblePermissions || accessiblePermissions.length === 0) return false;
        return accessiblePermissions.includes(permName);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, currentModule, accessibleModules, accessiblePermissions, hasPermission, selectModule }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
