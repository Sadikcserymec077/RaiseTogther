import React from 'react';
import Avatar from '../common/Avatar';

const DonorFeed = ({ donors = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-1.5 py-1">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-2.5 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (donors.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400 text-sm">Be the first to donate!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {donors.map((donor, i) => (
        <div key={i} className="flex items-start gap-3">
          <Avatar name={donor.displayName} url={donor.avatarUrl} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-gray-900 truncate">{donor.displayName}</span>
              <span className="text-sm font-bold text-primary whitespace-nowrap">
                ₹{Number(donor.amount).toLocaleString('en-IN')}
              </span>
            </div>
            {donor.message && (
              <p className="text-xs text-gray-500 mt-0.5 italic line-clamp-1">"{donor.message}"</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(donor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonorFeed;
