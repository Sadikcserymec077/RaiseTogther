import React from 'react';
import BadgeShelf from '../components/badge/BadgeShelf';

const UserDashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Campaigns</p><p className="text-2xl font-bold">2</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Raised</p><p className="text-2xl font-bold">â‚¹15,000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Donated</p><p className="text-2xl font-bold">â‚¹5,000</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500">Bookmarks</p><p className="text-2xl font-bold">4</p>
        </div>
      </div>
      <div className="mb-8">
        <BadgeShelf />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity.</p>
      </div>
    </div>
  );
};
export default UserDashboard;
