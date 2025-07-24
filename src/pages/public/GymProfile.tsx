import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Calendar, 
  Clock,
  Star,
  Dumbbell,
  ArrowLeft
} from 'lucide-react';
import { api } from '../../services/authService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Gym {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: string;
  images: string[];
  gymCode: string;
  subscriptionPlans: Array<{
    id: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
  }>;
  classes: Array<{
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    trainer: {
      name: string;
    };
  }>;
  _count: {
    members: number;
    trainers: number;
    equipments: number;
  };
}

const GymProfile: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (identifier) {
      fetchGym();
    }
  }, [identifier]);

  const fetchGym = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/gyms/${identifier}`);
      setGym(response.data.gym);
    } catch (error) {
      console.error('Failed to fetch gym:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gym not found</h2>
          <p className="text-gray-600 mb-4">The gym you're looking for doesn't exist.</p>
          <Link to="/gyms">
            <Button>Back to Gyms</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/gyms" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Gyms</span>
            </Link>
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">GymSAAS</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center mb-6">
            {gym.logo ? (
              <img 
                src={gym.logo} 
                alt={gym.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <Dumbbell className="w-24 h-24 text-blue-600" />
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{gym.name}</h1>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{gym.address}, {gym.city}, {gym.state} {gym.zipCode}</span>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700">{gym._count.members} Members</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-700">{gym._count.trainers} Trainers</span>
                </div>
                <div className="flex items-center">
                  <Dumbbell className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-gray-700">{gym._count.equipments} Equipment</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {gym.description || 'A premium fitness facility dedicated to helping you achieve your fitness goals with state-of-the-art equipment and expert guidance.'}
              </p>
            </div>

            <div className="lg:ml-8 mt-6 lg:mt-0">
              <Card className="p-6 min-w-[300px]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Join This Gym</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{gym.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-700">{gym.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-3" />
                    <span className="text-gray-700">4.8 Rating</span>
                  </div>
                </div>
                <Link to="/register">
                  <Button className="w-full">
                    Join Now
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Gym Code: {gym.gymCode}
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscription Plans */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Plans</h2>
            <div className="space-y-4">
              {gym.subscriptionPlans.map((plan) => (
                <Card key={plan.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">${plan.price}/month</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {plan.duration} days
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <Star className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Classes</h2>
            <div className="space-y-4">
              {gym.classes.map((classItem) => (
                <Card key={classItem.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {classItem.name}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        Trainer: {classItem.trainer.name}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(classItem.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {classItem.startTime} - {classItem.endTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {gym.classes.length === 0 && (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming classes scheduled</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
            <p className="text-blue-100 mb-6">
              Join {gym.name} today and get access to premium facilities, expert trainers, and a supportive community.
            </p>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-50">
                Get Started Now
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GymProfile;