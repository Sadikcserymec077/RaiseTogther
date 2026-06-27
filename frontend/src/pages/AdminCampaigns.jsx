import React, { useState, useEffect } from 'react';
import { campaignApi } from '../api/campaignApi';
import StatusBadge from '../components/campaign/StatusBadge';
import RemarksModal from '../components/admin/RemarksModal';
import Pagination from '../components/common/Pagination';
import { formatINR } from '../utils/formatCurrency';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCampaigns = () => {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data } = activeTab === 'PENDING' 
        ? await campaignApi.getPendingCampaigns({ page })
        : await campaignApi.getAllAdminCampaigns({ page }); // Will need a status filter here in a real app
      
      if (data.success) {
        // Simple client-side filtering for tabs since we don't have all status endpoints
        let filtered = data.data.content;
        if (activeTab !== 'ALL' && activeTab !== 'PENDING') {
           filtered = filtered.filter(c => c.status === activeTab);
        }
        setCampaigns(filtered);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, [activeTab, page]);

  const handleApprove = async (id) => {
    if(!window.confirm("Approve this campaign?")) return;
    try {
      await campaignApi.approveCampaign(id);
      toast.success("Campaign approved");
      fetchCampaigns();
    } catch (error) { toast.error("Failed to approve"); }
  };

  const openRejectModal = (id) => {
    setSelectedCampaignId(id);
    setRejectModalOpen(true);
  };

  const handleReject = async (remarksData) => {
    setProcessing(true);
    try {
      await campaignApi.rejectCampaign(selectedCampaignId, remarksData);
      toast.success("Campaign rejected");
      setRejectModalOpen(false);
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to reject");
    } finally {
      setProcessing(false);
    }
  };

  const handleFeatureToggle = async (id) => {
    try {
      await campaignApi.toggleFeatured(id);
      toast.success("Featured status updated");
      fetchCampaigns();
    } catch (error) { toast.error("Failed to update"); }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Campaign Management</h1>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-6 w-max">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setPage(0); }}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500">No campaigns found for this status.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                  <tr>
                    <th className="px-6 py-4">Campaign Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Goal</th>
                    <th className="px-6 py-4">Creator</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c.id} className="border-b last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 mb-1">{c.title}</div>
                        <div className="text-xs text-gray-500">{c.category} • {c.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={c.status} />
                        {c.isFeatured && <span className="ml-2 text-xs text-yellow-600 font-medium">★ Featured</span>}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatINR(c.goalAmount)}</td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2">
                           {c.creatorAvatar && <img src={c.creatorAvatar} className="w-6 h-6 rounded-full" alt=""/>}
                           <span>{c.creatorName}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <a href={`/campaigns/${c.id}`} target="_blank" rel="noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 bg-white border rounded shadow-sm" title="View">
                            <Eye size={16} />
                          </a>
                          {c.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleApprove(c.id)} className="p-1.5 text-green-600 hover:bg-green-50 bg-white border rounded shadow-sm" title="Approve">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={() => openRejectModal(c.id)} className="p-1.5 text-red-600 hover:bg-red-50 bg-white border rounded shadow-sm" title="Reject">
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          {c.status === 'APPROVED' && (
                             <button onClick={() => handleFeatureToggle(c.id)} className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded hover:bg-yellow-100">
                               {c.isFeatured ? 'Unfeature' : 'Feature'}
                             </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {activeTab === 'PENDING' && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
          </div>
        )}
      </div>

      <RemarksModal 
        isOpen={rejectModalOpen} 
        onClose={() => setRejectModalOpen(false)} 
        onSubmit={handleReject}
        isLoading={processing}
      />
    </div>
  );
};

export default AdminCampaigns;
