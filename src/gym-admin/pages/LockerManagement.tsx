import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Key,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Locker {
  id: string;
  number: string;
  size: 'small' | 'medium' | 'large';
  location: string;
  status: 'available' | 'occupied' | 'maintenance';
  rentPrice: number;
  memberName?: string;
  memberEmail?: string;
  rentStartDate?: string;
  rentEndDate?: string;
  deposit: number;
}

const LockerManagement: React.FC = () => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [editingLocker, setEditingLocker] = useState<Locker | null>(null);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);

  const [formData, setFormData] = useState({
    number: '',
    size: 'medium' as const,
    location: 'Main Floor',
    rentPrice: '15',
    deposit: '50'
  });

  const [rentData, setRentData] = useState({
    memberName: '',
    memberEmail: '',
    rentStartDate: new Date().toISOString().split('T')[0],
    rentEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const locations = ['Main Floor', 'Upper Level', 'Pool Area', 'VIP Section'];
  const sizes = ['small', 'medium', 'large'];

  useEffect(() => {
    // Mock data for demo
    setLockers([
      {
        id: '1',
        number: 'L001',
        size: 'medium',
        location: 'Main Floor',
        status: 'occupied',
        rentPrice: 15,
        memberName: 'John Doe',
        memberEmail: 'john@example.com',
        rentStartDate: '2024-01-01',
        rentEndDate: '2024-01-31',
        deposit: 50
      },
      {
        id: '2',
        number: 'L002',
        size: 'large',
        location: 'Main Floor',
        status: 'available',
        rentPrice: 25,
        deposit: 75
      },
      {
        id: '3',
        number: 'L003',
        size: 'small',
        location: 'Upper Level',
        status: 'occupied',
        rentPrice: 10,
        memberName: 'Sarah Wilson',
        memberEmail: 'sarah@example.com',
        rentStartDate: '2024-01-15',
        rentEndDate: '2024-02-15',
        deposit: 30
      },
      {
        id: '4',
        number: 'L004',
        size: 'medium',
        location: 'Pool Area',
        status: 'maintenance',
        rentPrice: 15,
        deposit: 50
      },
      {
        id: '5',
        number: 'L005',
        size: 'large',
        location: 'VIP Section',
        status: 'available',
        rentPrice: 35,
        deposit: 100
      },
      {
        id: '6',
        number: 'L006',
        size: 'medium',
        location: 'Main Floor',
        status: 'occupied',
        rentPrice: 15,
        memberName: 'Mike Johnson',
        memberEmail: 'mike@example.com',
        rentStartDate: '2024-01-10',
        rentEndDate: '2024-02-10',
        deposit: 50
      }
    ]);
    setLoading(false);
  }, []);

  const handleAddLocker = (e: React.FormEvent) => {
    e.preventDefault();
    const locker: Locker = {
      id: Date.now().toString(),
      number: formData.number,
      size: formData.size,
      location: formData.location,
      status: 'available',
      rentPrice: parseFloat(formData.rentPrice),
      deposit: parseFloat(formData.deposit)
    };
    
    setLockers(prev => [locker, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditLocker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocker) return;

    const updatedLocker: Locker = {
      ...editingLocker,
      number: formData.number,
      size: formData.size,
      location: formData.location,
      rentPrice: parseFloat(formData.rentPrice),
      deposit: parseFloat(formData.deposit)
    };
    
    setLockers(prev => prev.map(locker => 
      locker.id === editingLocker.id ? updatedLocker : locker
    ));
    setEditingLocker(null);
    resetForm();
  };

  const handleRentLocker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocker) return;

    const updatedLocker: Locker = {
      ...selectedLocker,
      status: 'occupied',
      memberName: rentData.memberName,
      memberEmail: rentData.memberEmail,
      rentStartDate: rentData.rentStartDate,
      rentEndDate: rentData.rentEndDate
    };
    
    setLockers(prev => prev.map(locker => 
      locker.id === selectedLocker.id ? updatedLocker : locker
    ));
    setShowRentModal(false);
    setSelectedLocker(null);
    resetRentData();
  };

  const handleDeleteLocker = (id: string) => {
    if (confirm('Are you sure you want to delete this locker?')) {
      setLockers(prev => prev.filter(locker => locker.id !== id));
    }
  };

  const handleReturnLocker = (id: string) => {
    if (confirm('Are you sure you want to mark this locker as returned?')) {
      setLockers(prev => prev.map(locker => 
        locker.id === id ? {
          ...locker,
          status: 'available' as const,
          memberName: undefined,
          memberEmail: undefined,
          rentStartDate: undefined,
          rentEndDate: undefined
        } : locker
      ));
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      size: 'medium',
      location: 'Main Floor',
      rentPrice: '15',
      deposit: '50'
    });
  };

  const resetRentData = () => {
    setRentData({
      memberName: '',
      memberEmail: '',
      rentStartDate: new Date().toISOString().split('T')[0],
      rentEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  };

  const startEdit = (locker: Locker) => {
    setEditingLocker(locker);
    setFormData({
      number: locker.number,
      size: locker.size,
      location: locker.location,
      rentPrice: locker.rentPrice.toString(),
      deposit: locker.deposit.toString()
    });
  };

  const startRent = (locker: Locker) => {
    setSelectedLocker(locker);
    setShowRentModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'occupied':
        return <User className="h-4 w-4 text-red-400" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-400 bg-green-500/20';
      case 'occupied':
        return 'text-red-400 bg-red-500/20';
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small':
        return 'text-cyan-400 bg-cyan-500/20';
      case 'medium':
        return 'text-purple-400 bg-purple-500/20';
      case 'large':
        return 'text-pink-400 bg-pink-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredLockers = lockers.filter(locker => {
    const matchesSearch = locker.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         locker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (locker.memberName && locker.memberName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || locker.status === statusFilter;
    const matchesSize = sizeFilter === 'all' || locker.size === sizeFilter;
    return matchesSearch && matchesStatus && matchesSize;
  });

  const stats = {
    totalLockers: lockers.length,
    availableLockers: lockers.filter(l => l.status === 'available').length,
    occupiedLockers: lockers.filter(l => l.status === 'occupied').length,
    monthlyRevenue: lockers.filter(l => l.status === 'occupied').reduce((sum, l) => sum + l.rentPrice, 0)
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
          <h2 className="text-2xl font-bold text-white">Locker Management</h2>
          <p className="text-gray-400">Manage locker rentals and assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Locker</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Lockers</p>
              <p className="text-2xl font-bold text-white">{stats.totalLockers}</p>
            </div>
            <Key className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Available</p>
              <p className="text-2xl font-bold text-green-400">{stats.availableLockers}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Occupied</p>
              <p className="text-2xl font-bold text-red-400">{stats.occupiedLockers}</p>
            </div>
            <User className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-yellow-400">${stats.monthlyRevenue}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search lockers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>
        
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Sizes</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Lockers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLockers.map((locker) => (
          <div key={locker.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-purple-400" />
                <span className="text-lg font-bold text-white">{locker.number}</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(locker.status)}`}>
                {locker.status}
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Size:</span>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSizeColor(locker.size)}`}>
                  {locker.size}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Location:</span>
                <span className="text-gray-300">{locker.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Rent:</span>
                <span className="text-white font-bold">${locker.rentPrice}/month</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Deposit:</span>
                <span className="text-gray-300">${locker.deposit}</span>
              </div>
            </div>
            
            {locker.status === 'occupied' && locker.memberName && (
              <div className="bg-gray-800 p-3 rounded-lg mb-4">
                <p className="text-white font-medium text-sm">{locker.memberName}</p>
                <p className="text-gray-400 text-xs">{locker.memberEmail}</p>
                {locker.rentEndDate && (
                  <p className="text-gray-400 text-xs mt-1">
                    Expires: {new Date(locker.rentEndDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex space-x-2">
              {locker.status === 'available' && (
                <button
                  onClick={() => startRent(locker)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                >
                  Rent
                </button>
              )}
              
              {locker.status === 'occupied' && (
                <button
                  onClick={() => handleReturnLocker(locker.id)}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold py-2 px-3 rounded-lg transition-all duration-200 text-sm"
                >
                  Return
                </button>
              )}
              
              <button
                onClick={() => startEdit(locker)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg transition-colors duration-200"
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => handleDeleteLocker(locker.id)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-3 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Locker Modal */}
      {(showAddModal || editingLocker) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                {editingLocker ? 'Edit Locker' : 'Add New Locker'}
              </h3>
            </div>
            
            <form onSubmit={editingLocker ? handleEditLocker : handleAddLocker} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Locker Number</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                >
                  {sizes.map(size => (
                    <option key={size} value={size}>{size.charAt(0).toUpperCase() + size.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Rent ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.rentPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, rentPrice: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Deposit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.deposit}
                  onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLocker(null);
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
                  {editingLocker ? 'Update Locker' : 'Add Locker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rent Locker Modal */}
      {showRentModal && selectedLocker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Rent Locker {selectedLocker.number}</h3>
            </div>
            
            <form onSubmit={handleRentLocker} className="p-6 space-y-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <span className="text-white ml-2">{selectedLocker.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white ml-2">{selectedLocker.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Monthly Rent:</span>
                    <span className="text-white ml-2">${selectedLocker.rentPrice}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Deposit:</span>
                    <span className="text-white ml-2">${selectedLocker.deposit}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Member Name</label>
                <input
                  type="text"
                  value={rentData.memberName}
                  onChange={(e) => setRentData(prev => ({ ...prev, memberName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Member Email</label>
                <input
                  type="email"
                  value={rentData.memberEmail}
                  onChange={(e) => setRentData(prev => ({ ...prev, memberEmail: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={rentData.rentStartDate}
                    onChange={(e) => setRentData(prev => ({ ...prev, rentStartDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={rentData.rentEndDate}
                    onChange={(e) => setRentData(prev => ({ ...prev, rentEndDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <strong>Total Due:</strong> ${selectedLocker.rentPrice + selectedLocker.deposit} 
                  (${selectedLocker.rentPrice} rent + ${selectedLocker.deposit} deposit)
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRentModal(false);
                    setSelectedLocker(null);
                    resetRentData();
                  }}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-green-500/30"
                >
                  Rent Locker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockerManagement;