import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin,
  Users,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Playground {
  id: string;
  name: string;
  type: string;
  capacity: number;
  isActive: boolean;
}

interface TimeSlot {
  id: string;
  playgroundId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  memberName?: string;
  memberEmail?: string;
  bookingStatus: 'available' | 'booked' | 'cancelled';
}

interface Reservation {
  id: string;
  playgroundId: string;
  playgroundName: string;
  memberName: string;
  memberEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

const Reservations: React.FC = () => {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'playgrounds' | 'slots' | 'bookings'>('playgrounds');
  const [showAddPlaygroundModal, setShowAddPlaygroundModal] = useState(false);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [newPlayground, setNewPlayground] = useState({
    name: '',
    type: 'Court',
    capacity: 10
  });

  const [newSlot, setNewSlot] = useState({
    playgroundId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00'
  });

  useEffect(() => {
    // Mock data for demo
    setPlaygrounds([
      {
        id: '1',
        name: 'Basketball Court A',
        type: 'Basketball',
        capacity: 10,
        isActive: true
      },
      {
        id: '2',
        name: 'Tennis Court 1',
        type: 'Tennis',
        capacity: 4,
        isActive: true
      },
      {
        id: '3',
        name: 'Badminton Court 1',
        type: 'Badminton',
        capacity: 4,
        isActive: true
      },
      {
        id: '4',
        name: 'Squash Court',
        type: 'Squash',
        capacity: 2,
        isActive: false
      }
    ]);

    setTimeSlots([
      {
        id: '1',
        playgroundId: '1',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        isBooked: true,
        memberName: 'John Doe',
        memberEmail: 'john@example.com',
        bookingStatus: 'booked'
      },
      {
        id: '2',
        playgroundId: '1',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:00',
        isBooked: false,
        bookingStatus: 'available'
      },
      {
        id: '3',
        playgroundId: '2',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:00',
        isBooked: true,
        memberName: 'Sarah Wilson',
        memberEmail: 'sarah@example.com',
        bookingStatus: 'booked'
      }
    ]);

    setReservations([
      {
        id: '1',
        playgroundId: '1',
        playgroundName: 'Basketball Court A',
        memberName: 'John Doe',
        memberEmail: 'john@example.com',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        playgroundId: '2',
        playgroundName: 'Tennis Court 1',
        memberName: 'Sarah Wilson',
        memberEmail: 'sarah@example.com',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:00',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        playgroundId: '3',
        playgroundName: 'Badminton Court 1',
        memberName: 'Mike Johnson',
        memberEmail: 'mike@example.com',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '17:00',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ]);

    setLoading(false);
  }, []);

  const handleAddPlayground = (e: React.FormEvent) => {
    e.preventDefault();
    const playground: Playground = {
      id: Date.now().toString(),
      ...newPlayground,
      isActive: true
    };
    
    setPlaygrounds(prev => [playground, ...prev]);
    setShowAddPlaygroundModal(false);
    setNewPlayground({ name: '', type: 'Court', capacity: 10 });
  };

  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const slot: TimeSlot = {
      id: Date.now().toString(),
      ...newSlot,
      isBooked: false,
      bookingStatus: 'available'
    };
    
    setTimeSlots(prev => [slot, ...prev]);
    setShowAddSlotModal(false);
    setNewSlot({
      playgroundId: '',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00'
    });
  };

  const handleDeletePlayground = (id: string) => {
    if (confirm('Are you sure you want to delete this playground?')) {
      setPlaygrounds(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCancelReservation = (id: string) => {
    setReservations(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'cancelled' as const } : r
    ));
  };

  const handleConfirmReservation = (id: string) => {
    setReservations(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'confirmed' as const } : r
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

  const stats = {
    totalPlaygrounds: playgrounds.length,
    activePlaygrounds: playgrounds.filter(p => p.isActive).length,
    todayBookings: reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length,
    pendingBookings: reservations.filter(r => r.status === 'pending').length
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
          <h2 className="text-2xl font-bold text-white">Reservations</h2>
          <p className="text-gray-400">Manage playgrounds and bookings</p>
        </div>
        <div className="flex space-x-3">
          {activeTab === 'playgrounds' && (
            <button
              onClick={() => setShowAddPlaygroundModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Playground</span>
            </button>
          )}
          {activeTab === 'slots' && (
            <button
              onClick={() => setShowAddSlotModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Time Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Playgrounds</p>
              <p className="text-2xl font-bold text-white">{stats.totalPlaygrounds}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">{stats.activePlaygrounds}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Today's Bookings</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.todayBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingBookings}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('playgrounds')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'playgrounds'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <MapPin className="h-5 w-5" />
          <span>Playgrounds</span>
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'slots'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-black shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Clock className="h-5 w-5" />
          <span>Time Slots</span>
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

      {/* Content */}
      {activeTab === 'playgrounds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playgrounds.map((playground) => (
            <div key={playground.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">{playground.name}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  playground.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {playground.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{playground.type}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Users className="h-4 w-4" />
                  <span>Capacity: {playground.capacity}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeletePlayground(playground.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <label className="text-gray-300 font-medium">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Playground</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Time</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Member</th>
                    <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {timeSlots.filter(slot => slot.date === selectedDate).map((slot) => {
                    const playground = playgrounds.find(p => p.id === slot.playgroundId);
                    return (
                      <tr key={slot.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-purple-400" />
                            <span className="text-white">{playground?.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2 text-gray-300">
                            <Clock className="h-4 w-4" />
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            slot.bookingStatus === 'booked' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {slot.bookingStatus === 'booked' ? 'Booked' : 'Available'}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {slot.memberName ? (
                            <div>
                              <p className="text-white font-medium">{slot.memberName}</p>
                              <p className="text-gray-400 text-sm">{slot.memberEmail}</p>
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Member</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Playground</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Date & Time</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{reservation.memberName}</p>
                        <p className="text-gray-400 text-sm">{reservation.memberEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-purple-400" />
                        <span className="text-gray-300">{reservation.playgroundName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300">
                        <p>{new Date(reservation.date).toLocaleDateString()}</p>
                        <p className="text-sm">{reservation.startTime} - {reservation.endTime}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        <span className="capitalize">{reservation.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {reservation.status === 'pending' && (
                          <button
                            onClick={() => handleConfirmReservation(reservation.id)}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors duration-200"
                            title="Confirm"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {reservation.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
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

      {/* Add Playground Modal */}
      {showAddPlaygroundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Add New Playground</h3>
            </div>
            
            <form onSubmit={handleAddPlayground} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Playground Name</label>
                <input
                  type="text"
                  value={newPlayground.name}
                  onChange={(e) => setNewPlayground(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  value={newPlayground.type}
                  onChange={(e) => setNewPlayground(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Squash">Squash</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Football">Football</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={newPlayground.capacity}
                  onChange={(e) => setNewPlayground(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddPlaygroundModal(false)}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  Add Playground
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Time Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Add Time Slot</h3>
            </div>
            
            <form onSubmit={handleAddTimeSlot} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Playground</label>
                <select
                  value={newSlot.playgroundId}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, playgroundId: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Playground</option>
                  {playgrounds.filter(p => p.isActive).map(playground => (
                    <option key={playground.id} value={playground.id}>{playground.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;