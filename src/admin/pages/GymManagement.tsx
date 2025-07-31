import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Building2, 
  Users, 
  MapPin,
  Phone,
  Mail,
  Key,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Gym {
  id: string;
  name: string;
  email: string;
  gymCode: string;
  location: string;
  city: string;
  phone: string;
  description?: string;
  services: string[];
  amenities: string[];
  workingHours: string;
  priceRange: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    members: number;
    subscriptions: number;
  };
}

const GymManagement: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [newGym, setNewGym] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    city: '',
    phone: '',
    description: '',
    services: [] as string[],
    amenities: [] as string[],
    workingHours: '6:00 AM - 10:00 PM',
    priceRange: '$$',
    category: 'Premium'
  });

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://gym-api-qzjz.onrender.com/api/gyms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGyms(data);
      }
    } catch (error) {
      console.error('Error fetching gyms:', error);
      // Mock data for demo
      setGyms([
        {
          id: '1',
          name: 'FitZone Premium',
          email: 'admin@fitzone.com',
          gymCode: '123456',
          location: 'Downtown District',
          city: 'New York',
          phone: '+1 (555) 123-4567',
          description: 'Premium fitness facility with state-of-the-art equipment',
          services: ['Personal Training', 'Group Classes', 'Spa'],
          amenities: ['Pool', 'Sauna', 'Parking'],
          workingHours: '5:00 AM - 11:00 PM',
          priceRange: '$$$',
          category: 'Premium',
          isActive: true,
          createdAt: new Date().toISOString(),
          _count: { members: 245, subscriptions: 3 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGym = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://gym-api-qzjz.onrender.com/api/gyms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGym)
      });

      if (response.ok) {
        const gym = await response.json();
        setGyms(prev => [gym, ...prev]);
        setShowCreateModal(false);
        setNewGym({
          name: '',
          email: '',
          password: '',
          location: '',
          city: '',
          phone: '',
          description: '',
          services: [],
          amenities: [],
          workingHours: '6:00 AM - 10:00 PM',
          priceRange: '$$',
          category: 'Premium'
        });
      }
    } catch (error) {
      console.error('Error creating gym:', error);
    }
  };

  const handleDeleteGym = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gym?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://gym-api-qzjz.onrender.com/api/gyms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setGyms(prev => prev.filter(gym => gym.id !== id));
      }
    } catch (error) {
      console.error('Error deleting gym:', error);
    }
  };

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.gymCode.includes(searchTerm)
  );

  const serviceOptions = ['Personal Training', 'Group Classes', 'Spa', 'Nutrition Counseling', 'Cardio', 'Weight Training'];
  const amenityOptions = ['Pool', 'Sauna', 'Parking', 'Locker Rooms', 'Cafe', 'Showers'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Gym Management</h2>
          <p className="text-gray-400">Manage all registered gyms and their details</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Gym</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search gyms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      {/* Gyms Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Gym Details</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Code</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Location</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Members</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredGyms.map((gym) => (
                <tr key={gym.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{gym.name}</p>
                        <p className="text-gray-400 text-sm">{gym.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="bg-gray-800 border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-400 font-mono text-sm inline-block">
                      {gym.gymCode}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span>{gym.city}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Users className="h-4 w-4" />
                      <span>{gym._count.members}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 ${gym.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {gym.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <span>{gym.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedGym(gym);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGym(gym.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Gym Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Add New Gym</h3>
            </div>
            
            <form onSubmit={handleCreateGym} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gym Name</label>
                  <input
                    type="text"
                    value={newGym.name}
                    onChange={(e) => setNewGym(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={newGym.email}
                    onChange={(e) => setNewGym(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={newGym.location}
                    onChange={(e) => setNewGym(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    value={newGym.city}
                    onChange={(e) => setNewGym(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={newGym.phone}
                    onChange={(e) => setNewGym(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={newGym.category}
                    onChange={(e) => setNewGym(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Strength">Strength</option>
                    <option value="Wellness">Wellness</option>
                    <option value="CrossFit">CrossFit</option>
                    <option value="Boxing">Boxing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
                  <input
                    type="password"
                    value={newGym.password}
                    onChange={(e) => setNewGym(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                    placeholder="Set password for gym admin login"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newGym.description}
                  onChange={(e) => setNewGym(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30"
                >
                  Create Gym
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gym Details Modal */}
      {showDetailsModal && selectedGym && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{selectedGym.name}</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    <span className="text-gray-300">{selectedGym.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">{selectedGym.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-pink-400" />
                    <span className="text-gray-300">{selectedGym.location}, {selectedGym.city}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-yellow-400" />
                    <span className="text-gray-300 font-mono">{selectedGym.gymCode}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGym.services.map((service, index) => (
                        <span key={index} className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedGym.amenities.map((amenity, index) => (
                        <span key={index} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedGym.description && (
                <div>
                  <h4 className="text-white font-medium mb-2">Description</h4>
                  <p className="text-gray-300">{selectedGym.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <Users className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedGym._count.members}</p>
                  <p className="text-gray-400 text-sm">Members</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <Building2 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedGym._count.subscriptions}</p>
                  <p className="text-gray-400 text-sm">Subscriptions</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg text-center">
                  {selectedGym.isActive ? (
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                  )}
                  <p className="text-2xl font-bold text-white">{selectedGym.isActive ? 'Active' : 'Inactive'}</p>
                  <p className="text-gray-400 text-sm">Status</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymManagement;