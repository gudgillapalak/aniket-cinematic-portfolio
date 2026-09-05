import React, { useEffect, useRef, useState } from "react";
import { useInViewport } from "../../hooks/useInViewport.js";
import { EmptyState } from "./EmptyState.jsx";

// A <video> that only loads metadata until it's near the viewport, then
// plays while visible and pauses the moment it scrolls off — this is the
// core of the "don't load every video at once" performance requirement.
export function LazyVideo({
  src,
  poster,
  className,
  style,
  autoPlayInView = true,
  loop = true,
  muted = true,
  controls = false,
  objectFit = "cover",
  emptyLabel = "Video coming soon",
  emptyHint,
  ...rest
}) {
  const [wrapperRef, inView] = useInViewport({ threshold: 0.35 });
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !inView) return;
    // Force the browser to (re)run its resource-selection algorithm now
    // that a real src is set — some browsers don't reliably pick this up
    // from the attribute change alone when it was previously undefined.
    el.load();
    if (autoPlayInView) {
      el.play().catch(() => {
        /* autoplay can be blocked; the video is still loaded and visible */
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !autoPlayInView) return;
    if (!inView) el.pause();
  }, [inView, autoPlayInView]);

  if (!src) {
    return (
      <div ref={wrapperRef} className={className} style={style}>
        <EmptyState label={emptyLabel} hint={emptyHint} />
      </div>
    );
  }

  if (failed) {
    return (
      <div ref={wrapperRef} className={className} style={style}>
        <EmptyState
          label="Video failed to load"
          hint={`Check that ${src} exists and is a browser-playable format (H.264 .mp4 is safest)`}
        />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={className} style={{ ...style, overflow: "hidden", background: "#000" }}>
      <video
        ref={videoRef}
        src={inView ? src : undefined}
        poster={poster || undefined}
        preload={inView ? "auto" : "metadata"}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit, display: "block" }}
        {...rest}
      />
    </div>
  );
}
