import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, CheckCheck, BookOpen, HelpCircle, Award, Trash2 } from 'lucide-react';
import './NotificationDropdown.css';

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <BookOpen size={16} color="var(--cyan-accent)" />;
      case 'quiz':
        return <HelpCircle size={16} color="var(--pink-accent)" />;
      case 'achievement':
        return <Award size={16} color="#FBBF24" />;
      default:
        return <Bell size={16} color="var(--primary-purple)" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="glass-panel animate-modal-pop notif-dropdown"
    >
      {/* Header */}
      <div className="notif-header">
        <div className="notif-header-title">
          <Bell size={18} color="var(--primary-purple)" />
          <span>Notifications</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={markAllAsRead}
            title="Mark all as read"
            className="notif-action-btn"
          >
            <CheckCheck size={14} />
            <span>Mark all</span>
          </button>
          <button
            onClick={clearAll}
            title="Clear all"
            className="notif-action-btn"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">
            <p>No notifications right now.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Link
              key={notif.id}
              to={notif.link || '#'}
              onClick={() => {
                markAsRead(notif.id);
                onClose();
              }}
              className={`notif-item ${notif.read ? 'read' : ''}`}
            >
              <div className="notif-icon-box">
                {getTypeIcon(notif.type)}
              </div>

              <div className="notif-body">
                <div className="notif-item-top">
                  <span className={`notif-item-title ${notif.read ? 'read' : ''}`}>
                    {notif.title}
                  </span>
                  {!notif.read && (
                    <span className="notif-unread-dot" />
                  )}
                </div>

                <p className="notif-item-msg">
                  {notif.message}
                </p>

                <span className="notif-item-time">
                  {notif.timestamp}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
