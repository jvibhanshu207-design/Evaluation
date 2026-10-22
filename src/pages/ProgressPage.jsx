import React from 'react';
import {
  LineChart,
  TrendingUp,
  Target,
  Award,
  Calendar,
  BookOpen
} from 'lucide-react';
import { DEMO_ANALYTICS } from '../data/demoAnalytics';
import { useCourses } from '../context/CourseContext';
import ProgressBar from '../components/common/ProgressBar';
import './ProgressPage.css';

export default function ProgressPage() {
  const { enrolledCourses } = useCourses();
  const analytics = DEMO_ANALYTICS;

  const maxHours = Math.max(...analytics.weeklyActivity.map((d) => d.hours), 6);

  return (
    <div className="progress-container">
      {/* Header Banner */}
      <div className="glass-panel page-banner">
        <div className="page-tag">
          <LineChart size={20} color="var(--cyan-accent)" />
          <span>Academic Performance Analytics</span>
        </div>

        <h1 className="page-title">
          Learning Velocity & Analytics
        </h1>

        <p className="page-subtitle">
          Real-time metrics on your study habits, course completions, quiz accuracies, and consecutive streak consistency.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="progress-stats-grid">
        <div className="glass-panel progress-stat-card">
          <div className="progress-stat-label">
            Overall Curriculum
          </div>
          <div className="progress-stat-val" style={{ color: 'var(--electric-violet)' }}>
            {analytics.overallProgress}%
          </div>
          <div className="progress-stat-subtext" style={{ color: 'var(--emerald-accent)', fontWeight: 600 }}>
            ↑ 12% increase this month
          </div>
        </div>

        <div className="glass-panel progress-stat-card">
          <div className="progress-stat-label">
            Total Study Hours
          </div>
          <div className="progress-stat-val" style={{ color: 'var(--cyan-accent)' }}>
            {analytics.totalLearningHours} hrs
          </div>
          <div className="progress-stat-subtext" style={{ color: 'var(--text-secondary)' }}>
            Across 6 technological tracks
          </div>
        </div>

        <div className="glass-panel progress-stat-card">
          <div className="progress-stat-label">
            Quiz Accuracy
          </div>
          <div className="progress-stat-val" style={{ color: '#FBBF24' }}>
            {analytics.quizAccuracy.average}%
          </div>
          <div className="progress-stat-subtext" style={{ color: 'var(--text-secondary)' }}>
            Average across 5 exams
          </div>
        </div>

        <div className="glass-panel progress-stat-card">
          <div className="progress-stat-label">
            Learning Streak
          </div>
          <div className="progress-stat-val" style={{ color: 'var(--rose-accent)' }}>
            {analytics.streakDays} Days 🔥
          </div>
          <div className="progress-stat-subtext" style={{ color: 'var(--text-secondary)' }}>
            Consistency multiplier: 1.4x
          </div>
        </div>
      </div>

      {/* Two Column Section: Weekly Learning Activity Chart + Course Breakdown */}
      <div className="progress-charts-grid">
        {/* 📈 Weekly Learning Activity (Interactive SVG Bar Chart) */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--cyan-accent)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Weekly Learning Activity</h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
          </div>

          {/* Bar Chart Container */}
          <div className="progress-barchart-container">
            {analytics.weeklyActivity.map((day) => {
              const heightPct = (day.hours / maxHours) * 100;
              return (
                <div key={day.day} className="progress-bar-col">
                  <span className="progress-bar-val">
                    {day.hours}h
                  </span>

                  <div
                    className="progress-bar-fill"
                    style={{ height: `${heightPct}%` }}
                    title={`${day.day}: ${day.hours} hours, ${day.lessons} lessons`}
                  />

                  <span className="progress-bar-day">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Daily average: ~4.1 hours • Peak focus on Thursday
          </p>
        </div>

        {/* 📊 Course Progress Breakdown */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--primary-purple)" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Course Progress Breakdown</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {enrolledCourses.map((course) => (
              <div key={course.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{course.title}</span>
                  <span style={{ fontWeight: 800, color: course.stats.isCompleted ? 'var(--emerald-accent)' : 'var(--cyan-accent)' }}>
                    {course.stats.progress}%
                  </span>
                </div>
                <ProgressBar
                  progress={course.stats.progress}
                  height={7}
                  colorGradient={
                    course.stats.isCompleted
                      ? 'linear-gradient(90deg, #10B981, #34D399)'
                      : 'linear-gradient(90deg, #8B5CF6, #22D3EE)'
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🎯 Quiz Accuracy & 30-Day Activity Calendar Heatmap */}
      <div className="progress-charts-grid">
        {/* Quiz Accuracy List */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Target size={18} color="#FBBF24" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Quiz Subject Accuracy</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {analytics.quizAccuracy.categories.map((cat, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cat.name}</span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: cat.score >= 80 ? 'var(--emerald-accent)' : '#FBBF24'
                  }}
                >
                  {cat.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Activity Heatmap */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Calendar size={18} color="var(--emerald-accent)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>30-Day Study Consistency</h3>
          </div>

          {/* GitHub-style Heatmap Grid */}
          <div className="progress-heatmap-grid">
            {Array.from({ length: 30 }).map((_, idx) => {
              const isHigh = idx % 3 === 0;
              const isMedium = idx % 2 === 0;
              const bg =
                idx > 22
                  ? '#22D3EE'
                  : isHigh
                  ? '#8B5CF6'
                  : isMedium
                  ? 'rgba(139, 92, 246, 0.45)'
                  : 'rgba(255, 255, 255, 0.08)';

              return (
                <div
                  key={idx}
                  className="progress-heatmap-cell"
                  style={{
                    backgroundColor: bg,
                    boxShadow: idx > 22 ? '0 0 10px rgba(34, 211, 238, 0.5)' : 'none'
                  }}
                  title={`Day ${idx + 1}: ${idx > 22 ? '4.5 hrs' : isHigh ? '3.5 hrs' : '2.0 hrs'}`}
                />
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}
          >
            <span>Less study</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'rgba(139, 92, 246, 0.45)' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#8B5CF6' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#22D3EE' }} />
            </div>
            <span>Intensive study</span>
          </div>
        </div>
      </div>

      {/* 🧠 Full-Width Skill & Knowledge Hexagonal Radar Map */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Award size={18} color="var(--cyan-accent)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--cyan-accent)', textTransform: 'uppercase' }}>
                Cognitive Capability Model
              </span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              Skill & Knowledge Architecture Radar
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Overall Mastery Index: <strong style={{ color: 'var(--emerald-accent)' }}>83.5 / 100</strong>
            </span>
          </div>
        </div>

        {/* 2-Column: Radar SVG on left, Skill Metric breakdown on right */}
        <div className="radar-grid">
          {/* Radar Visualization */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width="340" height="340" viewBox="0 0 340 340" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="radarPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.45)" />
                  <stop offset="100%" stopColor="rgba(34, 211, 238, 0.35)" />
                </linearGradient>
              </defs>

              {/* Concentric Hexagons (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1.0].map((scale, sIdx) => {
                const r = 130 * scale;
                const points = [
                  [170, 170 - r],
                  [170 + r * 0.866, 170 - r * 0.5],
                  [170 + r * 0.866, 170 + r * 0.5],
                  [170, 170 + r],
                  [170 - r * 0.866, 170 + r * 0.5],
                  [170 - r * 0.866, 170 - r * 0.5]
                ].map((p) => p.join(',')).join(' ');

                return (
                  <polygon
                    key={sIdx}
                    points={points}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Radar Axis lines radiating from center */}
              {[
                [170, 170 - 130],
                [170 + 130 * 0.866, 170 - 130 * 0.5],
                [170 + 130 * 0.866, 170 + 130 * 0.5],
                [170, 170 + 130],
                [170 - 130 * 0.866, 170 + 130 * 0.5],
                [170 - 130 * 0.866, 170 - 130 * 0.5]
              ].map((pt, i) => (
                <line
                  key={i}
                  x1="170"
                  y1="170"
                  x2={pt[0]}
                  y2={pt[1]}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Dynamic Skill Polygon */}
              {(() => {
                const scores = [0.92, 0.85, 0.78, 0.88, 0.64, 0.70];
                const polyPts = [
                  [170, 170 - 130 * scores[0]],
                  [170 + 130 * scores[1] * 0.866, 170 - 130 * scores[1] * 0.5],
                  [170 + 130 * scores[2] * 0.866, 170 + 130 * scores[2] * 0.5],
                  [170, 170 + 130 * scores[3]],
                  [170 - 130 * scores[4] * 0.866, 170 + 130 * scores[4] * 0.5],
                  [170 - 130 * scores[5] * 0.866, 170 - 130 * scores[5] * 0.5]
                ];
                const ptsStr = polyPts.map((p) => p.join(',')).join(' ');

                return (
                  <g>
                    <polygon
                      points={ptsStr}
                      fill="url(#radarPolyGrad)"
                      stroke="#22D3EE"
                      strokeWidth="2.5"
                      style={{ filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.5))' }}
                    />
                    {polyPts.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p[0]}
                        cy={p[1]}
                        r="5"
                        fill="#F472B6"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        style={{ filter: 'drop-shadow(0 0 6px #F472B6)' }}
                      />
                    ))}
                  </g>
                );
              })()}

              {/* Skill Labels around vertices */}
              <text x="170" y="24" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="middle">Frontend (92%)</text>
              <text x="290" y="98" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="start">Backend (85%)</text>
              <text x="290" y="246" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="start">Algorithms (78%)</text>
              <text x="170" y="322" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="middle">Database (88%)</text>
              <text x="50" y="246" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="end">Concurrency (64%)</text>
              <text x="50" y="98" fill="#F8FAFC" fontSize="11" fontWeight="700" textAnchor="end">DevOps (70%)</text>
            </svg>
          </div>

          {/* Skill Metrics Breakdown List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { skill: 'Frontend & Reactive UI Architecture', score: 92, grade: 'Mastery', color: '#22D3EE' },
              { skill: 'Database Systems & SQL Optimization', score: 88, grade: 'Mastery', color: '#10B981' },
              { skill: 'Backend Architecture & REST APIs', score: 85, grade: 'Advanced', color: '#8B5CF6' },
              { skill: 'Data Structures & Algorithmic Logic', score: 78, grade: 'Proficient', color: '#A78BFA' },
              { skill: 'Cloud Infrastructure & DevOps Pipelines', score: 70, grade: 'Competent', color: '#F59E0B' },
              { skill: 'Multithreading & Low-Level Concurrency', score: 64, grade: 'Developing', color: '#EF4444' }
            ].map((s, idx) => (
              <div key={idx} className="radar-skill-row">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.skill}</span>
                  <span style={{ fontWeight: 800, color: s.color }}>{s.score}% • {s.grade}</span>
                </div>
                <div className="radar-skill-track">
                  <div className="radar-skill-bar" style={{ width: `${s.score}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
