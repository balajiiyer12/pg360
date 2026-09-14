import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function LoggedInNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-6 py-4 md:px-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-extrabold text-sm">
          360
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          PG360
        </span>
      </div>

      <button 
        onClick={handleLogout} 
        className="px-6 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm"
      >
        Logout
      </button>
    </header>
  );
}

export default LoggedInNavbar;