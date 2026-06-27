import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const RemarksModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [remarks, setRemarks] = useState('');
  const [requestDocs, setRequestDocs] = useState(false);

  const handleSubmit = () => {
    if (!remarks.trim()) return;
    onSubmit({ adminRemarks: remarks, requestMoreDocuments: requestDocs });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Campaign" size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection *</label>
          <textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={4}
            placeholder="Provide clear feedback to the campaign creator..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={requestDocs} onChange={e => setRequestDocs(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-700">Request additional documents from creator</span>
        </label>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSubmit} isLoading={isLoading} disabled={!remarks.trim()}
            className="flex-1 !bg-red-600 hover:!bg-red-700">
            Reject Campaign
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemarksModal;
