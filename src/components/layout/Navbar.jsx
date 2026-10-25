import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useFocus } from '../../context/FocusContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCourses } from '../../context/CourseContext';
import { useCart } from '../../context/CartContext';
import Logo from '../common/Logo';
import LanguageSelector from '../common/LanguageSelector';
import NotificationDropdown from '../notifications/NotificationDropdown';
import {
  Search,
  Flame,
  Bell,
  Moon,
  Sun,
  Menu,
  PlayCircle,
  User,
  LogOut,
  Timer,
  Brain,
  ShoppingBag,
  X,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onOpenCommandPalette, onToggleMobileSidebar, onReplayIntro, isMobileSidebarOpen }) {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { unreadCount } = useNotifications();
  const { isRunning, formattedTime } = useFocus();
  const { t } = useLanguage();
  const { courses, isEnrolled } = useCourses();
  const { cartCount, openCart } = useCart();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  // Trimmed search query
  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Dynamic search across title, description, category, instructor
  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    return courses.filter((course) => {
      const title = (course.title || '').toLowerCase();
      const desc = (course.description || '').toLowerCase();
      const cat = (course.category || '').toLowerCase();
      const instructor = (
        typeof course.instructor === 'object'
          ? course.instructor?.name || ''
          : course.instructor || ''
      ).toLowerCase();

      return (
        title.includes(trimmedQuery) ||
        desc.includes(trimmedQuery) ||
        cat.includes(trimmedQuery) ||
        instructor.includes(trimmedQuery)
      );
    });
  }, [courses, trimmedQuery]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
      searchInputRef.current?.blur();
      mobileSearchInputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      if (searchResults.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % searchResults.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (searchResults.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev <= 0 ? searchResults.length - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        e.preventDefault();
        handleSelectCourse(searchResults[selectedIndex]);
      }
    }
  };

  const handleSelectCourse = (course) => {
    const destination = isEnrolled(course.id) ? `/learn/${course.id}` : `/courses/${course.id}`;
    navigate(destination);
    setSearchQuery('');
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSelectedIndex(-1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedIndex(-1);
    searchInputRef.current?.focus();
  };

  const handleApplySuggestion = (text) => {
    setSearchQuery(text);
    setIsSearchFocused(true);
  };

  return (
    <header className="glass-panel navbar-header">
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay glass-panel">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(false)}
            className="mobile-search-close-btn"
            aria-label="Close search"
          >
            <X size={18} />
          </button>

          <div className="mobile-search-input-wrap">
            <Search size={16} className="mobile-search-icon" />
            <input
              ref={mobileSearchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('searchPlaceholder', 'Search courses, skills, instructors...')}
              className="mobile-search-input"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mobile-search-clear-btn"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile search results list */}
          {trimmedQuery && (
            <div className="mobile-search-results-list">
              {searchResults.length > 0 ? (
                searchResults.map((course) => (
                  <div
                    key={course.id}
                    className="navbar-search-result-item"
                    onClick={() => handleSelectCourse(course)}
                  >
                    <img src={course.thumbnail} alt={course.title} className="navbar-result-thumb" />
                    <div className="navbar-result-info">
                      <span className="navbar-result-cat">{course.category}</span>
                      <h4 className="navbar-result-title">{course.title}</h4>
                      <span className="navbar-result-inst">
                        By {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="navbar-search-empty">
                  <p>No courses found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Left: Mobile hamburger & Brand */}
      <div className="navbar-left">
        <button
          onClick={onToggleMobileSidebar}
          className="mobile-hamburger-btn"
          aria-label="Toggle navigation drawer"
          aria-expanded={isMobileSidebarOpen}
          aria-controls="mobile-navigation-drawer"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-brand-wrapper">
          <Logo size="sm" to="/dashboard" />
          <span className="navbar-version-pill">
            v2.6
          </span>
        </div>
      </div>

      {/* Center: Dynamic Search Bar with Floating Dropdown */}
      <div className="navbar-center" ref={searchContainerRef}>
        <div className={`navbar-search-box ${isSearchFocused ? 'focused' : ''}`}>
          <Search size={16} className="navbar-search-icon" />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder', 'Search courses, skills, instructors...')}
            className="navbar-search-input"
            aria-label="Search curriculum and courses"
            role="combobox"
            aria-expanded={isSearchFocused && trimmedQuery.length > 0}
            aria-autocomplete="list"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="navbar-search-clear-btn"
              title="Clear search"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="navbar-search-kbd-btn"
              title="Open Command Palette (Ctrl+K)"
              aria-label="Command Palette shortcut"
            >
              <kbd className="navbar-search-kbd">⌘K</kbd>
            </button>
          )}
        </div>

        {/* Floating Search Dropdown */}
        {isSearchFocused && trimmedQuery.length > 0 && (
          <div className="navbar-search-dropdown glass-panel animate-modal-pop" role="listbox">
            {searchResults.length > 0 ? (
              <>
                <div className="navbar-dropdown-header">
                  <span>Found {searchResults.length} {searchResults.length === 1 ? 'course' : 'courses'}</span>
                  <span className="navbar-dropdown-hint">Press Enter ↵ to open</span>
                </div>

                <div className="navbar-dropdown-list">
                  {searchResults.map((course, idx) => {
                    const enrolled = isEnrolled(course.id);
                    const isSelected = idx === selectedIndex;
                    const price = Number(course.price || 49.99);
                    const isFree = course.isFree || course.price === 0;

                    return (
                      <div
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`navbar-search-result-item ${isSelected ? 'selected' : ''}`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="navbar-result-thumb"
                        />

                        <div className="navbar-result-info">
                          <div className="navbar-result-top-line">
                            <span className="navbar-result-cat">{course.category}</span>
                            {enrolled && (
                              <span className="navbar-result-enrolled-badge">
                                <CheckCircle2 size={11} /> Enrolled
                              </span>
                            )}
                          </div>

                          <h4 className="navbar-result-title">
                            {course.title}
                          </h4>

                          <div className="navbar-result-bottom-line">
                            <span className="navbar-result-inst">
                              {typeof course.instructor === 'object' ? course.instructor?.name : course.instructor}
                            </span>

                            <div className="navbar-result-meta-right">
                              <span className="navbar-result-rating">
                                <Star size={11} fill="#FBBF24" color="#FBBF24" />
                                {course.rating}
                              </span>
                              <span className="navbar-result-price">
                                {isFree ? 'Free' : `$${price.toFixed(0)}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="navbar-result-arrow">
                          <ArrowRight size={15} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="navbar-search-empty">
                <div className="navbar-empty-icon-wrap">
                  <Search size={22} color="var(--primary-purple)" />
                </div>
                <p className="navbar-empty-title">
                  No courses found matching <strong>"{searchQuery}"</strong>
                </p>
                <p className="navbar-empty-subtitle">
                  Try searching with different keywords or topics:
                </p>
                <div className="navbar-empty-suggestions">
                  {['React', 'Java', 'Python', 'Web', 'Database', 'Algorithms'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleApplySuggestion(tag)}
                      className="navbar-suggestion-pill"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Quick actions, notifications, streak & profile */}
      <div className="navbar-right">
        {/* Mobile Search Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setIsMobileSearchOpen(true);
            setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
          }}
          className="navbar-mobile-search-btn"
          aria-label="Search courses"
          title="Search courses"
        >
          <Search size={17} />
        </button>

        {/* Shopping Cart Button with Dynamic Badge */}
        <button
          type="button"
          onClick={openCart}
          className="navbar-cart-btn"
          title={`Shopping Cart (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
          aria-label={`Shopping Cart with ${cartCount} items`}
        >
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="navbar-cart-badge" aria-hidden="true">
              {cartCount}
            </span>
          )}
        </button>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Focus Room Quick Link with Live Timer */}
        <Link
          to="/focus-room"
          className={`glass-btn navbar-quick-btn hide-on-tablet ${isRunning ? 'active-focus-timer' : ''}`}
          title={isRunning ? `Focus timer running: ${formattedTime}` : 'Pomodoro Focus Room'}
          style={isRunning ? {
            background: 'rgba(34, 211, 238, 0.16)',
            borderColor: 'rgba(34, 211, 238, 0.55)',
            color: '#22d3ee',
            fontWeight: 700
          } : {}}
        >
          <Timer size={15} color="var(--cyan-accent)" />
          {isRunning ? (
            <span style={{ fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.5px' }}>
              {formattedTime}
            </span>
          ) : (
            <span className="hide-on-mobile">{t('focus', 'Focus')}</span>
          )}
        </Link>

        {/* Smart Learning Quick Link */}
        <Link
          to="/smart-learning"
          className="glass-btn navbar-quick-btn hide-on-laptop"
          title="Adaptive Smart Learning Hub"
        >
          <Brain size={15} color="var(--electric-violet)" />
          <span className="hide-on-mobile">{t('smartHub', 'Smart Hub')}</span>
        </Link>

        {/* Streak indicator badge */}
        <div
          title={`${user?.streak || 7} Day Learning Streak! Keep it going!`}
          className="streak-badge-btn hide-on-tablet"
        >
          <Flame size={16} fill="#FBBF24" color="#FBBF24" />
          <span>{user?.streak || 7} {t('daysStreak', 'Days')}</span>
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
            role="button"
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={isUserMenuOpen}
            aria-label="User Account Menu"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsUserMenuOpen(!isUserMenuOpen);
              }
            }}
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user?.name || 'Vibhanshu'}
              className="navbar-user-avatar"
            />
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
                <span>{t('profile', 'My Profile')}</span>
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
                <span>{t('logout', 'Logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
