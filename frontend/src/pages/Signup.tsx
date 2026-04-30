import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const Signup: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const response = await api.post('/auth/google', { token: credentialResponse.credential });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Signup failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-sections py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="mb-8">
          <BookOpen className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">Join CollegesHub</h2>
          <p className="mt-2 text-gray-500">Sign up instantly with your Google account</p>
        </div>
        
        {error && <div className="mb-6 text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg font-medium border border-red-100">{error}</div>}

        <div className="flex justify-center flex-col items-center gap-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Signup failed')}
            text="signup_with"
            size="large"
            shape="pill"
          />
          
          <div className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-accent hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Signup;
