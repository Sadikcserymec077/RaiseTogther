import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Avatar from '../components/common/Avatar';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', bio: '', address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await userApi.getMe();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          name: data.data.name || '',
          phone: data.data.phone || '',
          bio: data.data.bio || '',
          address: data.data.address || ''
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await userApi.updateProfile(formData);
      if (data.success) {
        setProfile(data.data);
        setUser({ ...user, name: data.data.name });
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {}
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      const { data } = await userApi.changePassword(passwordData);
      if (data.success) {
        toast.success('Password changed successfully');
        setIsChangingPassword(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {}
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await userApi.uploadAvatar(formData);
      if (data.success) {
        setProfile({ ...profile, profilePicture: data.data });
        setUser({ ...user, profilePicture: data.data });
        toast.success('Avatar updated successfully');
      }
    } catch (error) {}
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-primary to-indigo-800"></div>
        
        {/* Avatar Section */}
        <div className="relative px-6 pb-6">
          <div className="relative -mt-16 sm:-mt-20 inline-block">
            <Avatar name={profile.name} url={profile.profilePicture} className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white text-4xl" />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 text-gray-700"
            >
              <Camera size={20} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500">{profile.email} {profile.isEmailVerified && <span className="text-green-500 text-sm ml-2">✓ Verified</span>}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'outline' : 'primary'}>
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Main Info */}
            <div className="p-6 md:col-span-2">
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <Input label="Full Name" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  <Input label="Phone Number" id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  <Input label="Address" id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  
                  <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea 
                      id="bio" rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-gray-600 whitespace-pre-line">{profile.bio || "No bio added yet."}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="mt-1 text-gray-900">{profile.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Address</h4>
                      <p className="mt-1 text-gray-900">{profile.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Stats & Security */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
              {isChangingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input label="Current Password" id="currentPassword" type="password" required value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} />
                  <Input label="New Password" id="newPassword" type="password" required value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                  <Input label="Confirm New Password" id="confirmPassword" type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">Save</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsChangingPassword(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <Button variant="outline" className="w-full" onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
