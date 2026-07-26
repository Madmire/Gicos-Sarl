/**
 * Layout pour l'administration
 * GICOS - Galaxie Immobilière Construction et Services
 */

import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Image,
  Wrench,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { name: 'Annonces', path: '/admin/annonces', icon: Building2 },
    { name: 'Galerie', path: '/admin/galerie', icon: Image },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Témoignages', path: '/admin/temoignages', icon: Users },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - TailAdmin Dark Style */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-boxdark shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-strokedark">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white p-1">
              <img src="/logo.png" alt="GICOS" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-white">GICOS</h1>
              <p className="text-xs text-bodydark">Administration</p>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-bodydark hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Title */}
        <div className="px-6 pt-6 pb-3">
          <p className="text-xs font-semibold text-bodydark uppercase tracking-wider">Menu</p>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-meta-4 text-white'
                    : 'text-bodydark2 hover:bg-meta-4 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {isActive(item.path) && (
                  <ChevronRight size={16} className="ml-auto text-gold-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Voir le site */}
        <div className="absolute bottom-20 left-4 right-4">
          <Link 
            to="/" 
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-meta-4 text-bodydark2 rounded-lg font-medium hover:bg-meta-3 hover:text-white transition-colors"
          >
            Voir le site
          </Link>
        </div>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-meta-1 hover:bg-meta-4 rounded-lg font-medium transition-colors"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content - TailAdmin style */}
      <div className="lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-20 bg-white shadow-md flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:flex items-center gap-4">
            <span className="text-sm text-gray-500">Bienvenue,</span>
            <span className="font-semibold text-gray-900">{user?.username || 'Admin'}</span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <button className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-meta-1 rounded-full border-2 border-white" />
            </button>

            {/* User dropdown */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.username || 'Admin'}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 bg-gray-100 min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
