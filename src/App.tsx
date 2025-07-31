import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminApp from './admin/AdminApp';
import GymAdminApp from './gym-admin/GymAdminApp';
import Header from './components/Header';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import GymMarketplace from './pages/GymMarketplace';
import GymProfile from './pages/GymProfile';
import MemberSignup from './pages/MemberSignup';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    const gymToken = localStorage.getItem('gymAdminToken');
    const gymUserData = localStorage.getItem('gymAdminUser');
    
    if (gymToken && gymUserData) {
      try {
        const parsedUser = JSON.parse(gymUserData);
        console.log('🏋️ Found stored gym admin user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing gym admin user data:', error);
        localStorage.removeItem('gymAdminToken');
        localStorage.removeItem('gymAdminUser');
      }
    } else if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('🔍 Found stored user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const userData = localStorage.getItem('adminUser');
      const gymToken = localStorage.getItem('gymAdminToken');
      const gymUserData = localStorage.getItem('gymAdminUser');
      
      if (gymToken && gymUserData) {
        try {
          const parsedUser = JSON.parse(gymUserData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing gym admin user data:', error);
          localStorage.removeItem('gymAdminToken');
          localStorage.removeItem('gymAdminUser');
          setUser(null);
        }
      } else if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Listen for storage changes (when login happens in modal)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Check if we're on gym admin routes
  if (window.location.pathname.startsWith('/gym-admin') || (user && user.role === 'gym_admin')) {
    console.log('🏋️ Loading Gym Admin App for user:', user);
    return <GymAdminApp />;
  }

  // Check if we're on admin routes
  if (window.location.pathname.startsWith('/admin') || (user && user.role === 'super_admin')) {
    console.log('🚀 Loading Admin App for user:', user);
    return <AdminApp />;
  }

  console.log('🏠 Loading Main App');
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/marketplace" element={<GymMarketplace />} />
            <Route path="/gym/:id" element={<GymProfile />} />
            <Route path="/signup" element={<MemberSignup />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;