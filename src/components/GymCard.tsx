import React from 'react';
import { Star, MapPin, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Gym } from '../types';

interface GymCardProps {
  gym: Gym;
}

const GymCard: React.FC<GymCardProps> = ({ gym }) => {
  return (
    <Link to={`/gym/${gym.id}`} className="block group">
      <div className="bg-gray-900 rounded-xl shadow-sm hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 overflow-hidden border border-gray-800 group-hover:border-cyan-500">
        <div className="relative">
          <img
            src={gym.image}
            alt={gym.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-cyan-400 shadow-sm border border-cyan-500/30">
            {gym.priceRange}
          </div>
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg shadow-purple-500/30">
            {gym.category}
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-200">
            {gym.name}
          </h3>
          
          <div className="flex items-center space-x-2 text-gray-400 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{gym.location}, {gym.city}</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              <span className="font-semibold text-white">{gym.rating}</span>
              <span className="text-gray-400 text-sm">({gym.reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-sm">{gym.trainers.length} trainers</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400 mb-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{gym.workingHours}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {gym.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs font-medium border border-gray-700"
              >
                {service}
              </span>
            ))}
            {gym.services.length > 3 && (
              <span className="text-gray-400 text-xs">+{gym.services.length - 3} more</span>
            )}
          </div>
          
          <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold py-2 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default GymCard;