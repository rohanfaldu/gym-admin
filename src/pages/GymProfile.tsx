import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, Mail, Users, Calendar, ArrowLeft } from 'lucide-react';
import LiveChat from '../components/LiveChat';
import { gyms } from '../data/gyms';

const GymProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gym = gyms.find(g => g.id === id);

  if (!gym) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gym not found</h1>
          <Link to="/marketplace" className="text-blue-600 hover:text-blue-700">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/marketplace"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to all gyms</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        <div className="h-64 lg:h-80 overflow-hidden">
          <img
            src={gym.image}
            alt={gym.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-sm font-medium shadow-lg shadow-purple-500/30">
                  {gym.category}
                </span>
                <span className="bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-cyan-500/30">
                  {gym.priceRange}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{gym.name}</h1>
              <div className="flex items-center space-x-4 text-lg">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-5 w-5" />
                  <span>{gym.location}, {gym.city}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{gym.rating}</span>
                  <span className="text-white/80">({gym.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About {gym.name}</h2>
              <p className="text-gray-300 leading-relaxed mb-6">{gym.description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Services</h3>
                  <div className="space-y-2">
                    {gym.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-sm shadow-cyan-500/50"></div>
                        <span className="text-gray-300">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {gym.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full shadow-sm shadow-purple-500/50"></div>
                        <span className="text-gray-300">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trainers */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Our Trainers</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {gym.trainers.map((trainer) => (
                  <div key={trainer.id} className="flex items-center space-x-4 p-4 border border-gray-700 rounded-lg hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-200 bg-gray-800/50">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{trainer.name}</h3>
                      <p className="text-cyan-400 text-sm font-medium">{trainer.specialty}</p>
                      <p className="text-gray-400 text-sm">{trainer.experience} experience</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Schedule */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Class Schedule</h2>
              <div className="space-y-4">
                {gym.classSchedule.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 bg-gray-800/50">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg shadow-lg shadow-purple-500/30">
                        <Calendar className="h-5 w-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{classItem.name}</h3>
                        <p className="text-gray-300 text-sm">with {classItem.trainer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{classItem.time}</p>
                      <p className="text-gray-400 text-sm">{classItem.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="font-medium text-white">Working Hours</p>
                    <p className="text-gray-300 text-sm">{gym.workingHours}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-white">Phone</p>
                    <a href={`tel:${gym.phone}`} className="text-cyan-400 text-sm hover:text-cyan-300">
                      {gym.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-pink-400" />
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <a href={`mailto:${gym.email}`} className="text-cyan-400 text-sm hover:text-cyan-300">
                      {gym.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-white">Trainers</p>
                    <p className="text-gray-300 text-sm">{gym.trainers.length} expert trainers</p>
                  </div>
                </div>
              </div>
              
              <Link
                to={`/signup?gym=${gym.id}`}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-200 text-center block shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
              >
                Join This Gym
              </Link>
              
              <p className="text-gray-400 text-xs text-center mt-3">
                Click to start your membership request
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat */}
      <LiveChat gymName={gym.name} />
    </div>
  );
};

export default GymProfile;