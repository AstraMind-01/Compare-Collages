import React, { useState } from 'react';
import { Trophy, School, ArrowRight, Info } from 'lucide-react';
import api from '../services/api';
import CollegeCard from '../components/CollegeCard';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percentage: number;
}

const Predictor: React.FC = () => {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [results, setResults] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rank) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      // Simulate rule-based prediction by fetching all colleges and filtering
      // In a real app, this would be a specialized backend endpoint
      const response = await api.get('/colleges?limit=100');
      const allColleges = response.data.data;
      
      const numRank = parseInt(rank);
      let predicted: College[] = [];
      
      if (exam === 'JEE Main') {
        if (numRank < 10000) {
          predicted = allColleges.filter((c: any) => c.rating >= 4.5);
        } else if (numRank < 50000) {
          predicted = allColleges.filter((c: any) => c.rating >= 4.0);
        } else {
          predicted = allColleges.filter((c: any) => c.rating >= 3.5);
        }
      } else {
        // Generic logic for other exams
        predicted = allColleges.slice(0, 5);
      }
      
      setResults(predicted.slice(0, 6)); // Show top 6 matches
    } catch (error) {
      console.error('Prediction failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          College Predictor 2026
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your exam details and rank to see which colleges you might get into based on previous years' trends.
        </p>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-16">
        <div className="bg-accent p-1"></div>
        <form onSubmit={handlePredict} className="p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <School className="w-4 h-4 text-accent" /> Select Entrance Exam
              </label>
              <select 
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium"
              >
                <option>JEE Main</option>
                <option>JEE Advanced</option>
                <option>NEET</option>
                <option>BITSAT</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent" /> Your Rank / Score
              </label>
              <input 
                type="number"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all font-medium"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Check My Chances <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
        <div className="bg-blue-50 px-8 py-4 flex items-center gap-3 text-blue-700 text-sm font-medium border-t border-blue-100">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>Prediction is based on rule-based logic and historical data. Actual cutoffs may vary.</span>
        </div>
      </div>

      {searched && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Predicted Colleges for <span className="text-accent">{exam}</span> Rank <span className="text-accent">#{rank}</span>
            </h2>
            <span className="text-gray-500 font-medium">{results.length} Matches Found</span>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4">😕</div>
              <h3 className="text-xl font-bold text-gray-900">No close matches found</h3>
              <p className="text-gray-500 mt-2">Try a different rank or check back later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Predictor;
