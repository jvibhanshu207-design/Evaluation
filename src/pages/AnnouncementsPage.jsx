import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Calendar, User, Search } from 'lucide-react';
import { DEMO_ANNOUNCEMENTS } from '../data/demoAnnouncements';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';
import { sound } from '../utils/sound';
import './AnnouncementsPage.css';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(() =>
    getStoredData(STORAGE_KEYS.ANNOUNCEMENTS, DEMO_ANNOUNCEMENTS)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All'); // 'All' | 'Urgent' | 'Unread'

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }, [announcements]);

  const toggleReadStatus = (id) => {
    sound.playClick();
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a))
    );
  };

  const markAllRead = () => {
    sound.playClick();
    setAnnouncements((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesFilter =
      selectedFilter === 'All' ||
      (selectedFilter === 'Urgent' && a.priority === 'Urgent') ||
      (selectedFilter === 'Unread' && !a.read);
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'pill-badge badge-danger';
      case 'High':
        return 'pill-badge badge-warning';
      default:
        return 'pill-badge badge-cyan';
    }
  };

  return (
    <div className="announcements-container">
      {/* Header Banner */}
      <div className="glass-panel page-banner">
        <div>
          <div className="page-tag">
            <Bell size={20} color="var(--primary-purple)" />
            <span>Academic Communication Center</span>
          </div>
          <h1 className="page-title">
            Official University Announcements
          </h1>
          <p className="page-subtitle">
            Stay updated with examination timetables, hackathon deadlines, guest lectures, and departmental circulars.
          </p>
        </div>

        <button onClick={markAllRead} className="glass-btn" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
          <CheckCheck size={16} />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="announcements-controls">
        <div className="announcements-filter-group">
          {['All', 'Urgent', 'Unread'].map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`announcements-filter-btn ${isSelected ? 'active' : ''}`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="announcements-search-box">
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="announcements-search-input"
          />
        </div>
      </div>

      {/* Announcements Cards */}
      <div className="announcements-list">
        {filteredAnnouncements.map((ann) => {
          return (
            <div
              key={ann.id}
              className={`glass-panel glass-panel-hover announcement-card ${ann.priority === 'Urgent' ? 'urgent' : ''} ${!ann.read ? 'unread' : ''}`}
            >
              <div className="announcement-card-header">
                <div className="announcement-tag-group">
                  <span className={getPriorityBadgeClass(ann.priority)}>
                    {ann.priority} Priority
                  </span>

                  <span className="announcement-category-label">
                    {ann.category}
                  </span>
                </div>

                <button
                  onClick={() => toggleReadStatus(ann.id)}
                  style={{
                    fontSize: '0.78rem',
                    color: ann.read ? 'var(--text-muted)' : 'var(--cyan-accent)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                  }}
                >
                  {ann.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
              </div>

              <h3 className="announcement-card-title">
                {ann.title}
              </h3>

              <p className="announcement-card-body">
                {ann.content}
              </p>

              <div className="announcement-card-footer">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} />
                  <span>Author: <strong style={{ color: 'var(--text-secondary)' }}>{ann.author}</strong></span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} />
                  <span>{ann.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
