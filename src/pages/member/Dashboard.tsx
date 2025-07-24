import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Calendar, 
  CreditCard, 
  User,
  TrendingUp,
  Clock,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface DashboardStats {
  activeDays: number;
  classesAttended: number;
  monthlyVisits: number;
  totalBookings: number;
}

interface UpcomingClass {
  id: string;
  class: {
    name: string;
    trainer: {
      name: string;
    };
  };
  date: string;
  startTime: string;
  endTime: string;
}

const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, classesResponse] = await Promise.all([
        api.get(`/users/${user?.id}/dashboard`),
        api.get('/bookings/upcoming')
      ]);
      
      setStats(statsResponse.data.stats);
      setUpcomingClasses(classesResponse.data.bookings);
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
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your fitness journey overview
          </p>
        </div>
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Days</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeDays || 0}</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Activity className="w-4 h-4 mr-1" />
                Last 30 days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Attended</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.classesAttended || 0}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <Award className="w-4 h-4 mr-1" />
                Total completed
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Visits</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.monthlyVisits || 0}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                This month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              <p className="text-sm text-purple-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                All time
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col">
            <Calendar className="w-6 h-6 mb-2" />
            Book Class
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <CreditCard className="w-6 h-6 mb-2" />
            View Subscriptions
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Activity className="w-6 h-6 mb-2" />
            My Bookings
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <User className="w-6 h-6 mb-2" />
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Upcoming Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Classes</h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div className="space-y-4">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.class.name}</p>
                      <p className="text-sm text-gray-500">with {booking.class.trainer.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming classes</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Book a class
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Fitness Goals */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Fitness Goals</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Monthly Classes</p>
                  <p className="text-sm text-gray-500">Goal: 12 classes</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">8/12</p>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Weekly Workouts</p>
                  <p className="text-sm text-gray-500">Goal: 4 workouts</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">3/4</p>
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Streak Days</p>
                  <p className="text-sm text-gray-500">Current streak</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">5 days</p>
                <p className="text-sm text-gray-500">Keep it up!</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;