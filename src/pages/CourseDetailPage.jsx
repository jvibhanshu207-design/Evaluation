import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  Clock,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Zap,
  Check
} from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { useCart } from '../context/CartContext';
import EnrollmentModal from '../components/courses/EnrollmentModal';
import ProgressBar from '../components/common/ProgressBar';
import './CourseDetailPage.css';

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const { courses, isEnrolled, enrollCourse, getCourseStats } = useCourses();
  const { addToCart, isInCart, isPurchased } = useCart();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'curriculum' | 'instructor' | 'reviews'
  const [expandedModules, setExpandedModules] = useState({ 'mod-1': true, 'react-mod-1': true, 'dsa-mod-1': true, 'py-mod-1': true, 'db-mod-1': true, 'web-mod-1': true });
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const enrolled = isEnrolled(course.id) || isPurchased(course.id);
  const inCart = isInCart(course.id);
  const stats = getCourseStats(course.id);
  const price = Number(course.price || 49.99);
  const originalPrice = Number(course.originalPrice || 89.99);
  const discountPercent = Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100));

  const handleAddToCart = () => {
    addToCart(course);
  };

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(course);
    }
    navigate('/checkout');
  };

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  return (
    <div className="course-detail-container">
      {/* Hero Banner */}
      <div className="glass-panel course-hero-banner">
        {/* Glow */}
        <div className="course-hero-glow" />

        {/* Left Column: Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="course-category-tag">
              {course.category}
            </span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              • {course.level}
            </span>
          </div>

          <h1 className="course-hero-title">
            {course.title}
          </h1>

          <p className="course-hero-desc">
            {course.description}
          </p>

          {/* Metadata badges */}
          <div className="course-meta-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FBBF24' }}>
              <Star size={18} fill="#FBBF24" color="#FBBF24" />
              <strong style={{ color: 'var(--text-primary)' }}>{course.rating}</strong>
              <span style={{ color: 'var(--text-muted)' }}>({course.reviewsCount?.toLocaleString()} ratings)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Users size={18} />
              <span>{course.studentsCount?.toLocaleString()} students enrolled</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
              <Clock size={18} />
              <span>{course.duration} on-demand video</span>
            </div>
          </div>

          {/* Instructor Snippet */}
          <div className="course-instructor-snippet">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="course-instructor-avatar"
            />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.96rem' }}>
                {course.instructor.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {course.instructor.role}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Enrollment Card / Preview */}
        <div className="glass-panel course-pricing-card">
          <div className="course-preview-thumb-wrap">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="course-preview-thumb"
            />
            <div className="course-preview-overlay">
              <div className="course-preview-play-btn">
                <PlayCircle size={32} />
              </div>
            </div>
          </div>

          <div>
            <div className="course-price-header">
              <span className="course-current-price">
                ${price.toFixed(2)}
              </span>
              {originalPrice > price && (
                <span className="course-original-price">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="course-discount-badge">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {enrolled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Your Progress</span>
                  <span style={{ fontWeight: 700, color: stats.isCompleted ? 'var(--emerald-accent)' : 'var(--cyan-accent)' }}>
                    {stats.progress}%
                  </span>
                </div>
                <ProgressBar
                  progress={stats.progress}
                  height={8}
                  colorGradient={
                    stats.isCompleted
                      ? 'linear-gradient(90deg, #10B981, #34D399)'
                      : 'linear-gradient(90deg, #8B5CF6, #22D3EE)'
                  }
                />
                <button
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="gradient-border-btn"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.98rem', marginTop: '6px' }}
                >
                  <span>{stats.isCompleted ? 'Review Lectures' : 'Continue Learning'}</span>
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="gradient-border-btn"
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1.02rem' }}
                >
                  <Zap size={18} />
                  <span>Buy Now — Instant Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="glass-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px',
                    fontSize: '0.96rem',
                    borderColor: inCart ? 'var(--cyan-accent)' : 'var(--card-border)',
                    backgroundColor: inCart ? 'rgba(34, 211, 238, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                    color: inCart ? 'var(--cyan-accent)' : 'var(--text-primary)'
                  }}
                >
                  {inCart ? <Check size={18} /> : <ShoppingBag size={18} />}
                  <span>{inCart ? 'Already in Cart' : 'Add to Shopping Cart'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="course-perks-list">
            <div className="course-perk-item">
              <CheckCircle2 size={15} color="var(--emerald-accent)" />
              <span>Full lifetime access to 10+ YouTube lectures</span>
            </div>
            <div className="course-perk-item">
              <CheckCircle2 size={15} color="var(--emerald-accent)" />
              <span>Interactive programming assignments & quizzes</span>
            </div>
            <div className="course-perk-item">
              <CheckCircle2 size={15} color="var(--emerald-accent)" />
              <span>Verifiable Certificate of Completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="course-tabs-nav">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'curriculum', label: `Curriculum (${course.totalLessons} lessons)` },
          { id: 'instructor', label: 'Instructor' },
          { id: 'reviews', label: 'Reviews' }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`course-tab-btn ${isSelected ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="glass-panel course-overview-panel">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
            What you'll master in this course
          </h3>
          <div className="course-overview-grid">
            {course.overview?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--cyan-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px' }}>
            Prerequisites & Requirements
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6' }}>
            Basic computational literacy and enthusiasm to write code. No prior paid software required—all development tools used in this course are free and open-source.
          </p>
        </div>
      )}

      {/* Tab 2: Curriculum */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {course.modules.map((mod) => {
            const isExpanded = !!expandedModules[mod.id];
            return (
              <div key={mod.id} className="glass-panel course-module-accordion">
                <div
                  onClick={() => toggleModule(mod.id)}
                  className="course-module-header"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BookOpen size={18} color="var(--primary-purple)" />
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {mod.title}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ({mod.lessons.length} lessons)
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {isExpanded && (
                  <div className="course-lessons-list">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="course-lesson-row"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <PlayCircle size={16} color="var(--cyan-accent)" />
                          <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                            {lesson.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Instructor */}
      {activeTab === 'instructor' && (
        <div className="glass-panel course-instructor-bio-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="course-instructor-lg-avatar"
            />
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{course.instructor.name}</h3>
              <p style={{ color: 'var(--cyan-accent)', fontSize: '0.9rem', fontWeight: 600 }}>
                {course.instructor.role}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                <span>★ {course.instructor.rating} Rating</span>
                <span>👥 {course.instructor.students?.toLocaleString()} Students</span>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.96rem' }}>
            {course.instructor.bio}
          </p>
        </div>
      )}

      {/* Tab 4: Reviews */}
      {activeTab === 'reviews' && (
        <div className="glass-panel course-reviews-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '24px' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#FBBF24', lineHeight: 1 }}>
              {course.rating}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '4px', color: '#FBBF24', marginBottom: '4px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} fill="#FBBF24" color="#FBBF24" />
                ))}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Course Rating • Based on {course.reviewsCount} verified student evaluations
              </p>
            </div>
          </div>

          {/* Sample Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="course-review-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '0.92rem' }}>Priya S. — 6th Semester</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>1 week ago</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                "The embedded YouTube learning player with sequential lesson tracking makes studying so seamless. Completed the assignments and got my certificate!"
              </p>
            </div>

            <div className="course-review-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <strong style={{ fontSize: '0.92rem' }}>Rohan M. — CS Major</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>2 weeks ago</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                "Best structured course I've experienced. The code explanations and interactive quizzes at the end of each module reinforce concepts deeply."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Celebration Modal */}
      <EnrollmentModal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        course={course}
      />
    </div>
  );
}
