import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  Sparkles,
  RotateCcw,
  Brain,
  Timer,
  BookOpen,
  ShoppingBag,
  X
} from 'lucide-react';
import { resetDemoData } from '../../utils/storage';
import './Sidebar.css';

export default function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile, onReplayIntro }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/courses', label: 'Courses', icon: Compass },
    { to: '/cart', label: 'Shopping Cart', icon: ShoppingBag },
    { to: '/my-courses', label: 'My Courses', icon: BookOpen, badge: 'Owned' },
    { to: '/my-learning', label: 'My Learning', icon: GraduationCap, badge: '6' },
    { to: '/assignments', label: 'Assignments', icon: FileCheck2, badge: '4' },
    { to: '/quizzes', label: 'Quizzes', icon: HelpCircle, badge: '2' },
    { to: '/notes', label: 'Notes', icon: FileText },
    { to: '/announcements', label: 'Announcements', icon: Bell, badge: 'New' },
    { to: '/progress', label: 'Progress', icon: LineChart },
    { to: '/smart-learning', label: 'Smart Learning', icon: Brain, badge: 'AI' },
    { to: '/focus-room', label: 'Focus Room', icon: Timer, badge: '⚡' },
    { to: '/planner', label: 'Study Planner', icon: CalendarCheck },
    { to: '/achievements', label: 'Achievements', icon: Award },
    { to: '/saved', label: 'Saved Lessons', icon: Bookmark },
    { to: '/profile', label: 'Profile', icon: User }
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
        className={`glass-panel sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? '78px' : '260px'
        }}
      >
        {/* Top: Logo & Collapse Button */}
        <div>
          <div className={`sidebar-header ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            {!isCollapsed && (
              <div className="sidebar-brand-box">
                <div className="sidebar-brand-icon">
                  <Sparkles size={18} color="white" />
                </div>
                <span className="sidebar-brand-text">
                  LearnSphere
                </span>
              </div>
            )}

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
            title={isCollapsed ? 'Settings' : undefined}
            className={`sidebar-footer-btn ${isCollapsed ? 'collapsed' : 'expanded'}`}
          >
            <Settings size={18} />
            {!isCollapsed && <span>Settings</span>}
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title={isCollapsed ? 'Logout' : undefined}
            className={`sidebar-footer-btn danger ${isCollapsed ? 'collapsed' : 'expanded'}`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout</span>}
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
                System Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="btn-icon"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="sidebar-settings-item">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Reset Demo Data</h4>
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
