import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { Search, Flame, Bell, Moon, Sun, Menu, PlayCircle, User, LogOut, Timer, Brain } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onOpenCommandPalette, onToggleMobileSidebar, onReplayIntro }) {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="glass-panel navbar-header">
      {/* Left: Mobile hamburger & Brand */}
      <div className="navbar-left">
        <button
          onClick={onToggleMobileSidebar}
          className="mobile-hamburger-btn"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={20} />
        </button>

        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo-badge">
            <span style={{ fontSize: '1.15rem' }}>🎓</span>
          </div>
          <span className="navbar-brand-name">
            Learn<span className="gradient-text">Sphere</span>
          </span>
          <span className="navbar-version-pill">
            v2.6
          </span>
        </Link>
      </div>

      {/* Center: Command Palette Trigger Button */}
      <div className="navbar-center">
        <button
          onClick={onOpenCommandPalette}
          className="navbar-search-btn"
          aria-label="Search curriculum and tools (Ctrl + K)"
        >
          <Search size={16} className="navbar-search-icon" />
          <span className="navbar-search-placeholder">Search courses, quizzes, assignments...</span>
          <kbd className="navbar-search-kbd">⌘K</kbd>
        </button>
      </div>

      {/* Right: Quick actions, notifications, streak & profile */}
      <div className="navbar-right">
        {/* Focus Room Quick Link */}
        <Link
          to="/focus-room"
          className="glass-btn navbar-quick-btn"
          title="Pomodoro Focus Room"
        >
          <Timer size={15} color="var(--cyan-accent)" />
          <span className="hide-on-mobile">Focus</span>
        </Link>

        {/* Smart Learning Quick Link */}
        <Link
          to="/smart-learning"
          className="glass-btn navbar-quick-btn"
          title="Adaptive Smart Learning Hub"
        >
          <Brain size={15} color="var(--electric-violet)" />
          <span className="hide-on-mobile">Smart Hub</span>
        </Link>

        {/* Streak indicator badge */}
        <div
          title="7 Day Learning Streak! Keep it going!"
          className="streak-badge-btn"
        >
          <Flame size={16} fill="#FBBF24" color="#FBBF24" />
          <span>7 Days</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="navbar-theme-btn"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={17} color="#FBBF24" /> : <Moon size={17} color="#8B5CF6" />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`navbar-bell-btn ${isNotifOpen ? 'active' : ''}`}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="navbar-unread-pill">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User Avatar & Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="navbar-user-trigger"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name || 'Vibhanshu'}
              className="navbar-user-avatar"
            />
            <div style={{ display: 'none' }} className="user-nav-name">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
            </div>
          </div>

          {isUserMenuOpen && (
            <div className="glass-panel animate-modal-pop navbar-user-menu">
              <div className="navbar-user-header">
                <p className="navbar-user-name">{user?.name}</p>
                <p className="navbar-user-id">{user?.studentId}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="navbar-menu-item"
              >
                <User size={15} />
                <span>My Profile</span>
              </Link>

              {onReplayIntro && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onReplayIntro();
                  }}
                  className="navbar-menu-item cyan"
                >
                  <PlayCircle size={15} />
                  <span>Replay Intro</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="navbar-menu-item danger"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
