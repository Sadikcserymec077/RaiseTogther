import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { donationApi } from '../api/donationApi';
import ConfettiWrapper from '../components/common/ConfettiWrapper';
import ReceiptCard from '../components/donation/ReceiptCard';
import { CheckCircle, Gift, ArrowLeft, Share2, Home } from 'lucide-react';

const DonationSuccess = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await donationApi.getDonationById(id);
        setDonation(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just donated on RaiseTogether!',
        text: `I donated ₹${donation?.amount} to "${donation?.campaignTitle}" on RaiseTogether. Join me in making a difference!`,
        url: `${window.location.origin}/campaigns/${donation?.campaignId}`,
      });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <ConfettiWrapper trigger />
      <div className="max-w-lg w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thank You! 💙</h1>
          <p className="text-gray-600 text-lg">Your donation was successful!</p>
        </div>

        {/* Donation Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="text-center mb-6">
            <p className="text-5xl font-extrabold text-primary mb-1">
              ₹{Number(donation?.amount).toLocaleString('en-IN')}
            </p>
            <p className="text-gray-500">donated to</p>
            <p className="font-bold text-gray-900 text-lg mt-1">{donation?.campaignTitle}</p>
          </div>

          {donation?.rewardTitle && (
            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4">
              <Gift size={20} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Reward Earned!</p>
                <p className="text-xs text-yellow-700">{donation.rewardTitle}</p>
              </div>
            </div>
          )}

          {/* Receipt */}
          {donation && <ReceiptCard donation={donation} />}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link to={`/campaigns/${donation?.campaignId}`}
            className="flex flex-col items-center gap-1.5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <ArrowLeft size={18} />
            Campaign
          </Link>
          <button onClick={handleShare}
            className="flex flex-col items-center gap-1.5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Share2 size={18} />
            Share
          </button>
          <Link to="/"
            className="flex flex-col items-center gap-1.5 py-3 bg-primary text-white rounded-xl text-xs font-medium hover:bg-indigo-600 transition-colors">
            <Home size={18} />
            Home
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          A confirmation email with your receipt has been sent to your email address.
        </p>
      </div>
    </div>
  );
};

export default DonationSuccess;
