import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignApi } from '../api/campaignApi';
import { rewardApi } from '../api/rewardApi';
import { donationApi } from '../api/donationApi';
import { useAuth } from '../context/AuthContext';
import DonationAmountPicker from '../components/donation/DonationAmountPicker';
import RewardSelector from '../components/donation/RewardSelector';
import ProgressBar from '../components/campaign/ProgressBar';
import { Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const DonatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [amount, setAmount] = useState(500);
  const [selectedReward, setSelectedReward] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [campRes, rewardRes] = await Promise.all([
          campaignApi.getCampaignById(id),
          rewardApi.getRewardsForCampaign(id),
        ]);
        setCampaign(campRes.data.data);
        setRewards(rewardRes.data.data || []);
      } catch {
        toast.error("Could not load campaign");
        navigate(`/campaigns/${id}`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDonate = async () => {
    if (!amount || amount < 1) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    setProcessing(true);
    try {
      const initiateRes = await donationApi.initiateDonation({
        campaignId: parseInt(id),
        amount: Number(amount),
        isAnonymous,
        message,
        rewardId: selectedReward?.id || null,
      });

      const orderData = initiateRes.data.data;

      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: 'RaiseTogether',
        description: orderData.campaignTitle,
        image: '/logo.png',
        handler: async (response) => {
          try {
            await donationApi.verifyPayment({
              donationId: orderData.donationId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            navigate(`/donation-success/${orderData.donationId}`);
          } catch {
            toast.error("Payment verification failed. Please contact support.");
            navigate(`/campaigns/${id}`);
          }
        },
        prefill: {
          name: isAnonymous ? '' : (user?.name || ''),
          email: isAnonymous ? '' : (user?.email || ''),
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast("Payment cancelled");
          }
        }
      };

      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh and try again.");
        setProcessing(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Campaign Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {campaign?.thumbnailImage && (
                <img src={campaign.thumbnailImage} alt={campaign.title} className="w-full h-44 object-cover" />
              )}
              <div className="p-5">
                <h2 className="font-bold text-gray-900 text-lg leading-tight">{campaign?.title}</h2>
                <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-2">{campaign?.description}</p>
                <div className="mb-3">
                  <ProgressBar percent={campaign?.progressPercent} showLabel />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="font-semibold text-primary">₹{Number(campaign?.raisedAmount).toLocaleString('en-IN')} raised</span>
                  <span>{campaign?.donorCount} donors</span>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
              <Shield size={20} className="text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">100% Secure Donation</p>
                <p className="text-xs text-green-700">Powered by Razorpay. We never store your card details.</p>
              </div>
            </div>
          </div>

          {/* Right: Donation Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Make a Donation</h1>

              <div className="space-y-6">
                {/* Amount Picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Amount (₹)</label>
                  <DonationAmountPicker amount={amount} onChange={setAmount} />
                </div>

                {/* Reward Selection */}
                {rewards.length > 0 && (
                  <div>
                    <RewardSelector
                      rewards={rewards}
                      selectedReward={selectedReward}
                      onSelect={setSelectedReward}
                      currentAmount={Number(amount)}
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Leave a Message (optional)</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Share why you're supporting this campaign..."
                    rows={3}
                    maxLength={500}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Anonymous Toggle */}
                <div
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isAnonymous ? 'border-primary bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-5 rounded-full transition-all relative ${isAnonymous ? 'bg-primary' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnonymous ? 'translate-x-5' : ''}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {isAnonymous ? <EyeOff size={14} className="text-primary" /> : <Eye size={14} className="text-gray-500" />}
                      <span className="text-sm font-medium text-gray-700">Donate Anonymously</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Your name will appear as "Anonymous" in the donor list.</p>
                  </div>
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonate}
                  disabled={processing || !amount || amount < 1}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                      Processing...
                    </span>
                  ) : `Donate ₹${Number(amount).toLocaleString('en-IN')}`}
                </button>

                <p className="text-center text-xs text-gray-400">
                  By donating, you agree to our Terms of Service. Donations are processed securely via Razorpay.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DonatePage;
