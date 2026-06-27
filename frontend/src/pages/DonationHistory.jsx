import React, { useState, useEffect } from 'react';
import { donationApi } from '../api/donationApi';
import Pagination from '../components/common/Pagination';
import { Download, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const statusColor = {
  SUCCESS: 'bg-green-50 text-green-700 border-green-200',
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-gray-50 text-gray-600 border-gray-200',
};

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await donationApi.getDonationHistory(page);
        setDonations(data.data.content);
        setTotalPages(data.data.totalPages);
      } catch { toast.error("Failed to load donations"); }
      finally { setLoading(false); }
    };
    load();
  }, [page]);

  const handleDownload = (id) => {
    const token = localStorage.getItem('accessToken');
    const url = `http://localhost:8089/api/v1/donations/${id}/receipt?token=${token}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Donations</h1>
          <p className="text-gray-600 mt-1">Track your contribution history and download receipts.</p>
        </div>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : donations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Receipt size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-500">Your donation history will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                  <tr>
                    <th className="px-6 py-4">Campaign</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Reward</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(d => (
                    <tr key={d.id} className="border-b last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {d.campaignThumbnail && <img src={d.campaignThumbnail} alt="" className="w-9 h-9 rounded-lg object-cover" />}
                          <span className="font-medium text-gray-900 line-clamp-1">{d.campaignTitle}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary">₹{Number(d.amount).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor[d.status]}`}>{d.status}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">{d.rewardTitle || '—'}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4 text-right">
                        {d.receiptNumber && d.status === 'SUCCESS' ? (
                          <button onClick={() => handleDownload(d.id, d.receiptNumber)} className="p-2 text-primary hover:bg-indigo-50 rounded-lg" title="Download Receipt">
                            <Download size={16} />
                          </button>
                        ) : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
