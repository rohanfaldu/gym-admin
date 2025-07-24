import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Calendar,
  Star,
  MoreVertical
} from 'lucide-react';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  _count?: {
    memberships: number;
  };
}

const SubscriptionManagement: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPlans();
  }, [searchTerm]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const gymId = 'current-gym-id'; // Replace with actual gym ID
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/subscription-plans/gym/${gymId}?${params.toString()}`);
      setPlans(response.data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/subscription-plans/${planId}`);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Failed to delete plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const togglePlanStatus = async (planId: string, isActive: boolean) => {
    try {
      await api.put(`/subscription-plans/${planId}`, { isActive: !isActive });
      toast.success(`Plan ${!isActive ? 'activated' : 'deactivated'} successfully`);
      fetchPlans();
    } catch (error) {
      console.error('Failed to update plan status:', error);
      toast.error('Failed to update plan status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage membership plans for your gym
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscription plans..."
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Plans Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  {!plan.isActive && (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-blue-600">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>

                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{plan.duration} days</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{plan._count?.memberships || 0} members</span>
                  </div>
                </div>

                {plan.description && (
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                )}

                <div className="space-y-2 mb-6">
                  <h4 className="font-medium text-gray-900">Features:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Star className="w-3 h-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                  >
                    {plan.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deletePlan(plan.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {plans.length === 0 && !loading && (
            <div className="col-span-full">
              <Card className="p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No subscription plans</h3>
                <p className="text-gray-600 mb-4">Create your first subscription plan to start accepting members</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;