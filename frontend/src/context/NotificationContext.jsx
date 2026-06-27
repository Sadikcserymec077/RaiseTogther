import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const { data } = await notificationApi.getUnreadCount();
      if (data.success) {
        setUnreadCount(data.data);
      }
    } catch (err) {
      console.error('Error fetching unread notification count:', err);
    }
  };

  const fetchLatestNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await notificationApi.getNotifications(0, 5);
      if (data.success) {
        setNotifications(data.data.content);
      }
    } catch (err) {
      console.error('Error fetching latest notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      const { data } = await notificationApi.markAsRead(id);
      if (data.success) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      const { data } = await notificationApi.markAllAsRead();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const { data } = await notificationApi.deleteNotification(id);
      if (data.success) {
        const target = notifications.find(n => n.id === id);
        if (target && !target.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast.success('Notification removed');
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Poll or fetch on mount/user change
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      fetchLatestNotifications();
    } else {
      setUnreadCount(0);
      setNotifications([]);
    }
  }, [user]);

  // Handle incoming real-time notifications via CustomEvent from WebSocketContext
  useEffect(() => {
    const handleNotification = (e) => {
      const newNotification = e.detail;
      
      // Update counts and lists
      setUnreadCount(prev => prev + 1);
      setNotifications(prev => {
        const filtered = prev.filter(n => n.id !== newNotification.notificationId);
        return [
          {
            id: newNotification.notificationId,
            type: newNotification.type,
            title: newNotification.title,
            message: newNotification.message,
            referenceId: newNotification.referenceId,
            referenceType: newNotification.referenceType,
            isRead: false,
            createdAt: newNotification.createdAt
          },
          ...filtered
        ].slice(0, 10);
      });

      // Trigger beautiful visual Toast Notification
      toast((t) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{newNotification.title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{newNotification.message}</span>
        </div>
      ), {
        icon: '🔔',
        duration: 5000,
        position: 'top-right'
      });
    };

    window.addEventListener('app-notification', handleNotification);
    return () => {
      window.removeEventListener('app-notification', handleNotification);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        loading,
        fetchUnreadCount,
        fetchLatestNotifications,
        markRead,
        markAllRead,
        deleteNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
