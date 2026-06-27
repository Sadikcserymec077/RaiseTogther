import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setStatus('error');
    }
    // eslint-disable-next-line
  }, [token]);

  const verifyToken = async () => {
    try {
      await authApi.verifyEmail(token);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          
          {status === 'verifying' && (
            <div className="space-y-4">
              <Spinner size="lg" className="mx-auto" />
              <h2 className="text-xl font-medium text-gray-900">Verifying your email...</h2>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
              <p className="text-gray-600">Your account has been successfully verified.</p>
              <div className="pt-4">
                <Link to="/login">
                  <Button className="w-full">Continue to Login</Button>
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
              <p className="text-gray-600">The verification link is invalid or has expired.</p>
              <div className="pt-4">
                <Link to="/register">
                  <Button variant="outline" className="w-full">Back to Registration</Button>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
