import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface Membership {
  id: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  plan: {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    features: string[];
  };
  gym: {
    name: string;
    gymCode: string;
  };
}

interface AvailablePlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
}

const Subscriptions: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [availablePlans, setAvailablePlans] = useState<AvailablePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membershipsResponse, plansResponse] = await Promise.all([
        api.get('/memberships'),
        api.get('/subscription-plans')
      ]);
      
      setMemberships(membershipsResponse.data.memberships);
      setAvailablePlans(plansResponse.data.plans || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPlan = async (planId: string) => {
    try {
      await api.post('/memberships', { planId });
      toast.success('Subscription created successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create subscription');
    }
  };

  const cancelMembership = async (membershipId: string) => {
    if (!confirm('Are you sure you want to cancel this membership?')) {
      return;
    }

    try {
      await api.put(`/memberships/${membershipId}/cancel`);
      toast.success('Membership cancelled successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel membership');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      EXPIRED: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
        <p className="text-gray-600 mt-2">
          Manage your gym memberships and explore new plans
        </p>
      </div>

      {/* Current Memberships */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Memberships</h2>
        {memberships.length > 0 ? (
          <div className="space-y-4">
            {memberships.map((membership) => {
              const daysRemaining = getDaysRemaining(membership.endDate);
              const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
              const isActive = membership.status === 'ACTIVE' && daysRemaining > 0;
              
              return (
                <Card key={membership.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-gradient-to-br from-blue-600 to-teal-600' : 'bg-gray-100'
                      }`}>
                        <CreditCard className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{membership.plan.name}</h3>
                          {getStatusBadge(membership.status)}
                          {isExpiringSoon && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              Expires in {daysRemaining} days
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">{membership.gym.name}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">
                                {new Date(membership.startDate).toLocaleDateString()} - {new Date(membership.endDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              <span className="text-sm">${membership.plan.price}/month</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600">
                              Auto-renew: <span className="font-medium">{membership.autoRenew ? 'Yes' : 'No'}</span>
                            </div>
                            {isActive && (
                              <div className="text-sm text-gray-600">
                                Days remaining: <span className={`font-medium ${isExpiringSoon ? 'text-orange-600' : 'text-green-600'}`}>
                                  {daysRemaining}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Plan Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {membership.plan.features.map((feature, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {isActive && (
                      <div className="flex flex-col space-y-2 mt-4 lg:mt-0">
                        <Button size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Renew
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => cancelMembership(membership.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Memberships</h3>
            <p className="text-gray-600">Choose a plan below to get started with your fitness journey</p>
          </Card>
        )}
      </div>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Plans</h2>
        {availablePlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <Card key={plan.id} className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {plan.duration} days
                  </span>
                </div>

                {plan.description && (
                  <p className="text-gray-600 text-sm text-center mb-6">{plan.description}</p>
                )}

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full"
                  onClick={() => subscribeToPlan(plan.id)}
                >
                  Subscribe Now
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Plans Available</h3>
            <p className="text-gray-600">Contact your gym for available subscription plans</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;