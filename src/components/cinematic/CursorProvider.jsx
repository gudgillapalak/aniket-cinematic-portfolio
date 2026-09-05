import React, { createContext, useEffect, useRef, useState } from "react";

export const CursorContext = createContext(null);

// Provides a custom cursor that reacts to hoverable content across the site
// ("VIEW", "PLAY", "DRAG", "OPEN"...). Falls back to the native cursor on
// touch/coarse-pointer devices so mobile is untouched.
export function CursorProvider({ children }) {
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const [variant, setVariant] = useState(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(isFine);
    if (!isFine) return undefined;

    document.body.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let raf;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
    };

    const render = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) {
    return <CursorContext.Provider value={{ setVariant: () => {} }}>{children}</CursorContext.Provider>;
  }

  return (
    <CursorContext.Provider value={{ setVariant }}>
      {children}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 999,
          pointerEvents: "none",
          width: variant ? 84 : 10,
          height: variant ? 84 : 10,
          borderRadius: "50%",
          border: variant ? "1px solid var(--accent-amber)" : "none",
          background: variant ? "rgba(53,196,234,0.10)" : "var(--fg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "width 0.25s var(--ease-cinematic), height 0.25s var(--ease-cinematic), background 0.25s, border 0.25s",
          mixBlendMode: variant ? "normal" : "difference",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "var(--accent-amber)",
            opacity: variant ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          {variant}
        </span>
      </div>
    </CursorContext.Provider>
  );
}
