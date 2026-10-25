import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  GraduationCap,
  Play,
  Clock,
  Award,
  Star
} from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import './MyCoursesPage.css';

export default function MyCoursesPage() {
  const { courses, isEnrolled } = useCourses();

  // Filter courses where the user is enrolled
  const enrolledCourses = courses.filter((course) => isEnrolled(course.id));

  return (
    <div className="my-courses-container">
      {/* Page Header Banner */}
      <div className="glass-panel page-banner">
        <div>
          <div className="page-tag">
            <GraduationCap size={18} color="var(--primary-purple)" />
            <span>Academic Portfolio</span>
          </div>

          <h1 className="page-title">
            My <span className="gradient-text">Courses</span>
          </h1>

          <p className="page-subtitle">
            Your personal learning dashboard displaying all enrolled courses with full classroom access.
          </p>
        </div>

        {enrolledCourses.length > 0 && (
          <div className="my-courses-stats-badge">
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan-accent)' }}>
                {enrolledCourses.length}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {enrolledCourses.length === 1 ? 'Enrolled Course' : 'Enrolled Courses'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid or Empty State */}
      {enrolledCourses.length === 0 ? (
        /* Empty State: No enrolled courses yet */
        <div className="glass-panel my-courses-empty-card">
          <div className="my-courses-empty-icon">
            <BookOpen size={36} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '10px'
            }}
          >
            No Enrolled Courses Yet
          </h2>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.98rem',
              lineHeight: '1.6',
              maxWidth: '460px',
              marginBottom: '28px'
            }}
          >
            You have not enrolled in any courses yet. Browse our comprehensive catalog and enroll to start learning.
          </p>

          <Link
            to="/courses"
            className="gradient-border-btn"
            style={{ padding: '13px 28px', fontSize: '1rem', fontWeight: 700 }}
          >
            <BookOpen size={18} />
            <span>Browse Courses</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        /* Enrolled Courses Grid */
        <div className="courses-grid">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="glass-panel glass-panel-hover my-courses-purchased-card"
            >
              {/* Thumbnail Banner */}
              <div className="my-courses-thumb-wrap">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="my-courses-thumb-img"
                />
                <div className="my-courses-thumb-overlay" />

                {/* Enrolled Tag */}
                <span className="my-courses-license-tag">
                  <GraduationCap size={12} />
                  <span>Enrolled</span>
                </span>
              </div>

              {/* Body Content */}
              <div className="my-courses-card-body">
                <div>
                  <div className="my-courses-card-category">
                    {course.category}
                  </div>

                  <h3 className="my-courses-card-title">
                    {course.title}
                  </h3>

                  {/* Instructor row */}
                  <div className="my-courses-instructor-row">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                      Instructor: <strong style={{ color: 'var(--text-primary)' }}>{course.instructor.name}</strong>
                    </span>
                  </div>

                  {/* Meta stats */}
                  <div className="my-courses-meta-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24' }}>
                      <Star size={14} fill="#FBBF24" color="#FBBF24" />
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{course.rating}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={14} color="var(--cyan-accent)" />
                      <span>Verified Cert</span>
                    </div>
                  </div>
                </div>

                {/* Start Learning Button */}
                <Link
                  to={`/learn/${course.id}`}
                  className="gradient-border-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '11px 16px',
                    fontSize: '0.94rem',
                    fontWeight: 700
                  }}
                >
                  <Play size={16} fill="currentColor" />
                  <span>Start Learning</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
