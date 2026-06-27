import React, { useState } from 'react';
import { reportApi } from '../../api/reportApi';
import { AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ReportModal = ({ campaignId, isOpen, onClose }) => {
  const [reason, setReason] = useState('SPAM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error('Please provide a description of the issue');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await reportApi.reportCampaign(campaignId, reason, description.trim());
      if (data.success) {
        toast.success('Campaign reported successfully. Content moderators will review this.');
        setDescription('');
        setReason('SPAM');
        onClose();
      }
    } catch (err) {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2 text-red-600 font-semibold text-base">
            <AlertTriangle className="w-5 h-5" />
            Report Campaign
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-grow">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">Reason for reporting</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200/20 text-sm px-3 py-2 bg-white"
            >
              <option value="SPAM">Spam or misleading information</option>
              <option value="FRAUD">Fraudulent or suspicious actions</option>
              <option value="HARASSMENT">Harassment or abusive remarks</option>
              <option value="OTHER">Other reasons</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">Detailed Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please explain in detail why you are reporting this campaign... Provide evidence or links if possible."
              className="w-full rounded-lg border border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200/20 text-sm p-3 resize-none border"
              required
            />
          </div>

          <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
            Please file report responsibly. False reporting may lead to account penalties.
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
