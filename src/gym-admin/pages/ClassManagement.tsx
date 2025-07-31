import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  User,
  GraduationCap,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface GymClass {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  trainerName: string;
  day: string;
  time: string;
  duration: number; // in minutes
  capacity: number;
  enrolled: number;
  price: number;
  isActive: boolean;
  category: string;
}

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  email: string;
}

interface ClassBooking {
  id: string;
  classId: string;
  className: string;
  memberName: string;
  memberEmail: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'bookings'>('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClass, setEditingClass] = useState<GymClass | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trainerId: '',
    day: 'Monday',
    time: '09:00',
    duration: '60',
    capacity: '20',
    price: '25',
    category: 'Fitness',
    isActive: true
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['Fitness', 'Yoga', 'Pilates', 'HIIT', 'Strength', 'Cardio', 'Dance', 'Martial Arts'];

  useEffect(() => {
    // Mock data for demo
    setTrainers([
      {
        id: '1',
        name: 'Sarah Johnson',
        specialty: 'Yoga & Pilates',
        email: 'sarah@fitzone.com'
      },
      {
        id: '2',
        name: 'Mike Chen',
        specialty: 'HIIT & CrossFit',
        email: 'mike@fitzone.com'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        specialty: 'Dance & Cardio',
        email: 'emma@fitzone.com'
      },
      {
        id: '4',
        name: 'David Rodriguez',
        specialty: 'Strength Training',
        email: 'david@fitzone.com'
      }
    ]);

    setClasses([
      {
        id: '1',
        name: 'Morning Yoga',
        description: 'Start your day with energizing yoga flow',
        trainerId: '1',
        trainerName: 'Sarah Johnson',
        day: 'Monday',
        time: '07:00',
        duration: 60,
        capacity: 25,
        enrolled: 18,
        price: 20,
        isActive: true,
        category: 'Yoga'
      },
      {
        id: '2',
        name: 'HIIT Training',
        description: 'High-intensity interval training for maximum results',
        trainerId: '2',
        trainerName: 'Mike Chen',
        day: 'Monday',
        time: '18:00',
        duration: 45,
        capacity: 20,
        enrolled: 15,
        price: 30,
        isActive: true,
        category: 'HIIT'
      },
      {
        id: '3',
        name: 'Zumba Dance',
        description: 'Fun dance workout with Latin rhythms',
        trainerId: '3',
        trainerName: 'Emma Wilson',
        day: 'Tuesday',
        time: '19:00',
        duration: 60,
        capacity: 30,
        enrolled: 22,
        price: 25,
        isActive: true,
        category: 'Dance'
      },
      {
        id: '4',
        name: 'Strength & Conditioning',
        description: 'Build muscle and improve overall strength',
        trainerId: '4',
        trainerName: 'David Rodriguez',
        day: 'Wednesday',
        time: '17:00',
        duration: 75,
        capacity: 15,
        enrolled: 12,
        price: 35,
        isActive: true,
        category: 'Strength'
      },
      {
        id: '5',
        name: 'Evening Pilates',
        description: 'Relaxing pilates session to end your day',
        trainerId: '1',
        trainerName: 'Sarah Johnson',
        day: 'Thursday',
        time: '20:00',
        duration: 50,
        capacity: 20,
        enrolled: 8,
        price: 22,
        isActive: false,
        category: 'Pilates'
      }
    ]);

    setBookings([
      {
        id: '1',
        classId: '1',
        className: 'Morning Yoga',
        memberName: 'John Doe',
        memberEmail: 'john@example.com',
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      },
      {
        id: '2',
        classId: '2',
        className: 'HIIT Training',
        memberName: 'Sarah Wilson',
        memberEmail: 'sarah@example.com',
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      },
      {
        id: '3',
        classId: '3',
        className: 'Zumba Dance',
        memberName: 'Mike Johnson',
        memberEmail: 'mike@example.com',
        bookingDate: new Date().toISOString(),
        status: 'pending'
      },
      {
        id: '4',
        classId: '1',
        className: 'Morning Yoga',
        memberName: 'Emma Davis',
        memberEmail: 'emma@example.com',
        bookingDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'cancelled'
      }
    ]);

    setLoading(false);
  }, []);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    const trainer = trainers.find(t => t.id === formData.trainerId);
    
    const newClass: GymClass = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      trainerId: formData.trainerId,
      trainerName: trainer?.name || '',
      day: formData.day,
      time: formData.time,
      duration: parseInt(formData.duration),
      capacity: parseInt(formData.capacity),
      enrolled: 0,
      price: parseFloat(formData.price),
      isActive: formData.isActive,
      category: formData.category
    };
    
    setClasses(prev => [newClass, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;

    const trainer = trainers.find(t => t.id === formData.trainerId);
    
    const updatedClass: GymClass = {
      ...editingClass,
      name: formData.name,
      description: formData.description,
      trainerId: formData.trainerId,
      trainerName: trainer?.name || '',
      day: formData.day,
      time: formData.time,
      duration: parseInt(formData.duration),
      capacity: parseInt(formData.capacity),
      price: parseFloat(formData.price),
      isActive: formData.isActive,
      category: formData.category
    };
    
    setClasses(prev => prev.map(cls => cls.id === editingClass.id ? updatedClass : cls));
    setEditingClass(null);
    resetForm();
  };

  const handleDeleteClass = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(cls => cls.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      trainerId: '',
      day: 'Monday',
      time: '09:00',
      duration: '60',
      capacity: '20',
      price: '25',
      category: 'Fitness',
      isActive: true
    });
  };

  const startEdit = (gymClass: GymClass) => {
    setEditingClass(gymClass);
    setFormData({
      name: gymClass.name,
      description: gymClass.description,
      trainerId: gymClass.trainerId,
      day: gymClass.day,
      time: gymClass.time,
      duration: gymClass.duration.toString(),
      capacity: gymClass.capacity.toString(),
      price: gymClass.price.toString(),
      category: gymClass.category,
      isActive: gymClass.isActive
    });
  };

  const handleBookingStatusChange = (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking =>
    booking.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.memberEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalClasses: classes.length,
    activeClasses: classes.filter(c => c.isActive).length,
    totalEnrolled: classes.reduce((sum, c) => sum + c.enrolled, 0),
    totalCapacity: classes.reduce((sum, c) => sum + c.capacity, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Class Management</h2>
          <p className="text-gray-400">Schedule and manage fitness classes</p>
        </div>
        {activeTab === 'classes' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Class</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Classes</p>
              <p className="text-2xl font-bold text-white">{stats.totalClasses}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Classes</p>
              <p className="text-2xl font-bold text-green-400">{stats.activeClasses}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Enrolled</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.totalEnrolled}</p>
            </div>
            <Users className="h-8 w-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Capacity Usage</p>
              <p className="text-2xl font-bold text-yellow-400">
                {stats.totalCapacity > 0 ? Math.round((stats.totalEnrolled / stats.totalCapacity) * 100) : 0}%
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'classes'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <GraduationCap className="h-5 w-5" />
          <span>Classes</span>
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'bookings'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Bookings</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Content */}
      {activeTab === 'classes' ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Class</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Trainer</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Schedule</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Enrollment</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Price</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredClasses.map((gymClass) => (
                  <tr key={gymClass.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{gymClass.name}</p>
                        <p className="text-gray-400 text-sm">{gymClass.category}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-300">{gymClass.trainerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300">
                        <p>{gymClass.day}</p>
                        <p className="text-sm">{gymClass.time} ({gymClass.duration}min)</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${(gymClass.enrolled / gymClass.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 text-sm">{gymClass.enrolled}/{gymClass.capacity}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-white font-bold">${gymClass.price}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        gymClass.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {gymClass.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEdit(gymClass)}
                          className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(gymClass.id)}
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
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Member</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Class</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Booking Date</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{booking.memberName}</p>
                        <p className="text-gray-400 text-sm">{booking.memberEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-300">{booking.className}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleBookingStatusChange(booking.id, 'confirmed')}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors duration-200"
                            title="Confirm"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleBookingStatusChange(booking.id, 'cancelled')}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Class Modal */}
      {(showAddModal || editingClass) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                {editingClass ? 'Edit Class' : 'Add New Class'}
              </h3>
            </div>
            
            <form onSubmit={editingClass ? handleEditClass : handleAddClass} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Class Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trainer</label>
                  <select
                    value={formData.trainerId}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainerId: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Trainer</option>
                    {trainers.map(trainer => (
                      <option key={trainer.id} value={trainer.id}>{trainer.name} - {trainer.specialty}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Active Class</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingClass(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  {editingClass ? 'Update Class' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;