import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Play,
  Bookmark,
  Clock,
  Search,
  ListVideo,
  Award,
  Sparkles,
  FileEdit,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCourses } from '../context/CourseContext';
import { DEMO_COURSES } from '../data/demoCourses';
import YouTubePlayer from '../components/classroom/YouTubePlayer';
import CompletionModal from '../components/classroom/CompletionModal';
import CertificateModal from '../components/certificate/CertificateModal';
import ProgressBar from '../components/common/ProgressBar';
import { sound } from '../utils/sound';
import './ClassroomPage.css';

export default function ClassroomPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const {
    courses,
    findCourse,
    isEnrolled,
    enrollCourse,
    markLessonComplete,
    getCourseStats,
    getNextLesson,
    getPrevLesson,
    toggleBookmark,
    isBookmarked,
    toggleWatchLater,
    isWatchLater
  } = useCourses();

  // Find course from context or fall back to DEMO_COURSES
  const course = (findCourse ? findCourse(courseId) : null) ||
    courses.find((c) => c.id === courseId || (c.slug && c.slug === courseId)) ||
    DEMO_COURSES.find((c) => c.id === courseId || (c.slug && c.slug === courseId)) ||
    null;

  // Auto-enroll when entering classroom
  useEffect(() => {
    if (course && !isEnrolled(course.id)) {
      enrollCourse(course.id);
    }
  }, [course?.id, isEnrolled, enrollCourse]);

  // Ensure modules are always available with fallback to demo curriculum
  const courseModules = (Array.isArray(course?.modules) && course.modules.length > 0)
    ? course.modules
    : (DEMO_COURSES.find((c) => c.id === course?.id)?.modules || []);

  // Flatten all lessons to locate current lesson
  const allLessons = [];
  courseModules.forEach((mod) => {
    if (Array.isArray(mod.lessons)) {
      mod.lessons.forEach((l) => {
        allLessons.push({ ...l, moduleId: mod.id, moduleTitle: mod.title });
      });
    }
  });

  // Track user-selected lesson within this session
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // Synchronously resolve active lesson: URL param > user click > first incomplete > first lesson
  const targetLessonId = lessonId || selectedLessonId;
  const activeLesson = (targetLessonId && allLessons.find((l) => l.id === targetLessonId)) ||
    allLessons.find((l) => !l.completed) ||
    allLessons[0] ||
    null;

  const [searchLessonQuery, setSearchLessonQuery] = useState('');
  const [playlistMode, setPlaylistMode] = useState(true);
  const [autoNextPrompt, setAutoNextPrompt] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [notesList, setNotesList] = useState([]);
  const [expandedModules, setExpandedModules] = useState({
    'mod-1': true,
    'mod-2': true,
    'mod-3': true,
    'react-mod-1': true,
    'react-mod-2': true,
    'react-mod-3': true,
    'dsa-mod-1': true,
    'dsa-mod-2': true,
    'py-mod-1': true,
    'py-mod-2': true,
    'db-mod-1': true,
    'db-mod-2': true,
    'web-mod-1': true,
    'web-mod-2': true
  });

  // If course does not exist, display helpful 404
  if (!course) {
    return (
      <div className="classroom-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '40px auto', padding: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Course Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            The requested course could not be found or may have been removed.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="gradient-border-btn"
            style={{ margin: '0 auto' }}
          >
            <span>Browse All Courses</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // If course legitimately has no lessons, display empty state
  if (allLessons.length === 0 || !activeLesson) {
    return (
      <div className="classroom-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="glass-panel" style={{ maxWidth: '520px', margin: '40px auto', padding: '40px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--primary-purple)'
            }}
          >
            <ListVideo size={26} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '10px' }}>No Lessons Available</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6' }}>
            There are currently no lessons published for <strong>{course.title}</strong>. Please explore our other active courses.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/courses" className="gradient-border-btn" style={{ padding: '9px 18px' }}>
              <span>Browse Courses</span>
              <ArrowRight size={15} />
            </Link>
            <Link to={`/courses/${course.id}`} className="glass-btn" style={{ padding: '9px 16px' }}>
              <span>Course Details</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stats = getCourseStats(course.id);
  const nextLesson = getNextLesson(course.id, activeLesson.id);
  const prevLesson = getPrevLesson(course.id, activeLesson.id);

  const toggleModule = (modId) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLessonId(lesson.id);
    setAutoNextPrompt(null);
    sound.playClick();
  };

  // Mark lesson as complete
  const handleToggleComplete = () => {
    if (!activeLesson) return;
    const isNowComplete = !activeLesson.completed;
    const { newlyFinishedCourse } = markLessonComplete(course.id, activeLesson.id, isNowComplete);

    if (isNowComplete) {
      if (newlyFinishedCourse) {
        setShowCompletionModal(true);
      } else if (nextLesson) {
        setAutoNextPrompt(nextLesson);
      }
    }
  };

  // Add quick note
  const handleSaveNote = () => {
    if (!quickNote.trim() || !activeLesson) return;
    setNotesList((prev) => [
      {
        id: Date.now(),
        lessonTitle: activeLesson.title,
        text: quickNote,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);
    setQuickNote('');
    sound.playClick();
  };

  // Filter lessons for sidebar search
  const filteredModules = courseModules.map((mod) => ({
    ...mod,
    lessons: (mod.lessons || []).filter((l) =>
      l.title.toLowerCase().includes(searchLessonQuery.toLowerCase()) ||
      mod.title.toLowerCase().includes(searchLessonQuery.toLowerCase())
    )
  }));

  return (
    <div className="classroom-container">
      {/* Top Breadcrumb & Status Bar */}
      <div className="classroom-top-bar">
        <div className="classroom-top-title-wrap">
          <Link
            to={`/courses/${course.id}`}
            className="glass-btn"
            style={{ padding: '7px 14px', fontSize: '0.84rem' }}
          >
            <ArrowLeft size={15} />
            <span>Course Details</span>
          </Link>

          <div>
            <div className="classroom-course-tag">
              {course.title}
            </div>
            <h1 className="classroom-lesson-title">
              {activeLesson.title}
            </h1>
          </div>
        </div>

        {/* Course Progress & Certificate Link */}
        <div className="classroom-top-progress">
          <div className="classroom-progress-label">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Course Progress:
            </span>
            <span style={{ fontWeight: 800, color: stats.isCompleted ? 'var(--emerald-accent)' : 'var(--cyan-accent)' }}>
              {stats.progress}%
            </span>
          </div>

          {stats.isCompleted ? (
            <button
              onClick={() => setShowCertificateModal(true)}
              className="gradient-border-btn classroom-cert-unlocked-btn"
            >
              <Award size={15} />
              <span>Certificate Unlocked 🎓</span>
            </button>
          ) : (
            <span className="classroom-lessons-done-pill">
              {stats.completedLessons}/{stats.totalLessons} Lessons Done
            </span>
          )}
        </div>
      </div>

      {/* Main 3-Column Learning Environment */}
      <div className="classroom-grid">
        {/* LEFT COLUMN: Course Modules & Lessons */}
        <div className="glass-panel classroom-sidebar">
          {/* Header & Playlist Mode */}
          <div className="classroom-sidebar-header">
            <div className="classroom-sidebar-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.94rem' }}>
                <ListVideo size={17} color="var(--primary-purple)" />
                <span>Curriculum Modules</span>
              </div>

              <button
                onClick={() => setPlaylistMode(!playlistMode)}
                className={`classroom-playlist-toggle ${playlistMode ? 'active' : ''}`}
                title="When playlist mode is active, videos autoplay next in sequence"
              >
                🎬 Playlist Mode {playlistMode ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Search Lessons Bar */}
            <div className="classroom-search-input-wrap">
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchLessonQuery}
                onChange={(e) => setSearchLessonQuery(e.target.value)}
                className="classroom-search-input"
              />
            </div>
          </div>

          {/* Modules Accordion List */}
          <div className="classroom-modules-scroll">
            {filteredModules.map((mod) => {
              const isExpanded = !!expandedModules[mod.id];
              return (
                <div key={mod.id} style={{ marginBottom: '8px' }}>
                  <div
                    onClick={() => toggleModule(mod.id)}
                    className="classroom-module-heading"
                  >
                    <span>{mod.title}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {(mod.lessons || []).map((lesson) => {
                        const isCurrent = lesson.id === activeLesson.id;
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => handleSelectLesson(lesson)}
                            className={`classroom-lesson-item ${isCurrent ? 'active' : ''}`}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                              {lesson.completed ? (
                                <CheckCircle2 size={16} color="var(--emerald-accent)" style={{ flexShrink: 0 }} />
                              ) : isCurrent ? (
                                <Play size={14} fill="var(--cyan-accent)" color="var(--cyan-accent)" style={{ flexShrink: 0 }} />
                              ) : (
                                <Circle size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                              )}

                              <span
                                className="classroom-lesson-title-text"
                                style={{
                                  fontWeight: isCurrent ? 700 : 500,
                                  color: isCurrent ? '#FFFFFF' : 'var(--text-secondary)'
                                }}
                              >
                                {lesson.title}
                              </span>
                            </div>

                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                              {lesson.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: YouTube Player & Controls */}
        <div className="classroom-center-column">
          {/* Dedicated YouTube Player Frame */}
          <YouTubePlayer
            videoId={activeLesson.videoId}
            title={activeLesson.title}
            onEnded={() => {
              handleToggleComplete();
            }}
          />

          {/* Auto-Next Dialog / Celebration Overlay */}
          {autoNextPrompt && (
            <div className="glass-panel animate-modal-pop classroom-auto-next-prompt">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(52, 211, 153, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--emerald-accent)'
                  }}
                >
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--emerald-accent)' }}>
                    ✓ Lesson Completed! Great job! 🎉
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Next lesson: <strong>"{autoNextPrompt.title}"</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleSelectLesson(autoNextPrompt)}
                  className="gradient-border-btn"
                  style={{ padding: '7px 16px', fontSize: '0.84rem' }}
                >
                  <span>Continue Learning →</span>
                </button>
                <button
                  onClick={() => setAutoNextPrompt(null)}
                  className="glass-btn"
                  style={{ padding: '7px 12px', fontSize: '0.84rem' }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Video Control Bar: Prev, Mark Complete, Next & Bookmarks */}
          <div className="glass-panel classroom-video-controls">
            {/* Left Action Toggles */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => toggleBookmark(activeLesson.id)}
                className="glass-btn"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  borderColor: isBookmarked(activeLesson.id) ? 'var(--cyan-accent)' : 'var(--card-border)',
                  color: isBookmarked(activeLesson.id) ? 'var(--cyan-accent)' : 'var(--text-secondary)'
                }}
              >
                <Bookmark size={15} fill={isBookmarked(activeLesson.id) ? 'currentColor' : 'none'} />
                <span>{isBookmarked(activeLesson.id) ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <button
                onClick={() => toggleWatchLater(activeLesson.id)}
                className="glass-btn"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  borderColor: isWatchLater(activeLesson.id) ? 'var(--pink-accent)' : 'var(--card-border)',
                  color: isWatchLater(activeLesson.id) ? 'var(--pink-accent)' : 'var(--text-secondary)'
                }}
              >
                <Clock size={15} />
                <span>{isWatchLater(activeLesson.id) ? 'In Watch Later' : 'Watch Later'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  const btn = document.getElementById('floating-ai-button');
                  if (btn) btn.click();
                }}
                className="glass-btn"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.82rem',
                  borderColor: 'rgba(167, 139, 250, 0.4)',
                  color: 'var(--cyan-accent)'
                }}
                title="Ask LearnSphere AI about this lesson"
              >
                <Sparkles size={15} />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Navigation & Completion Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => prevLesson && handleSelectLesson(prevLesson)}
                disabled={!prevLesson}
                className="glass-btn"
                style={{ padding: '8px 14px', fontSize: '0.84rem', opacity: !prevLesson ? 0.4 : 1 }}
              >
                <ArrowLeft size={14} />
                <span>Previous</span>
              </button>

              <button
                onClick={handleToggleComplete}
                className={activeLesson.completed ? 'glass-btn' : 'gradient-border-btn'}
                style={{
                  padding: '8px 18px',
                  fontSize: '0.86rem',
                  backgroundColor: activeLesson.completed ? 'rgba(52, 211, 153, 0.15)' : undefined,
                  borderColor: activeLesson.completed ? 'var(--emerald-accent)' : undefined,
                  color: activeLesson.completed ? 'var(--emerald-accent)' : undefined
                }}
              >
                <CheckCircle2 size={16} />
                <span>{activeLesson.completed ? 'Completed ✓' : 'Mark as Complete'}</span>
              </button>

              <button
                onClick={() => nextLesson && handleSelectLesson(nextLesson)}
                disabled={!nextLesson}
                className="glass-btn"
                style={{ padding: '8px 14px', fontSize: '0.84rem', opacity: !nextLesson ? 0.4 : 1 }}
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Lesson Details & Description */}
          <div className="glass-panel classroom-about-panel">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
              About this lesson
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.94rem', marginBottom: '16px' }}>
              {activeLesson.description}
            </p>

            <div className="classroom-about-meta">
              <span>Module: <strong style={{ color: 'var(--text-primary)' }}>{activeLesson.moduleTitle}</strong></span>
              <span>Estimated Duration: <strong style={{ color: 'var(--text-primary)' }}>{activeLesson.duration}</strong></span>
              <span>Platform: <strong style={{ color: 'var(--text-primary)' }}>YouTube Embed Stream</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Course Progress Panel & In-Video Note Taker */}
        <div className="classroom-right-column">
          {/* Course Progress Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px' }}>
              Course Analytics
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Mastery Level</span>
                <span style={{ fontWeight: 800, color: stats.isCompleted ? 'var(--emerald-accent)' : 'var(--cyan-accent)' }}>
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
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Lessons Completed:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{stats.completedLessons} / {stats.totalLessons}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Study Time:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{course.duration}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Course Quiz:</span>
                <Link to="/quizzes" style={{ color: 'var(--cyan-accent)', fontWeight: 600 }}>
                  Take Quiz →
                </Link>
              </div>
            </div>

            {/* Certificate Status Box */}
            <div
              className="classroom-cert-box"
              style={{
                backgroundColor: stats.isCompleted ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${stats.isCompleted ? 'rgba(245, 158, 11, 0.35)' : 'var(--card-border)'}`
              }}
            >
              <Award size={20} color={stats.isCompleted ? '#FBBF24' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: stats.isCompleted ? '#FBBF24' : 'var(--text-secondary)' }}>
                  {stats.isCompleted ? 'Certificate Ready! 🎓' : 'Certificate Locked'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {stats.isCompleted ? 'Click below to view' : 'Complete 100% to unlock'}
                </div>
              </div>
            </div>

            {stats.isCompleted && (
              <button
                onClick={() => setShowCertificateModal(true)}
                className="gradient-border-btn"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px', padding: '8px', fontSize: '0.84rem' }}
              >
                <span>View Certificate</span>
                <Award size={14} />
              </button>
            )}
          </div>

          {/* Quick Note Taker Card */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FileEdit size={16} color="var(--electric-violet)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Quick Study Notes</h3>
            </div>

            <textarea
              rows={3}
              placeholder="Jot down a key thought while watching..."
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              className="classroom-notes-textarea"
            />

            <button
              onClick={handleSaveNote}
              className="glass-btn"
              style={{ width: '100%', justifyContent: 'center', padding: '7px', fontSize: '0.82rem' }}
            >
              Save Note to Notebook
            </button>

            {/* Saved Notes Feed */}
            {notesList.length > 0 && (
              <div className="classroom-notes-feed">
                {notesList.map((n) => (
                  <div key={n.id} className="classroom-note-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cyan-accent)', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 600 }}>{n.lessonTitle.substring(0, 16)}...</span>
                      <span style={{ color: 'var(--text-muted)' }}>{n.time}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>{n.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Completion Modal */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        course={course}
        stats={stats}
        onOpenCertificate={() => setShowCertificateModal(true)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        course={course}
      />
    </div>
  );
}
