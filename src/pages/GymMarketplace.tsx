import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import GymCard from '../components/GymCard';
import FilterSidebar from '../components/FilterSidebar';
import SearchBar from '../components/SearchBar';
import { gyms, cities, categories } from '../data/gyms';
import { Gym } from '../types';

const GymMarketplace: React.FC = () => {
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>(gyms);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Add 'All' option to filter arrays
  const cityOptions = ['All', ...cities];
  const categoryOptions = categories;

  useEffect(() => {
    let filtered = gyms;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(gym =>
        gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity !== 'All') {
      filtered = filtered.filter(gym => gym.city === selectedCity);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(gym => gym.category === selectedCategory);
    }

    setFilteredGyms(filtered);
  }, [searchTerm, selectedCity, selectedCategory]);

  const handleSearch = (location: string) => {
    setSearchTerm(location);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Section */}
      <section className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Gym</h1>
            <p className="text-gray-300">Discover the best fitness centers in your area</p>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search gyms by name, city, or location..."
            className="max-w-2xl"
          />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            selectedCity={selectedCity}
            selectedCategory={selectedCategory}
            onCityChange={setSelectedCity}
            onCategoryChange={setSelectedCategory}
            cities={cityOptions}
            categories={categoryOptions}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden flex items-center space-x-2 bg-gray-800 border border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-white"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                
                <p className="text-gray-300">
                  <span className="font-semibold text-white">{filteredGyms.length}</span> gyms found
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/30' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-black shadow-lg shadow-cyan-500/30' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Results */}
            {filteredGyms.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredGyms.map((gym) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-gray-800 border border-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No gyms found</h3>
                <p className="text-gray-300 mb-6">
                  Try adjusting your filters or search terms to find more results.
                </p>
                <button
                  onClick={() => {
                    setSelectedCity('All');
                    setSelectedCategory('All');
                    setSearchTerm('');
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymMarketplace;