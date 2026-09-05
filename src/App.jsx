import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { CursorProvider } from "./components/cinematic/CursorProvider.jsx";
import { FilmGrain } from "./components/cinematic/FilmGrain.jsx";
import { Intro } from "./components/cinematic/Intro.jsx";
import { Timecode } from "./components/ui/Timecode.jsx";
import { Navigation } from "./components/navigation/Navigation.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { Hero } from "./components/hero/Hero.jsx";
import { About } from "./components/sections/About.jsx";
import { Videos } from "./components/sections/Videos.jsx";
import { Audio } from "./components/sections/Audio.jsx";
import { Frames } from "./components/sections/Frames.jsx";
import { useSmoothScroll } from "./hooks/useSmoothScroll.js";

gsap.registerPlugin(ScrollTrigger);

// Each section gets a deliberately different entrance so the site reads
// as a sequence of edits/cuts rather than one repeated fade-up applied
// everywhere. Order matches the section order below.
const TRANSITIONS = [
  "wipe", // About  — clip-path reveal, like a curtain/iris opening
  "slide-right", // Videos — pans in from the left, like a dolly
  "scale", // Audio   — pushes forward out of black, like a zoom-in cut
  "wipe", // Frames  — another iris wipe, closing cut
];

const SECTIONS = [About, Videos, Audio, Frames];

function fromVarsFor(variant) {
  switch (variant) {
    case "wipe":
      return { clipPath: "inset(0 0 100% 0)", autoAlpha: 1 };
    case "scale":
      return { autoAlpha: 0, scale: 0.92 };
    case "slide-left":
      return { autoAlpha: 0, xPercent: 6, x: 48 };
    case "slide-right":
      return { autoAlpha: 0, xPercent: -6, x: -48 };
    case "fade-up":
    default:
      return { autoAlpha: 0, y: 40 };
  }
}

function toVarsFor(variant) {
  switch (variant) {
    case "wipe":
      return { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "power4.inOut" };
    case "scale":
      return { autoAlpha: 1, scale: 1, duration: 1, ease: "power3.out" };
    case "slide-left":
    case "slide-right":
      return { autoAlpha: 1, xPercent: 0, x: 0, duration: 1, ease: "power3.out" };
    case "fade-up":
    default:
      return { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" };
  }
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const contentRef = useRef(null);

  useSmoothScroll();

  useEffect(() => {
    if (!introDone) return undefined;

    const ctx = gsap.context(() => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        const variant = el.dataset.reveal || "fade-up";
        gsap.fromTo(el, fromVarsFor(variant), {
          ...toVarsFor(variant),
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
            once: true,
          },
        });
      });

      // Hairline dividers draw themselves in left-to-right, like a
      // record scratch cueing the next cut, instead of just appearing.
      document.querySelectorAll(".hairline").forEach((hr) => {
        gsap.fromTo(
          hr,
          { scaleX: 0, transformOrigin: "0% 50%" },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power2.inOut",
            scrollTrigger: { trigger: hr, start: "top 90%", once: true },
          }
        );
      });

      ScrollTrigger.refresh();
    }, contentRef);

    return () => ctx.revert();
  }, [introDone]);

  return (
    <CursorProvider>
      <FilmGrain />
      <Timecode />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <Navigation />
      <main ref={contentRef}>
        <Hero />
        {SECTIONS.map((Section, i) => (
          <React.Fragment key={Section.name}>
            <div data-reveal={TRANSITIONS[i]}>
              <Section />
            </div>
            {i < SECTIONS.length - 1 && <hr className="hairline" />}
          </React.Fragment>
        ))}
      </main>
      <Footer />
    </CursorProvider>
  );
}
