import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Assignment Released',
    message: 'Java OOP Hierarchy & Abstract Payroll System is due tomorrow.',
    type: 'assignment',
    read: false,
    timestamp: '2 hours ago',
    link: '/assignments'
  },
  {
    id: 'notif-2',
    title: 'Quiz Reminder 🔥',
    message: 'Test your knowledge on React 19 Hooks & State Architecture.',
    type: 'quiz',
    read: false,
    timestamp: '4 hours ago',
    link: '/quizzes'
  },
  {
    id: 'notif-3',
    title: 'Streak Maintained!',
    message: 'You have hit a 7-day learning streak! Keep the flame alive.',
    type: 'achievement',
    read: false,
    timestamp: 'Yesterday',
    link: '/achievements'
  },
  {
    id: 'notif-4',
    title: 'New Announcement',
    message: 'Mid-Semester Examination Schedule & Guidelines have been published.',
    type: 'announcement',
    read: true,
    timestamp: '2 days ago',
    link: '/announcements'
  }
];

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() =>
    getStoredData(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  useEffect(() => {
    setStoredData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = ({ title, message, type = 'general', link = '#' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: 'Just now',
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
