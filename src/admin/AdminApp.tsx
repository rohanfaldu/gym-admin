import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import GymManagement from './pages/GymManagement';
import BillingManagement from './pages/BillingManagement';
import SupportLogs from './pages/SupportLogs';
import AdminLayout from './components/AdminLayout';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const AdminApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing admin user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AdminLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/gyms" element={<GymManagement />} />
          <Route path="/admin/billing" element={<BillingManagement />} />
          <Route path="/admin/support" element={<SupportLogs />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
};

export default AdminApp;