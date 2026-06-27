import React from 'react';
import { Gift, Check, Lock } from 'lucide-react';

const RewardCard = ({ reward, selected, onSelect, currentAmount = 0 }) => {
  const eligible = currentAmount >= reward.minimumAmount;
  const unavailable = !reward.isAvailable;

  return (
    <div
      onClick={() => eligible && !unavailable && onSelect && onSelect(reward)}
      className={`relative border-2 rounded-2xl p-4 transition-all ${
        selected ? 'border-primary bg-indigo-50 shadow-md' :
        !eligible || unavailable ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' :
        'border-gray-200 hover:border-primary cursor-pointer hover:shadow-sm'
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}
      {unavailable && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-gray-400">
          <Lock size={12} /> Sold out
        </div>
      )}

      <div className="flex items-start gap-3">
        {reward.imageUrl ? (
          <img src={reward.imageUrl} alt={reward.title} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{reward.title}</p>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{reward.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold text-primary bg-indigo-50 px-2 py-0.5 rounded-full">
              Donate ₹{Number(reward.minimumAmount).toLocaleString('en-IN')}+
            </span>
            {reward.maxClaims && (
              <span className="text-xs text-gray-400">
                {reward.maxClaims - reward.totalClaimed} left
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
