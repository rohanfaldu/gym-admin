import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { RoleGuard } from './components/auth/RoleGuard';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import GymMarketplace from './pages/public/GymMarketplace';
import GymProfile from './pages/public/GymProfile';

// Super Admin pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import GymManagement from './pages/super-admin/GymManagement';
import PlatformSettings from './pages/super-admin/PlatformSettings';

// Gym Admin pages
import GymAdminDashboard from './pages/gym-admin/Dashboard';
import MemberManagement from './pages/gym-admin/MemberManagement';
import ClassManagement from './pages/gym-admin/ClassManagement';
import SubscriptionManagement from './pages/gym-admin/SubscriptionManagement';

// Member pages
import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';
import ClassBooking from './pages/member/ClassBooking';
import Subscriptions from './pages/member/Subscriptions';

// Layout components
import SuperAdminLayout from './components/layouts/SuperAdminLayout';
import GymAdminLayout from './components/layouts/GymAdminLayout';
import MemberLayout from './components/layouts/MemberLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/gyms" element={<GymMarketplace />} />
            <Route path="/gym/:identifier" element={<GymProfile />} />

            {/* Super Admin Routes */}
            <Route path="/super-admin/*" element={
              <PrivateRoute>
                <RoleGuard roles={['SUPER_ADMIN']}>
                  <SuperAdminLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/super-admin/dashboard" />} />
                      <Route path="/dashboard" element={<SuperAdminDashboard />} />
                      <Route path="/gyms" element={<GymManagement />} />
                      <Route path="/settings" element={<PlatformSettings />} />
                    </Routes>
                  </SuperAdminLayout>
                </RoleGuard>
              </PrivateRoute>
            } />

            {/* Gym Admin Routes */}
            <Route path="/gym-admin/*" element={
              <PrivateRoute>
                <RoleGuard roles={['GYM_ADMIN', 'SUPER_ADMIN']}>
                  <GymAdminLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/gym-admin/dashboard" />} />
                      <Route path="/dashboard" element={<GymAdminDashboard />} />
                      <Route path="/members" element={<MemberManagement />} />
                      <Route path="/classes" element={<ClassManagement />} />
                      <Route path="/subscriptions" element={<SubscriptionManagement />} />
                    </Routes>
                  </GymAdminLayout>
                </RoleGuard>
              </PrivateRoute>
            } />

            {/* Member Routes */}
            <Route path="/member/*" element={
              <PrivateRoute>
                <RoleGuard roles={['MEMBER']}>
                  <MemberLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/member/dashboard" />} />
                      <Route path="/dashboard" element={<MemberDashboard />} />
                      <Route path="/profile" element={<MemberProfile />} />
                      <Route path="/classes" element={<ClassBooking />} />
                      <Route path="/subscriptions" element={<Subscriptions />} />
                    </Routes>
                  </MemberLayout>
                </RoleGuard>
              </PrivateRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;