import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('OAuth authentication failed');
      navigate('/auth');
      return;
    }

    if (token) {
      localStorage.setItem('auth_token', token);
      setToken(token);
      toast.success('Successfully logged in with Google!');
      navigate('/dashboard');
    } else {
      toast.error('No authentication token received');
      navigate('/auth');
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing authentication...
        </h2>
        <p className="text-gray-600">
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;