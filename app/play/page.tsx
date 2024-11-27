"use client";
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";

const songs = [
  {
    title: "Symphony",
    name: "Clean Bandit ft. Zara Larsson",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Clean-Bandit-Symphony.mp3",
    img: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/d3ca28bf-e1b7-467e-a00b-c7785be8e397",
  },
  {
    title: "Pawn It All",
    name: "Alicia Keys",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Pawn-It-All.mp3",
    img: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/1afe4c6a-0287-43f0-9076-92f8be49d9dc",
  },
  {
    title: "Seni Dert Etmeler",
    name: "Madrigal",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Madrigal-Seni-Dert-Etmeler.mp3",
    img: "https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/abaa23bd-8c93-4219-a3ef-0d0cb6f12566",
  },
];

const MusicPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const swiperRef = useRef<any>(null); // Ref for the swiper

  const playPauseHandler = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateCurrentTime = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };

    const onSongEnd = () => {
      // Automatically move to the next song with animation
      if (swiperRef.current) {
        swiperRef.current.swiper.slideNext(); // Slide to next song
      }
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateCurrentTime);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration || 0);
      });
      audio.addEventListener("ended", onSongEnd); // Listen to the song end event
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateCurrentTime);
        audio.removeEventListener("ended", onSongEnd);
      }
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        slidesPerView={3} // Show 3 slides at once
        spaceBetween={20} // Space between slides
        onSlideChange={(swiper) => setCurrentSongIndex(swiper.activeIndex)}
        className="max-w-lg"
        ref={swiperRef} // Attach the ref to Swiper
      >
        {songs.map((song, index) => (
          <SwiperSlide key={index} className="relative">
            <img
              src={song.img}
              alt={song.title}
              className="rounded-xl shadow-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-6 flex flex-col items-center min-w-60">
        <h1 className="text-2xl font-semibold">{songs[currentSongIndex].title}</h1>
        <p className="text-lg opacity-80">{songs[currentSongIndex].name}</p>
        <audio ref={audioRef} src={songs[currentSongIndex].source}></audio>
        <input
          type="range"
          className="w-full mt-4 appearance-none bg-gray-700 rounded-full h-2 focus:outline-none focus:ring"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
        />
        <div className="flex justify-between w-full text-sm mt-1 text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="mt-6 flex items-center space-x-6">
          <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={prevSong}
          >
            <FaBackward />
          </button>
          <button
            className="p-4 rounded-full bg-green-500 hover:bg-green-400 text-black"
            onClick={playPauseHandler}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={nextSong}
          >
            <FaForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
