import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Buttery smooth scrolling tied into GSAP's own ticker so ScrollTrigger
// stays perfectly in sync with it — this is what makes the section
// reveals and hero parallax feel like a continuous camera move rather
// than a series of separate scroll-jumps. Respects reduced-motion by
// simply not initializing (native scroll takes over).
export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    window.__lenis = lenis;

    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = null;
    };
  }, []);
}
