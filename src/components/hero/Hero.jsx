import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { profile } from "../../data/profile.js";
import { media } from "../../data/media.js";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";
import { HeroObject } from "../three/HeroObject.jsx";

// The strongest screen on the site. Uses the real hero video if one has
// been registered in src/data/media.js; otherwise opens on the cinematic
// title card alone — never a stock/fake video.
export function Hero() {
  const videoRef = useRef(null);
  const rootRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const cursor = useCursorVariant();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-line",
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.08, delay: 0.15 }
      );
      gsap.fromTo(
        ".hero-sub",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.7 }
      );
      gsap.to(".hero-scroll", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
      });

      // Subtle parallax on the media layer as the user scrolls.
      gsap.to(".hero-media", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const words = profile.tagline.split(" ");

  return (
    <section
      id="top"
      ref={rootRef}
      style={{
        position: "relative",
        height: "100svh",
        minHeight: 560,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      <div className="hero-media" style={{ position: "absolute", inset: "-10% 0 0 0" }}>
        {media.heroVideo ? (
          <video
            ref={videoRef}
            src={media.heroVideo}
            poster={media.heroPoster || undefined}
            autoPlay
            muted={muted}
            loop
            playsInline
            style={{ width: "100%", height: "110%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "110%",
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(61,159,209,0.15), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(53,196,234,0.10), transparent 55%), var(--bg)",
            }}
          />
        )}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(7,11,16,0.35) 0%, rgba(7,11,16,0.55) 55%, var(--bg) 96%)",
          }}
        />
      </div>

      {media.heroVideo && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          {...cursor(muted ? "SOUND ON" : "SOUND OFF")}
          className="eyebrow"
          style={{
            position: "absolute",
            top: "6rem",
            right: "1.6rem",
            zIndex: 2,
            border: "1px solid var(--line)",
            padding: "0.5rem 0.9rem",
          }}
        >
          {muted ? "Sound Off" : "Sound On"}
        </button>
      )}

      <div
        className="hero-object hero-sub"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          right: "2%",
          width: "min(44vw, 500px)",
          height: "min(44vw, 500px)",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        <HeroObject />
      </div>

      <div style={{ position: "relative", zIndex: 2, padding: "0 1.6rem var(--space-6)" }}>
        <p className="eyebrow hero-sub" style={{ marginBottom: "0.8rem" }}>
          {profile.roles.join(" · ")}
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "clamp(2rem, 7.5vw, 5.8rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {words.map((word, i) => (
            <span key={i} style={{ display: "block", overflow: "visible", paddingBottom: "0.08em" }}>
              <span className="hero-line" style={{ display: "inline-block" }}>
                {word}
              </span>
            </span>
          ))}
        </h1>
        <p
          className="hero-sub"
          style={{
            marginTop: "1.6rem",
            maxWidth: "56ch",
            color: "var(--muted)",
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 2vw, 1.3rem)",
          }}
        >
          {profile.summary}
        </p>
      </div>

      <div
        className="hero-scroll"
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "1.4rem",
          left: "1.6rem",
          zIndex: 2,
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          color: "var(--muted)",
        }}
      >
        ↓ SCROLL TO ENTER
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-object { display: none; }
        }
      `}</style>
    </section>
  );
}
