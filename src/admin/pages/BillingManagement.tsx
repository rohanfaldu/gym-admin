import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Eye
} from 'lucide-react';

interface Billing {
  id: string;
  gymId: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
  gym: {
    name: string;
    email: string;
  };
}

const BillingManagement: React.FC = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [gyms, setGyms] = useState<any[]>([]);

  const [newBilling, setNewBilling] = useState({
    gymId: '',
    amount: '',
    description: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchBillings();
    fetchGyms();
  }, []);

  const fetchBillings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/billing', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBillings(data);
      }
    } catch (error) {
      console.error('Error fetching billings:', error);
      // Mock data for demo
      setBillings([
        {
          id: '1',
          gymId: '1',
          amount: 2500,
          description: 'Monthly subscription fee',
          status: 'paid',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          paidDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          gym: { name: 'FitZone Premium', email: 'admin@fitzone.com' }
        },
        {
          id: '2',
          gymId: '2',
          amount: 1800,
          description: 'Platform usage fee',
          status: 'pending',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          gym: { name: 'PowerHouse Gym', email: 'admin@powerhouse.com' }
        },
        {
          id: '3',
          gymId: '3',
          amount: 3200,
          description: 'Premium features subscription',
          status: 'overdue',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          gym: { name: 'Zen Fitness Studio', email: 'hello@zenfitness.com' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGyms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/gyms', {
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
    }
  };

  const handleCreateBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3001/api/billing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newBilling,
          amount: parseFloat(newBilling.amount)
        })
      });

      if (response.ok) {
        const billing = await response.json();
        setBillings(prev => [billing, ...prev]);
        setShowCreateModal(false);
        setNewBilling({ gymId: '', amount: '', description: '', dueDate: '' });
      }
    } catch (error) {
      console.error('Error creating billing:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-400 bg-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'overdue':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredBillings = billings.filter(billing => {
    const matchesSearch = billing.gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         billing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || billing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = billings.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const pendingAmount = billings.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
  const overdueAmount = billings.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0);

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
          <h2 className="text-2xl font-bold text-white">Billing Management</h2>
          <p className="text-gray-400">Manage gym subscriptions and payments</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">${pendingAmount.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Overdue</p>
              <p className="text-2xl font-bold text-red-400">${overdueAmount.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Invoices</p>
              <p className="text-2xl font-bold text-cyan-400">{billings.length}</p>
            </div>
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Billing Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Gym</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Description</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Due Date</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredBillings.map((billing) => (
                <tr key={billing.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-medium">{billing.gym.name}</p>
                      <p className="text-gray-400 text-sm">{billing.gym.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-300">{billing.description}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white font-bold">${billing.amount.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(billing.dueDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(billing.status)}`}>
                      {getStatusIcon(billing.status)}
                      <span className="capitalize">{billing.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-200">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Billing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">Create New Invoice</h3>
            </div>
            
            <form onSubmit={handleCreateBilling} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Gym</label>
                <select
                  value={newBilling.gymId}
                  onChange={(e) => setNewBilling(prev => ({ ...prev, gymId: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Choose a gym</option>
                  {gyms.map((gym) => (
                    <option key={gym.id} value={gym.id}>{gym.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBilling.amount}
                  onChange={(e) => setNewBilling(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <input
                  type="text"
                  value={newBilling.description}
                  onChange={(e) => setNewBilling(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={newBilling.dueDate}
                  onChange={(e) => setNewBilling(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                  required
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
                  Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagement;