import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Award,
  ArrowLeft,
  Coffee,
  Brain
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage';

export default function FocusRoomPage() {
  // Timer Modes: pomodoro (25), shortBreak (5), longBreak (15), deepWork (50)
  const MODES = {
    pomodoro: { label: 'Pomodoro', duration: 25 * 60, icon: Brain },
    shortBreak: { label: 'Short Break', duration: 5 * 60, icon: Coffee },
    longBreak: { label: 'Long Break', duration: 15 * 60, icon: Sparkles },
    deepWork: { label: 'Deep Focus', duration: 50 * 60, icon: Flame }
  };

  const [activeMode, setActiveMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(() => {
    return parseInt(localStorage.getItem('learnsphere_focus_sessions') || '3', 10);
  });
  const [minutesFocused, setMinutesFocused] = useState(() => {
    return parseInt(localStorage.getItem('learnsphere_focus_minutes') || '75', 10);
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);

  // Study Goals
  const [goals, setGoals] = useState(() => {
    return getStoredData('learnsphere_focus_goals', [
      { id: 1, text: 'Review Binary Search Tree implementations', completed: true },
      { id: 2, text: 'Watch Lesson 5 in Java Masterclass', completed: false },
      { id: 3, text: 'Solve 2 practice questions in Quiz center', completed: false }
    ]);
  });
  const [newGoalText, setNewGoalText] = useState('');

  const containerRef = useRef(null);

  // Save goals
  useEffect(() => {
    setStoredData('learnsphere_focus_goals', goals);
  }, [goals]);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session
      setIsRunning(false);
      sound.playTimerBell();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const sessionMins = Math.round(MODES[activeMode].duration / 60);
      const newSessions = completedSessions + 1;
      const newMins = minutesFocused + sessionMins;
      setCompletedSessions(newSessions);
      setMinutesFocused(newMins);
      localStorage.setItem('learnsphere_focus_sessions', newSessions.toString());
      localStorage.setItem('learnsphere_focus_minutes', newMins.toString());

      // Auto switch to break if it was pomodoro/deepWork
      if (activeMode === 'pomodoro' || activeMode === 'deepWork') {
        setActiveMode('shortBreak');
        setTimeLeft(MODES.shortBreak.duration);
      } else {
        setActiveMode('pomodoro');
        setTimeLeft(MODES.pomodoro.duration);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeMode, completedSessions, minutesFocused]);

  const handleModeChange = (modeKey) => {
    sound.playClick();
    setActiveMode(modeKey);
    setTimeLeft(MODES[modeKey].duration);
    setIsRunning(false);
  };

  const handleToggleTimer = () => {
    sound.playClick();
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(MODES[activeMode].duration);
  };

  const handleSkipTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimeLeft(0);
  };

  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Add / Toggle Goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    sound.playClick();
    setGoals((prev) => [
      ...prev,
      { id: Date.now(), text: newGoalText.trim(), completed: false }
    ]);
    setNewGoalText('');
  };

  const handleToggleGoal = (id) => {
    sound.playClick();
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const handleDeleteGoal = (id) => {
    sound.playClick();
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Progress Calculation
  const totalDuration = MODES[activeMode].duration;
  const progressPct = ((totalDuration - timeLeft) / totalDuration) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        minHeight: '80vh',
        position: 'relative'
      }}
    >
      {/* Top Header & Navigation */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/dashboard" className="glass-btn" style={{ padding: '8px 14px', fontSize: '0.84rem' }}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer size={18} color="var(--cyan-accent)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--cyan-accent)', textTransform: 'uppercase' }}>
                Distraction-Free Sanctuary
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
              Focus Room & Pomodoro Engine
            </h1>
          </div>
        </div>

        {/* Quick controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setAmbientAudio(!ambientAudio)}
            className="glass-btn"
            style={{
              padding: '8px 14px',
              fontSize: '0.82rem',
              borderColor: ambientAudio ? 'var(--cyan-accent)' : undefined,
              color: ambientAudio ? 'var(--cyan-accent)' : undefined
            }}
            title="Ambient Study Sound Generator"
          >
            {ambientAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{ambientAudio ? 'Ambient Rain ON' : 'Ambient Sound'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="glass-btn"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            title="Toggle Distraction-free Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? 'Exit Zen' : 'Zen Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Layout (Timer Card + Study Goals Card) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}
        className="focus-grid"
      >
        {/* LEFT COLUMN: Pomodoro Timer Interactive Core */}
        <div
          className="glass-panel"
          style={{
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Ambient Radial Spotlight */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: isRunning
                ? 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />

          {/* Mode Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '6px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '36px',
              zIndex: 1,
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            {Object.entries(MODES).map(([key, config]) => {
              const isSelected = activeMode === key;
              const IconComp = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => handleModeChange(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: 'none',
                    backgroundColor: isSelected ? 'var(--primary-purple)' : 'transparent',
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.5)' : 'none'
                  }}
                >
                  <IconComp size={15} />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>

          {/* Circular Countdown Ring */}
          <div style={{ position: 'relative', width: '280px', height: '280px', marginBottom: '32px', zIndex: 1 }}>
            <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background track circle */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="10"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="none"
                stroke="url(#focusGradient)"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progressPct / 100)}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1s linear',
                  filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))'
                }}
              />
              <defs>
                <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
            </svg>

            {/* Centered Digital Clock & State */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                  textShadow: '0 0 30px rgba(139, 92, 246, 0.6)'
                }}
              >
                {formattedTime}
              </span>
              <span
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: isRunning ? 'var(--cyan-accent)' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: '4px'
                }}
              >
                {isRunning ? '● Session in Progress' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 1 }}>
            <button
              onClick={handleResetTimer}
              className="glass-btn"
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
              title="Reset Timer"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={handleToggleTimer}
              className="gradient-border-btn"
              style={{
                padding: '12px 36px',
                fontSize: '1.05rem',
                borderRadius: '9999px',
                background: isRunning
                  ? 'linear-gradient(135deg, #EF4444, #F43F5E)'
                  : 'linear-gradient(135deg, #8B5CF6, #22D3EE)'
              }}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              <span>{isRunning ? 'Pause Focus' : 'Start Focus'}</span>
            </button>

            <button
              onClick={handleSkipTimer}
              className="glass-btn"
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
              title="Skip to next session"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Bottom XP & Motivation Banner */}
          <div
            style={{
              marginTop: '36px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)'
            }}
          >
            <Sparkles size={16} color="#FBBF24" />
            <span>
              Each completed Pomodoro earns <strong style={{ color: '#FBBF24' }}>+50 XP</strong> and boosts your streak multiplier!
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Study Goals & Focus Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Focus Stats Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
              Session Intelligence
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(167, 139, 250, 0.25)'
                }}
              >
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Cycles Done
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--electric-violet)' }}>
                  {completedSessions}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>pomodoro intervals</div>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(34, 211, 238, 0.1)',
                  border: '1px solid rgba(34, 211, 238, 0.25)'
                }}
              >
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Time Logged
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--cyan-accent)' }}>
                  {minutesFocused}m
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>deep study time</div>
              </div>
            </div>
          </div>

          {/* Interactive Study Goals Checklist */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--emerald-accent)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Session Study Goals</h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {goals.filter((g) => g.completed).length}/{goals.length} Done
              </span>
            </div>

            {/* Add Goal Input */}
            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Add goal for this session..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={!newGoalText.trim()}
                className="gradient-border-btn"
                style={{ padding: '0 16px', fontSize: '0.84rem' }}
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </form>

            {/* Goals List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {goals.map((g) => (
                <div
                  key={g.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: g.completed ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${g.completed ? 'rgba(52, 211, 153, 0.25)' : 'var(--card-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    onClick={() => handleToggleGoal(g.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    {g.completed ? (
                      <CheckCircle2 size={18} color="var(--emerald-accent)" style={{ flexShrink: 0 }} />
                    ) : (
                      <Circle size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        fontSize: '0.88rem',
                        color: g.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: g.completed ? 'line-through' : 'none'
                      }}
                    >
                      {g.text}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(g.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Delete goal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
