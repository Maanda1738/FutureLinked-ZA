import { useState } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), location.trim());
    }
  };

  const popularSearches = [
    'IT internship',
    'Graduate program',
    'Engineering bursary',
    'Marketing jobs',
    'Data analyst',
    'Teaching positions'
  ];

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="What are you looking for? (e.g., IT internship, graduate program)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>

          {/* Location Input */}
          <div className="md:w-64 relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                Search
              </>
            )}
          </button>
        </div>
      </form>

      {/* Popular Searches */}
      <div className="text-center">
        <p className="text-blue-200 mb-3">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => onSearch(search, '')}
              className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-100 rounded-full text-sm hover:bg-opacity-30 transition-colors"
              disabled={loading}
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}