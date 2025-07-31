import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const GymAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    todayAttendance: 0,
    monthlyRevenue: 0,
    pendingRequests: 0,
    totalClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 22000, members: 180 },
    { month: 'Feb', revenue: 25000, members: 195 },
    { month: 'Mar', revenue: 23000, members: 210 },
    { month: 'Apr', revenue: 27000, members: 225 },
    { month: 'May', revenue: 26000, members: 235 },
    { month: 'Jun', revenue: 28500, members: 245 },
  ];

  const attendanceData = [
    { day: 'Mon', attendance: 85 },
    { day: 'Tue', attendance: 92 },
    { day: 'Wed', attendance: 78 },
    { day: 'Thu', attendance: 88 },
    { day: 'Fri', attendance: 95 },
    { day: 'Sat', attendance: 110 },
    { day: 'Sun', attendance: 65 },
  ];

  const membershipData = [
    { name: 'Basic', value: 120, color: '#06B6D4' },
    { name: 'Premium', value: 85, color: '#8B5CF6' },
    { name: 'VIP', value: 40, color: '#EC4899' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) {
        setError('No authentication found');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch(`https://gym-api-qzjz.onrender.com/api/gym/${user.gymId}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching gym dashboard data:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };
  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: '+12%'
    },
    {
      title: 'Active Members',
      value: stats.activeMembers,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-500',
      change: '+8%'
    },
    {
      title: 'Today Attendance',
      value: stats.todayAttendance,
      icon: Calendar,
      color: 'from-cyan-500 to-blue-500',
      change: '+5%'
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      change: '+15%'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'member_join',
      message: 'John Doe joined Premium membership',
      time: '2 hours ago',
      icon: Users,
      color: 'text-green-400'
    },
    {
      id: '2',
      type: 'payment',
      message: 'Payment received from Sarah Wilson - $89',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'text-yellow-400'
    },
    {
      id: '3',
      type: 'class_booking',
      message: 'Mike Chen booked HIIT Training class',
      time: '6 hours ago',
      icon: Calendar,
      color: 'text-purple-400'
    },
    {
      id: '4',
      type: 'membership_expiry',
      message: 'Emma Wilson membership expires in 3 days',
      time: '8 hours ago',
      icon: AlertTriangle,
      color: 'text-red-400'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
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

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Pending Requests</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-400 mb-2">{stats.pendingRequests}</p>
          <p className="text-gray-300 text-sm">New membership requests awaiting approval</p>
        </div>

        <div className="bg-gray-900 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h3 className="text-lg font-bold text-white">Expiring Soon</h3>
          </div>
          <p className="text-3xl font-bold text-red-400 mb-2">{stats.expiringSoon}</p>
          <p className="text-gray-300 text-sm">Memberships expiring in next 7 days</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Members Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
            Revenue & Member Growth
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
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="#EC4899" 
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Attendance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-cyan-400" />
            Weekly Attendance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="attendance" fill="url(#cyanGradient)" />
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Membership Distribution & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Distribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Membership Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={membershipData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {membershipData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className={`p-2 rounded-full bg-gray-700 ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.message}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Add Member</h4>
          <p className="text-gray-400 mb-4">Register new member</p>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30">
            Add Member
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
          <Calendar className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Schedule Class</h4>
          <p className="text-gray-400 mb-4">Create new class</p>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30">
            Schedule
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
          <DollarSign className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Generate Invoice</h4>
          <p className="text-gray-400 mb-4">Create billing</p>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/30">
            Invoice
          </button>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Approve Requests</h4>
          <p className="text-gray-400 mb-4">Review pending</p>
          <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-green-500/30">
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default GymAdminDashboard;