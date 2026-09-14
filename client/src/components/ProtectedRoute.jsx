import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium">Loading session...</p>
      </div>
    );
  }

  if (!user || (allowedRole && user.role !== allowedRole)) {
    return <Navigate to="/login"/>;
  }

  return <Outlet />;
};

export default ProtectedRoute;