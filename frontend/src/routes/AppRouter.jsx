import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Pages
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import VerifyEmail from '../pages/VerifyEmail';
import Profile from '../pages/Profile';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import FraudDetection from '../pages/admin/FraudDetection';
import CampaignListing from '../pages/CampaignListing';
import CampaignDetail from '../pages/CampaignDetail';
import CreateCampaign from '../pages/CreateCampaign';
import EditCampaign from '../pages/EditCampaign';
import MyCampaigns from '../pages/MyCampaigns';
import Bookmarks from '../pages/Bookmarks';
import AdminCampaigns from '../pages/AdminCampaigns';
import DonatePage from '../pages/DonatePage';
import DonationSuccess from '../pages/DonationSuccess';
import DonationHistory from '../pages/DonationHistory';
import RewardManager from '../pages/RewardManager';
import NotificationCenter from '../pages/NotificationCenter';
import Leaderboard from '../pages/Leaderboard';
import AdminReports from '../pages/AdminReports';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/campaigns" element={<CampaignListing />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />
      <Route path="/campaigns/:id/donate" element={<DonatePage />} />
      <Route path="/donations/campaign/:campaignId" element={<CampaignDetail />} />
      <Route path="/leaderboard" element={<Leaderboard />} />

      {/* Protected Routes (Logged in users) */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/campaigns/create" element={<CreateCampaign />} />
        <Route path="/campaigns/:id/edit" element={<EditCampaign />} />
        <Route path="/my-campaigns" element={<MyCampaigns />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/donation-success/:id" element={<DonationSuccess />} />
        <Route path="/my-donations" element={<DonationHistory />} />
        <Route path="/campaigns/:id/rewards" element={<RewardManager />} />
        <Route path="/notifications" element={<NotificationCenter />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/fraud" element={<FraudDetection />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
