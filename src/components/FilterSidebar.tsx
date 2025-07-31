import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  selectedCategory: string;
  onCityChange: (city: string) => void;
  onCategoryChange: (category: string) => void;
  cities: string[];
  categories: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  selectedCity,
  selectedCategory,
  onCityChange,
  onCategoryChange,
  cities,
  categories
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 left-0 h-full w-80 bg-white shadow-xl lg:shadow-none
        fixed lg:static top-0 left-0 h-full w-80 bg-gray-900 border-r border-gray-800 shadow-xl lg:shadow-none
        transform transition-transform duration-300 z-50 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="hidden lg:block mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </h2>
          </div>

          {/* City Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
            <div className="space-y-2">
              {cities.map((city) => (
                <label key={city} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="city"
                    value={city}
                    checked={selectedCity === city}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                  />
                  <span className="ml-3 text-gray-300 group-hover:text-cyan-400 transition-colors duration-200">
                    {city}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                  />
                  <span className="ml-3 text-gray-300 group-hover:text-cyan-400 transition-colors duration-200">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={() => {
              onCityChange('All');
              onCategoryChange('All');
            }}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg transition-colors duration-200 font-medium border border-gray-700"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;