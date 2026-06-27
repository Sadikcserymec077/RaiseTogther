import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await authApi.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      if (data.success) {
        setRegisteredEmail(formData.email);
        setRegistered(true);
      }
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  // Show email verification pending screen
  if (registered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow-lg sm:rounded-2xl sm:px-10 text-center border border-indigo-100">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailCheck className="text-indigo-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Inbox!</h2>
            <p className="text-gray-600 mb-4">
              We've sent a verification email to:
            </p>
            <div className="bg-indigo-50 rounded-xl px-4 py-3 mb-6">
              <p className="text-indigo-700 font-semibold text-lg break-all">{registeredEmail}</p>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              Please click the link in that email to verify your account before you can log in.
              Check your spam folder if you don't see it.
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Go to Login
                </Button>
              </Link>
              <p className="text-xs text-gray-400">
                Wrong email?{' '}
                <button
                  onClick={() => setRegistered(false)}
                  className="text-indigo-600 underline"
                >
                  Go back and fix it
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have one?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-lg sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input label="Full Name" id="name" type="text" required value={formData.name} onChange={handleChange} />
            <Input label="Email address" id="email" type="email" required value={formData.email} onChange={handleChange} />
            <Input label="Phone Number" id="phone" type="tel" value={formData.phone} onChange={handleChange} />
            <Input label="Password" id="password" type="password" required value={formData.password} onChange={handleChange} />
            <Input label="Confirm Password" id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
