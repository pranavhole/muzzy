"use client"
import React, { useEffect } from 'react';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  currentSong: {
    youtubeId: string;
    title: string;
  } | null;
  onPlayerReady: (player: any) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ currentSong, onPlayerReady }) => {
  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  const onReady = (event: any) => {
    onPlayerReady(event.target);
  };

  return currentSong ? (
    <div style={{ display: 'none' }}>
      <YouTube
        videoId={currentSong.youtubeId}
        opts={opts}
        onReady={onReady}
      />
    </div>
  ) : null;
};

export default YouTubePlayer;
