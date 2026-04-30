import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await api.post('/auth/verify-email', { token });
        setStatus('success');
        setMessage(response.data.message);
        // Automatically redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    };

    verifyToken();
  }, [location, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Verifying Email...</h1>
            <p className="text-gray-500">Please wait while we activate your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 animate-in zoom-in duration-300">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Email Verified!</h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-400">Redirecting to login in 3 seconds...</p>
            <Link 
              to="/login" 
              className="mt-6 inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
            >
              Go to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
            <p className="text-gray-600">{message}</p>
            <Link 
              to="/signup" 
              className="mt-6 inline-block text-accent font-bold hover:underline"
            >
              Back to Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
