import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  FileCheck2,
  HelpCircle,
  Clock,
  Flame,
  ArrowRight,
  Quote,
  CalendarCheck,
  Play,
  Timer,
  Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { useLanguage } from '../context/LanguageContext';
import { DEMO_ANALYTICS } from '../data/demoAnalytics';
import { DEMO_ASSIGNMENTS } from '../data/demoAssignments';
import { DEMO_QUIZZES } from '../data/demoQuizzes';
import { DEMO_PLANNER_TASKS } from '../data/demoPlanner';
import { getStoredData, STORAGE_KEYS } from '../utils/storage';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { courses, getCourseStats, isEnrolled } = useCourses();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [quoteIdx, setQuoteIdx] = useState(0);
  const quotes = DEMO_ANALYTICS.motivationalQuotes;

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % quotes.length);
  };

  // Continue Learning Courses (Enrolled courses)
  const continueCourses = useMemo(() => {
    return courses
      .filter(c => isEnrolled(c.id))
      .slice(0, 5)
      .map(c => ({
        ...c,
        stats: getCourseStats(c.id)
      }));
  }, [courses, isEnrolled, getCourseStats]);

  // Overall progress calculation across enrolled courses
  const { overallPercentage, totalLessons, completedLessons } = useMemo(() => {
    const total = continueCourses.reduce((sum, c) => sum + (c.stats?.totalLessons || 0), 0);
    const completed = continueCourses.reduce((sum, c) => sum + (c.stats?.completedLessons || 0), 0);
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { overallPercentage: pct, totalLessons: total, completedLessons: completed };
  }, [continueCourses]);

  // Stored assignments & quizzes
  const storedAssignments = useMemo(() => {
    return getStoredData(STORAGE_KEYS.ASSIGNMENTS, DEMO_ASSIGNMENTS);
  }, []);

  const storedQuizzes = useMemo(() => {
    return getStoredData(STORAGE_KEYS.QUIZZES, DEMO_QUIZZES);
  }, []);

  const pendingAssignmentsCount = useMemo(() => {
    return Array.isArray(storedAssignments)
      ? storedAssignments.filter(a => a.status === 'Pending' || a.status === 'In Progress').length
      : 0;
  }, [storedAssignments]);

  const pendingQuizzesCount = useMemo(() => {
    return Array.isArray(storedQuizzes)
      ? storedQuizzes.filter(q => !q.completed).length
      : 0;
  }, [storedQuizzes]);

  const avgQuizScore = useMemo(() => {
    if (!Array.isArray(storedQuizzes)) return 84;
    const completed = storedQuizzes.filter(q => q.completed && typeof q.score === 'number');
    if (completed.length === 0) return 84;
    const sum = completed.reduce((acc, q) => acc + q.score, 0);
    return Math.round(sum / completed.length);
  }, [storedQuizzes]);

  const pendingAssignmentsList = useMemo(() => {
    return Array.isArray(storedAssignments)
      ? storedAssignments.filter(a => a.status === 'Pending' || a.status === 'In Progress').slice(0, 3)
      : [];
  }, [storedAssignments]);

  const upcomingTasks = DEMO_PLANNER_TASKS.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <div className="glass-panel dashboard-banner">
        {/* Glow backdrop */}
        <div className="dashboard-banner-glow" />

        <div className="dashboard-banner-content">
          <div className="dashboard-banner-tag">
            <span>{t("academicSemester", "ACADEMIC SEMESTER AUTUMN 2026")}</span>
          </div>

          <h1 className="dashboard-banner-title">
            {t("goodMorning", "Good Morning")}, {user?.name?.split(' ')[0] || "Vibhanshu"} 👋
          </h1>

          <p className="dashboard-banner-subtitle">
            Ready to continue your learning journey? Track lessons, master new skills, and earn certificates.
          </p>

          {/* Motivational Quote pill */}
          <div
            onClick={nextQuote}
            className="dashboard-quote-pill"
            title="Click to see another motivational quote"
          >
            <Quote size={15} color="var(--electric-violet)" />
            <span className="dashboard-quote-text">
              "{quotes[quoteIdx].text}"
            </span>
            <span className="dashboard-quote-author">
              — {quotes[quoteIdx].author}
            </span>
          </div>
        </div>

        {/* 7-Day Streak Card */}
        <div className="dashboard-streak-card">
          <div className="dashboard-streak-header">
            <div className="dashboard-streak-label">
              <Flame size={22} fill="#FBBF24" color="#FBBF24" />
              <span className="dashboard-streak-title">
                {user?.streak || 7} Day Streak!
              </span>
            </div>
            <span className="dashboard-streak-status">Active</span>
          </div>

          {/* Streak Days Row */}
          <div className="dashboard-streak-days">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={i}
                className="dashboard-streak-day-badge"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6 Dynamic Dashboard Widgets */}
      <div className="dashboard-widgets-grid">
        <StatCard
          title={t("overallProgress", "Overall Progress")}
          value={`${overallPercentage}%`}
          subtext={totalLessons > 0 ? `${completedLessons} / ${totalLessons} lessons done` : 'Enroll in courses to begin'}
          isCircular={true}
          circularProgress={overallPercentage}
          colorTheme="purple"
        />

        <StatCard
          title={t("activeCourses", "Active Courses")}
          value={`${continueCourses.length} Active`}
          subtext={`${continueCourses.length} enrolled in curriculum`}
          icon={GraduationCap}
          colorTheme="cyan"
          badge="+2 this term"
          badgeType="positive"
        />

        <StatCard
          title={t("assignments", "Assignments")}
          value={`${pendingAssignmentsCount} Pending`}
          subtext={pendingAssignmentsCount > 0 ? "Next due: Tomorrow" : "All caught up!"}
          icon={FileCheck2}
          colorTheme="pink"
          badge={pendingAssignmentsCount > 0 ? "Action required" : "Complete"}
          badgeType={pendingAssignmentsCount > 0 ? "warning" : "positive"}
        />

        <StatCard
          title={t("quizzes", "Quizzes")}
          value={`${pendingQuizzesCount} Upcoming`}
          subtext={`Avg score: ${avgQuizScore}%`}
          icon={HelpCircle}
          colorTheme="amber"
          badge="Top 5%"
          badgeType="positive"
        />

        <StatCard
          title={t("learningHours", "Learning Hours")}
          value={`${user?.totalLearningHours || 28.5} hrs`}
          subtext="Logged this month"
          icon={Clock}
          colorTheme="emerald"
          badge="+4.2h this week"
          badgeType="positive"
        />

        <StatCard
          title={t("currentStreak", "Current Streak")}
          value={`${user?.streak || 7} Days`}
          subtext="Personal record: 14d"
          icon={Flame}
          colorTheme="amber"
          badge="🔥 Hot"
          badgeType="positive"
        />
      </div>

      {/* 🚀 Next-Gen Feature Launchpad */}
      <div className="dashboard-launchpad-grid">
        {/* Card 1: Study Planner & Notes */}
        <Link
          to="/planner"
          className="glass-panel dashboard-launchpad-card card-ai"
        >
          <div className="dashboard-launchpad-top">
            <div className="dashboard-launchpad-icon icon-ai">
              <CalendarCheck size={22} />
            </div>
            <span className="dashboard-launchpad-badge badge-ai">
              SCHEDULE
            </span>
          </div>
          <div>
            <h3 className="dashboard-launchpad-title">Study Planner & Schedule</h3>
            <p className="dashboard-launchpad-desc">
              Organize daily milestones, schedule study blocks, and keep exam preparation on track.
            </p>
          </div>
          <div className="dashboard-launchpad-cta cta-ai">
            <span>Open Study Planner</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        {/* Card 2: Focus Room & Pomodoro */}
        <Link
          to="/focus-room"
          className="glass-panel dashboard-launchpad-card card-focus"
        >
          <div className="dashboard-launchpad-top">
            <div className="dashboard-launchpad-icon icon-focus">
              <Timer size={22} />
            </div>
            <span className="dashboard-launchpad-badge badge-focus">
              ZEN MODE
            </span>
          </div>
          <div>
            <h3 className="dashboard-launchpad-title">Focus Room & Pomodoro</h3>
            <p className="dashboard-launchpad-desc">
              Distraction-free environment with ambient audio, study goals, and +50 XP per cycle.
            </p>
          </div>
          <div className="dashboard-launchpad-cta cta-focus">
            <span>Enter Focus Sanctuary</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        {/* Card 3: Smart Learning & Flashcards */}
        <Link
          to="/smart-learning"
          className="glass-panel dashboard-launchpad-card card-smart"
        >
          <div className="dashboard-launchpad-top">
            <div className="dashboard-launchpad-icon icon-smart">
              <Brain size={22} />
            </div>
            <span className="dashboard-launchpad-badge badge-smart">
              ADAPTIVE
            </span>
          </div>
          <div>
            <h3 className="dashboard-launchpad-title">Smart Learning Hub</h3>
            <p className="dashboard-launchpad-desc">
              3D spaced-repetition flashcards, weak-topic scanner, and personalized path.
            </p>
          </div>
          <div className="dashboard-launchpad-cta cta-smart">
            <span>Explore Adaptive Hub</span>
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>

      {/* Horizontal Section: Continue Learning */}
      <div>
        <div className="dashboard-section-header">
          <div className="dashboard-section-title-wrap">
            <div className="dashboard-section-dot" />
            <h2 className="dashboard-section-title">{t("continueLearning", "Continue Learning")}</h2>
          </div>

          <Link to="/my-learning" className="dashboard-section-link">
            <span>{t("viewAll", "View All")}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal Scroll Grid of Courses */}
        {continueCourses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>
              You haven't enrolled in any courses yet. Browse our course catalog to start learning!
            </p>
            <Link to="/courses" className="gradient-border-btn" style={{ display: 'inline-flex', padding: '9px 20px' }}>
              <span>Explore Courses</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="dashboard-continue-grid">
            {continueCourses.map((course) => {
              const stats = course.stats;
              const remainingLessons = stats.totalLessons - stats.completedLessons;

              return (
                <div
                  key={course.id}
                  className="glass-panel glass-panel-hover dashboard-continue-card"
                >
                  <div>
                    <div className="dashboard-continue-card-top">
                      <span className="dashboard-continue-category">
                        {course.category}
                      </span>

                      <span
                        className="dashboard-continue-percent"
                        style={{
                          color: stats.isCompleted ? 'var(--emerald-accent)' : 'var(--cyan-accent)'
                        }}
                      >
                        {stats.progress}%
                      </span>
                    </div>

                    <h3 className="dashboard-continue-title">
                      {course.title}
                    </h3>

                    <div className="dashboard-continue-instructor">
                      Instructor: {course.instructor.name}
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

                    <div className="dashboard-continue-meta">
                      <span>{remainingLessons > 0 ? `${remainingLessons} lessons left` : 'Completed ✓'}</span>
                      <span>{stats.completedLessons}/{stats.totalLessons}</span>
                    </div>
                  </div>

                  <div className="dashboard-continue-action">
                    <button
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="gradient-border-btn dashboard-continue-btn"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>{stats.isCompleted ? 'Review Lectures' : 'Continue'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Column Bottom Grid: Upcoming Deadlines & Recent Notices */}
      <div className="dashboard-bottom-grid">
        {/* Pending Assignments & Deadlines */}
        <div className="glass-panel dashboard-panel-card">
          <div className="dashboard-panel-header">
            <div className="dashboard-panel-title-wrap">
              <FileCheck2 size={18} color="var(--primary-purple)" />
              <h3 className="dashboard-panel-title">{t("upcomingAssignments", "Upcoming Assignments")}</h3>
            </div>
            <Link to="/assignments" className="dashboard-panel-link">
              All ({storedAssignments.length})
            </Link>
          </div>

          <div className="dashboard-list">
            {pendingAssignmentsList.map((asg) => (
              <div key={asg.id} className="dashboard-list-item">
                <div>
                  <div className="dashboard-item-title">
                    {asg.title}
                  </div>
                  <div className="dashboard-item-meta">
                    {asg.courseName} • Due: <span style={{ color: 'var(--rose-accent)' }}>{asg.dueDate}</span>
                  </div>
                </div>

                <Link
                  to="/assignments"
                  className="glass-btn"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  Submit
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Study Planner Tasks */}
        <div className="glass-panel dashboard-panel-card">
          <div className="dashboard-panel-header">
            <div className="dashboard-panel-title-wrap">
              <CalendarCheck size={18} color="var(--cyan-accent)" />
              <h3 className="dashboard-panel-title">{t("smartStudySchedule", "Smart Study Schedule")}</h3>
            </div>
            <Link to="/planner" className="dashboard-panel-link">
              Planner →
            </Link>
          </div>

          <div className="dashboard-list">
            {upcomingTasks.map((t) => (
              <div key={t.id} className="dashboard-list-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className="dashboard-planner-dot"
                    style={{
                      backgroundColor:
                        t.priority === 'High'
                          ? '#EF4444'
                          : t.priority === 'Medium'
                          ? '#F59E0B'
                          : '#10B981'
                    }}
                  />
                  <div>
                    <div className="dashboard-item-title">
                      {t.title}
                    </div>
                    <div className="dashboard-item-meta">
                      {t.subject} • {t.date} at {t.time}
                    </div>
                  </div>
                </div>

                <span
                  className="dashboard-priority-badge"
                  style={{
                    backgroundColor:
                      t.priority === 'High'
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(245, 158, 11, 0.15)',
                    color: t.priority === 'High' ? '#EF4444' : '#F59E0B'
                  }}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
