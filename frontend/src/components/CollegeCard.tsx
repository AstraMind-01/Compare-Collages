import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, IndianRupee, Layers } from 'lucide-react';
import { useCompare } from '../context/CompareContext';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percentage: number;
}

interface CollegeCardProps {
  college: College;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  const { compareList, addToCompare } = useCompare();
  const isSelected = compareList.some(c => c.id === college.id);

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border flex flex-col h-full ${isSelected ? 'border-accent ring-2 ring-accent ring-opacity-50' : 'border-gray-100'}`}>
      <div className="h-48 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
          <span className="text-4xl">🏛️</span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1 text-yellow-600 shadow-sm">
          <Star className="w-4 h-4 fill-current" /> {college.rating}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
          {college.name}
        </h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{college.location}</span>
        </div>
        
        <div className="mt-auto space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Fees</span>
            <span className="font-semibold text-gray-900 flex items-center">
              <IndianRupee className="w-3 h-3 mr-0.5" />
              {college.fees.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Placement</span>
            <span className="font-semibold text-green-600">
              {college.placement_percentage}%
            </span>
          </div>
        </div>
        
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => addToCompare(college)}
            className={`flex-1 text-center text-sm font-semibold py-2.5 rounded-lg transition-colors border flex items-center justify-center gap-1.5 ${isSelected ? 'bg-accent text-white border-accent hover:bg-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
          >
            {isSelected ? '✓ Added' : <><Layers className="w-4 h-4" /> Compare</>}
          </button>
          <Link 
            to={`/college/${college.id}`}
            className="flex-1 text-center text-sm bg-sections hover:bg-gray-200 text-accent font-semibold py-2.5 rounded-lg transition-colors border border-gray-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
