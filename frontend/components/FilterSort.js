import { Filter, SortAsc, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function FilterSort({ onFilterChange, onSortChange, resultsCount }) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    salaryMin: '',
    workType: 'all', // all, remote, onsite, hybrid
    datePosted: 'all', // all, 24h, 3days, 7days
  });
  const [sortBy, setSortBy] = useState('date'); // date, salary, relevance

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value);
  };

  const clearFilters = () => {
    const defaultFilters = {
      salaryMin: '',
      workType: 'all',
      datePosted: 'all',
    };
    setFilters(defaultFilters);
    setSortBy('date');
    onFilterChange(defaultFilters);
    onSortChange('date');
  };

  const hasActiveFilters = filters.salaryMin || filters.workType !== 'all' || filters.datePosted !== 'all';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors justify-center sm:justify-start ${
            hasActiveFilters 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && <span className="bg-white text-primary-600 rounded-full px-2 py-0.5 text-xs font-bold">Active</span>}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {/* Results Count */}
        <div className="text-sm text-gray-600 text-center sm:text-left">
          Showing <span className="font-semibold">{resultsCount}</span> opportunities
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SortAsc className="h-4 w-4 text-gray-600 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="date">Most Recent</option>
            <option value="salary">Highest Salary</option>
            <option value="relevance">Most Relevant</option>
          </select>
        </div>
      </div>

      {/* Expanded Filter Options */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Minimum Salary Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary
              </label>
              <input
                type="number"
                placeholder="e.g., 15000"
                value={filters.salaryMin}
                onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Work Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Type
              </label>
              <select
                value={filters.workType}
                onChange={(e) => handleFilterChange('workType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Date Posted Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Posted
              </label>
              <select
                value={filters.datePosted}
                onChange={(e) => handleFilterChange('datePosted', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Any Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="3days">Last 3 Days</option>
                <option value="7days">Last 7 Days</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
