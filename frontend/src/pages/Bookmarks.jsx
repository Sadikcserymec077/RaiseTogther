import React, { useState, useEffect } from 'react';
import { bookmarkApi } from '../api/bookmarkApi';
import CampaignCard from '../components/campaign/CampaignCard';
import Pagination from '../components/common/Pagination';
import { HeartCrack } from 'lucide-react';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await bookmarkApi.getBookmarks({ page, size: 12 });
      if (data.success) {
        setBookmarks(data.data.content);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookmarks(); }, [page]);

  const handleRemove = async (e, id) => {
    e.preventDefault(); // Prevent triggering link
    try {
      await bookmarkApi.removeBookmark(id);
      toast.success("Bookmark removed");
      fetchBookmarks();
    } catch (error) {
      toast.error("Failed to remove bookmark");
    }
  };

  if (loading && page === 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Campaigns</h1>
          <p className="text-gray-600 mt-1">Campaigns you have bookmarked to support later.</p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <HeartCrack size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-500">You haven't saved any campaigns. Explore campaigns and click the heart icon to save them here.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarks.map(campaign => (
                <div key={campaign.id} className="relative group">
                  <CampaignCard campaign={campaign} />
                  <button 
                    onClick={(e) => handleRemove(e, campaign.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="Remove Bookmark"
                  >
                    <HeartCrack size={16} />
                  </button>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
