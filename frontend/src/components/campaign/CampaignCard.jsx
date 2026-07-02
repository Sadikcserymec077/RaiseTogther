import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import CategoryBadge from './CategoryBadge';
import { formatINR, formatCompact } from '../../utils/formatCurrency';
import { MapPin, Clock, Users } from 'lucide-react';

const CampaignCard = ({ campaign }) => {
  const {
    id, title, thumbnailImage, category, goalAmount, raisedAmount,
    progressPercent, donorCount, daysRemaining, location, creatorName, isFeatured,
  } = campaign;

  return (
    <Link to={`/campaigns/${id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {thumbnailImage ? (
          <img
            src={thumbnailImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
            <span className="text-4xl">🚀</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <CategoryBadge category={category} />
          {isFeatured && (
            <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-semibold">⭐ Featured</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>

        {location && (
          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-3">
            <MapPin size={12} /> {location}
          </p>
        )}

        <ProgressBar percent={progressPercent} showLabel={false} className="mb-2" />

        <div className="flex justify-between items-center text-sm mb-3">
          <div>
            <p className="font-bold text-gray-900 dark:text-gray-100">{formatCompact(raisedAmount)}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">raised of {formatCompact(goalAmount)}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 dark:text-gray-100">{progressPercent?.toFixed(0)}%</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">funded</p>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-3">
          <span className="flex items-center gap-1"><Users size={12} /> {donorCount} donors</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Ended'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
