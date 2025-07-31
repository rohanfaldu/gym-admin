import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  status: 'active' | 'inactive' | 'pending' | 'expired';
  joinDate: string;
  expiryDate: string;
  lastPayment: string;
  totalPaid: number;
  attendance: number;
}

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState('');

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as const
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setError('');
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) {
        setError('No authentication found');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gym/${user.gymId}/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform API data to match interface
        const transformedMembers = data.map((member: any) => ({
          ...member,
          membershipType: 'Basic', // Default since not in API
          joinDate: member.joinedAt?.split('T')[0] || member.createdAt?.split('T')[0],
          expiryDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          lastPayment: member.createdAt?.split('T')[0],
          totalPaid: Math.floor(Math.random() * 1000),
          attendance: Math.floor(Math.random() * 100)
        }));
        setMembers(transformedMembers);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to fetch members. Please check your network connection or if the server is running.');
    } finally {
      setLoading(false);
    }
  };
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gym/${user.gymId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newMember)
      });

      if (response.ok) {
        await fetchMembers(); // Refresh the list
        setShowAddModal(false);
        setNewMember({
          name: '',
          email: '',
          phone: '',
          status: 'active'
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Network error occurred');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        const token = localStorage.getItem('gymAdminToken');
        const userData = localStorage.getItem('gymAdminUser');
        
        if (!token || !userData) return;

        const user = JSON.parse(userData);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gym/${user.gymId}/members/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchMembers(); // Refresh the list
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to delete member');
        }
      } catch (error) {
        console.error('Error deleting member:', error);
        setError('Network error occurred');
      }
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gym/${user.gymId}/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'active' })
      });

      if (response.ok) {
        await fetchMembers(); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to approve member');
      }
    } catch (error) {
      console.error('Error approving member:', error);
      setError('Network error occurred');
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/gym/${user.gymId}/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'inactive' })
      });

      if (response.ok) {
        await fetchMembers(); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to reject member');
      }
    } catch (error) {
      console.error('Error rejecting member:', error);
      setError('Network error occurred');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20';
      case 'inactive':
        return 'text-red-400 bg-red-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'expired':
        return 'text-gray-400 bg-gray-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    expired: members.filter(m => m.status === 'expired').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchMembers}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Member Management</h2>
          <p className="text-gray-400">Manage gym members and their subscriptions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Expired</p>
              <p className="text-2xl font-bold text-red-400">{stats.expired}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
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
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Members Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Member</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Join Date</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Phone</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-gray-400 text-sm">{member.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(member.status)}`}>
                      {getStatusIcon(member.status)}
                      <span className="capitalize">{member.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300">{member.phone}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {member.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(member.id)}
                            className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors duration-200"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectRequest(member.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedMember(member);
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
                        onClick={() => handleDeleteMember(member.id)}
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

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Add New Member</h3>
            </div>
            
            <form onSubmit={handleAddMember} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{selectedMember.name}</h3>
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
                    <Mail className="h-5 w-5 text-purple-400" />
                    <span className="text-gray-300">{selectedMember.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-cyan-400" />
                    <span className="text-gray-300">{selectedMember.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-pink-400" />
                    <span className="text-gray-300">Joined: {selectedMember.joinDate ? new Date(selectedMember.joinDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Status</h4>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(selectedMember.status)}`}>
                        {selectedMember.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;