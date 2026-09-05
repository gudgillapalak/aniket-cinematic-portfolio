import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const WORDS = ["FILM.", "MUSIC.", "VISUALS."];

// The opening title sequence — a black screen that states the four pillars
// of Aniket's practice one at a time before revealing the site. Runs once
// per session (sessionStorage), so returning visitors who reload a section
// anchor aren't forced through it again.
export function Intro({ onDone }) {
  const rootRef = useRef(null);
  const wordRef = useRef(null);
  const [skip] = useState(() => {
    try {
      return sessionStorage.getItem("intro-seen") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (skip) {
      onDone();
      return undefined;
    }

    try {
      sessionStorage.setItem("intro-seen", "1");
    } catch {
      /* ignore */
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: onDone,
        });
      },
    });

    WORDS.forEach((word, i) => {
      tl.set(wordRef.current, { textContent: word })
        .fromTo(
          wordRef.current,
          { autoAlpha: 0, y: 24, letterSpacing: "0.4em" },
          { autoAlpha: 1, y: 0, letterSpacing: "0.02em", duration: 0.55, ease: "power3.out" }
        )
        .to(wordRef.current, { autoAlpha: 0, y: -16, duration: 0.4, ease: "power2.in" }, "+=0.35");
      if (i === WORDS.length - 1) {
        tl.to({}, { duration: 0.1 });
      }
    });

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skip) return null;

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 500,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
      }}
    >
      <span
        ref={wordRef}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          textTransform: "uppercase",
          fontSize: "clamp(2.5rem, 10vw, 7rem)",
          color: "var(--fg)",
        }}
      />
      <span
        className="eyebrow"
        style={{ position: "absolute", bottom: "2.4rem" }}
      >
        Aniket Bhanjadeo
      </span>
    </div>
  );
}
