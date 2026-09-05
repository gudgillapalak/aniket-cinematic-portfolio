import React, { useState } from "react";
import { media } from "../../data/media.js";
import { LazyVideo } from "../media/LazyVideo.jsx";
import { HorizontalGallery } from "../gallery/HorizontalGallery.jsx";
import { ReelModal } from "../video/ReelModal.jsx";
import { ViewAllMediaModal } from "../modal/ViewAllMediaModal.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { ViewAllButton } from "./ViewAllButton.jsx";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

// One combined home for every moving-image piece — cinematography, edits,
// anything shot and cut. An optional showreel plays up top; every clip in
// media.videos lives in the gallery below it.
export function Videos() {
  const [reelOpen, setReelOpen] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const cursor = useCursorVariant();
  const reel = media.showreel;

  return (
    <section id="videos" className="section">
      <SectionHeader
        eyebrow="Behind the Lens & the Cut"
        title="Videos"
        description="Shot, then carried through post-production and grading — cinematography and edits in one reel."
        index="02"
      />

      {reel?.video && (
        <div style={{ position: "relative", aspectRatio: "21 / 9", marginBottom: "var(--space-4)" }}>
          <LazyVideo src={reel.video} poster={reel.poster} style={{ width: "100%", height: "100%" }} autoPlayInView />
          <button
            type="button"
            onClick={() => setReelOpen(true)}
            {...cursor("PLAY")}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(0deg, rgba(7,11,16,0.5), transparent 40%)",
            }}
          >
            <span
              className="eyebrow"
              style={{ border: "1px solid var(--fg)", padding: "0.9rem 1.6rem", fontSize: "0.85rem" }}
            >
              PLAY REEL
            </span>
          </button>
        </div>
      )}

      <HorizontalGallery items={media.videos} type="video" emptyLabel="Videos coming soon" />
      <ViewAllButton count={media.videos.length} onClick={() => setViewAll(true)} />

      {reelOpen && reel?.video && (
        <ReelModal src={reel.video} poster={reel.poster} title="Showreel" onClose={() => setReelOpen(false)} />
      )}
      {viewAll && (
        <ViewAllMediaModal title="Videos" items={media.videos} type="video" onClose={() => setViewAll(false)} />
      )}
    </section>
  );
}
