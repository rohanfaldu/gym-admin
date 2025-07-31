import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStats {
  totalGyms: number;
  activeGyms: number;
  totalMembers: number;
  totalRevenue: number;
}

interface ActivityLog {
  id: string;
  action: string;
  details: string;
  createdAt: string;
  gym?: { name: string };
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalGyms: 0,
    activeGyms: 0,
    totalMembers: 0,
    totalRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 },
  ];

  const gymGrowthData = [
    { month: 'Jan', gyms: 45 },
    { month: 'Feb', gyms: 52 },
    { month: 'Mar', gyms: 61 },
    { month: 'Apr', gyms: 68 },
    { month: 'May', gyms: 75 },
    { month: 'Jun', gyms: 82 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Gyms',
      value: stats.totalGyms,
      icon: Building2,
      color: 'from-cyan-500 to-blue-500',
      change: '+12%'
    },
    {
      title: 'Active Gyms',
      value: stats.activeGyms,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      change: '+8%'
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: '+23%'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      change: '+15%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="text-center">
  //         <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
  //         <p className="text-red-400 mb-4">{error}</p>
  //         <button
  //           onClick={fetchDashboardData}
  //           className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                  <p className="text-green-400 text-sm mt-1">{card.change} from last month</p>
                </div>
                <div className={`bg-gradient-to-r ${card.color} p-3 rounded-lg shadow-lg`}>
                  <Icon className="h-6 w-6 text-black" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-cyan-400" />
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#06B6D4" 
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gym Growth Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-purple-400" />
            Gym Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gymGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="gyms" fill="url(#purpleGradient)" />
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-400" />
          Recent Activities
        </h3>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-full">
                  <Activity className="h-4 w-4 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.details}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-cyan-400 text-sm font-medium">
                  {activity.action.replace('_', ' ')}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activities</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
          <Building2 className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Add New Gym</h4>
          <p className="text-gray-400 mb-4">Register a new gym partner</p>
          <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30">
            Add Gym
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <DollarSign className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Generate Invoice</h4>
          <p className="text-gray-400 mb-4">Create billing for gyms</p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30">
            Create Invoice
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Support Tickets</h4>
          <p className="text-gray-400 mb-4">View pending issues</p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/30">
            View Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;