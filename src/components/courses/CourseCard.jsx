import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCourses } from '../../context/CourseContext';
import { useCart } from '../../context/CartContext';
import ProgressBar from '../common/ProgressBar';
import { useLanguage, useDynamicText } from '../../context/LanguageContext';
import './CourseCard.css';

export default function CourseCard({ course }) {
  const { isEnrolled, getCourseStats, enrollCourse } = useCourses();
  const { isInCart, addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const { t } = useLanguage();
  const translatedTitle = useDynamicText(course.title);
  const enrolled = isEnrolled(course.id);
  const inCart = isInCart(course.id);
  const stats = getCourseStats(course.id);

  const price = Number(course.price || 49.99);
  const originalPrice = Number(course.originalPrice || 89.99);
  const discountPercent = Math.max(0, Math.round(((originalPrice - price) / originalPrice) * 100));

  const isFree = course.isFree || course.price === 0;
  const handleQuickEnroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFree) {
      enrollCourse(course.id);
      navigate(`/learn/${course.id}`);
    } else {
      navigate(`/checkout/${course.id}`);
    }
  };

  return (
    <div className="glass-panel glass-panel-hover course-card">
      {/* Thumbnail Banner */}
      <div className="course-card-thumb-wrap">
        <img
          src={course.thumbnail}
          alt={translatedTitle}
          className="course-card-thumb"
        />
        {/* Gradient Overlay */}
        <div className="course-card-thumb-gradient" />

        {/* Badge */}
        {course.badge && (
          <span className="course-card-badge">
            {course.badge}
          </span>
        )}

        {/* Level */}
        <span className="course-card-level">
          {course.level}
        </span>
      </div>

      {/* Body Content */}
      <div className="course-card-body">
        <div>
          {/* Category */}
          <div className="course-card-category">
            {course.category}
          </div>

          {/* Title */}
          <Link to={`/courses/${course.id}`}>
            <h3 className="course-card-title">
              {course.title}
            </h3>
          </Link>

          {/* Instructor snippet */}
          <div className="course-card-instructor">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="course-card-avatar"
            />
            <span className="course-card-instructor-name">
              {course.instructor.name}
            </span>
          </div>

          {/* Metadata badges: Rating, Students, Duration */}
          <div className="course-card-meta">
            <div className="course-card-rating">
              <Star size={14} fill="#FBBF24" color="#FBBF24" />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{course.rating}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} />
              <span>{course.studentsCount?.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div>
          {/* Price display (informational) */}
          <div className="course-card-pricing">
            <span className="course-card-price">
              ${price.toFixed(2)}
            </span>
            {originalPrice > price && (
              <span className="course-card-orig-price">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="course-card-discount">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {enrolled ? (
            <div>
              <div className="course-card-progress-info">
                <span>{stats.completedLessons} / {stats.totalLessons} lessons completed</span>
                <span style={{ fontWeight: 700, color: stats.isCompleted ? 'var(--emerald-accent)' : 'var(--cyan-accent)' }}>
                  {stats.progress}%
                </span>
              </div>

              <ProgressBar
                progress={stats.progress}
                height={6}
                colorGradient={
                  stats.isCompleted
                    ? 'linear-gradient(90deg, #10B981, #34D399)'
                    : 'linear-gradient(90deg, #8B5CF6, #22D3EE)'
                }
              />

              <div style={{ marginTop: '14px' }}>
                <Link
                  to={`/learn/${course.id}`}
                  className="gradient-border-btn"
                  style={{ width: '100%', justifyContent: 'center', padding: '9px 16px', fontSize: '0.88rem' }}
                >
                  <span>{stats.isCompleted ? t('reviewCourse', 'Review Course') : t('continueLearning', 'Continue Learning')}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="course-card-actions-grid" style={{ display: 'flex', gap: '8px' }}>
              <Link
                to={`/courses/${course.id}`}
                className="glass-btn"
                style={{
                  flex: 1,
                  padding: '9px 10px',
                  fontSize: '0.84rem',
                  justifyContent: 'center'
                }}
              >
                <span>{t("details", "Details")}</span>
              </Link>

              {isFree ? (
                <button
                  type="button"
                  onClick={handleQuickEnroll}
                  className="gradient-border-btn"
                  style={{
                    flex: 1.25,
                    padding: '9px 12px',
                    fontSize: '0.84rem',
                    justifyContent: 'center'
                  }}
                >
                  <span>Enroll Free</span>
                  <ArrowRight size={14} />
                </button>
              ) : inCart ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openCart();
                  }}
                  className="glass-btn"
                  style={{
                    flex: 1.25,
                    padding: '9px 10px',
                    fontSize: '0.84rem',
                    justifyContent: 'center',
                    borderColor: 'rgba(34, 211, 238, 0.45)',
                    color: 'var(--cyan-accent)',
                    background: 'rgba(34, 211, 238, 0.1)'
                  }}
                  title="Course is in your cart — click to view cart"
                >
                  <ShoppingBag size={14} />
                  <span>In Cart</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(course);
                  }}
                  className="gradient-border-btn"
                  style={{
                    flex: 1.25,
                    padding: '9px 10px',
                    fontSize: '0.84rem',
                    justifyContent: 'center'
                  }}
                  title="Add course to cart"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
