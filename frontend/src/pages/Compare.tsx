import React from 'react';
import ComparisonTable from '../components/ComparisonTable';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCompare } from '../context/CompareContext';



const Compare: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-accent mb-4 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Compare Colleges
          </h1>
          <p className="text-gray-500 mt-1">Side-by-side comparison of your selected choices.</p>
        </div>
        
        {compareList.length > 0 && (
          <button 
            onClick={clearCompare}
            className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <ComparisonTable colleges={compareList} onRemove={removeFromCompare} />
      
      {compareList.length > 0 && compareList.length < 3 && (
        <div className="mt-8 text-center">
          <Link to="/" className="inline-block bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 font-medium transition-colors">
            + Add another college to compare
          </Link>
        </div>
      )}
    </div>
  );
};

export default Compare;
