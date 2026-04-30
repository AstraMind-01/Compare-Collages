import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, User, Clock, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  content: string;
  email: string;
  created_at: string;
}

const Discussion: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const { user } = useAuth();

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to ask a question');
    
    try {
      await api.post('/questions', { title: newTitle, content: newContent });
      setNewTitle('');
      setNewContent('');
      setShowAskModal(false);
      fetchQuestions();
    } catch (error) {
      alert('Failed to post question');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Community Discussion</h1>
          <p className="text-gray-500 mt-1">Ask questions, share experiences, and help fellow students.</p>
        </div>
        <button 
          onClick={() => setShowAskModal(true)}
          className="bg-accent text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> Ask a Question
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse h-32"></div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-900">No discussions yet</h3>
          <p className="text-gray-500 mt-2">Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {questions.map((q) => (
            <Link 
              key={q.id} 
              to={`/discussion/${q.id}`}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-accent group flex flex-col sm:flex-row gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-medium">
                  <User className="w-3 h-3" /> {q.email}
                  <span className="text-gray-200">|</span>
                  <Clock className="w-3 h-3" /> {new Date(q.created_at).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-accent transition-colors">
                  {q.title}
                </h3>
                <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                  {q.content}
                </p>
              </div>
              <div className="flex items-center gap-2 text-accent font-bold text-sm sm:self-center">
                View Discussion <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowAskModal(false)}></div>
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-accent h-2 w-full"></div>
            <form onSubmit={handleAsk} className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ask Your Question</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Question Title</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Which college is best for CSE?"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Describe your question</label>
                  <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Provide more details so others can help you better..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all h-32 resize-none"
                    required
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAskModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 border border-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discussion;
