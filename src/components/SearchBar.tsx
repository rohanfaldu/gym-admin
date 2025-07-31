import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (location: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search by city or location...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-4 h-5 w-5 text-gray-400 z-10" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-16 py-4 text-lg border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-900 text-white shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/20 placeholder-gray-400"
        />
        <button
          type="submit"
          className="absolute right-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;