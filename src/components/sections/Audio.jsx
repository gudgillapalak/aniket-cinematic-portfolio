import React, { useRef, useState } from "react";
import { media } from "../../data/media.js";
import { MusicPlayer } from "../music/MusicPlayer.jsx";
import { ViewAllAudioModal } from "../modal/ViewAllAudioModal.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { ViewAllButton } from "./ViewAllButton.jsx";

// Reads tracks directly from src/data/media.js — drop your files into
// public/assets/music/tracks/ and register them there. No API needed.
export function Audio() {
  const [viewAll, setViewAll] = useState(false);
  const playerRef = useRef(null);
  const tracks = media.audio;

  return (
    <section id="audio" className="section">
      <SectionHeader
        eyebrow="Written, Sung, Mixed"
        title="Audio"
        description="Original tracks written and performed, mixed, mastered, and engineered start to finish."
        index="03"
      />
      <MusicPlayer ref={playerRef} tracks={tracks} />
      <ViewAllButton count={tracks.length} onClick={() => setViewAll(true)} />
      {viewAll && (
        <ViewAllAudioModal
          tracks={tracks}
          onSelect={(i) => playerRef.current?.playTrack(i)}
          onClose={() => setViewAll(false)}
        />
      )}
    </section>
  );
}
