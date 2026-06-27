import React from 'react';
import RewardCard from '../campaign/RewardCard';

const RewardSelector = ({ rewards, selectedReward, onSelect, currentAmount }) => {
  if (!rewards || rewards.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Select a Reward (Optional)</h3>
        {selectedReward && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Clear selection
          </button>
        )}
      </div>
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {rewards.map(reward => (
          <RewardCard
            key={reward.id}
            reward={reward}
            selected={selectedReward?.id === reward.id}
            onSelect={onSelect}
            currentAmount={currentAmount}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardSelector;
