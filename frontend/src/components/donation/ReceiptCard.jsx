import React from 'react';
import { FileText, Download, Mail, Calendar, Hash } from 'lucide-react';
import { donationApi } from '../../api/donationApi';
import toast from 'react-hot-toast';

const ReceiptCard = ({ donation }) => {
  const handleDownload = () => {
    const token = localStorage.getItem('accessToken');
    const url = `http://localhost:8089/api/v1/donations/${donation.id}/receipt?token=${token}`;
    window.open(url, '_blank');
  };

  const handleEmail = async () => {
    try {
      await donationApi.emailReceipt(donation.id);
      toast.success("Receipt emailed to you!");
    } catch {
      toast.error("Failed to send email");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary rounded-lg">
          <FileText size={18} className="text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Donation Receipt</p>
          <p className="font-bold text-gray-900 text-sm font-mono">{donation.receiptNumber}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Hash size={14} />
          <span>Payment ID: <span className="font-mono text-xs">{donation.paymentId || 'N/A'}</span></span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={14} />
          <span>{new Date(donation.createdAt).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          <Download size={14} /> Download
        </button>
        <button
          onClick={handleEmail}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Mail size={14} /> Email Me
        </button>
      </div>
    </div>
  );
};

export default ReceiptCard;
