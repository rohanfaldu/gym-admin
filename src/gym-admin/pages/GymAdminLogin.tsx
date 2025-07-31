import React, { useState } from 'react';
import { Building2, Lock, User, AlertCircle } from 'lucide-react';

interface GymAdminLoginProps {
  onLogin: (token: string, user: any) => void;
}

const GymAdminLogin: React.FC<GymAdminLoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: 'admin@fitzone.com',
    password: 'gym123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gym-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          throw new Error(`Server error: ${response.status}`);
        }
        setError(errorData.error || 'Login failed');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        onLogin(data.token, data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10"></div>
      
      <div className="relative max-w-md w-full mx-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-purple-500/20 p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50">
              <Building2 className="h-10 w-10 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Gym Admin</h1>
            <p className="text-gray-300">Gym Management Portal</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="admin@fitzone.com"
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
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 disabled:shadow-none"
            >
              {loading ? 'Signing In...' : 'Sign In to Gym Dashboard'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-sm font-medium text-purple-400 mb-2">Demo Credentials:</h3>
            <p className="text-xs text-gray-300">Email: admin@fitzone.com</p>
            <p className="text-xs text-gray-300">Password: gym123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymAdminLogin;