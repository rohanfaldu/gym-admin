import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  CreditCard, 
  HeadphonesIcon, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Gym Management', href: '/admin/gyms', icon: Building2 },
    { name: 'Billing', href: '/admin/billing', icon: CreditCard },
    { name: 'Support & Logs', href: '/admin/support', icon: HeadphonesIcon },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 z-50 lg:z-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-cyan-500/30">
              <Shield className="h-6 w-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">
              {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;