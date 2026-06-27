import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellRing, Check, Trash2, Circle } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationsDropdown = () => {
  const {
    unreadCount,
    notifications,
    markRead,
    markAllRead,
    deleteNotification,
    fetchLatestNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchLatestNotifications();
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-all focus:outline-none"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing className="w-6 h-6 text-primary animate-pulse" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xxs font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
              {unreadCount}
            </span>
          </>
        ) : (
          <Bell className="w-6 h-6" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {unreadCount} new
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:text-indigo-700 font-medium transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  {/* Indicator / Status */}
                  <div className="flex-shrink-0 mt-1">
                    {!notification.isRead ? (
                      <Circle className="w-2.5 h-2.5 fill-primary text-primary" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-gray-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <p className={`text-xs font-semibold text-gray-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xxs text-gray-400 block mt-1">
                      {getRelativeTime(notification.createdAt)}
                    </span>
                  </div>

                  {/* Individual Actions */}
                  <div className="flex flex-col gap-1 items-center justify-center flex-shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={() => markRead(notification.id)}
                        className="p-1 hover:bg-gray-200/60 rounded text-gray-500 hover:text-green-600 transition-colors"
                        title="Mark read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 hover:bg-gray-200/60 rounded text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <Link
            to="/notifications"
            onClick={() => setIsOpen(false)}
            className="block text-center py-2.5 text-xs font-medium text-gray-600 hover:text-primary hover:bg-gray-50 border-t border-gray-100 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
