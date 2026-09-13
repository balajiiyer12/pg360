import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
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

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <div className="hover:text-slate-900 transition-colors">Features</div>
        <div className="hover:text-slate-900 transition-colors">Pricing</div>
        <div className="hover:text-slate-900 transition-colors">Contact</div>
      </nav>

      
      <button onClick={()=>{navigate("/login")}} className="px-6 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-sm">
        Login  
      </button>
    </header>
  );
}

export default Navbar;