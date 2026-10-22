import React, { useState } from 'react';
import './YouTubePlayer.css';

export default function YouTubePlayer({ videoId, title }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="youtube-player-wrapper">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="yt-player-loading">
          <div className="yt-player-spinner" />
          <span className="yt-player-loading-text">
            Loading HD Video Stream...
          </span>
        </div>
      )}

      {/* YouTube Iframe Embed */}
      <iframe
        className="yt-player-iframe"
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&autoplay=0`}
        title={title || 'Educational Video Lesson'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
