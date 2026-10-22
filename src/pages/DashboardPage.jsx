import React, { useState } from 'react';
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
  Brain,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { DEMO_ANALYTICS } from '../data/demoAnalytics';
import { DEMO_ASSIGNMENTS } from '../data/demoAssignments';
import { DEMO_PLANNER_TASKS } from '../data/demoPlanner';
import StatCard from '../components/common/StatCard';
import ProgressBar from '../components/common/ProgressBar';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { courses, getCourseStats } = useCourses();
  const navigate = useNavigate();

  const [quoteIdx, setQuoteIdx] = useState(0);
  const quotes = DEMO_ANALYTICS.motivationalQuotes;

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % quotes.length);
  };

  // Continue Learning Courses (Enrolled courses)
  const continueCourses = courses.slice(0, 5).map(c => ({
    ...c,
    stats: getCourseStats(c.id)
  }));

  const pendingAssignments = DEMO_ASSIGNMENTS.filter(a => a.status === 'Pending').slice(0, 3);
  const upcomingTasks = DEMO_PLANNER_TASKS.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <div className="glass-panel dashboard-banner">
        {/* Glow backdrop */}
        <div className="dashboard-banner-glow" />

        <div className="dashboard-banner-content">
          <div className="dashboard-banner-tag">
            <span>ACADEMIC SEMESTER AUTUMN 2026</span>
          </div>

          <h1 className="dashboard-banner-title">
            Good Morning, {user?.name?.split(' ')[0] || 'Vibhanshu'} 👋
          </h1>

          <p className="dashboard-banner-subtitle">
            Ready to continue your learning journey? 14 lessons left across your curriculum.
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
                7 Day Streak!
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

      {/* 6 Dashboard Widgets */}
      <div className="dashboard-widgets-grid">
        <StatCard
          title="Overall Progress"
          value="72%"
          subtext="18 / 25 modules done"
          isCircular={true}
          circularProgress={72}
          colorTheme="purple"
        />

        <StatCard
          title="Active Courses"
          value="6 Active"
          subtext="Enrolled & registered"
          icon={GraduationCap}
          colorTheme="cyan"
          badge="+2 this term"
          badgeType="positive"
        />

        <StatCard
          title="Assignments"
          value="4 Pending"
          subtext="Next due: Tomorrow"
          icon={FileCheck2}
          colorTheme="pink"
          badge="Action required"
          badgeType="warning"
        />

        <StatCard
          title="Quizzes"
          value="2 Upcoming"
          subtext="Avg score: 84%"
          icon={HelpCircle}
          colorTheme="amber"
          badge="Top 5%"
          badgeType="positive"
        />

        <StatCard
          title="Learning Hours"
          value="28.5 hrs"
          subtext="Logged this month"
          icon={Clock}
          colorTheme="emerald"
          badge="+4.2h this week"
          badgeType="positive"
        />

        <StatCard
          title="Current Streak"
          value="7 Days"
          subtext="Personal record: 14d"
          icon={Flame}
          colorTheme="amber"
          badge="🔥 Hot"
          badgeType="positive"
        />
      </div>

      {/* 🚀 Next-Gen Feature Launchpad */}
      <div className="dashboard-launchpad-grid">
        {/* Card 1: AI Assistant */}
        <div
          onClick={() => {
            const btn = document.getElementById('floating-ai-button');
            if (btn) btn.click();
          }}
          className="glass-panel dashboard-launchpad-card card-ai"
        >
          <div className="dashboard-launchpad-top">
            <div className="dashboard-launchpad-icon icon-ai">
              <Bot size={22} />
            </div>
            <span className="dashboard-launchpad-badge badge-ai">
              AI READY
            </span>
          </div>
          <div>
            <h3 className="dashboard-launchpad-title">LearnSphere AI Tutor</h3>
            <p className="dashboard-launchpad-desc">
              Explain topics, summarize lessons, auto-generate quizzes and notes on demand.
            </p>
          </div>
          <div className="dashboard-launchpad-cta cta-ai">
            <span>Launch AI Assistant (Ctrl + J)</span>
            <ArrowRight size={14} />
          </div>
        </div>

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
            <h2 className="dashboard-section-title">Continue Learning</h2>
          </div>

          <Link to="/my-learning" className="dashboard-section-link">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Horizontal Scroll Grid of Courses */}
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
      </div>

      {/* Two Column Bottom Grid: Upcoming Deadlines & Recent Notices */}
      <div className="dashboard-bottom-grid">
        {/* Pending Assignments & Deadlines */}
        <div className="glass-panel dashboard-panel-card">
          <div className="dashboard-panel-header">
            <div className="dashboard-panel-title-wrap">
              <FileCheck2 size={18} color="var(--primary-purple)" />
              <h3 className="dashboard-panel-title">Upcoming Assignments</h3>
            </div>
            <Link to="/assignments" className="dashboard-panel-link">
              All ({DEMO_ASSIGNMENTS.length})
            </Link>
          </div>

          <div className="dashboard-list">
            {pendingAssignments.map((asg) => (
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
              <h3 className="dashboard-panel-title">Smart Study Schedule</h3>
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
