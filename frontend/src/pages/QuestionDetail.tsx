import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Clock, MessageCircle, Send } from 'lucide-react';

interface Answer {
  id: string;
  content: string;
  email: string;
  created_at: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  email: string;
  created_at: string;
  answers: Answer[];
}

const QuestionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data);
    } catch (error) {
      console.error('Failed to fetch question', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to answer');
    
    setSubmitting(true);
    try {
      await api.post(`/questions/${id}/answers`, { content: answerContent });
      setAnswerContent('');
      fetchQuestion();
    } catch (error) {
      alert('Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
    </div>
  );

  if (!question) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Question not found</h2>
      <Link to="/discussion" className="text-accent hover:underline mt-4 inline-block">Back to discussion</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/discussion" className="inline-flex items-center text-gray-500 hover:text-accent mb-8 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Discussion
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
        <div className="p-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 font-medium">
            <User className="w-4 h-4" /> {question.email}
            <span className="text-gray-200">|</span>
            <Clock className="w-4 h-4" /> {new Date(question.created_at).toLocaleDateString()}
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
            {question.title}
          </h1>
          <div className="bg-gray-50 p-6 rounded-2xl text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
            {question.content}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-accent" /> Answers ({question.answers.length})
        </h2>

        {question.answers.length > 0 ? (
          <div className="space-y-6">
            {question.answers.map((answer) => (
              <div key={answer.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-medium">
                  <User className="w-3 h-3" /> {answer.email}
                  <span className="text-gray-200">|</span>
                  <Clock className="w-3 h-3" /> {new Date(answer.created_at).toLocaleDateString()}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{answer.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No answers yet. Be the first to share your knowledge!</p>
          </div>
        )}

        <div className="mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-accent h-1 w-full"></div>
          <form onSubmit={handleAnswer} className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Your Answer</h3>
            <textarea 
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder={user ? "Write your helpful answer here..." : "Please log in to answer questions."}
              disabled={!user || submitting}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all h-40 resize-none font-medium mb-6 disabled:opacity-60"
              required
            />
            {user ? (
              <button 
                type="submit"
                disabled={submitting}
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-70"
              >
                {submitting ? 'Posting...' : <><Send className="w-4 h-4" /> Post Answer</>}
              </button>
            ) : (
              <Link to="/login" className="inline-block bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">
                Login to Answer
              </Link>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
