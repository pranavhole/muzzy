"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import YouTubePlayer from '@/app/components/YouTubePlayer';
interface SongQueueItem {
  id: string;
  title: string;
  votes: number;
  youtubeId: string;
}
         
interface StreamData {
  streams: Array<{
    id: string;
    active: boolean;
    title: string;
    extractedId: string;
    _count: { upvotes: number };
    upvotes: any[];
  }>;
}

// Add proper types
type Player = {
  playVideo: () => void;
  pauseVideo: () => void;
};

export default function StreamView({ createrid }: { createrid: string | null}) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [queue, setQueue] = useState<SongQueueItem[]>([]);
  const [currentSong, setCurrentSong] = useState<SongQueueItem | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimize YouTube ID extraction with useMemo
  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const youtubeId = useMemo(() => getYoutubeId(youtubeUrl), [youtubeUrl]);

  // Improved refresh stream function
  const refreshStream = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get<StreamData>(`/api/Streams?creatorId=${createrid}`, {
        withCredentials: true
      });
      
      const initialQueue = data.streams.map((stream) => ({
        id: stream.id,
        title: stream.title,
        votes: stream._count.upvotes,
        youtubeId: stream.extractedId.split('&')[0],
      }));

      setQueue(initialQueue.sort((a, b) => b.votes - a.votes));
      
      const activeStream = data.streams.find((stream) => stream.active);
      if (activeStream) {
        setCurrentSong({
          id: activeStream.id,
          title: activeStream.title,
          votes: activeStream._count.upvotes,
          youtubeId: activeStream.extractedId.split('&')[0],
        });
      }
    } catch (err) {
      setError('Failed to fetch stream data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimize handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await axios.post(`/api/Streams?creatorId=${createrid}`, {
        url: youtubeUrl
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      setYoutubeUrl('');
      await refreshStream();
    } catch (err) {
      setError('Failed to add song. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Optimize handleVote
  const handleVote = useCallback(async (id: string, increment: number) => {
    try {
      setError(null);
      const endpoint = increment === 1 ? 'upvote' : 'downvote';
      const { data } = await axios.post(`/api/Streams/${endpoint}`, {
        StreamId: id
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      refreshStream();
     
    } catch (err) {
      setError('Failed to update vote');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    refreshStream();
  }, [refreshStream]);


  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <YouTubePlayer
        currentSong={currentSong}
        onPlayerReady={setPlayer}
      />

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
                  onClick={() => {
                    if (player && player.playVideo) {
                      player.playVideo();
                    } else {
                      console.warn('Player not initialized');
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Play
                </button>
                <button
                  onClick={() => {
                    if (player && player.pauseVideo) {
                      player.pauseVideo();
                    } else {
                      console.warn('Player not initialized');
                    }
                  }}
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

      {/* Queue and Add Song Sections */}
      <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
        {/* Add Song Form */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
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
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Adding...' : 'Add to Queue'}
            </button>

            {youtubeUrl && getYoutubeId(youtubeUrl) && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getYoutubeId(
                      youtubeUrl
                    )}`}
                    title="YouTube preview"
                    allow="encrypted-media"
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
                <div
                  key={song.id}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                >
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

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}

