import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignApi } from '../api/campaignApi';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { CATEGORY_STYLES } from '../components/campaign/CategoryBadge';
import toast from 'react-hot-toast';

const EditCampaign = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', goalAmount: '', deadline: '', location: '', story: ''
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { data } = await campaignApi.getCampaignById(id);
        if (data.success) {
           const c = data.data;
           setFormData({
             title: c.title,
             description: c.description,
             category: c.category,
             goalAmount: c.goalAmount,
             deadline: c.deadline,
             location: c.location || '',
             story: c.story || ''
           });
        }
      } catch (error) {
        toast.error("Failed to fetch campaign details");
        navigate('/my-campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await campaignApi.updateCampaign(id, formData);
      if (data.success) {
        toast.success("Campaign updated successfully");
        navigate('/my-campaigns');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update campaign");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Campaign</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Title" name="title" value={formData.title} onChange={handleChange} required />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" required>
                {Object.keys(CATEGORY_STYLES).map(cat => <option key={cat} value={cat}>{CATEGORY_STYLES[cat].label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Goal Amount (₹)" name="goalAmount" type="number" value={formData.goalAmount} onChange={handleChange} required />
              <Input label="Deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} required />
            </div>
            <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary" required></textarea>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Detailed Story</label>
              <textarea name="story" value={formData.story} onChange={handleChange} rows={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary"></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
               <Button variant="outline" type="button" onClick={() => navigate('/my-campaigns')}>Cancel</Button>
               <Button type="submit" isLoading={saving}>Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCampaign;
