import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">GymFinder</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your trusted partner in finding the perfect fitness center. Connect with premium gyms and start your fitness journey today.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/marketplace" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                  Find Gyms
                </a>
              </li>
              <li>
                <a href="/signup" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                  Join as Member
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                  Premium Gyms
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                  Strength Training
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                  Wellness Centers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">
                  CrossFit Boxes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-cyan-400 mt-0.5" />
                <span className="text-gray-300">
                  123 Fitness Street<br />
                  New York, NY 10001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pink-400" />
                <span className="text-gray-300">info@gymfinder.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 GymFinder. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;