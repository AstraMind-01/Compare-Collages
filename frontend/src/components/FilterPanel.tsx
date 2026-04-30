import React, { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';

interface FilterPanelProps {
  onFilterChange: (filters: { search: string; location: string; minFees: string; maxFees: string }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [minFees, setMinFees] = useState('');
  const [maxFees, setMaxFees] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search, location, minFees, maxFees });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, location, minFees, maxFees]);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-accent" />
        <h2 className="font-bold text-gray-900">Search & Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search colleges..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Location (e.g. Delhi)"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Min Fees"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            value={minFees}
            onChange={(e) => setMinFees(e.target.value)}
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Max Fees"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            value={maxFees}
            onChange={(e) => setMaxFees(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
