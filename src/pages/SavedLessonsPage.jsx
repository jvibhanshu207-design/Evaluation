import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Play, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import EmptyState from '../components/common/EmptyState';

export default function SavedLessonsPage() {
  const { courses, bookmarks, toggleBookmark, watchLater, toggleWatchLater } = useCourses();
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'watchLater'
  const navigate = useNavigate();

  // Find all lessons with their course metadata
  const allLessonsMap = [];
  courses.forEach((c) => {
    c.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        allLessonsMap.push({
          ...l,
          courseId: c.id,
          courseName: c.title,
          moduleTitle: m.title
        });
      });
    });
  });

  const bookmarkedLessons = allLessonsMap.filter((l) => bookmarks.includes(l.id));
  const watchLaterLessons = allLessonsMap.filter((l) => watchLater.includes(l.id));

  const currentList = activeTab === 'bookmarks' ? bookmarkedLessons : watchLaterLessons;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bookmark size={20} color="var(--cyan-accent)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase' }}>
            Personal Study Queue
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.3rem', fontWeight: 800 }}>
          Saved Lessons & Watch Later
        </h1>

        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', fontSize: '0.96rem' }}>
          Quickly access pinned video explanations, bookmarked reference code, and lessons saved for your next study session.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <button
            onClick={() => setActiveTab('bookmarks')}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'bookmarks' ? 700 : 500,
              backgroundColor: activeTab === 'bookmarks' ? 'rgba(34, 211, 238, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${activeTab === 'bookmarks' ? 'var(--cyan-accent)' : 'var(--card-border)'}`,
              color: activeTab === 'bookmarks' ? '#FFFFFF' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={15} />
            <span>Bookmarked Lessons ({bookmarkedLessons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('watchLater')}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '0.86rem',
              fontWeight: activeTab === 'watchLater' ? 700 : 500,
              backgroundColor: activeTab === 'watchLater' ? 'rgba(244, 114, 182, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${activeTab === 'watchLater' ? 'var(--pink-accent)' : 'var(--card-border)'}`,
              color: activeTab === 'watchLater' ? '#FFFFFF' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Clock size={15} />
            <span>Watch Later Queue ({watchLaterLessons.length})</span>
          </button>
        </div>
      </div>

      {/* Lessons List */}
      {currentList.length === 0 ? (
        <EmptyState
          title={`No ${activeTab === 'bookmarks' ? 'bookmarked' : 'watch later'} lessons`}
          description="While watching any lecture in the course classroom, click the Bookmark or Watch Later button to add videos to this queue."
          actionText="Explore Courses"
          actionLink="/courses"
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {currentList.map((lesson) => (
            <div
              key={lesson.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '190px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--electric-violet)', textTransform: 'uppercase' }}>
                    {lesson.courseName}
                  </span>

                  <button
                    onClick={() => {
                      if (activeTab === 'bookmarks') toggleBookmark(lesson.id);
                      else toggleWatchLater(lesson.id);
                    }}
                    style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Remove from list"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  {lesson.title}
                </h3>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  {lesson.moduleTitle}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Duration: {lesson.duration}
                </span>

                <Link
                  to={`/learn/${lesson.courseId}`}
                  className="gradient-border-btn"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Play size={13} fill="currentColor" />
                  <span>Watch Now</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
