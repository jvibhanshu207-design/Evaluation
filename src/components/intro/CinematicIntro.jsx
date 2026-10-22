import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound';
import './CinematicIntro.css';

export default function CinematicIntro({ onComplete }) {
  const [stage, setStage] = useState('walking'); // 'walking' | 'aiming' | 'throwing' | 'impact' | 'particles' | 'logo'
  const [muted, setMuted] = useState(false);
  const [studentX, setStudentX] = useState(-10);
  const [particles, setParticles] = useState([]);
  const hasTriggeredImpact = useRef(false);

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  // Generate particles for the glass crack explosion
  const generateParticles = () => {
    const pts = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const dist = 180 + Math.random() * 450;
      const size = 3 + Math.random() * 6;
      const colors = ['#22D3EE', '#8B5CF6', '#A78BFA', '#F472B6', '#FFFFFF'];
      pts.push({
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.2
      });
    }
    setParticles(pts);
  };

  // Timeline orchestrator
  useEffect(() => {
    let animFrame;
    let startTime = null;

    // 1. Walking Animation
    const walkDuration = 2200; // 2.2 seconds to walk to center
    const walkStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / walkDuration, 1);
      // Easing out towards center
      const currentX = -10 + progress * 55; // from -10% to 45%
      setStudentX(currentX);

      if (progress < 1) {
        animFrame = requestAnimationFrame(walkStep);
      } else {
        // Reached center: enter aiming stage
        setStage('aiming');
      }
    };

    animFrame = requestAnimationFrame(walkStep);

    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Aiming -> Throwing -> Impact sequence
  useEffect(() => {
    if (stage === 'aiming') {
      const timer = setTimeout(() => {
        setStage('throwing');
        sound.playWhoosh();
      }, 700);
      return () => clearTimeout(timer);
    }

    if (stage === 'throwing') {
      // Pebble flies into camera for 600ms
      const timer = setTimeout(() => {
        setStage('impact');
      }, 550);
      return () => clearTimeout(timer);
    }

    if (stage === 'impact' && !hasTriggeredImpact.current) {
      hasTriggeredImpact.current = true;
      sound.playGlassImpact();

      // Transition from impact/cracks to particle burst
      const partTimer = setTimeout(() => {
        generateParticles();
        setStage('particles');
        sound.playCosmicShimmer();
      }, 750);

      return () => clearTimeout(partTimer);
    }

    if (stage === 'particles') {
      // Particles converge to logo
      const logoTimer = setTimeout(() => {
        setStage('logo');
      }, 800);
      return () => clearTimeout(logoTimer);
    }

    if (stage === 'logo') {
      // Hold logo for 3.2 seconds then complete intro
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 3200);
      return () => clearTimeout(finishTimer);
    }
  }, [stage, onComplete]);

  return (
    <div
      className={`intro-container ${stage === 'impact' ? 'animate-shake-screen' : ''
        }`}
      style={{
        animation: stage === 'impact' ? 'shakeScreen 0.4s ease-in-out' : 'none'
      }}
    >
      {/* Background portal & ambient study space */}
      <div className="intro-backdrop">
        <div className="portal-grid" />

        {/* Floating math / science chalk symbols */}
        <div className="floating-chalk-symbols">
          <span className="chalk-sym" style={{ top: '15%', left: '12%' }}>∫ f(x)dx</span>
          <span className="chalk-sym" style={{ top: '22%', right: '18%' }}>λ = h / p</span>
          <span className="chalk-sym" style={{ top: '65%', left: '8%' }}>O(N log N)</span>
          <span className="chalk-sym" style={{ top: '70%', right: '12%' }}>&lt;Component /&gt;</span>
          <span className="chalk-sym" style={{ top: '35%', left: '28%' }}>E = mc²</span>
          <span className="chalk-sym" style={{ top: '40%', right: '32%' }}>∇ × B</span>
        </div>
      </div>

      {/* Top Controls: Audio toggle & Skip Intro */}
      <div className="intro-controls">
        <button
          className="audio-toggle-btn"
          onClick={handleToggleMute}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle Audio"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <button
          className="skip-intro-btn"
          onClick={onComplete}
          id="skip-intro-button"
        >
          <span>Skip Intro</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Character Walking & Throwing Stage */}
      {(stage === 'walking' || stage === 'aiming' || stage === 'throwing') && (
        <div className="learner-stage">
          {/* Futuristic Holographic Portal Screen being interacted with */}
          <div
            className="futuristic-screen-terminal"
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '52%',
              width: '180px',
              height: '240px',
              borderRadius: '16px',
              background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1.5px solid rgba(34, 211, 238, 0.45)',
              boxShadow: '0 0 35px rgba(34, 211, 238, 0.35), inset 0 0 25px rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              padding: '14px',
              overflow: 'hidden',
              transform: 'perspective(500px) rotateY(-18deg)',
              pointerEvents: 'none',
              zIndex: 10
            }}
          >
            {/* Hologram Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(34, 211, 238, 0.3)', paddingBottom: '6px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>
              <span style={{ fontSize: '0.62rem', color: '#22D3EE', fontFamily: 'monospace', fontWeight: 700 }}>
                SEC-NODE // 01
              </span>
            </div>

            {/* Hologram Scanning Lines */}
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '3px', width: '75%', backgroundColor: 'rgba(34, 211, 238, 0.6)', borderRadius: '2px' }} />
              <div style={{ height: '3px', width: '90%', backgroundColor: 'rgba(167, 139, 250, 0.5)', borderRadius: '2px' }} />
              <div style={{ height: '3px', width: '60%', backgroundColor: 'rgba(34, 211, 238, 0.4)', borderRadius: '2px' }} />
            </div>

            {/* Glowing Target Ring */}
            <div
              style={{
                margin: 'auto auto',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                border: '1.5px dashed #22D3EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'spinSlow 12s linear infinite'
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1.5px solid #F472B6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22D3EE', boxShadow: '0 0 10px #22D3EE' }} />
              </div>
            </div>

            {/* Terminal Status */}
            <div style={{ marginTop: 'auto', fontSize: '0.62rem', color: '#94A3B8', fontFamily: 'monospace', textAlign: 'center' }}>
              [TOUCH TO ENGAGE]
            </div>
          </div>

          <div
            className={`student-character ${stage === 'walking' ? 'student-bob' : ''}`}
            style={{ left: `${studentX}%` }}
          >
            {/* Original Stylized Vector Student */}
            <svg
              width="100"
              height="170"
              viewBox="0 0 100 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <filter id="pebbleGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Head / Hair */}
              <circle cx="50" cy="35" r="16" fill="url(#skinGrad)" />
              {/* Modern haircut */}
              <path
                d="M34 32 C34 16, 66 16, 66 32 C66 35, 60 26, 50 26 C40 26, 34 35, 34 32 Z"
                fill="#1E1B4B"
              />
              <path
                d="M34 28 Q48 14 66 26"
                stroke="#312E81"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Eyes looking forward */}
              <circle cx="54" cy="35" r="2.5" fill="#0F172A" />
              <circle cx="62" cy="35" r="2.5" fill="#0F172A" />

              {/* Backpack */}
              <rect x="25" y="58" width="14" height="32" rx="6" fill="#F472B6" />

              {/* Body / Hoodie */}
              <path
                d="M36 55 C42 52, 58 52, 64 55 L68 95 C68 98, 32 98, 32 95 Z"
                fill="url(#bodyGrad)"
              />

              {/* Legs */}
              <rect
                x="38"
                y="95"
                width="8"
                height="45"
                rx="4"
                fill="#334155"
                className={stage === 'walking' ? 'student-legs-walk' : ''}
              />
              <rect
                x="54"
                y="95"
                width="8"
                height="45"
                rx="4"
                fill="#1E293B"
                className={stage === 'walking' ? 'student-legs-walk' : ''}
              />

              {/* Sneakers */}
              <rect x="36" y="137" width="16" height="7" rx="3" fill="#22D3EE" />
              <rect x="52" y="137" width="16" height="7" rx="3" fill="#22D3EE" />

              {/* Left Arm holding pebble or throwing */}
              {stage === 'walking' && (
                <g>
                  {/* Arm holding pebble */}
                  <path
                    d="M60 62 Q72 70 76 80"
                    stroke="#8B5CF6"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  {/* Glowing Pebble in hand */}
                  <circle
                    cx="78"
                    cy="82"
                    r="6"
                    fill="#22D3EE"
                    filter="url(#pebbleGlow)"
                  />
                </g>
              )}

              {stage === 'aiming' && (
                <g>
                  {/* Arm drawn back to throw */}
                  <path
                    d="M50 62 Q30 50 25 40"
                    stroke="#8B5CF6"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="23"
                    cy="38"
                    r="8"
                    fill="#22D3EE"
                    filter="url(#pebbleGlow)"
                  />
                </g>
              )}

              {stage === 'throwing' && (
                <g>
                  {/* Arm forward follow-through */}
                  <path
                    d="M50 62 Q75 50 90 45"
                    stroke="#8B5CF6"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>
      )}

      {/* Flying Stone in 3D perspective towards screen */}
      {stage === 'throwing' && (
        <div
          className="flying-stone"
          style={{
            top: '55%',
            left: '52%',
            animation: 'flyToCamera 0.55s cubic-bezier(0.15, 0.8, 0.25, 1) forwards'
          }}
        />
      )}

      {/* Screen flash on impact */}
      {stage === 'impact' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(34, 211, 238, 0.6) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 1100,
            animation: 'screenFlash 0.6s ease-out forwards'
          }}
        />
      )}

      {/* Impact Shockwave Ring */}
      {(stage === 'impact' || stage === 'particles') && (
        <div className="impact-shockwave" />
      )}

      {/* Spiderweb Glass Cracks SVG Overlay */}
      {(stage === 'impact' || stage === 'particles') && (
        <svg
          className="glass-crack-overlay"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
        >
          {/* Radial Crack Lines radiating from center (500, 350) */}
          <path className="crack-path" d="M500 350 L420 230 L350 160 L240 80 L120 20" />
          <path className="crack-path" d="M500 350 L580 210 L680 140 L790 70 L920 30" />
          <path className="crack-path" d="M500 350 L630 330 L760 310 L880 290 L980 270" />
          <path className="crack-path" d="M500 350 L620 440 L740 510 L860 590 L950 670" />
          <path className="crack-path" d="M500 350 L510 470 L530 580 L540 680" />
          <path className="crack-path" d="M500 350 L400 450 L310 540 L210 630 L80 690" />
          <path className="crack-path" d="M500 350 L370 360 L240 370 L110 380 L10 390" />
          <path className="crack-path" d="M500 350 L450 260 L480 150 L490 30" />

          {/* Concentric fracture rings */}
          <path
            className="crack-path"
            d="M450 290 Q500 270 560 290 Q590 340 570 400 Q510 420 450 390 Q430 340 450 290 Z"
          />
          <path
            className="crack-path"
            d="M380 230 Q510 190 640 230 Q700 340 650 460 Q520 500 370 450 Q310 340 380 230 Z"
          />
          <path
            className="crack-path"
            d="M280 150 Q510 90 750 160 Q830 350 760 540 Q520 600 240 520 Q160 340 280 150 Z"
          />
        </svg>
      )}

      {/* Exploding / Converging Particles */}
      {stage === 'particles' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none' }}>
          {particles.map(p => (
            <div
              key={p.id}
              className="intro-particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 12px ${p.color}`,
                '--tx': `${p.x}px`,
                '--ty': `${p.y}px`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* LearnSphere Brand Reveal Stage */}
      {stage === 'logo' && (
        <div className="intro-logo-reveal">
          {/* Animated 3D Planetary Orb */}
          <div className="intro-logo-orb">
            <svg viewBox="0 0 100 100" width="120" height="120">
              <defs>
                <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
                <filter id="logoGlow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Outer Glow Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(139, 92, 246, 0.3)"
                strokeWidth="2"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="url(#orbGradient)"
                strokeWidth="3.5"
                filter="url(#logoGlow)"
              />
              {/* Planetary Core */}
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="url(#orbGradient)"
                filter="url(#logoGlow)"
              />
              {/* Tilted Orbital Ring */}
              <ellipse
                cx="50"
                cy="50"
                rx="38"
                ry="13"
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
                transform="rotate(-28 50 50)"
                filter="url(#logoGlow)"
              />
              {/* Orbiting Satellite Dot */}
              <circle cx="78" cy="35" r="4.5" fill="#F472B6" filter="url(#logoGlow)" />
            </svg>
          </div>

          <h1 className="intro-logo-title">LEARNSPHERE</h1>
          <p className="intro-tagline">Learn. Explore. Grow.</p>

          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#94A3B8',
              fontSize: '0.9rem'
            }}
          >
            <Sparkles size={16} className="text-cyan-accent" />
            <span>Welcome to the future of learning</span>
          </div>

          {/* Interactive Enter Button */}
          <button
            onClick={onComplete}
            className="gradient-border-btn animate-pulse-glow"
            style={{
              marginTop: '24px',
              padding: '12px 32px',
              fontSize: '1rem',
              fontWeight: 800,
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #8B5CF6, #22D3EE)',
              color: '#FFFFFF',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>ENTER LEARNSPHERE</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
