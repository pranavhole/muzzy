"use client";
import { useState, useEffect } from 'react';

interface SongQueueItem {
  id: string;
  title: string;
  votes: number;
  youtubeId: string;
}

export default function MusicQueue() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [queue, setQueue] = useState<SongQueueItem[]>([]);
  const [currentSong, setCurrentSong] = useState<SongQueueItem | null>(null);
  const [player, setPlayer] = useState<any>(null);

  // Improved YouTube ID extraction
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = getYoutubeId(youtubeUrl);
    
    if (videoId) {
      const newSong: SongQueueItem = {
        id: Date.now().toString(),
        title: `Song ${Date.now()}`, // Temporary title
        votes: 0,
        youtubeId: videoId
      };
      
      // Use functional update to ensure latest state
      setQueue(prevQueue => [...prevQueue, newSong]);
      setYoutubeUrl('');
      console.log('Added to queue:', newSong); // Debug log
    } else {
      console.error('Invalid YouTube URL');
      alert('Please enter a valid YouTube URL');
    }
  };


  const handleVote = (id: string, increment: number) => {
    setQueue(queue.map(song => {
      if (song.id === id) {
        return { ...song, votes: song.votes + increment };
      }
      return song;
    }).sort((a, b) => b.votes - a.votes));
  };

  // Audio player controls
  const loadAudio = (youtubeId: string) => {
    if (player) {
      player.loadVideoById(youtubeId);
      player.playVideo();
    }
  };

  useEffect(() => {
    // Initialize YouTube player
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      const ytPlayer = new (window as any).YT.Player('audio-player', {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          controls: 0,
          showinfo: 0,
          rel: 0
        },
        events: {
          onReady: () => setPlayer(ytPlayer)
        }
      });
    };
  }, []);

  useEffect(() => {
    if (currentSong && player) {
      loadAudio(currentSong.youtubeId);
    }
  }, [currentSong]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Hidden audio player */}
      <div id="audio-player" className="hidden"></div>

      {/* Current Audio Controls */}
      <div className="mb-8 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Now Playing</h2>
        {currentSong ? (
          <div className="flex items-center space-x-4">
            <img
              src={`https://img.youtube.com/vi/${currentSong.youtubeId}/default.jpg`}
              alt={currentSong.title}
              className="w-20 h-20 rounded-lg"
            />
            <div>
              <h3 className="text-lg font-medium">{currentSong.title}</h3>
              <div className="flex space-x-4 mt-2">
                <button
                  onClick={() => player.playVideo()}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Play
                </button>
                <button
                  onClick={() => player.pauseVideo()}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Pause
                </button>
                <button
                  onClick={() => setCurrentSong(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No audio currently playing</div>
        )}
      </div>

      <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
        {/* Song Submission Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Add a Song</h2>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube URL here"
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add to Queue
            </button>

            {youtubeUrl && getYoutubeId(youtubeUrl) && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Queue List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Queue</h2>
            <div className="space-y-4">
              {queue.map((song) => (
                <div key={song.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                  <img
                    src={`https://img.youtube.com/vi/${song.youtubeId}/default.jpg`}
                    alt={song.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{song.title}</h3>
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() => handleVote(song.id, 1)}
                        className="text-green-500 hover:text-green-600 px-2"
                      >
                        ↑
                      </button>
                      <span className="mx-2 w-8 text-center">{song.votes}</span>
                      <button
                        onClick={() => handleVote(song.id, -1)}
                        className="text-red-500 hover:text-red-600 px-2"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => setCurrentSong(song)}
                        className="ml-auto bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Play Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {queue.length === 0 && (
                <p className="text-gray-500 text-center py-4">Queue is empty</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}