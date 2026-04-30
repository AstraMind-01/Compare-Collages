import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import api from '../services/api';
import CollegeCard from '../components/CollegeCard';
import FilterPanel from '../components/FilterPanel';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percentage: number;
}

const Home: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', location: '', minFees: '', maxFees: '' });
  
  // From context
  const { compareList } = useCompare();

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        ...filters
      });
      
      const response = await api.get(`/colleges?${params.toString()}`);
      setColleges(response.data.data);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch colleges. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [page, filters]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          Discover Your Dream College
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Search, filter, and compare top colleges to make the best decision for your future.
        </p>
      </div>

      <FilterPanel onFilterChange={handleFilterChange} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl shadow-md h-80 animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-t-xl"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="text-gray-400 mb-4 text-5xl">🔍</div>
          <h3 className="text-xl font-bold text-gray-900">No colleges found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Floating Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Link to="/compare" className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-bold transform hover:scale-105 duration-200">
            <span>Compare</span>
            <span className="bg-accent w-6 h-6 rounded-full flex items-center justify-center text-sm">{compareList.length}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
