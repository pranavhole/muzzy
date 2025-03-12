"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';

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

const YouTubePlayer = dynamic(
    () => import('../components/YouTubePlayer'),
    { ssr: false }
);

export default function MusicQueue() {
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [queue, setQueue] = useState<SongQueueItem[]>([]);
    const [currentSong, setCurrentSong] = useState<SongQueueItem | null>(null);
    const [player, setPlayer] = useState<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const getYoutubeId = (url: string) => {
        const regExp =
            /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const initializeWebRTC = async () => {
        // Create WebRTC peer connection
        peerConnectionRef.current = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // Create audio context and stream destination
        audioContextRef.current = new AudioContext();
        streamDestinationRef.current = audioContextRef.current.createMediaStreamDestination();

        // Get the audio element from YouTube player iframe
        const youtubeIframe = document.querySelector('iframe');
        if (youtubeIframe) {
            // Get the contentWindow document to access the video element
            const iframeDoc = (youtubeIframe as HTMLIFrameElement).contentDocument || (youtubeIframe as HTMLIFrameElement).contentWindow?.document;
            const videoElement = iframeDoc?.querySelector('video');
            
            if (videoElement) {
                const source = audioContextRef.current.createMediaElementSource(videoElement);
                source.connect(streamDestinationRef.current);
                source.connect(audioContextRef.current.destination);
            }
        }

        // Add audio track to peer connection
        const audioTrack = streamDestinationRef.current.stream.getAudioTracks()[0];
        peerConnectionRef.current.addTrack(audioTrack);

        // Create and set local description
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);

        // Handle ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                // Send candidate to remote peer (implement your signaling here)
                console.log('New ICE candidate:', event.candidate);
            }
        };
    };

    useEffect(() => {
        const fetchStreamData = async () => {
            try {
                const res = await fetch('/api/Streams/my', { credentials: 'include' });
                const data: StreamData = await res.json();

                const initialQueue = data.streams.map((stream) => ({
                    id: stream.id,
                    title: stream.title,
                    votes: stream._count.upvotes,
                    youtubeId: stream.extractedId.split('&')[0],
                }));

                const activeStream = data.streams.find((stream) => stream.active);
                setQueue(initialQueue);
                if (activeStream) {
                    setCurrentSong({
                        id: activeStream.id,
                        title: activeStream.title,
                        votes: activeStream._count.upvotes,
                        youtubeId: activeStream.extractedId.split('&')[0],
                    });
                }

                // Initialize WebRTC after YouTube player is ready
                await initializeWebRTC();
            } catch (err) {
                console.error('Failed to fetch stream data:', err);
            }
        };

        fetchStreamData();

        return () => {
            // Cleanup
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const videoId = getYoutubeId(youtubeUrl);
        if (videoId) {
            const newSong: SongQueueItem = {
                id: '',
                title: '',
                votes: 0,
                youtubeId: videoId,
            };

            setQueue((prev) => [...prev, newSong]);
            setYoutubeUrl('');
        } else {
            alert('Please enter a valid YouTube URL');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <YouTubePlayer
                currentSong={currentSong}
                onPlayerReady={(p) => {
                    setPlayer(p);
                    if (currentSong) {
                        p.loadVideoById(currentSong.youtubeId);
                        p.playVideo();
                    }
                }}
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
                                            console.log("started")
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
                                    onClick={() => {
                                        if (player) {
                                            player.stopVideo();
                                            setCurrentSong(null);
                                        }
                                    }}
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
        </div>
    );
}
