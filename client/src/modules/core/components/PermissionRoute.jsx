import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PermissionRoute = ({ children, permission }) => {
    const { user, loading, hasPermission } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If no permission is required, allow access
    if (!permission) {
        return children;
    }

    // Check if user has the required permission
    if (!hasPermission(permission)) {
        // Redirect to dashboard with error state
        return <Navigate to="/" state={{ error: 'You do not have permission to access this page.' }} replace />;
    }

    return children;
};

export default PermissionRoute;
