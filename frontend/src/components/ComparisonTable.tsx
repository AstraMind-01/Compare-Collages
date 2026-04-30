import React from 'react';
import { IndianRupee, Star, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement_percentage: number;
}

interface ComparisonTableProps {
  colleges: College[];
  onRemove: (id: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ colleges, onRemove }) => {
  if (colleges.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-gray-400 mb-3 text-4xl">⚖️</div>
        <h3 className="text-lg font-medium text-gray-900">No colleges selected</h3>
        <p className="text-gray-500 mt-1">Select up to 3 colleges from the home page to compare them.</p>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline font-medium">
          Browse Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200 bg-sections w-1/4">Feature</th>
              {colleges.map((college) => (
                <th key={college.id} className="p-4 border-b border-gray-200 bg-white relative min-w-[250px]">
                  <button 
                    onClick={() => onRemove(college.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove"
                  >
                    ×
                  </button>
                  <h4 className="font-bold text-lg text-gray-900 pr-4">{college.name}</h4>
                  <Link to={`/college/${college.id}`} className="text-xs text-accent hover:underline mt-1 inline-block">
                    View Details
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="p-4 font-medium text-gray-700 bg-sections flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Location
              </td>
              {colleges.map((college) => (
                <td key={`loc-${college.id}`} className="p-4 text-gray-600">
                  {college.location}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-700 bg-sections flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-gray-400" /> Fees
              </td>
              {colleges.map((college) => (
                <td key={`fees-${college.id}`} className="p-4 text-gray-900 font-semibold">
                  ₹{college.fees.toLocaleString('en-IN')}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-700 bg-sections flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-400" /> Rating
              </td>
              {colleges.map((college) => (
                <td key={`rating-${college.id}`} className="p-4">
                  <div className="flex items-center text-yellow-600 font-bold">
                    <Star className="w-4 h-4 fill-current mr-1" /> {college.rating} / 5.0
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-gray-700 bg-sections flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-400" /> Placement %
              </td>
              {colleges.map((college) => {
                // Find max placement to highlight
                const isMax = college.placement_percentage === Math.max(...colleges.map(c => c.placement_percentage));
                return (
                  <td key={`place-${college.id}`} className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${isMax ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800'}`}>
                      {college.placement_percentage}%
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
