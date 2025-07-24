import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Star, Dumbbell } from 'lucide-react';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Gym {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  logo?: string;
  images: string[];
  _count: {
    members: number;
    classes: number;
  };
}

const GymMarketplace: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    fetchGyms();
  }, [searchTerm, cityFilter]);

  const fetchGyms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (cityFilter) params.append('city', cityFilter);
      
      const response = await api.get(`/gyms?${params.toString()}`);
      setGyms(response.data.gyms);
    } catch (error) {
      console.error('Failed to fetch gyms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GymSAAS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Gym
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing fitness facilities near you and start your fitness journey today
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gyms..."
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="City"
              className="pl-10 w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Gym Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym) => (
              <Card key={gym.id} hover className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                  {gym.logo ? (
                    <img 
                      src={gym.logo} 
                      alt={gym.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Dumbbell className="w-12 h-12 text-blue-600" />
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {gym.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{gym.city}, {gym.state}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {gym.description || 'A premium fitness facility with state-of-the-art equipment and expert trainers.'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{gym._count.members} members</span>
                      </div>
                      <div className="flex items-center">
                        <Dumbbell className="w-4 h-4 mr-1" />
                        <span>{gym._count.classes} classes</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>

                  <Link to={`/gym/${gym.id}`}>
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && gyms.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gyms found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GymMarketplace;