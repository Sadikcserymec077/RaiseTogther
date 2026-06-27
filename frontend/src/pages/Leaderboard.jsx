import React, { useState, useEffect } from 'react';
import { leaderboardApi } from '../api/leaderboardApi';
import Avatar from '../components/common/Avatar';
import { formatINR } from '../utils/formatCurrency';
import { Trophy, Award, Target, Flame, TrendingUp, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('donors'); // 'donors' | 'campaigns' | 'creators'
  const [donorPeriod, setDonorPeriod] = useState('all'); // 'all' | 'monthly'
  const [loading, setLoading] = useState(false);
  
  const [donors, setDonors] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [creators, setCreators] = useState([]);

  const loadLeaderboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'donors') {
        const { data } = await leaderboardApi.getTopDonors(donorPeriod);
        if (data.success) setDonors(data.data || []);
      } else if (activeTab === 'campaigns') {
        const { data } = await leaderboardApi.getTopCampaigns();
        if (data.success) setCampaigns(data.data || []);
      } else if (activeTab === 'creators') {
        const { data } = await leaderboardApi.getTopCreators();
        if (data.success) setCreators(data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
  }, [activeTab, donorPeriod]);

  // Helper to render rank badges
  const getRankBadgeClass = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rank === 2) return 'bg-slate-100 text-slate-800 border-slate-200';
    if (rank === 3) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Helper to render top 3 podium layout
  const renderPodium = (items, type) => {
    if (items.length === 0) return null;
    const podiumItems = [
      items[1], // 2nd Place (Left)
      items[0], // 1st Place (Center)
      items[2]  // 3rd Place (Right)
    ].filter(Boolean);

    return (
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 my-10 px-4">
        {podiumItems.map((item, idx) => {
          // Determine the actual index/rank of this item
          const isFirst = item === items[0];
          const isSecond = item === items[1];
          const isThird = item === items[2];
          const rank = isFirst ? 1 : isSecond ? 2 : isThird ? 3 : 0;
          
          let heightClass = 'h-52';
          let borderAccent = 'border-slate-200';
          let bgGradient = 'from-slate-50 to-white';
          if (isFirst) {
            heightClass = 'h-64 md:-mt-6 ring-4 ring-yellow-400/30';
            borderAccent = 'border-yellow-400';
            bgGradient = 'from-yellow-50/50 to-white';
          } else if (isThird) {
            heightClass = 'h-44';
            borderAccent = 'border-amber-400';
            bgGradient = 'from-amber-50/30 to-white';
          }

          return (
            <div
              key={item.id || item.email || idx}
              className={`w-full md:w-64 border rounded-2xl p-6 flex flex-col items-center justify-between shadow-lg bg-gradient-to-b ${bgGradient} ${borderAccent} ${heightClass} transition-all hover:scale-102 duration-300 relative`}
            >
              {/* Rank Badge */}
              <span className={`absolute -top-3 left-1/2 transform -translate-x-1/2 border px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getRankBadgeClass(rank)}`}>
                {rank === 1 ? '🥇 1st' : rank === 2 ? '🥈 2nd' : '🥉 3rd'}
              </span>

              {/* Avatar / Photo */}
              <div className="mt-2">
                <Avatar
                  name={item.name || item.title || 'Anonymous'}
                  url={item.profilePicture || item.thumbnailImage}
                  size={isFirst ? 'xl' : 'lg'}
                />
              </div>

              {/* Details */}
              <div className="text-center w-full mt-2">
                <h4 className="font-bold text-gray-900 text-sm md:text-base truncate max-w-[200px] mx-auto">
                  {item.name || item.title}
                </h4>
                {type === 'donors' && (
                  <>
                    <p className="text-xs text-primary font-bold mt-1">
                      {formatINR(item.totalDonated)}
                    </p>
                    <span className="inline-block mt-2 bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xxs font-semibold border border-indigo-100">
                      {item.badge}
                    </span>
                  </>
                )}
                {type === 'campaigns' && (
                  <>
                    <p className="text-xs text-primary font-bold mt-1">
                      {formatINR(item.raisedAmount)}
                    </p>
                    <p className="text-xxs text-gray-500 mt-1">
                      {item.donorCount} donors
                    </p>
                  </>
                )}
                {type === 'creators' && (
                  <>
                    <p className="text-xs text-primary font-bold mt-1">
                      {formatINR(item.totalRaised)}
                    </p>
                    <p className="text-xxs text-gray-500 mt-1">
                      {item.campaignCount} campaigns
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-3">
          <Sparkles className="w-4 h-4" /> Live Leaderboard
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">CrowdCash+ Wall of Fame</h1>
        <p className="text-gray-500 mt-2">Celebrating our incredible donors, campaign creators, and top-performing projects.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200 mb-8 max-w-lg mx-auto">
        <button
          onClick={() => setActiveTab('donors')}
          className={`flex items-center gap-1.5 pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'donors'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Award className="w-4.5 h-4.5" /> Top Donors
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-1.5 pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'campaigns'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Target className="w-4.5 h-4.5" /> Top Campaigns
        </button>
        <button
          onClick={() => setActiveTab('creators')}
          className={`flex items-center gap-1.5 pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'creators'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Flame className="w-4.5 h-4.5" /> Top Creators
        </button>
      </div>

      {/* Donors Period Toggle */}
      {activeTab === 'donors' && (
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setDonorPeriod('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              donorPeriod === 'all'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setDonorPeriod('monthly')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              donorPeriod === 'monthly'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            This Month
          </button>
        </div>
      )}

      {/* Podium Rendering */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : activeTab === 'donors' && donors.length > 0 ? (
        <>
          {renderPodium(donors, 'donors')}
          
          {/* Table for rank 4+ */}
          {donors.length > 3 && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-150 overflow-hidden mt-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase">
                    <th className="py-4 px-6">Rank</th>
                    <th className="py-4 px-6">Donor</th>
                    <th className="py-4 px-6">Tier Badge</th>
                    <th className="py-4 px-6 text-right">Total Donated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {donors.slice(3).map((donor, index) => (
                    <tr key={donor.email} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-500">#{index + 4}</td>
                      <td className="py-4 px-6 flex items-center gap-3">
                        <Avatar name={donor.name || 'Anonymous'} url={donor.profilePicture} size="sm" />
                        <span className="font-semibold text-gray-900">{donor.name || 'Anonymous'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xxs font-semibold border border-gray-200">
                          {donor.badge}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-primary">{formatINR(donor.totalDonated)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : activeTab === 'campaigns' && campaigns.length > 0 ? (
        <>
          {renderPodium(campaigns, 'campaigns')}
          
          {campaigns.length > 3 && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-150 overflow-hidden mt-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase">
                    <th className="py-4 px-6">Rank</th>
                    <th className="py-4 px-6">Campaign</th>
                    <th className="py-4 px-6">Donors Count</th>
                    <th className="py-4 px-6 text-right">Amount Raised</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {campaigns.slice(3).map((campaign, index) => (
                    <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-500">#{index + 4}</td>
                      <td className="py-4 px-6 flex items-center gap-3">
                        <Avatar name={campaign.title} url={campaign.thumbnailImage} size="sm" />
                        <span className="font-semibold text-gray-900 truncate max-w-[300px]">{campaign.title}</span>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-600">{campaign.donorCount} donors</td>
                      <td className="py-4 px-6 text-right font-bold text-primary">{formatINR(campaign.raisedAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : activeTab === 'creators' && creators.length > 0 ? (
        <>
          {renderPodium(creators, 'creators')}
          
          {creators.length > 3 && (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-150 overflow-hidden mt-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase">
                    <th className="py-4 px-6">Rank</th>
                    <th className="py-4 px-6">Creator</th>
                    <th className="py-4 px-6">Campaigns Count</th>
                    <th className="py-4 px-6 text-right">Total Raised</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {creators.slice(3).map((creator, index) => (
                    <tr key={creator.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-500">#{index + 4}</td>
                      <td className="py-4 px-6 flex items-center gap-3">
                        <Avatar name={creator.name} url={creator.profilePicture} size="sm" />
                        <span className="font-semibold text-gray-900">{creator.name}</span>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-600">{creator.campaignCount} campaigns</td>
                      <td className="py-4 px-6 text-right font-bold text-primary">{formatINR(creator.totalRaised)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          No data available for this leaderboard.
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
