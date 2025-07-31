import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Receipt,
  Calendar,
  DollarSign,
  TrendingDown,
  Filter,
  Download
} from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  vendor?: string;
  receipt?: string;
  isRecurring: boolean;
  notes?: string;
}

const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Equipment',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    vendor: '',
    isRecurring: false,
    notes: ''
  });

  const categories = [
    'Equipment',
    'Utilities',
    'Rent',
    'Maintenance',
    'Staff Salaries',
    'Marketing',
    'Insurance',
    'Supplies',
    'Professional Services',
    'Other'
  ];

  const paymentMethods = ['Cash', 'Credit Card', 'Bank Transfer', 'Check'];

  useEffect(() => {
    // Mock data for demo
    setExpenses([
      {
        id: '1',
        description: 'New Treadmill Purchase',
        amount: 2500.00,
        category: 'Equipment',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
        vendor: 'FitnessTech Inc.',
        isRecurring: false,
        notes: 'Replacement for broken treadmill #3'
      },
      {
        id: '2',
        description: 'Monthly Electricity Bill',
        amount: 450.00,
        category: 'Utilities',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        vendor: 'City Electric Company',
        isRecurring: true,
        notes: 'Monthly utility payment'
      },
      {
        id: '3',
        description: 'Cleaning Supplies',
        amount: 125.50,
        category: 'Supplies',
        date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'Cash',
        vendor: 'CleanPro Supplies',
        isRecurring: false
      },
      {
        id: '4',
        description: 'HVAC Maintenance',
        amount: 350.00,
        category: 'Maintenance',
        date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'Check',
        vendor: 'Cool Air Services',
        isRecurring: false,
        notes: 'Quarterly HVAC system maintenance'
      },
      {
        id: '5',
        description: 'Monthly Rent',
        amount: 5000.00,
        category: 'Rent',
        date: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        vendor: 'Property Management LLC',
        isRecurring: true,
        notes: 'Monthly facility rent'
      },
      {
        id: '6',
        description: 'Social Media Advertising',
        amount: 200.00,
        category: 'Marketing',
        date: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
        vendor: 'Facebook Ads',
        isRecurring: false,
        notes: 'Monthly social media campaign'
      }
    ]);
    setLoading(false);
  }, []);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: Date.now().toString(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      vendor: formData.vendor || undefined,
      isRecurring: formData.isRecurring,
      notes: formData.notes || undefined
    };
    
    setExpenses(prev => [expense, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    const updatedExpense: Expense = {
      ...editingExpense,
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      vendor: formData.vendor || undefined,
      isRecurring: formData.isRecurring,
      notes: formData.notes || undefined
    };
    
    setExpenses(prev => prev.map(expense => 
      expense.id === editingExpense.id ? updatedExpense : expense
    ));
    setEditingExpense(null);
    resetForm();
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setExpenses(prev => prev.filter(expense => expense.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'Equipment',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      vendor: '',
      isRecurring: false,
      notes: ''
    });
  };

  const startEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      paymentMethod: expense.paymentMethod,
      vendor: expense.vendor || '',
      isRecurring: expense.isRecurring,
      notes: expense.notes || ''
    });
  };

  const exportExpenses = () => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Payment Method', 'Vendor', 'Recurring', 'Notes'].join(','),
      ...filteredExpenses.map(expense => [
        expense.date,
        expense.description,
        expense.category,
        expense.amount,
        expense.paymentMethod,
        expense.vendor || '',
        expense.isRecurring ? 'Yes' : 'No',
        expense.notes || ''
      ].join(','))
    ].join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (expense.vendor && expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const expenseDate = new Date(expense.date);
      const now = new Date();
      switch (dateRange) {
        case 'today':
          matchesDate = expenseDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = expenseDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = expenseDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const stats = {
    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
    monthlyExpenses: expenses.filter(e => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return expenseDate >= monthAgo;
    }).reduce((sum, e) => sum + e.amount, 0),
    recurringExpenses: expenses.filter(e => e.isRecurring).reduce((sum, e) => sum + e.amount, 0),
    expenseCount: expenses.length
  };

  const categoryTotals = categories.map(category => ({
    category,
    total: expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0)
  })).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

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
          <h2 className="text-2xl font-bold text-white">Expenses</h2>
          <p className="text-gray-400">Track and manage gym expenses</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportExpenses}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <p className="text-2xl font-bold text-red-400">${stats.totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-yellow-400">${stats.monthlyExpenses.toLocaleString()}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Recurring</p>
              <p className="text-2xl font-bold text-purple-400">${stats.recurringExpenses.toLocaleString()}</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Records</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.expenseCount}</p>
            </div>
            <DollarSign className="h-8 w-8 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Expenses by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryTotals.map((item) => (
            <div key={item.category} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">{item.category}</span>
                <span className="text-white font-bold">${item.total.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                  style={{ width: `${(item.total / stats.totalExpenses) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Expenses Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Date</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Description</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Category</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Payment</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Vendor</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-medium">{expense.description}</p>
                      {expense.isRecurring && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                          Recurring
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="bg-gray-800 border border-purple-500/30 px-3 py-1 rounded-full text-purple-400 text-sm inline-block">
                      {expense.category}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-red-400" />
                      <span className="text-red-400 font-bold">${expense.amount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300">{expense.paymentMethod}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-300">{expense.vendor || '-'}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(expense)}
                        className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
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

      {/* Add/Edit Expense Modal */}
      {(showAddModal || editingExpense) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </h3>
            </div>
            
            <form onSubmit={editingExpense ? handleEditExpense : handleAddExpense} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vendor (Optional)</label>
                  <input
                    type="text"
                    value={formData.vendor}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  />
                </div>
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
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
                    className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Recurring Expense</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingExpense(null);
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
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;