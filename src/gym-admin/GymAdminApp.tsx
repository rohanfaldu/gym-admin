import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GymAdminLogin from './pages/GymAdminLogin';
import GymAdminDashboard from './pages/GymAdminDashboard';
import MemberManagement from './pages/MemberManagement';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Reservations from './pages/Reservations';
import ProductsInventory from './pages/ProductsInventory';
import SalesInvoicing from './pages/SalesInvoicing';
import AttendanceLogs from './pages/AttendanceLogs';
import ClassManagement from './pages/ClassManagement';
import LockerManagement from './pages/LockerManagement';
import Expenses from './pages/Expenses';
import Payroll from './pages/Payroll';
import Deposits from './pages/Deposits';
import GymSettings from './pages/GymSettings';
import GymAdminLayout from './components/GymAdminLayout';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  gymId: string;
  gymName: string;
}

const GymAdminApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gymAdminToken');
    const userData = localStorage.getItem('gymAdminUser');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing gym admin user data:', error);
        localStorage.removeItem('gymAdminToken');
        localStorage.removeItem('gymAdminUser');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, userData: User) => {
    localStorage.setItem('gymAdminToken', token);
    localStorage.setItem('gymAdminUser', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('gymAdminToken');
    localStorage.removeItem('gymAdminUser');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <GymAdminLogin onLogin={handleLogin} />;
  }

  return (
    <Router>
      <GymAdminLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/gym-admin" element={<GymAdminDashboard />} />
          <Route path="/gym-admin/members" element={<MemberManagement />} />
          <Route path="/gym-admin/subscriptions" element={<SubscriptionPlans />} />
          <Route path="/gym-admin/reservations" element={<Reservations />} />
          <Route path="/gym-admin/products" element={<ProductsInventory />} />
          <Route path="/gym-admin/sales" element={<SalesInvoicing />} />
          <Route path="/gym-admin/attendance" element={<AttendanceLogs />} />
          <Route path="/gym-admin/classes" element={<ClassManagement />} />
          <Route path="/gym-admin/lockers" element={<LockerManagement />} />
          <Route path="/gym-admin/expenses" element={<Expenses />} />
          <Route path="/gym-admin/payroll" element={<Payroll />} />
          <Route path="/gym-admin/deposits" element={<Deposits />} />
          <Route path="/gym-admin/settings" element={<GymSettings />} />
          <Route path="*" element={<Navigate to="/gym-admin" replace />} />
        </Routes>
      </GymAdminLayout>
    </Router>
  );
};

export default GymAdminApp;