import React from 'react';
import './Loader.css';

export default function Loader({ text = 'Preparing your learning space...' }) {
  return (
    <div className="loader-container">
      <div className="loader-stage">
        {/* Core Glowing Orb */}
        <div className="loader-core-orb" />

        {/* Orbit Ring 1 */}
        <div className="loader-orbit-1">
          {/* Orbiting particle 1 (Book / Code particle) */}
          <div className="loader-particle-1" />
        </div>

        {/* Orbit Ring 2 (Tilted) */}
        <div className="loader-orbit-2">
          {/* Orbiting particle 2 */}
          <div className="loader-particle-2" />
        </div>
      </div>

      <p className="loader-text">
        {text}
      </p>
    </div>
  );
}
