  import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  Activity,
  Clock,
  Target
} from 'lucide-react';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  todayBookings: number;
  monthlyRevenue: number;
}

interface RecentMember {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  plan: {
    name: string;
    price: number;
  };
  createdAt: string;
}

const GymAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMembers, setRecentMembers] = useState<RecentMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 4500, members: 45 },
    { month: 'Feb', revenue: 5200, members: 52 },
    { month: 'Mar', revenue: 4800, members: 48 },
    { month: 'Apr', revenue: 6100, members: 61 },
    { month: 'May', revenue: 6700, members: 67 },
    { month: 'Jun', revenue: 7300, members: 73 },
  ];

  const attendanceData = [
    { day: 'Mon', attendance: 85 },
    { day: 'Tue', attendance: 92 },
    { day: 'Wed', attendance: 78 },
    { day: 'Thu', attendance: 88 },
    { day: 'Fri', attendance: 95 },
    { day: 'Sat', attendance: 76 },
    { day: 'Sun', attendance: 65 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // This would use the actual gym ID from the authenticated user
      const gymId = 'cmdmtf6qy00018nhrd0duebou'; // Replace with actual gym ID
      const response = await api.get(`/gyms/${gymId}/dashboard`);
      setStats(response.data.stats);
      setRecentMembers(response.data.recentMembers);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gym Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor your gym's performance and member activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalMembers || 0}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeMembers || 0}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <UserPlus className="w-4 h-4 mr-1" />
                {stats?.activeMembers && stats?.totalMembers ? 
                  `${Math.round((stats.activeMembers / stats.totalMembers) * 100)}%` : '0%'} active
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.todayBookings || 0}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                Classes & sessions
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ${(stats?.monthlyRevenue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <DollarSign className="w-4 h-4 mr-1" />
                This month
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563EB" 
                strokeWidth={3}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Attendance']}
              />
              <Bar dataKey="attendance" fill="#0891B2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Members</h3>
            {/* <Button variant="ghost" size="sm">View all</Button> */}
          </div>
          <div className="space-y-4">
            {recentMembers.length > 0 ? (
              recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {member.user.avatar ? (
                        <img 
                          src={member.user.avatar} 
                          alt={`${member.user.firstName} ${member.user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 font-medium">
                          {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.user.firstName} {member.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{member.plan.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${member.plan.price}/mo
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent members</p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add Member</p>
              <p className="text-sm text-gray-500">Register new member</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Schedule Class</p>
              <p className="text-sm text-gray-500">Create new class</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">View Payments</p>
              <p className="text-sm text-gray-500">Check transactions</p>
            </button>

            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-500">View detailed reports</p>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GymAdminDashboard;