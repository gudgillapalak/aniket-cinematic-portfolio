import React, { useState } from "react";
import { media } from "../../data/media.js";
import { FrameGrid } from "../gallery/FrameGrid.jsx";
import { ViewAllMediaModal } from "../modal/ViewAllMediaModal.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { ViewAllButton } from "./ViewAllButton.jsx";

export function Frames() {
  const [viewAll, setViewAll] = useState(false);

  return (
    <section id="frames" className="section">
      <SectionHeader eyebrow="Stills" title="Frames" index="04" />
      <FrameGrid items={media.frames} />
      <ViewAllButton count={media.frames.length} onClick={() => setViewAll(true)} />
      {viewAll && (
        <ViewAllMediaModal title="Frames" items={media.frames} type="image" onClose={() => setViewAll(false)} />
      )}
    </section>
  );
}
