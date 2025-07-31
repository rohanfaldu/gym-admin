import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, MapPin, Clock, Zap, Shield, Heart } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { gyms } from '../data/gyms';

const Homepage: React.FC = () => {
  const handleSearch = (location: string) => {
    // Navigate to marketplace with search query
    window.location.href = `/marketplace?location=${encodeURIComponent(location)}`;
  };

  const featuredGyms = gyms.slice(0, 3);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Find Your Perfect
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 glow-text">
                    Fitness Partner
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
                  Discover premium gyms, expert trainers, and fitness communities near you.
                </p>
              </div>
              
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Enter your city or location..."
                className="max-w-lg"
              />
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
                  <Users className="h-4 w-4" />
                  <span>1000+ Gyms</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30">
                  <Star className="h-4 w-4" />
                  <span>Expert Trainers</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-pink-500/30">
                  <MapPin className="h-4 w-4" />
                  <span>All Locations</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Modern Gym"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-gray-900 border border-cyan-500/30 p-6 rounded-xl shadow-xl shadow-cyan-500/20">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-3 rounded-lg shadow-lg shadow-cyan-500/30">
                      <Heart className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Join Today</p>
                      <p className="text-gray-400">Start your fitness journey</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose GymFinder?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We make finding and joining the perfect gym simple, fast, and hassle-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-sm hover:shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 text-center group">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                <Search className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Easy Discovery</h3>
              <p className="text-gray-300 leading-relaxed">
                Find gyms by location, category, and services. Filter by your specific needs and preferences.
              </p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-sm hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-center group">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Verified Quality</h3>
              <p className="text-gray-300 leading-relaxed">
                All gyms are verified with real reviews, ratings, and detailed information about facilities.
              </p>
            </div>
            
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-sm hover:shadow-lg hover:shadow-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 text-center group">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300">
                <Zap className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instant Joining</h3>
              <p className="text-gray-300 leading-relaxed">
                Connect with gyms instantly through our platform. Get quick responses and start your fitness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gyms */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Featured Gyms
            </h2>
            <p className="text-xl text-gray-300">
              Top-rated fitness centers in your area
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredGyms.map((gym) => (
              <Link key={gym.id} to={`/gym/${gym.id}`} className="group">
                <div className="bg-gray-900 rounded-xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden border border-gray-800 group-hover:border-cyan-500">
                  <div className="relative">
                    <img
                      src={gym.image}
                      alt={gym.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-cyan-400 border border-cyan-500/30">
                      {gym.priceRange}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-200">
                      {gym.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-gray-400 mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{gym.location}, {gym.city}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                        <span className="font-semibold">{gym.rating}</span>
                        <span className="text-gray-400 text-sm">({gym.reviewCount})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Open Now</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {gym.services.slice(0, 2).map((service, index) => (
                        <span
                          key={index}
                          className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs border border-gray-700"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to="/marketplace"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              <span>View All Gyms</span>
              <Search className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts who found their perfect gym through GymFinder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/marketplace"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              Find Gyms Near You
            </Link>
            <Link
              to="/signup"
              className="bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-8 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/50"
            >
              Join as Member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;