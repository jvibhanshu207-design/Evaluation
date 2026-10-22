import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Play, Award } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import ProgressBar from '../components/common/ProgressBar';
import EmptyState from '../components/common/EmptyState';
import CertificateModal from '../components/certificate/CertificateModal';
import './MyLearningPage.css';

export default function MyLearningPage() {
  const { enrolledCourses } = useCourses();
  const [activeTab, setActiveTab] = useState('in-progress'); // 'in-progress' | 'completed' | 'all'
  const [selectedCertCourse, setSelectedCertCourse] = useState(null);
  const navigate = useNavigate();

  const inProgressCourses = enrolledCourses.filter((c) => !c.stats.isCompleted);
  const completedCourses = enrolledCourses.filter((c) => c.stats.isCompleted);

  const displayedCourses =
    activeTab === 'in-progress'
      ? inProgressCourses
      : activeTab === 'completed'
      ? completedCourses
      : enrolledCourses;

  return (
    <div className="my-learning-container">
      {/* Header Banner */}
      <div className="glass-panel page-banner">
        <div className="page-tag">
          <GraduationCap size={20} color="var(--primary-purple)" />
          <span>My Enrolled Curriculum</span>
        </div>

        <h1 className="page-title">
          My Learning Workspace
        </h1>

        <p className="page-subtitle">
          Track your course completion rate, jump back into your current lesson, and claim your certificates as you finish each path.
        </p>

        {/* Tab Filters */}
        <div className="my-learning-tabs">
          {[
            { id: 'in-progress', label: `In Progress (${inProgressCourses.length})` },
            { id: 'completed', label: `Completed (${completedCourses.length})` },
            { id: 'all', label: `All Enrolled (${enrolledCourses.length})` }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`my-learning-tab-btn ${isSelected ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      {displayedCourses.length === 0 ? (
        <EmptyState
          title={activeTab === 'completed' ? 'No completed courses yet' : 'No courses in this section'}
          description="Continue your active lessons or browse our catalog to start learning new disciplines."
          actionText="Browse Courses"
          actionLink="/courses"
        />
      ) : (
        <div className="courses-grid">
          {displayedCourses.map((course) => {
            const stats = course.stats;
            const remaining = stats.totalLessons - stats.completedLessons;

            return (
              <div
                key={course.id}
                className="glass-panel glass-panel-hover my-learning-card"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="my-learning-thumb-wrap">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="my-learning-thumb"
                    />
                    <div className="my-learning-thumb-overlay" />
                    <span className="my-learning-category-tag">
                      {course.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="my-learning-card-body">
                    <h3 className="my-learning-course-title">
                      {course.title}
                    </h3>

                    <div className="my-learning-instructor">
                      Instructor: {course.instructor.name}
                    </div>

                    <div className="my-learning-progress-row">
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {stats.completedLessons} of {stats.totalLessons} lessons completed
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: stats.isCompleted ? 'var(--emerald-accent)' : 'var(--cyan-accent)'
                        }}
                      >
                        {stats.progress}%
                      </span>
                    </div>

                    <ProgressBar
                      progress={stats.progress}
                      height={7}
                      colorGradient={
                        stats.isCompleted
                          ? 'linear-gradient(90deg, #10B981, #34D399)'
                          : 'linear-gradient(90deg, #8B5CF6, #22D3EE)'
                      }
                    />

                    <div className="my-learning-meta-row">
                      <span>{remaining > 0 ? `${remaining} lessons remaining` : 'Course Completed!'}</span>
                      <span>Total: {course.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="my-learning-actions">
                  <button
                    onClick={() => navigate(`/learn/${course.id}`)}
                    className="gradient-border-btn"
                    style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: '0.88rem' }}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>{stats.isCompleted ? 'Review Lectures' : 'Continue Learning'}</span>
                  </button>

                  {stats.isCompleted && (
                    <button
                      onClick={() => setSelectedCertCourse(course)}
                      className="glass-btn"
                      style={{
                        padding: '9px 12px',
                        fontSize: '0.88rem',
                        borderColor: '#FBBF24',
                        color: '#FBBF24'
                      }}
                      title="View Certificate of Completion"
                    >
                      <Award size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertCourse && (
        <CertificateModal
          isOpen={!!selectedCertCourse}
          onClose={() => setSelectedCertCourse(null)}
          course={selectedCertCourse}
        />
      )}
    </div>
  );
}
