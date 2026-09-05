import { useCallback, useEffect, useRef, useState } from "react";

// Loads the YouTube IFrame API once (shared across every player instance
// on the page) and resolves once window.YT is ready.
let apiPromise = null;
function loadYouTubeAPI() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

// Drives a hidden YouTube IFrame player so a YouTube track can sit in the
// same custom player UI as local audio files — same play/pause button,
// same seek bar, same waveform. `mountRef` is a ref to the element the
// iframe replaces; `videoId` is the YouTube video ID (not a full URL).
export function useYouTubePlayer(mountRef, videoId) {
  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const autoplayRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setPlaying(false);
    setDuration(0);
    setCurrentTime(0);

    if (!videoId || !mountRef.current) return undefined;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !YT) return;
      playerRef.current = new YT.Player(mountRef.current, {
        videoId,
        playerVars: { controls: 0, disablekb: 1, modestbranding: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            setReady(true);
            setDuration(e.target.getDuration() || 0);
            if (autoplayRef.current) {
              e.target.playVideo();
              autoplayRef.current = false;
            }
          },
          onStateChange: (e) => {
            if (cancelled) return;
            setPlaying(e.data === 1);
            if (e.data === 1) setDuration(e.target.getDuration() || 0);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  useEffect(() => {
    clearInterval(pollRef.current);
    if (playing) {
      pollRef.current = setInterval(() => {
        const t = playerRef.current?.getCurrentTime?.();
        if (typeof t === "number") setCurrentTime(t);
      }, 250);
    }
    return () => clearInterval(pollRef.current);
  }, [playing]);

  const play = useCallback(() => {
    if (ready) playerRef.current?.playVideo?.();
    else autoplayRef.current = true;
  }, [ready]);

  const pause = useCallback(() => playerRef.current?.pauseVideo?.(), []);
  const seekTo = useCallback((seconds) => playerRef.current?.seekTo?.(seconds, true), []);
  const setVolume = useCallback((v) => playerRef.current?.setVolume?.(Math.round(v * 100)), []);

  return { ready, playing, duration, currentTime, play, pause, seekTo, setVolume };
}
