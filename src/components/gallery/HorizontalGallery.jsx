import React, { useRef } from "react";
import { LazyVideo } from "../media/LazyVideo.jsx";
import { LazyImage } from "../media/LazyImage.jsx";
import { EmptyState } from "../media/EmptyState.jsx";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

// A large-scale horizontal-scrolling strip used by Cinematography and
// Photography — deliberately not a boring uniform card grid.
export function HorizontalGallery({ items = [], type = "video", emptyLabel }) {
  const trackRef = useRef(null);
  const cursor = useCursorVariant();

  const scrollBy = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 520, behavior: "smooth" });
  };

  if (!items.length) {
    return <EmptyState label={emptyLabel || "Media coming soon"} hint="Drop files into public/assets and register them in src/data/media.js" />;
  }

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: "1.2rem",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: "1rem",
        }}
        className="gallery-track"
      >
        {items.map((item, i) => (
          <figure
            key={item.title ? `${item.title}-${i}` : i}
            {...cursor(type === "video" ? "PLAY" : "VIEW")}
            style={{
              margin: 0,
              flex: "0 0 auto",
              width: "min(78vw, 620px)",
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ width: "100%", aspectRatio: "16 / 10", background: "var(--bg-alt)", flex: "0 0 auto" }}>
              {type === "video" ? (
                <LazyVideo src={item.video} poster={item.thumbnail} style={{ width: "100%", height: "100%" }} objectFit="contain" />
              ) : (
                <LazyImage src={item.image} alt={item.title || ""} style={{ width: "100%", height: "100%" }} />
              )}
            </div>
            <figcaption style={{ marginTop: "0.8rem", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.05rem" }}>
                {item.title}
              </span>
              <span className="eyebrow" style={{ whiteSpace: "nowrap" }}>
                {[item.category, item.year].filter(Boolean).join(" · ")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.6rem" }}>
        <button type="button" onClick={() => scrollBy(-1)} className="eyebrow" {...cursor("DRAG")} aria-label="Scroll left">
          ← PREV
        </button>
        <button type="button" onClick={() => scrollBy(1)} className="eyebrow" {...cursor("DRAG")} aria-label="Scroll right">
          NEXT →
        </button>
      </div>
    </div>
  );
}
