import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await authApi.resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      if (data.success) {
        toast.success('Password reset successfully. You can now login.');
        navigate('/login');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center">Invalid or missing token</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create new password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input label="New Password" id="newPassword" type="password" required value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} />
            <Input label="Confirm New Password" id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
