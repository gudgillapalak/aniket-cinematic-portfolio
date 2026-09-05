import { useEffect, useRef, useState } from "react";

// Tracks whether an element is intersecting the viewport. Used to lazy-load
// and pause/play media only when it's actually visible, per the performance
// requirements (don't load or play every video at once).
export function useInViewport(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}
