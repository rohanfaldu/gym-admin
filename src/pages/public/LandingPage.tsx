import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Users, 
  Calendar, 
  CreditCard, 
  Shield, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Complete member lifecycle management with automated billing and communication'
    },
    {
      icon: Calendar,
      title: 'Class Scheduling',
      description: 'Advanced booking system with real-time availability and waitlist management'
    },
    {
      icon: CreditCard,
      title: 'Payment Processing',
      description: 'Integrated payment solutions with multiple gateways and automated invoicing'
    },
    {
      icon: Shield,
      title: 'Multi-Gym Support',
      description: 'Manage multiple gym locations with centralized administration and reporting'
    },
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Native mobile apps for iOS and Android with offline capabilities'
    },
    {
      icon: Dumbbell,
      title: 'Equipment Tracking',
      description: 'Comprehensive equipment management with maintenance scheduling'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Gym Owner',
      content: 'This platform transformed how we manage our gym. Member retention improved by 40%!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Fitness Director',
      content: 'The best gym management solution we\'ve used. The mobile app is incredibly user-friendly.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Gym Chain Owner',
      content: 'Managing 5 locations is now effortless. The analytics help us make better business decisions.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GymSAAS</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/gyms" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Find Gyms
              </Link>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                    {' '}Gym Business
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Complete gym management platform with member portal, class booking, 
                  payment processing, and powerful analytics. Everything you need to grow your fitness business.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/gyms">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Gyms
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Modern gym interior"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Everything You Need to Run a Successful Gym
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform handles every aspect of gym management, 
              from member onboarding to advanced analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Trusted by Gym Owners Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about their experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Gym?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful gym owners who have revolutionized their business with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-50">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/gyms">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Gyms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">GymSAAS</span>
              </div>
              <p className="text-gray-400">
                The complete gym management platform for modern fitness businesses.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/gyms" className="hover:text-white transition-colors">Find Gyms</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">For Gym Owners</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#status" className="hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GymSAAS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;