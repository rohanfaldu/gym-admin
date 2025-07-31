import React from 'react';
import { useState } from 'react';
import { Search, MapPin, User, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';

const Header: React.FC = () => {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'super_admin' | 'gym_admin'>('super_admin');

  const isActive = (path: string) => location.pathname === path;

  const handleSuperAdminAccess = () => {
    setLoginType('super_admin');
    setShowLoginModal(true);
  };

  const handleGymAdminAccess = () => {
    setLoginType('gym_admin');
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="bg-black border-b border-gray-800 sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-200 shadow-lg shadow-cyan-500/30">
              <Search className="h-5 w-5 text-black font-bold" />
            </div>
            <span className="text-xl font-bold text-white">GymFinder</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 glow-text' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/marketplace" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/marketplace') 
                  ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 glow-text' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              Find Gyms
            </Link>
            <Link 
              to="/signup" 
              className={`font-medium transition-colors duration-200 ${
                isActive('/signup') 
                  ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1 glow-text' 
                  : 'text-gray-300 hover:text-cyan-400'
              }`}
            >
              Join
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200">
              <MapPin className="h-5 w-5" />
            </button>
            <button 
              onClick={handleGymAdminAccess}
              className="p-2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
              title="Gym Admin Dashboard"
            >
              <Building2 className="h-5 w-5" />
            </button>
            <button 
              onClick={handleSuperAdminAccess}
              className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              title="Super Admin Dashboard"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        loginType={loginType}
      />
      </>
  );
};

export default Header;