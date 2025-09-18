import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Settings, LogOut, Plus, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Users, label: 'Community', path: '/community' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ icon: Settings, label: 'Admin', path: '/admin' });
  }
  
  const NavContent = () => (
    <>
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <span className="text-xl font-bold text-white">Gettogather</span>
        </Link>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-500/10 text-primary-400' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8">
          <Link
            to="/create-event"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-3 rounded-xl hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-200"
          >
            <Plus size={20} />
            <span className="font-medium">Create Event</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.department}</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <Bell size={18} />
          </button>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <LogOut size={16} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="bg-gray-800 border-r border-gray-700 w-64 min-h-screen fixed left-0 top-0 z-40 hidden md:block">
        <NavContent />
      </nav>
      
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4 z-50">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">G</span>
          </div>
          <span className="text-lg font-bold text-white">Gettogather</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="text-gray-300">
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-gray-800 z-50 md:hidden"
          >
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-300">
                <X size={24} />
              </button>
            </div>
            <NavContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add padding to main content for mobile header */}
      <div className="pt-16 md:pt-0"></div>
    </>
  );
};

export default Navigation;
