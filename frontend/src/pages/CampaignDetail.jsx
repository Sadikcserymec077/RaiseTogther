import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { campaignApi } from '../api/campaignApi';
import { bookmarkApi } from '../api/bookmarkApi';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import ImageGallery from '../components/campaign/ImageGallery';
import ProgressBar from '../components/campaign/ProgressBar';
import CountdownTimer from '../components/campaign/CountdownTimer';
import CategoryBadge from '../components/campaign/CategoryBadge';
import StatusBadge from '../components/campaign/StatusBadge';
import ShareButtons from '../components/campaign/ShareButtons';
import CommentsSection from '../components/campaign/CommentsSection';
import QASection from '../components/campaign/QASection';
import ReportModal from '../components/campaign/ReportModal';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { formatINR } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import { MapPin, Users, Heart, Share2, Info, User, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const CampaignDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { subscribe, unsubscribe } = useWebSocket();
  const navigate = useNavigate();
  
  const [campaign, setCampaign] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data: campData } = await campaignApi.getCampaignById(id);
        if (campData.success) {
          setCampaign(campData.data);
          setIsBookmarked(campData.data.isBookmarked);
        }
        const { data: updData } = await campaignApi.getCampaignUpdates(id);
        if (updData.success) {
           setUpdates(updData.data);
        }
      } catch (error) {
        toast.error("Failed to load campaign details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  useEffect(() => {
    const topic = `/topic/campaign/${id}`;
    
    subscribe(topic, (message) => {
      if (message.type === 'NEW_DONATION' || message.type === 'GOAL_ACHIEVED') {
        setCampaign(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            raisedAmount: message.raisedAmount,
            donorCount: message.donorCount,
            progressPercent: message.progressPercent
          };
        });

        toast.success(
          `New donation of ₹${message.donationAmount} from ${message.donorDisplayName}!`,
          { icon: '🎁', duration: 4000 }
        );

        if (message.type === 'GOAL_ACHIEVED') {
          try {
            confetti({
              particleCount: 150,
              spread: 80,
              origin: { y: 0.6 }
            });
          } catch (e) {
            console.error("Confetti failed:", e);
          }
          toast.success("🎉 Campaign Goal Achieved!", { duration: 6000 });
        }
      }
    });

    return () => {
      unsubscribe(topic);
    };
  }, [id, subscribe, unsubscribe]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark campaigns");
      navigate('/login');
      return;
    }
    
    try {
      if (isBookmarked) {
        await bookmarkApi.removeBookmark(id);
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await bookmarkApi.addBookmark(id);
        setIsBookmarked(true);
        toast.success("Campaign bookmarked");
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!campaign) {
    return <div className="min-h-screen flex items-center justify-center">Campaign not found.</div>;
  }

  const isOwner = user?.id === campaign.creator?.id;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Top Banner for non-active status */}
      {campaign.status !== 'APPROVED' && (
        <div className="bg-yellow-50 border-b border-yellow-200 py-3">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium text-yellow-800 flex items-center justify-center gap-2">
            <Info size={16} /> 
            This campaign is currently <StatusBadge status={campaign.status} /> 
            {isOwner && (campaign.status === 'PENDING' || campaign.status === 'PAUSED' || campaign.status === 'REJECTED') && (
               <Link to={`/campaigns/${campaign.id}/edit`} className="underline ml-2">Edit Campaign</Link>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Media & Tabs */}
          <div className="lg:w-2/3">
            <ImageGallery thumbnailImage={campaign.thumbnailImage} images={campaign.images} title={campaign.title} />
            
            {/* Tabs */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100 overflow-x-auto">
                {['story', 'updates', 'comments', 'q&a'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary bg-indigo-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                    {tab === 'q&a' ? 'Q&A' : (tab.charAt(0).toUpperCase() + tab.slice(1))} {tab === 'updates' && `(${updates.length})`}
                  </button>
                ))}
              </div>
              
              <div className="p-6">
                {activeTab === 'story' && (
                   <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                     {campaign.story || campaign.description}
                   </div>
                 )}
                
                {activeTab === 'updates' && (
                  <div className="space-y-6">
                    {updates.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No updates posted yet.</p>
                    ) : (
                      updates.map(update => (
                        <div key={update.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50">
                          <h4 className="font-bold text-gray-900 text-lg">{update.title}</h4>
                          <div className="flex items-center gap-2 mt-1 mb-4 text-xs text-gray-500">
                             <Avatar name={update.postedByName} url={update.postedByAvatar} size="sm" />
                             <span>{update.postedByName}</span> • <span>{formatDateTime(update.createdAt)}</span>
                          </div>
                          <div className="text-gray-700 whitespace-pre-wrap text-sm">{update.content}</div>
                          {update.imageUrl && (
                             <img src={update.imageUrl} alt="" className="mt-4 rounded-lg max-h-64 object-cover" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {activeTab === 'comments' && (
                  <CommentsSection campaignId={id} user={user} isAuthenticated={isAuthenticated} />
                )}

                {activeTab === 'q&a' && (
                  <QASection campaignId={id} user={user} isAuthenticated={isAuthenticated} isCreator={isOwner} />
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column: Actions & Info */}
          <div className="lg:w-1/3 space-y-6">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex justify-between items-start mb-4 gap-2">
                  <CategoryBadge category={campaign.category} />
                  <button onClick={handleBookmarkToggle} className={`p-2 rounded-full transition-colors ${isBookmarked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}>
                    <Heart size={20} fill={isBookmarked ? "currentColor" : "none"} />
                  </button>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{campaign.title}</h1>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">{campaign.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-extrabold text-gray-900">{formatINR(campaign.raisedAmount)}</span>
                    <span className="text-gray-500">raised of {formatINR(campaign.goalAmount)}</span>
                  </div>
                  <ProgressBar percent={campaign.progressPercent} showLabel={false} className="mb-2" />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-primary">{campaign.progressPercent?.toFixed(1)}% funded</span>
                    <span className="text-gray-500">{campaign.donorCount} donors</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <CountdownTimer deadline={campaign.deadline} />
                </div>
                
                <Button 
                  className="w-full mb-3 text-lg py-3 shadow-md hover:shadow-lg transition-all" 
                  disabled={campaign.status !== 'APPROVED'}
                  onClick={() => navigate(`/campaigns/${id}/donate`)}
                >
                  Donate Now
                </Button>
                
                <ShareButtons url={window.location.href} title={campaign.title} />
             </div>
             
             {/* Organizer Info */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <h3 className="font-semibold text-gray-900 mb-4">Organizer</h3>
               <div className="flex items-center gap-4">
                 <Avatar name={campaign.creator?.name} url={campaign.creator?.profilePicture} size="lg" />
                 <div>
                   <p className="font-medium text-gray-900 flex items-center gap-1">
                     <User size={14}/> {campaign.creator?.name}
                   </p>
                   {campaign.location && (
                     <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                       <MapPin size={14}/> {campaign.location}
                     </p>
                   )}
                 </div>
               </div>
               
               {isAuthenticated && !isOwner && (
                 <button
                   onClick={() => setIsReportModalOpen(true)}
                   className="w-full mt-4 flex items-center justify-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm rounded-xl transition-all"
                 >
                   <AlertTriangle className="w-4 h-4" /> Report Campaign
                 </button>
               )}
             </div>
          </div>

        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        campaignId={id}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default CampaignDetail;
