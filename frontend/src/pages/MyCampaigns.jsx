import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { campaignApi } from '../api/campaignApi';
import StatusBadge from '../components/campaign/StatusBadge';
import { formatINR } from '../utils/formatCurrency';
import { Play, Pause, Edit, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const { data } = await campaignApi.getMyCampaigns();
      if (data.success) setCampaigns(data.data.content);
    } catch (error) {
      toast.error("Failed to load your campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handlePauseResume = async (id, currentStatus) => {
    try {
      if (currentStatus === 'APPROVED') {
        await campaignApi.pauseCampaign(id);
        toast.success("Campaign paused");
      } else if (currentStatus === 'PAUSED') {
        await campaignApi.resumeCampaign(id);
        toast.success("Campaign resumed");
      }
      fetchCampaigns();
    } catch (error) { toast.error("Action failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await campaignApi.deleteCampaign(id);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (error) { toast.error("Delete failed"); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-gray-600 mt-1">Manage your fundraising projects</p>
          </div>
          <Link to="/campaigns/create" className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-600 transition-colors">
            Start New Campaign
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <span className="text-5xl mb-4 block">📝</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns yet</h3>
            <p className="text-gray-500 mb-6">You haven't created any fundraising campaigns yet.</p>
            <Link to="/campaigns/create" className="text-primary font-medium hover:underline">Create your first campaign</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b">
                  <tr>
                    <th className="px-6 py-4">Campaign</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Raised</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id} className="border-b last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={c.thumbnailImage || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">{c.title}</div>
                            <div className="text-xs text-gray-400">Created on {new Date(c.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{formatINR(c.raisedAmount)}</div>
                        <div className="text-xs text-gray-400">of {formatINR(c.goalAmount)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/campaigns/${c.id}`} className="p-2 text-gray-400 hover:text-primary bg-white rounded-lg border shadow-sm" title="View"><Eye size={16} /></Link>
                          {(c.status === 'PENDING' || c.status === 'PAUSED' || c.status === 'REJECTED') && (
                            <Link to={`/campaigns/${c.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 bg-white rounded-lg border shadow-sm" title="Edit"><Edit size={16} /></Link>
                          )}
                          {(c.status === 'APPROVED' || c.status === 'PAUSED') && (
                            <button onClick={() => handlePauseResume(c.id, c.status)} className="p-2 text-gray-400 hover:text-orange-600 bg-white rounded-lg border shadow-sm" title={c.status === 'APPROVED' ? 'Pause' : 'Resume'}>
                              {c.status === 'APPROVED' ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                          )}
                          {(c.status === 'PENDING' || c.status === 'PAUSED' || c.status === 'REJECTED') && (
                            <button onClick={() => handleDelete(c.id)} className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-lg border shadow-sm" title="Delete"><Trash2 size={16} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCampaigns;
