import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CreditCard,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Star
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // in months
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  memberCount: number;
  description: string;
}

const SubscriptionPlans: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '1',
    features: [''],
    isPopular: false,
    isActive: true,
    description: ''
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const response = await fetch(`http://localhost:3001/api/gym/${user.gymId}/subscriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Transform API data to match interface
        const transformedPlans = data.map((sub: any) => ({
          id: sub.id,
          name: sub.planName,
          price: sub.price,
          duration: sub.duration,
          features: JSON.parse(sub.features || '[]'),
          isPopular: false,
          isActive: sub.isActive,
          memberCount: Math.floor(Math.random() * 100),
          description: `${sub.planName} subscription plan`
        }));
        setPlans(transformedPlans);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`http://localhost:3001/api/gym/${user.gymId}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: formData.name,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          features: formData.features.filter(f => f.trim() !== ''),
          description: formData.description
        })
      });

      if (response.ok) {
        await fetchSubscriptions();
        setShowAddModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
    }
  };

  const handleEditPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const token = localStorage.getItem('gymAdminToken');
      const userData = localStorage.getItem('gymAdminUser');
      
      if (!token || !userData) return;

      const user = JSON.parse(userData);
      const response = await fetch(`http://localhost:3001/api/gym/${user.gymId}/subscriptions/${editingPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: formData.name,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          features: formData.features.filter(f => f.trim() !== ''),
          isActive: formData.isActive
        })
      });

      if (response.ok) {
        await fetchSubscriptions();
        setEditingPlan(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        const token = localStorage.getItem('gymAdminToken');
        const userData = localStorage.getItem('gymAdminUser');
        
        if (!token || !userData) return;

        const user = JSON.parse(userData);
        const response = await fetch(`http://localhost:3001/api/gym/${user.gymId}/subscriptions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchSubscriptions();
        }
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      duration: '1',
      features: [''],
      isPopular: false,
      isActive: true,
      description: ''
    });
  };

  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      features: [...plan.features, ''],
      isPopular: plan.isPopular,
      isActive: plan.isActive,
      description: plan.description
    });
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter(p => p.isActive).length,
    totalMembers: plans.reduce((sum, p) => sum + p.memberCount, 0),
    monthlyRevenue: plans.reduce((sum, p) => sum + (p.price * p.memberCount), 0)
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
          <h2 className="text-2xl font-bold text-white">Subscription Plans</h2>
          <p className="text-gray-400">Create and manage membership plans</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Plans</p>
              <p className="text-2xl font-bold text-white">{stats.totalPlans}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Plans</p>
              <p className="text-2xl font-bold text-green-400">{stats.activePlans}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-cyan-400">{stats.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-yellow-400">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-gray-900 border rounded-xl p-6 relative ${
            plan.isPopular ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-gray-800'
          }`}>
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-3xl font-bold text-purple-400">${plan.price}</span>
                <span className="text-gray-400">/{plan.duration === 1 ? 'month' : `${plan.duration} months`}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-cyan-400" />
                <span className="text-gray-300 text-sm">{plan.memberCount} members</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                plan.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {plan.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => startEdit(plan)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Plan Modal */}
      {(showAddModal || editingPlan) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white">
                {editingPlan ? 'Edit Plan' : 'Add New Plan'}
              </h3>
            </div>
            
            <form onSubmit={editingPlan ? handleEditPlan : handleAddPlan} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (months)</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Popular Plan</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-300">Active</span>
                  </label>
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
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-300">Features</label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="Enter feature"
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPlan(null);
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
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;