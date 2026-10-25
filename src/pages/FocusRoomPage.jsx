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
  ArrowLeft,
  Brain,
  Coffee,
  Flame
} from 'lucide-react';
import { sound } from '../utils/sound';
import { useFocus, FOCUS_MODES } from '../context/FocusContext';
import { useLanguage } from '../context/LanguageContext';
import './FocusRoomPage.css';

const MODE_ICONS = {
  pomodoro: Brain,
  shortBreak: Coffee,
  longBreak: Sparkles,
  deepWork: Flame
};

export default function FocusRoomPage() {
  const {
    activeMode,
    modes,
    MODES,
    isRunning,
    completedSessions,
    minutesFocused,
    goals,
    toggleTimer,
    resetTimer,
    skipTimer,
    changeMode,
    setMode,
    addGoal,
    toggleGoal,
    deleteGoal,
    progressPct,
    formattedTime
  } = useFocus();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  const { t } = useLanguage();
  const containerRef = useRef(null);

  // Safe mode handler & modes dictionary
  const handleSelectMode = setMode || changeMode;
  const availableModes = MODES || modes || FOCUS_MODES || {
    pomodoro: { id: 'pomodoro', label: 'Pomodoro', duration: 25 * 60 },
    shortBreak: { id: 'shortBreak', label: 'Short Break', duration: 5 * 60 },
    longBreak: { id: 'longBreak', label: 'Long Break', duration: 15 * 60 },
    deepWork: { id: 'deepWork', label: 'Deep Focus', duration: 50 * 60 }
  };

  // Ambient sound management
  useEffect(() => {
    if (ambientAudio) {
      sound.startAmbientRain();
    } else {
      sound.stopAmbientRain();
    }
    return () => {
      sound.stopAmbientRain();
    };
  }, [ambientAudio]);

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

  // Add Goal Form Submit
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    sound.playClick();
    addGoal(newGoalText.trim());
    setNewGoalText('');
  };

  return (
    <div
      ref={containerRef}
      className="focus-container"
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
                {t("zenSanctuary", "Distraction-Free Sanctuary")}
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
              {t("focusPomodoroEngine", "Focus Room & Pomodoro Engine")}
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
            title="Ambient Rain Sound Generator"
          >
            {ambientAudio ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{ambientAudio ? t('ambientRainOn', 'Ambient Rain ON') : t('ambientRain', 'Ambient Rain')}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="glass-btn"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            title="Toggle Distraction-free Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? t('exitZen', 'Exit Zen') : t('zenFullscreen', 'Zen Fullscreen')}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Layout (Timer Card + Study Goals Card) */}
      <div className="focus-grid">
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
            {Object.entries(availableModes).map(([key, config]) => {
              const isSelected = activeMode === key;
              const IconComp = MODE_ICONS[key] || Sparkles;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectMode(key)}
                  className={`focus-mode-btn ${isSelected ? 'active' : ''}`}
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
                strokeDashoffset={2 * Math.PI * 120 * (1 - (progressPct || 0) / 100)}
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
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                  textShadow: '0 0 30px rgba(139, 92, 246, 0.6)'
                }}
              >
                {formattedTime || '25:00'}
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
              onClick={resetTimer}
              className="glass-btn"
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={toggleTimer}
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
              <span>{isRunning ? t('pauseFocus', 'Pause Focus') : t('startFocus', 'Start Focus')}</span>
            </button>

            <button
              onClick={skipTimer}
              className="glass-btn"
              style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
              title="Skip to next session"
              aria-label="Skip session"
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
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{t("sessionGoals", "Session Study Goals")}</h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {(goals || []).filter((g) => g.completed).length}/{(goals || []).length} Done
              </span>
            </div>

            {/* Add Goal Input */}
            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder={t("addGoalPlaceholder", "Add goal for this session...")}
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
              {(goals || []).map((g) => (
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
                    onClick={() => toggleGoal(g.id)}
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
                    onClick={() => deleteGoal(g.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Delete goal"
                    aria-label="Delete goal"
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
