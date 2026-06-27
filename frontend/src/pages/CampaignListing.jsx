import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { campaignApi } from '../api/campaignApi';
import CampaignCard from '../components/campaign/CampaignCard';
import CampaignFilter from '../components/campaign/CampaignFilter';
import Pagination from '../components/common/Pagination';
import { Search } from 'lucide-react';

const CampaignListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'ALL',
    sort: searchParams.get('sort') || 'createdAt,desc',
    location: searchParams.get('location') || '',
    minGoal: searchParams.get('minGoal') || '',
    maxGoal: searchParams.get('maxGoal') || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page')) || 0,
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  // Fetch campaigns when filters change
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const params = {
          ...filters,
          category: filters.category === 'ALL' ? '' : filters.category,
          size: 12,
        };
        const { data } = await campaignApi.getCampaigns(params);
        if (data.success) {
          setCampaigns(data.data.content);
          setTotalPages(data.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
    
    // Update URL params
    const paramsToSet = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if(value && value !== 'ALL' && value !== 0) paramsToSet.set(key, value);
    });
    setSearchParams(paramsToSet, { replace: true });

  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 0 }); // Reset to page 0 on filter change
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput, page: 0 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Campaigns</h1>
            <p className="text-gray-600 mt-1">Discover and support projects that matter to you.</p>
          </div>
          <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
             <CampaignFilter filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-gray-100 shadow-sm" />
                 ))}
              </div>
            ) : campaigns.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {campaigns.map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
                <Pagination 
                  currentPage={filters.page} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => handleFilterChange({ category: 'ALL', sort: 'createdAt,desc', location: '', minGoal: '', maxGoal: '', search: '' })}
                  className="mt-4 text-primary font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignListing;
