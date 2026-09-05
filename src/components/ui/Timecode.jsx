import React, { useEffect, useRef, useState } from "react";
import { formatTimecode } from "../../utils/formatTimecode.js";

// Signature motif: a running timecode readout fixed in the corner,
// referencing Aniket's identity as an editor/cinematographer. Purely
// decorative/atmospheric — pauses respectfully under reduced-motion.
export function Timecode() {
  const [seconds, setSeconds] = useState(0);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reduced.current) return undefined;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      setSeconds((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: "1.4rem",
        right: "1.4rem",
        zIndex: 150,
        fontFamily: "var(--font-mono)",
        fontSize: "0.68rem",
        letterSpacing: "0.1em",
        color: "var(--muted-dim)",
        pointerEvents: "none",
        mixBlendMode: "difference",
      }}
      className="timecode-hide-mobile"
    >
      REC {formatTimecode(seconds)}
    </div>
  );
}
