import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-brand-link">
            <div className="footer-brand-icon">
              <Sparkles size={20} />
            </div>
            <span className="footer-brand-title">
              Learn<span className="gradient-text">Sphere</span>
            </span>
          </Link>

          <p className="footer-desc">
            An intelligent, next-generation learning ecosystem uniting interactive courses, cognitive AI study tutoring, timed evaluations, and verifiable credentials.
          </p>

          <div className="footer-status-pill">
            <span className="footer-status-dot" />
            <span>All Systems Operational • v2.4 Live</span>
          </div>
        </div>

        {/* Column 1: Curriculum & Exploration */}
        <div>
          <h4 className="footer-col-title">
            Learning Hub
          </h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/courses" className="footer-link">
                Explore Courses
              </Link>
            </li>
            <li>
              <Link to="/my-courses" className="footer-link">
                My Purchased Courses
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="footer-link">
                Student Dashboard
              </Link>
            </li>
            <li>
              <Link to="/smart-learning" className="footer-link">
                Adaptive Smart Learning
              </Link>
            </li>
            <li>
              <Link to="/focus-room" className="footer-link">
                Focus Room & Pomodoro
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: Academic Tools */}
        <div>
          <h4 className="footer-col-title">
            Study Tools
          </h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/quizzes" className="footer-link">
                Interactive Quizzes
              </Link>
            </li>
            <li>
              <Link to="/assignments" className="footer-link">
                Assignments Portal
              </Link>
            </li>
            <li>
              <Link to="/notes" className="footer-link">
                Digital Study Notes
              </Link>
            </li>
            <li>
              <Link to="/planner" className="footer-link">
                Academic Planner
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Trust & Support */}
        <div>
          <h4 className="footer-col-title">
            Help & Trust
          </h4>
          <ul className="footer-links-list">
            <li>
              <a href="#faqs" className="footer-link">
                Frequently Asked Questions
              </a>
            </li>
            <li>
              <Link to="/achievements" className="footer-link">
                Verified Credentials & XP
              </Link>
            </li>
            <li>
              <Link to="/announcements" className="footer-link">
                System Announcements
              </Link>
            </li>
            <li>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Press <kbd className="footer-kbd">Ctrl+K</kbd> for quick command search
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom">
        <div>
          © {CURRENT_YEAR} LearnSphere Educational Ecosystem. Built with passion for modern scholars.
        </div>

        <div className="footer-legal-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security & Compliance</span>
        </div>
      </div>
    </footer>
  );
}
