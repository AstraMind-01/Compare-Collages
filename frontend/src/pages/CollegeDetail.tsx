import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { MapPin, IndianRupee, Star, CheckCircle, ArrowLeft, BookmarkPlus, BookOpen, Layers } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  duration: string;
}

interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  description: string;
  placement_percentage: number;
  courses: Course[];
}

const CollegeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const { user } = useAuth();
  const { compareList, addToCompare } = useCompare();

  const isSelectedForCompare = college ? compareList.some(c => c.id === college.id) : false;

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await api.get(`/colleges/${id}`);
        setCollege(response.data);
      } catch (err) {
        setError('Failed to fetch college details.');
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      setSaveMessage('Please log in to save colleges.');
      return;
    }
    try {
      await api.post('/saved-colleges', { collegeId: id });
      setSaveMessage('College saved to your dashboard!');
    } catch (err: any) {
      setSaveMessage(err.response?.data?.message || 'Failed to save college.');
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );
  
  if (error || !college) return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600 font-medium">
      {error || 'College not found'}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-accent mb-6 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Search
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
        <div className="h-64 bg-gradient-to-r from-blue-600 to-indigo-800 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 drop-shadow-md">{college.name}</h1>
            <div className="flex items-center text-blue-100 font-medium">
              <MapPin className="w-5 h-5 mr-1" />
              {college.location}
            </div>
          </div>
          <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-yellow-400 font-bold border border-white/20">
            <Star className="w-5 h-5 fill-current" /> <span className="text-lg text-white">{college.rating}</span>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About College</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{college.description}</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <button 
                onClick={handleSave}
                className="w-full bg-accent text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <BookmarkPlus className="w-5 h-5" /> Save College
              </button>
              <button 
                onClick={() => college && addToCompare(college)}
                className={`w-full px-4 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2 border ${isSelectedForCompare ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
              >
                <Layers className="w-5 h-5" /> {isSelectedForCompare ? 'Added to Compare' : 'Add to Compare'}
              </button>
              
              {compareList.length > 0 && (
                <Link 
                  to="/compare"
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  View Comparison ({compareList.length})
                </Link>
              )}
              {saveMessage && (
                <p className={`text-sm text-center font-medium ${saveMessage.includes('log in') || saveMessage.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-sections p-6 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <IndianRupee className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-sm mb-1">Average Fees</p>
                <p className="text-2xl font-bold text-gray-900">₹{college.fees.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="bg-sections p-6 rounded-xl border border-gray-100 flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 font-medium text-sm mb-1">Placement Record</p>
                <p className="text-2xl font-bold text-green-600">{college.placement_percentage}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* Courses Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-accent" /> Available Courses
              </h2>
              {college.courses && college.courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {college.courses.map((course) => (
                    <div key={course.id} className="border border-gray-200 p-4 rounded-xl hover:border-accent hover:shadow-sm transition-all bg-white">
                      <h3 className="font-bold text-gray-900 mb-1">{course.name}</h3>
                      <p className="text-gray-500 text-sm font-medium">{course.duration}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No courses listed.</p>
              )}
            </section>

            {/* Placements Section */}
            <section className="bg-gray-50 -mx-8 px-8 py-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" /> Placement Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-accent mb-1">{college.placement_percentage}%</p>
                  <p className="text-sm text-gray-500 font-medium">Placement Rate</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">₹12.5L</p>
                  <p className="text-sm text-gray-500 font-medium">Average Package</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-gray-900 mb-1">₹45L</p>
                  <p className="text-sm text-gray-500 font-medium">Highest Package</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600 leading-relaxed">
                Top recruiters include Google, Microsoft, Amazon, Deloitte, and Goldman Sachs. The career services cell provides extensive training and internship opportunities starting from the third year.
              </p>
            </section>

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" /> Student Reviews
              </h2>
              <div className="space-y-6">
                {[
                  { name: "Priya Sharma", role: "Final Year Student", rating: 5, comment: "Amazing infrastructure and the best placement support I could ask for. The faculty is very helpful." },
                  { name: "Rahul Verma", role: "Alumni (Batch of 2023)", rating: 4, comment: "Great campus life and exposure. The coding culture here is top-notch." }
                ].map((review, i) => (
                  <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                          {review.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{review.name}</h4>
                          <p className="text-xs text-gray-500 font-medium">{review.role}</p>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetail;
