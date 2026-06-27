import React from 'react';

const BADGES = [
  { id: 1, name: 'Top Donor', icon: '🏆', earned: true },
  { id: 2, name: 'Verified Creator', icon: '✅', earned: true },
  { id: 3, name: '100 Donations', icon: '💯', earned: false },
  { id: 4, name: 'First Campaign', icon: '🚀', earned: false }
];

const BadgeShelf = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">My Badges</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {BADGES.map(b => (
          <div key={b.id} className={`flex flex-col items-center p-4 rounded-lg border ${b.earned ? 'border-primary-200 bg-primary-50' : 'border-gray-200 opacity-50 bg-gray-50'} min-w-[120px]`}>
            <span className="text-4xl mb-2">{b.icon}</span>
            <span className="text-sm font-semibold text-center">{b.name}</span>
            {!b.earned && <span className="text-xs text-gray-500 mt-1">🔒 Locked</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeShelf;
