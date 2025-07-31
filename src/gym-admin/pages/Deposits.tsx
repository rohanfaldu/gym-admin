import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  DollarSign, 
  User,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';

interface Deposit {
  id: string;
  memberName: string;
  memberEmail: string;
  memberId: string;
  amount: number;
  type: 'security' | 'membership' | 'locker' | 'equipment';
  status: 'active' | 'refunded' | 'forfeited';
  depositDate: string;
  refundDate?: string;
  reason: string;
  notes?: string;
}

const Deposits: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);

  const [formData, setFormData] = useState({
    memberName: '',
    memberEmail: '',
    memberId: '',
    amount: '',
    type: 'security' as const,
    reason: '',
    notes: ''
  });

  const depositTypes = [
    { value: 'security', label: 'Security Deposit' },
    { value: 'membership', label: 'Membership Deposit' },
    { value: 'locker', label: 'Locker Deposit' },
    { value: 'equipment', label: 'Equipment Deposit' }
  ];

  useEffect(() => {
    // Mock data for demo
    setDeposits([
      {
        id: '1',
        memberName: 'John Doe',
        memberEmail: 'john@example.com',
        memberId: 'M001',
        amount: 100.00,
        type: 'security',
        status: 'active',
        depositDate: '2024-01-15',
        reason: 'Membership security deposit',
        notes: 'Standard security deposit for premium membership'
      },
      {
        id: '2',
        memberName: 'Sarah Wilson',
        memberEmail: 'sarah@example.com',
        memberId: 'M002',
        amount: 50.00,
        type: 'locker',
        status: 'active',
        depositDate: '2024-01-20',
        reason: 'Locker rental deposit',
        notes: 'Deposit for locker L001'
      },
      {
        id: '3',
        memberName: 'Mike Johnson',
        memberEmail: 'mike@example.com',
        memberId: 'M003',
        amount: 75.00,
        type: 'equipment',
        status: 'refunded',
        depositDate: '2024-01-10',
        refundDate: '2024-01-25',
        reason: 'Equipment damage deposit',
        notes: 'Deposit for personal training equipment usage'
      },
      {
        id: '4',
        memberName: 'Emma Davis',
        memberEmail: 'emma@example.com',
        memberId: 'M004',
        amount: 200.00,
        type: 'membership',
        status: 'active',
        depositDate: '2024-01-05',
        reason: 'VIP membership deposit',
        notes: 'Higher deposit for VIP membership tier'
      },
      {
        id: '5',
        memberName: 'Alex Brown',
        memberEmail: 'alex@example.com',
        memberId: 'M005',
        amount: 30.00,
        type: 'locker',
        status: 'forfeited',
        depositDate: '2023-12-15',
        reason: 'Locker deposit',
        notes: 'Forfeited due to locker damage'
      }
    ]);
    setLoading(false);
  }, []);

  const handleAddDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const deposit: Deposit = {
      id: Date.now().toString(),
      memberName: formData.memberName,
      memberEmail: formData.memberEmail,
      memberId: formData.memberId,
      amount: parseFloat(formData.amount),
      type: formData.type,
      status: 'active',
      depositDate: new Date().toISOString().split('T')[0],
      reason: formData.reason,
      notes: formData.notes || undefined
    };
    
    setDeposits(prev => [deposit, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleRefundDeposit = (deposit: Deposit, refundAmount?: number) => {
    const updatedDeposit: Deposit = {
      ...deposit,
      status: 'refunded',
      refundDate: new Date().toISOString().split('T')[0]
    };
    
    setDeposits(prev => prev.map(d => d.id === deposit.id ? updatedDeposit : d));
    setShowRefundModal(false);
    setSelectedDeposit(null);
  };

  const handleForfeitDeposit = (id: string) => {
    if (confirm('Are you sure you want to forfeit this deposit? This action cannot be undone.')) {
      setDeposits(prev => prev.map(deposit => 
        deposit.id === id ? { ...deposit, status: 'forfeited' as const } : deposit
      ));
    }
  };

  const resetForm = () => {
    setFormData({
      memberName: '',
      memberEmail: '',
      memberId: '',
      amount: '',
      type: 'security',
      reason: '',
      notes: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'refunded':
        return <ArrowDownCircle className="h-4 w-4 text-blue-400" />;
      case 'forfeited':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20';
      case 'refunded':
        return 'text-blue-400 bg-blue-500/20';
      case 'forfeited':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'text-purple-400 bg-purple-500/20';
      case 'membership':
        return 'text-cyan-400 bg-cyan-500/20';
      case 'locker':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'equipment':
        return 'text-pink-400 bg-pink-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.memberId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || deposit.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || deposit.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    totalDeposits: deposits.reduce((sum, d) => sum + d.amount, 0),
    activeDeposits: deposits.filter(d => d.status === 'active').reduce((sum, d) => sum + d.amount, 0),
    refundedDeposits: deposits.filter(d => d.status === 'refunded').reduce((sum, d) => sum + d.amount, 0),
    forfeitedDeposits: deposits.filter(d => d.status === 'forfeited').reduce((sum, d) => sum + d.amount, 0)
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
          <h2 className="text-2xl font-bold text-white">Deposits Management</h2>
          <p className="text-gray-400">Track member deposits and refunds</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Deposit</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Deposits</p>
              <p className="text-2xl font-bold text-white">${stats.totalDeposits.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">${stats.activeDeposits.toLocaleString()}</p>
            </div>
            <ArrowUpCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Refunded</p>
              <p className="text-2xl font-bold text-blue-400">${stats.refundedDeposits.toLocaleString()}</p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Forfeited</p>
              <p className="text-2xl font-bold text-red-400">${stats.forfeitedDeposits.toLocaleString()}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deposits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Types</option>
          {depositTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="refunded">Refunded</option>
          <option value="forfeited">Forfeited</option>
        </select>
      </div>

      {/* Deposits Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Member</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Type</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Date</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">{deposit.memberName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{deposit.memberName}</p>
                        <p className="text-gray-400 text-sm">{deposit.memberEmail}</p>
                        <p className="text-gray-500 text-xs">ID: {deposit.memberId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(deposit.type)}`}>
                      {depositTypes.find(t => t.value === deposit.type)?.label}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-white font-bold">${deposit.amount.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deposit.status)}`}>
                      {getStatusIcon(deposit.status)}
                      <span className="capitalize">{deposit.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-300">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(deposit.depositDate).toLocaleDateString()}</span>
                      </div>
                      {deposit.refundDate && (
                        <p className="text-blue-400 text-sm mt-1">
                          Refunded: {new Date(deposit.refundDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {deposit.status === 'active' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedDeposit(deposit);
                              setShowRefundModal(true);
                            }}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                            title="Refund Deposit"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleForfeitDeposit(deposit.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                            title="Forfeit Deposit"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Deposit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Add New Deposit</h3>
            </div>
            
            <form onSubmit={handleAddDeposit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Member Name</label>
                  <input
                    type="text"
                    value={formData.memberName}
                    onChange={(e) => setFormData(prev => ({ ...prev, memberName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Member Email</label>
                  <input
                    type="email"
                    value={formData.memberEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, memberEmail: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Member ID</label>
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) => setFormData(prev => ({ ...prev, memberId: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deposit Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {depositTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
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
                  Add Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Refund Deposit</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Deposit Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member:</span>
                    <span className="text-white">{selectedDeposit.memberName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{depositTypes.find(t => t.value === selectedDeposit.type)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-bold">${selectedDeposit.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{new Date(selectedDeposit.depositDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <strong>Confirm Refund:</strong> This will refund the full deposit amount of ${selectedDeposit.amount.toFixed(2)} to the member.
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowRefundModal(false);
                    setSelectedDeposit(null);
                  }}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRefundDeposit(selectedDeposit)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-black font-bold rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  Process Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposits;