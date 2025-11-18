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
    'IT Internships',
    'Graduate Programmes',
    'Data Analyst Jobs',
    'Engineering Internships'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-[40px] shadow-2xl p-3 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input - Larger with Icon Inside */}
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs, internships, or bursaries…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-base border-0 rounded-[32px] focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
              disabled={loading}
            />
          </div>

          {/* Location Input */}
          <div className="md:w-72 relative">
            <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="📍 Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-base border-0 rounded-[32px] focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"
              disabled={loading}
            />
          </div>

          {/* Search Button - Modern White Button with Blue Text */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-10 py-4 bg-white text-blue-600 rounded-[32px] hover:bg-gray-50 focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-base transition-all shadow-lg hover:shadow-xl border-2 border-blue-600"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>

      {/* Popular Searches - Pill-Shaped Clickable Tags */}
      <div className="text-center">
        <p className="text-white/80 mb-4 text-sm font-medium">Popular searches:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => onSearch(search, '')}
              className="px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/25 transition-all border border-white/20 hover:border-white/40 hover:scale-105 shadow-md"
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