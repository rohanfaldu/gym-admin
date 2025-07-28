import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Gym {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gymCode: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  createdAt: string;
  admins: Array<{
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  _count: {
    members: number;
    classes: number;
  };
}

const GymManagement: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGyms();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchGyms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);

      const response = await api.get(`/admin/gyms?${params.toString()}`);
      setGyms(response.data.gyms);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch gyms:', error);
      toast.error('Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  const updateGymStatus = async (gymId: string, status: string) => {
    try {
      await api.patch(`/admin/gyms/${gymId}/status`, { status });
      toast.success(`Gym ${status.toLowerCase()} successfully`);
      fetchGyms();
    } catch (error) {
      console.error('Failed to update gym status:', error);
      toast.error('Failed to update gym status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      SUSPENDED: { color: 'bg-red-100 text-red-800', icon: XCircle },
      REJECTED: { color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gym Management</h1>
          <p className="text-gray-600 mt-2">
            Manage gym registrations and monitor platform activity
          </p>
        </div>
        <Button onClick={() => navigate('/super-admin/gyms/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Gym
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gyms by name, email, or code..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Gyms List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {gyms.map((gym) => (
            <Card key={gym.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{gym.name}</h3>
                      {getStatusBadge(gym.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{gym.city}, {gym.state}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <span className="text-sm">{gym.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span className="text-sm">{gym.phone}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm">{gym._count.members} Members</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Building2 className="w-4 h-4 mr-2" />
                          <span className="text-sm">Code: {gym.gymCode}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Registered: {new Date(gym.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {gym.admins.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Gym Admins:</p>
                        <div className="flex flex-wrap gap-2">
                          {gym.admins.map((admin, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {admin.user.firstName} {admin.user.lastName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {gym.status === 'PENDING' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateGymStatus(gym.id, 'ACTIVE')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => updateGymStatus(gym.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {gym.status === 'ACTIVE' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateGymStatus(gym.id, 'SUSPENDED')}
                    >
                      Suspend
                    </Button>
                  )}
                  
                  {gym.status === 'SUSPENDED' && (
                    <Button
                      size="sm"
                      onClick={() => updateGymStatus(gym.id, 'ACTIVE')}
                    >
                      Reactivate
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {gyms.length === 0 && !loading && (
            <Card className="p-12 text-center">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No gyms found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </Card>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default GymManagement;