import React from 'react';

const ProgressBar = ({ percent, className = '', showLabel = true }) => {
  const safePercent = Math.min(Math.max(percent || 0, 0), 100);
  const color = safePercent >= 100 ? 'bg-green-500' : safePercent >= 70 ? 'bg-primary' : 'bg-indigo-400';

  return (
    <div className={className}>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1">{safePercent.toFixed(1)}% funded</p>
      )}
    </div>
  );
};

export default ProgressBar;
