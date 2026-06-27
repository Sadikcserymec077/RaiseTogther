import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rewardApi } from '../api/rewardApi';
import { useAuth } from '../context/AuthContext';
import { campaignApi } from '../api/campaignApi';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Plus, Edit, Trash2, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { title: '', description: '', minimumAmount: '', maxClaims: '', imageUrl: '' };

const RewardManager = () => {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await rewardApi.getRewardsForCampaign(campaignId);
      setRewards(data.data || []);
    } catch { toast.error("Failed to load rewards"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [campaignId]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (r) => { setEditing(r); setForm({ title: r.title, description: r.description, minimumAmount: r.minimumAmount, maxClaims: r.maxClaims || '', imageUrl: r.imageUrl || '' }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.minimumAmount) { toast.error("Title and minimum amount are required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, minimumAmount: Number(form.minimumAmount), maxClaims: form.maxClaims ? Number(form.maxClaims) : null };
      if (editing) {
        await rewardApi.updateReward(editing.id, payload);
        toast.success("Reward updated");
      } else {
        await rewardApi.createReward(campaignId, payload);
        toast.success("Reward created");
      }
      setModalOpen(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reward?")) return;
    try {
      await rewardApi.deleteReward(id);
      toast.success("Reward deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Rewards</h1>
            <p className="text-gray-600 mt-1">Create tiers to incentivize donors.</p>
          </div>
          <Button onClick={openCreate}><Plus size={16} className="mr-1" /> Add Reward</Button>
        </div>

        {loading ? <div className="text-center py-12">Loading...</div> : rewards.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Gift size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No rewards yet</h3>
            <p className="text-gray-500 mb-4">Add reward tiers to encourage higher donations.</p>
            <Button onClick={openCreate}>Create First Reward</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rewards.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift size={20} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{r.title}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{r.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="text-primary font-medium">Min ₹{Number(r.minimumAmount).toLocaleString('en-IN')}</span>
                      {r.maxClaims && <span className="text-gray-400">{r.totalClaimed}/{r.maxClaims} claimed</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(r)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Reward" : "Create Reward"}>
        <div className="space-y-4">
          <Input label="Reward Title *" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Early Bird Special" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" placeholder="What does this reward include?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Minimum Amount (₹) *" type="number" value={form.minimumAmount} onChange={e => setForm({...form, minimumAmount: e.target.value})} placeholder="500" />
            <Input label="Max Claims (blank = unlimited)" type="number" value={form.maxClaims} onChange={e => setForm({...form, maxClaims: e.target.value})} placeholder="e.g. 100" />
          </div>
          <Input label="Image URL (optional)" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSave} isLoading={saving} className="flex-1">{editing ? "Save Changes" : "Create Reward"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RewardManager;
