import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CollegeCard from '../components/CollegeCard';
import { Bookmark, ArrowRight } from 'lucide-react';

interface SavedCollege {
  id: string; // college id
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percentage: number;
  saved_id: string;
  saved_at: string;
}

const Dashboard: React.FC = () => {
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSavedColleges = async () => {
      try {
        const response = await api.get('/saved-colleges');
        setSavedColleges(response.data);
      } catch (err) {
        setError('Failed to fetch saved colleges.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedColleges();
  }, [user, navigate]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-accent" /> My Dashboard
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Welcome back, {user?.email}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Colleges</h2>
        
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : savedColleges.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-4 text-5xl">🏛️</div>
            <h3 className="text-lg font-medium text-gray-900">No saved colleges yet</h3>
            <p className="text-gray-500 mt-1">Start browsing and save colleges you are interested in.</p>
            <Link to="/" className="mt-6 inline-flex items-center text-white bg-accent px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Browse Colleges <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedColleges.map((college) => (
              <CollegeCard key={college.saved_id} college={college} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
