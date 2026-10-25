import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Flame,
  Sparkles,
  Award,
  Video,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Star,
  CalendarCheck,
  Timer,
  Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import CourseCard from '../components/courses/CourseCard';
import FaqSection from '../components/faq/FaqSection';
import Footer from '../components/layout/Footer';
import './LandingPage.css';

export default function LandingPage() {
  const { loginAsDemo } = useAuth();
  const { courses } = useCourses();
  const navigate = useNavigate();

  const handleDemoAccess = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="landing-hero">
        {/* Top Tagline Pill */}
        <div className="landing-hero-pill">
          <Sparkles size={16} />
          <span>Next-Generation EdTech Ecosystem</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="landing-hero-headline">
          Your Learning Universe,{' '}
          <span className="gradient-text">In One Place.</span>
        </h1>

        {/* Supporting Subtext */}
        <p className="landing-hero-subtext">
          LearnSphere brings courses, assignments, quizzes, notes, progress and academic communication together in one intelligent learning ecosystem.
        </p>

        {/* CTA Buttons */}
        <div className="landing-cta-row">
          <Link
            to="/courses"
            className="gradient-border-btn landing-cta-btn-primary"
          >
            <Compass size={19} />
            <span>Explore Courses</span>
          </Link>

          <Link
            to="/dashboard"
            className="glass-btn landing-cta-btn-secondary"
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={19} />
          </Link>

          <button
            onClick={handleDemoAccess}
            className="btn-cyan-accent"
          >
            <Sparkles size={16} />
            <span>Try Demo Account</span>
          </button>
        </div>

        {/* Interactive Visual Learning Center with 5 Floating Badges */}
        <div className="landing-orb-stage">
          {/* Central Glowing Planetary Orb */}
          <div className="landing-planetary-orb">
            {/* Pulsing Core */}
            <div className="landing-orb-core" />
          </div>

          {/* Floating Card 1: 87% Course Progress */}
          <div className="glass-panel animate-float-slow landing-float-card pos-1">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--electric-violet)'
              }}
            >
              <TrendingUp size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Course Progress
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                87% Complete 🚀
              </div>
            </div>
          </div>

          {/* Floating Card 2: 5.0 Rating */}
          <div className="glass-panel animate-float-reverse landing-float-card pos-2">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(34, 211, 238, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-accent)'
              }}
            >
              <Star size={20} fill="#22D3EE" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Student Rating
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                4.9/5 • 24k Reviews
              </div>
            </div>
          </div>

          {/* Floating Card 3: Certificate Ready */}
          <div className="glass-panel animate-float-reverse landing-float-card pos-3">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(244, 114, 182, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--pink-accent)'
              }}
            >
              <Award size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Verified Degree
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                Cryptographic Certs 🎓
              </div>
            </div>
          </div>

          {/* Floating Card 4: Verified Curriculum */}
          <div className="glass-panel animate-float-slow landing-float-card pos-4">
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(52, 211, 153, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--emerald-accent)'
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Accreditation
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                100% Verified Curricula
              </div>
            </div>
          </div>

          {/* Floating Center Badge: Streak */}
          <div className="glass-panel landing-float-card pos-streak">
            <Flame size={18} fill="#FBBF24" color="#FBBF24" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FBBF24' }}>
              Quiz Streak 🔥 7 Days
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="landing-features-section">
        <div className="landing-features-header">
          <span className="landing-features-tag">
            Revolutionary Learning Architecture
          </span>
          <h2 className="landing-features-title">
            Engineered for Academic Mastery
          </h2>
        </div>

        <div className="landing-features-grid">
          {/* Feature 1 */}
          <div className="glass-panel glass-panel-hover landing-feature-card">
            <div
              className="landing-feature-icon-box"
              style={{
                background: 'rgba(34, 211, 238, 0.15)',
                color: 'var(--cyan-accent)'
              }}
            >
              <Video size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              YouTube Educational Hub
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Every course integrates official high-definition YouTube video lessons, sequential module progression, instant bookmarks, and auto-next lesson transitions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel glass-panel-hover landing-feature-card">
            <div
              className="landing-feature-icon-box"
              style={{
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--electric-violet)'
              }}
            >
              <FileCheck2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Interactive Quizzes & Tasks
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Timed evaluations with instant score calculation, accuracy charts, answer explanations, and automated homework submission portals.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel glass-panel-hover landing-feature-card">
            <div
              className="landing-feature-icon-box"
              style={{
                background: 'rgba(251, 191, 36, 0.15)',
                color: '#FBBF24'
              }}
            >
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Verifiable Credentials
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Reach 100% course completion to unlock official tamper-proof credentials complete with gold seals and direct print/download support.
            </p>
          </div>

          {/* Feature 4: AI Assistant */}
          <div className="glass-panel glass-panel-hover landing-feature-card">
            <div
              className="landing-feature-icon-box"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(34, 211, 238, 0.2))',
                color: 'var(--cyan-accent)'
              }}
            >
              <CalendarCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Study Planner & Notes
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Schedule exam milestones, maintain rich digital study notes with tags, and track your daily academic targets with ease.
            </p>
          </div>

          {/* Feature 5: Focus Room */}
          <div className="glass-panel glass-panel-hover landing-feature-card">
            <div
              className="landing-feature-icon-box"
              style={{
                background: 'rgba(52, 211, 153, 0.15)',
                color: 'var(--emerald-accent)'
              }}
            >
              <Timer size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Focus Room & Pomodoro
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Distraction-free zen room with customized work intervals, ambient study sounds, interactive study goals, and XP rewards.
            </p>
          </div>

          {/* Feature 6: Smart Hub & 3D Flashcards */}
          <div className="glass-panel glass-panel-hover landing-feature-card">
            <div
              className="landing-feature-icon-box"
              style={{
                background: 'rgba(244, 114, 182, 0.15)',
                color: 'var(--pink-accent)'
              }}
            >
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              Adaptive Smart Learning
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              3D spaced-repetition flashcards, diagnostic weak-topic scanner, and dynamic difficulty assessment engines.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="landing-courses-section">
        <div className="landing-courses-header">
          <div>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--cyan-accent)'
              }}
            >
              Curated Curriculum
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginTop: '4px'
              }}
            >
              Top Recommended Courses
            </h2>
          </div>

          <Link to="/courses" className="glass-btn" style={{ padding: '9px 18px' }}>
            <span>View All Courses</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="courses-grid">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="glass-panel landing-stats-banner">
        <div>
          <div className="landing-stat-number" style={{ color: 'var(--electric-violet)' }}>
            24,000+
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Scholars</div>
        </div>

        <div>
          <div className="landing-stat-number" style={{ color: 'var(--cyan-accent)' }}>
            98.4%
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Course Completion Rate</div>
        </div>

        <div>
          <div className="landing-stat-number" style={{ color: '#FBBF24' }}>
            4.9 / 5.0
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Student Satisfaction</div>
        </div>

        <div>
          <div className="landing-stat-number" style={{ color: 'var(--emerald-accent)' }}>
            100%
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Demo Persistence</div>
        </div>
      </section>

      {/* Frequently Asked Questions Section */}
      <FaqSection />

      {/* Website Footer */}
      <Footer />
    </div>
  );
}
