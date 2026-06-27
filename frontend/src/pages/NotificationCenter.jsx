import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { notificationApi } from '../api/notificationApi';
import { Bell, Check, Trash2, Calendar, Eye, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

const NotificationCenter = () => {
  const { markRead, deleteNotification, markAllRead } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async (page = 0) => {
    setLoading(true);
    try {
      const { data } = await notificationApi.getNotifications(page, 10);
      if (data.success) {
        setNotifications(data.data.content);
        setTotalPages(data.data.totalPages);
        setCurrentPage(data.data.number);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(0);
  }, []);

  const handlePageChange = (page) => {
    fetchNotifications(page);
  };

  const handleMarkRead = async (id) => {
    await markRead(id);
    // Refresh local list
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    // Refresh local list
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkRead(notification.id);
    }
    
    // Redirect based on reference type
    if (notification.referenceType === 'CAMPAIGN' && notification.referenceId) {
      navigate(`/campaign/${notification.referenceId}`);
    } else if (notification.referenceType === 'DONATION') {
      navigate('/my-donations');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'REGISTRATION_SUCCESS':
      case 'EMAIL_VERIFIED':
        return <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Inbox className="w-5 h-5" /></div>;
      case 'DONATION_SUCCESS':
      case 'REWARD_ASSIGNED':
        return <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Check className="w-5 h-5" /></div>;
      case 'CAMPAIGN_APPROVED':
      case 'CAMPAIGN_GOAL_ACHIEVED':
        return <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Bell className="w-5 h-5" /></div>;
      case 'CAMPAIGN_REJECTED':
      case 'CAMPAIGN_EXPIRED':
        return <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Bell className="w-5 h-5" /></div>;
      default:
        return <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Bell className="w-5 h-5" /></div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Notification Center</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view your real-time alerts</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b mb-6 pb-px">
        <button
          onClick={() => setFilter('ALL')}
          className={`pb-2.5 px-2 font-medium text-sm border-b-2 transition-all ${
            filter === 'ALL'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`pb-2.5 px-2 font-medium text-sm border-b-2 transition-all ${
            filter === 'UNREAD'
              ? 'border-primary text-primary font-semibold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-xl shadow-sm">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications found</p>
          <p className="text-xs text-gray-400 mt-1">You are all caught up!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer bg-white hover:shadow-md ${
                !notification.isRead
                  ? 'border-indigo-100 ring-2 ring-indigo-50/50 bg-indigo-50/5'
                  : 'border-gray-100'
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Middle Section */}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold text-gray-900 ${!notification.isRead ? 'font-bold' : ''}`}>
                    {notification.title}
                  </span>
                  {!notification.isRead && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(notification.createdAt).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    })}
                  </span>
                  {notification.referenceId && (
                    <span className="text-primary hover:underline flex items-center gap-1 font-medium">
                      <Eye className="w-3.5 h-3.5" />
                      View context
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 items-center flex-shrink-0" onClick={e => e.stopPropagation()}>
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-green-600 transition-colors"
                    title="Mark read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 border-t pt-4">
              <button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
