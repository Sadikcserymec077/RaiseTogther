import React, { useState } from 'react';
import { shareToWhatsApp, shareToX, shareToFacebook, shareToLinkedIn, copyLink } from '../../utils/shareUtils';
import toast from 'react-hot-toast';

const ShareButtons = ({ url, title }) => {
  const fullUrl = url || window.location.href;

  const handleCopy = async () => {
    const success = await copyLink(fullUrl);
    if (success) toast.success('Link copied!');
    else toast.error('Could not copy link');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this amazing campaign: ${title}`,
          url: fullUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const buttons = [
    { label: 'WhatsApp', emoji: '💬', color: 'bg-green-500 hover:bg-green-600', action: () => shareToWhatsApp(fullUrl, title) },
    { label: 'Facebook', emoji: '📘', color: 'bg-blue-600 hover:bg-blue-700', action: () => shareToFacebook(fullUrl) },
    { label: 'X', emoji: '🐦', color: 'bg-black hover:bg-gray-800', action: () => shareToX(fullUrl, title) },
    { label: 'LinkedIn', emoji: '💼', color: 'bg-blue-700 hover:bg-blue-800', action: () => shareToLinkedIn(fullUrl, title) },
    { label: 'Copy', emoji: '🔗', color: 'bg-gray-200 hover:bg-gray-300 !text-gray-700', action: handleCopy },
  ];

  if (navigator.share) {
    buttons.unshift({ label: 'Share', emoji: '📲', color: 'bg-indigo-600 hover:bg-indigo-700', action: handleNativeShare });
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-2">Share this campaign</p>
      <div className="flex flex-wrap gap-2">
        {buttons.map(({ label, emoji, color, action }) => (
          <button key={label} onClick={action}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-colors ${color}`}>
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShareButtons;
