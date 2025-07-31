import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginType: 'super_admin' | 'gym_admin';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, loginType }) => {
  const [formData, setFormData] = useState({
    email: loginType === 'super_admin' ? 'admin@gymfinder.com' : 'admin@fitzone.com',
    password: loginType === 'super_admin' ? 'admin123' : 'gym123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when login type changes
  React.useEffect(() => {
    setFormData({
      email: loginType === 'super_admin' ? 'admin@gymfinder.com' : 'admin@fitzone.com',
      password: loginType === 'super_admin' ? 'admin123' : 'gym123'
    });
    setError('');
  }, [loginType]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log(`🔐 Starting ${loginType} login process...`);
    console.log('📧 Email:', formData.email);

    try {
      const loginUrl = loginType === 'super_admin' ? 'http://localhost:3001/api/auth/login' : 'http://localhost:3001/api/gym-auth/login';
      console.log('🌐 Making request to:', loginUrl);

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          setError(errorData.error || `Server error: ${response.status}`);
        } catch {
          setError(`Server error: ${response.status} - ${responseText}`);
        }
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('✅ Parsed response data:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        setError('Invalid response from server');
        return;
      }

      if (data.token && data.user) {
        console.log('🎉 Login successful!');
        console.log('👤 User role:', data.user.role);
        
        // Store credentials based on login type
        if (loginType === 'super_admin') {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          console.log('🚀 Redirecting to admin dashboard...');
          onClose();
          // Force a page reload to trigger the App component to re-check auth
          window.location.reload();
        } else {
          localStorage.setItem('gymAdminToken', data.token);
          localStorage.setItem('gymAdminUser', JSON.stringify(data.user));
          console.log('🏋️ Redirecting to gym admin dashboard...');
          onClose();
          // Force a page reload to trigger the App component to re-check auth
          window.location.reload();
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setError('Connection failed. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full shadow-2xl shadow-cyan-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {loginType === 'super_admin' ? 'Super Admin Login' : 'Gym Admin Login'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 disabled:shadow-none"
          >
            {loading ? 'Signing In...' : `Sign In to ${loginType === 'super_admin' ? 'Super Admin' : 'Gym Admin'} Dashboard`}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="p-6 pt-0">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/30">
            <h3 className="text-sm font-medium text-cyan-400 mb-2">
              {loginType === 'super_admin' ? 'Super Admin Access:' : 'Gym Admin Access:'}
            </h3>
            <p className="text-xs text-gray-300">✅ Email: {formData.email}</p>
            <p className="text-xs text-gray-300">✅ Password: {formData.password}</p>
            <p className="text-xs text-cyan-400 mt-2">Pre-filled for easy access!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;