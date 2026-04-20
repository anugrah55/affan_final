import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plane, LogOut, LayoutDashboard } from 'lucide-react';

export const AppLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-[#fefdfb] text-gray-900 font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <Plane size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">WonderPlan</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                Hi, {user?.name?.split(' ')[0] || 'Traveler'}
              </span>
            </div>
            
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
      
      {/* Footer watermark */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        Built by Affan Khan • End Term Project
      </footer>
    </div>
  );
};
