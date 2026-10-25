import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFocus } from '../../context/FocusContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../common/Logo';
import LanguageSelector from '../common/LanguageSelector';
import {
  LayoutDashboard,
  Compass,
  GraduationCap,
  FileCheck2,
  HelpCircle,
  FileText,
  Bell,
  LineChart,
  CalendarCheck,
  Award,
  Bookmark,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Brain,
  Timer,
  BookOpen,
  Globe,
  X
} from 'lucide-react';
import { resetDemoData } from '../../utils/storage';
import './Sidebar.css';

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) {
  const { logout } = useAuth();
  const { isRunning, formattedTime } = useFocus();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        if (onCloseMobile) onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const navLinks = [
    { to: '/dashboard', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { to: '/courses', label: t('courses', 'Courses'), icon: Compass },
    { to: '/my-courses', label: t('myCourses', 'My Courses'), icon: BookOpen, badge: t('alreadyEnrolled', 'Enrolled') },
    { to: '/my-learning', label: t('myLearning', 'My Learning'), icon: GraduationCap },
    { to: '/assignments', label: t('assignments', 'Assignments'), icon: FileCheck2 },
    { to: '/quizzes', label: t('quizzes', 'Quizzes'), icon: HelpCircle },
    { to: '/notes', label: t('notes', 'Notes'), icon: FileText },
    { to: '/announcements', label: t('announcements', 'Announcements'), icon: Bell, badge: 'New' },
    { to: '/progress', label: t('progress', 'Progress'), icon: LineChart },
    { to: '/smart-learning', label: t('smartLearning', 'Smart Learning'), icon: Brain },
    {
      to: '/focus-room',
      label: t('focusRoom', 'Focus Room'),
      icon: Timer,
      badge: isRunning ? formattedTime : '⚡'
    },
    { to: '/planner', label: t('studyPlanner', 'Study Planner'), icon: CalendarCheck },
    { to: '/achievements', label: t('achievements', 'Achievements'), icon: Award },
    { to: '/saved', label: t('savedLessons', 'Saved Lessons'), icon: Bookmark },
    { to: '/profile', label: t('profile', 'Profile'), icon: User }
  ];

  const handleResetData = () => {
    if (window.confirm('Reset all demo courses, assignments, and notes to original state?')) {
      resetDemoData();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="sidebar-mobile-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="mobile-navigation-drawer"
        role={isMobileOpen ? 'dialog' : 'complementary'}
        aria-modal={isMobileOpen ? 'true' : undefined}
        aria-label={isMobileOpen ? 'Navigation Menu' : 'Application Sidebar'}
        className={`glass-panel sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? '78px' : '260px'
        }}
      >
        {/* Top: Logo & Collapse Button */}
        <div>
          <div className={`sidebar-header ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            <Logo size="sm" to="/dashboard" showText={!isCollapsed} />

            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="sidebar-collapse-btn"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className={`sidebar-nav ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isCollapsed ? 'collapsed' : 'expanded'} ${isActive ? 'active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="sidebar-link-content">
                        <Icon
                          size={19}
                          className={`sidebar-link-icon ${isActive ? 'active' : ''}`}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className={`sidebar-badge ${item.badge === 'New' ? 'pink' : 'purple'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings & Logout */}
        <div className={`sidebar-footer ${isCollapsed ? 'collapsed' : 'expanded'}`}>
          <button
            onClick={() => setShowSettingsModal(true)}
            title={isCollapsed ? t('settings', 'Settings') : undefined}
            className={`sidebar-footer-btn ${isCollapsed ? 'collapsed' : 'expanded'}`}
          >
            <Settings size={18} />
            {!isCollapsed && <span>{t('settings', 'Settings')}</span>}
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title={isCollapsed ? t('logout', 'Logout') : undefined}
            className={`sidebar-footer-btn danger ${isCollapsed ? 'collapsed' : 'expanded'}`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>{t('logout', 'Logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowSettingsModal(false)}
        >
          <div
            className="glass-panel animate-modal-pop sidebar-settings-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-settings-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
                {t('systemSettings', 'System Settings')}
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="btn-icon"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Language Selector Row */}
              <div className="sidebar-settings-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <Globe size={16} color="var(--cyan-accent)" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{t('language', 'Language')}</h4>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Choose your preferred display language for UI & curriculum.
                  </p>
                </div>
                <LanguageSelector />
              </div>

              {/* Reset Data Row */}
              <div className="sidebar-settings-item">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{t('resetDemoData', 'Reset Demo Data')}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Restore original courses, lessons, notes, and progress.
                  </p>
                </div>
                <button
                  onClick={handleResetData}
                  className="btn-danger"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <RotateCcw size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
