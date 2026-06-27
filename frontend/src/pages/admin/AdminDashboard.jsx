import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Monthly Donations (â‚¹)', data: [12000, 19000, 3000, 5000, 20000, 30000], borderColor: '#3b82f6', tension: 0.4 }]
  };
  const barData = {
    labels: ['Medical', 'Education', 'Startup', 'Animal'],
    datasets: [{ label: 'Campaigns by Category', data: [12, 19, 3, 5], backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'] }]
  };
  const doughnutData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [{ data: [300, 50, 100], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'] }]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['Total Users', 'Total Campaigns', 'Total Donations', 'Fraud Alerts'].map(kpi => (
          <div key={kpi} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">{kpi}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border lg:col-span-2"><Line data={lineData} /></div>
        <div className="bg-white p-4 rounded-lg shadow-sm border"><Doughnut data={doughnutData} /></div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-8"><Bar data={barData} /></div>
    </div>
  );
};
export default AdminDashboard;
