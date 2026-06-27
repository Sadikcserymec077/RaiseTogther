import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { MailWarning } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUnverifiedEmail(null);
    try {
      await login(formData);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      const msg = error?.response?.data?.message || '';
      // Detect email-not-verified errors from backend
      if (
        msg.toLowerCase().includes('verify') ||
        msg.toLowerCase().includes('verified') ||
        msg.toLowerCase().includes('email not')
      ) {
        setUnverifiedEmail(formData.email);
      }
      // Interceptor already shows a generic error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Sign in to CrowdCash</h2>
        <p className="mt-2 text-sm text-gray-600">
          No account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Create one for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-100">

          {/* Email not verified warning */}
          {unverifiedEmail && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <MailWarning className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-amber-800">Email not verified</p>
                <p className="text-xs text-amber-700 mt-1">
                  We sent a verification link to <strong>{unverifiedEmail}</strong>.
                  Please check your inbox (and spam folder) and click the link before logging in.
                </p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="Email address" id="email" type="email" required value={formData.email} onChange={handleChange} />
            <Input label="Password" id="password" type="password" required value={formData.password} onChange={handleChange} />

            <div className="flex items-center justify-end text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
