import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus,
  Clock,
  Users,
  User,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface Class {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  duration: number;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
  trainer?: {
    id: string;
    name: string;
    specialties: string[];
    avatar?: string;
  };
  bookedCount: number;
  availableSpots: number;
  isFullyBooked: boolean;
}

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClasses();
  }, [currentPage, searchTerm, dateFilter, statusFilter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const gymId = 'current-gym-id'; // Replace with actual gym ID
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (dateFilter) params.append('date', dateFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await api.get(`/classes/gym/${gymId}?${params.toString()}`);
      setClasses(response.data.classes);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This will cancel all bookings.')) {
      return;
    }

    try {
      await api.delete(`/classes/${classId}`);
      toast.success('Class deleted successfully');
      fetchClasses();
    } catch (error) {
      console.error('Failed to delete class:', error);
      toast.error('Failed to delete class');
    }
  };

  const toggleClassStatus = async (classId: string, isActive: boolean) => {
    try {
      await api.put(`/classes/${classId}`, { isActive: !isActive });
      toast.success(`Class ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchClasses();
    } catch (error) {
      console.error('Failed to update class status:', error);
      toast.error('Failed to update class status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-2">
            Schedule and manage fitness classes for your gym
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Class
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Classes</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Classes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {classes.map((classItem) => {
            const classDate = new Date(classItem.date);
            const isPast = classDate < new Date();
            const isToday = classDate.toDateString() === new Date().toDateString();
            
            return (
              <Card key={classItem.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      isPast ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-600 to-teal-600'
                    }`}>
                      <Calendar className={`w-8 h-8 ${isPast ? 'text-gray-400' : 'text-white'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{classItem.name}</h3>
                        {!classItem.isActive && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            Inactive
                          </span>
                        )}
                        {isToday && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            Today
                          </span>
                        )}
                        {isPast && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            Completed
                          </span>
                        )}
                        {classItem.isFullyBooked && !isPast && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            Full
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {classDate.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">{classItem.startTime} - {classItem.endTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm">
                              {classItem.bookedCount}/{classItem.capacity} booked
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {classItem.trainer && (
                            <div className="flex items-center text-gray-600">
                              <User className="w-4 h-4 mr-2" />
                              <span className="text-sm">{classItem.trainer.name}</span>
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            Duration: <span className="font-medium">{classItem.duration} minutes</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Price: <span className="font-medium">${classItem.price}</span>
                          </div>
                        </div>
                      </div>

                      {classItem.description && (
                        <p className="text-gray-600 text-sm mb-4">{classItem.description}</p>
                      )}

                      {classItem.trainer?.specialties && classItem.trainer.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {classItem.trainer.specialties.map((specialty, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleClassStatus(classItem.id, classItem.isActive)}
                    >
                      {classItem.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteClass(classItem.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {classes.length === 0 && !loading && (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
              <p className="text-gray-600 mb-4">Create your first class to get started</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
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

export default ClassManagement;