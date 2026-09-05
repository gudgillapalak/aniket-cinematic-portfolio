import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { formatDuration } from "../../utils/formatTimecode.js";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";
import { useYouTubePlayer } from "../../hooks/useYouTubePlayer.js";
import { EmptyState } from "../media/EmptyState.jsx";

const BAR_COUNT = 28;

// A custom cinematic audio player — not the native browser widget.
// Renders a track list plus a bar-style "waveform" that animates with
// playback progress. Each track is either a local file (`audio`) or a
// YouTube video ID (`youtubeId`) — both play through the exact same
// controls, seek bar, and waveform.
export const MusicPlayer = forwardRef(function MusicPlayer({ tracks = [] }, ref) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);
  const ytMountRef = useRef(null);
  const cursor = useCursorVariant();

  const active = tracks[activeIndex];
  const isYouTube = Boolean(active?.youtubeId);

  const yt = useYouTubePlayer(ytMountRef, isYouTube ? active.youtubeId : null);

  // ---- Native <audio> file playback ----
  useEffect(() => {
    const el = audioRef.current;
    if (!el || isYouTube) return undefined;
    el.volume = volume;

    const onTime = () => {
      if (el.duration) setProgress(el.currentTime / el.duration);
    };
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, [activeIndex, volume, isYouTube]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || isYouTube) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, activeIndex, isYouTube]);

  // ---- YouTube volume + progress sync ----
  useEffect(() => {
    if (isYouTube) yt.setVolume(volume);
  }, [isYouTube, volume, yt]);

  useEffect(() => {
    if (isYouTube && yt.duration) setProgress(yt.currentTime / yt.duration);
  }, [isYouTube, yt.currentTime, yt.duration]);

  useEffect(() => {
    if (isYouTube) setDuration(yt.duration);
  }, [isYouTube, yt.duration]);

  const effectivePlaying = isYouTube ? yt.playing : playing;

  const selectTrack = (i, autoplay = true) => {
    setActiveIndex(i);
    setProgress(0);
    setDuration(0);
    if (autoplay) {
      if (tracks[i]?.youtubeId) {
        // yt.play() is called once the new player reports ready, via
        // the hook's own autoplay-pending flag.
        setTimeout(() => yt.play(), 0);
      } else {
        setPlaying(true);
      }
    } else {
      setPlaying(false);
    }
  };

  useImperativeHandle(ref, () => ({
    playTrack: (i) => selectTrack(i, true),
  }));

  if (!tracks.length) {
    return <EmptyState label="Tracks coming soon" hint="Drop audio into public/assets/music/tracks, or add a youtubeId, in src/data/media.js" />;
  }

  const togglePlay = () => {
    if (isYouTube) {
      if (yt.playing) yt.pause();
      else yt.play();
    } else {
      setPlaying((p) => !p);
    }
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (isYouTube) {
      if (yt.duration) yt.seekTo(ratio * yt.duration);
    } else if (audioRef.current?.duration) {
      audioRef.current.currentTime = ratio * audioRef.current.duration;
    }
  };

  return (
    <div>
      {!isYouTube && active?.audio && <audio ref={audioRef} src={active.audio} />}

      {isYouTube && (
        <div
          style={{
            aspectRatio: "16 / 9",
            background: "#000",
            border: "1px solid var(--line)",
            marginBottom: "1rem",
            overflow: "hidden",
          }}
        >
          <div ref={ytMountRef} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      {/* Off-screen mount kept alive for local-file tracks so the hook's
          ref target always exists, without taking up any layout space. */}
      {!isYouTube && (
        <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }}>
          <div ref={ytMountRef} />
        </div>
      )}

      <div
        style={{
          border: "1px solid var(--line)",
          padding: "1.6rem",
          display: "grid",
          gap: "1.4rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={togglePlay}
            {...cursor(effectivePlaying ? "PAUSE" : "PLAY")}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "1px solid var(--accent-amber)",
              flexShrink: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
            }}
            aria-label={effectivePlaying ? "Pause" : "Play"}
          >
            {effectivePlaying ? "II" : "▶"}
          </button>

          <div style={{ flex: 1, minWidth: 180 }}>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.2rem" }}>
              {active?.title || "—"}
            </p>
            <p className="eyebrow">
              {active?.role}
              {isYouTube ? " · YOUTUBE" : ""}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span className="eyebrow" style={{ fontSize: "0.6rem" }}>VOL</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Bar-style waveform visualization, driven by playback progress */}
        <div
          onClick={seek}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 48, cursor: "pointer" }}
        >
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const barProgress = i / BAR_COUNT;
            const isPast = barProgress <= progress;
            const height = 18 + Math.abs(Math.sin(i * 1.7)) * 26;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${height}px`,
                  background: isPast ? "var(--accent-amber)" : "var(--line)",
                  transition: "background 0.2s",
                  animation: effectivePlaying && isPast ? `barPulse 0.9s ${i * 0.02}s ease-in-out infinite alternate` : "none",
                }}
              />
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" }}>
          <span>{formatDuration(progress * duration)}</span>
          <span>{active?.duration || formatDuration(duration)}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: "1.2rem" }}>
        <p className="eyebrow" style={{ margin: 0 }}>Tracklist</p>
        <p className="eyebrow" style={{ margin: 0, color: "var(--muted)" }}>
          {String(tracks.length).padStart(2, "0")} {tracks.length === 1 ? "TRACK" : "TRACKS"}
        </p>
      </div>
      <ul
        className="music-tracklist"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          maxHeight: tracks.length > 8 ? "420px" : "none",
          overflowY: tracks.length > 8 ? "auto" : "visible",
        }}
      >
        {tracks.map((t, i) => (
          <li key={t.title || i} style={{ borderTop: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={() => selectTrack(i)}
              {...cursor("PLAY")}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "0.9rem 0.2rem",
                color: i === activeIndex ? "var(--accent-amber)" : "var(--fg)",
                textAlign: "left",
              }}
            >
              <span>
                <span className="eyebrow" style={{ marginRight: "0.8rem" }}>{String(i + 1).padStart(2, "0")}</span>
                {t.title}
                {t.youtubeId ? <span className="eyebrow" style={{ marginLeft: "0.6rem", color: "var(--accent-rose-bright)" }}>YT</span> : null}
              </span>
              <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{t.duration}</span>
            </button>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes barPulse {
          from { transform: scaleY(0.85); }
          to { transform: scaleY(1.15); }
        }
        .music-tracklist {
          scrollbar-width: thin;
          scrollbar-color: var(--accent-amber-dim) transparent;
        }
        .music-tracklist::-webkit-scrollbar {
          width: 4px;
        }
        .music-tracklist::-webkit-scrollbar-thumb {
          background: var(--accent-amber-dim);
        }
      `}</style>
    </div>
  );
});
