import React, { useState } from "react";
import { useInViewport } from "../../hooks/useInViewport.js";
import { EmptyState } from "./EmptyState.jsx";

// Fades an image in once it has actually loaded and is in view — avoids
// pop-in and keeps the gallery feeling deliberate rather than jumpy.
export function LazyImage({ src, alt = "", className, style, emptyLabel = "Image coming soon" }) {
  const [wrapperRef, inView] = useInViewport({ threshold: 0.1 });
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <div ref={wrapperRef} className={className} style={style}>
        <EmptyState label={emptyLabel} />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={className} style={{ ...style, overflow: "hidden", background: "var(--bg-alt)" }}>
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s var(--ease-cinematic)",
          }}
        />
      )}
    </div>
  );
}
