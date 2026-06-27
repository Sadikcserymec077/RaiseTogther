import React, { useState } from 'react';

const FraudDetection = () => {
  const [activeTab, setActiveTab] = useState('flagged');

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Fraud Detection Panel</h1>
      <div className="flex space-x-4 mb-6">
        {['flagged', 'reported', 'high-risk', 'suspicious'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Showing data for {activeTab}...</p>
        {/* Table will go here */}
      </div>
    </div>
  );
};
export default FraudDetection;
