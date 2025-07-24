import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  User,
  Filter,
  Search,
  MapPin,
  Star
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
  gym: {
    name: string;
    address: string;
    city: string;
  };
  trainer?: {
    name: string;
    specialties: string[];
    avatar?: string;
  };
  bookedCount: number;
  availableSpots: number;
}

const ClassBooking: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = ['All', 'Cardio', 'Strength', 'Yoga', 'Pilates', 'CrossFit', 'Dance'];

  useEffect(() => {
    fetchClasses();
  }, [searchTerm, dateFilter, categoryFilter]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (dateFilter) params.append('date', dateFilter);
      if (categoryFilter && categoryFilter !== 'All') params.append('category', categoryFilter);

      const response = await api.get(`/classes?${params.toString()}`);
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const bookClass = async (classId: string) => {
    try {
      await api.post('/bookings', {
        classId,
        type: 'CLASS'
      });
      toast.success('Class booked successfully!');
      fetchClasses(); // Refresh to update available spots
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to book class');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Classes</h1>
        <p className="text-gray-600 mt-2">
          Find and book fitness classes that match your schedule
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
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
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === category || (categoryFilter === '' && category === 'All')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Classes List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {classes.map((classItem) => {
            const classDate = new Date(classItem.date);
            const isPast = classDate < new Date();
            const isToday = classDate.toDateString() === new Date().toDateString();
            const isFull = classItem.availableSpots <= 0;
            
            return (
              <Card key={classItem.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      isPast ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-600 to-teal-600'
                    }`}>
                      <Calendar className={`w-8 h-8 ${isPast ? 'text-gray-400' : 'text-white'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{classItem.name}</h3>
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
                        {isFull && !isPast && (
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
                            <span className="text-sm">{classItem.startTime} - {classItem.endTime} ({classItem.duration} min)</span>
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
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{classItem.gym.name}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Price: <span className="font-medium text-green-600">${classItem.price}</span>
                          </div>
                        </div>
                      </div>

                      {classItem.description && (
                        <p className="text-gray-600 text-sm mb-4">{classItem.description}</p>
                      )}

                      {classItem.trainer?.specialties && classItem.trainer.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {classItem.trainer.specialties.map((specialty, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{classItem.gym.address}, {classItem.gym.city}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Action */}
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    {!isPast && (
                      <Button
                        onClick={() => bookClass(classItem.id)}
                        disabled={isFull}
                        className="w-full lg:w-auto"
                      >
                        {isFull ? 'Class Full' : 'Book Class'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

          {classes.length === 0 && !loading && (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later for new classes</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassBooking;