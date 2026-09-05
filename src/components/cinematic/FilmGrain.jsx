import React, { useEffect, useRef } from "react";

// Subtle animated film-grain overlay across the whole page. Cheap: draws
// static noise to a small canvas and tiles it via CSS rather than
// redrawing every frame at full resolution.
export function FilmGrain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const size = 128;
    canvas.width = size;
    canvas.height = size;

    let frame = 0;
    let raf;

    const draw = () => {
      frame += 1;
      if (frame % 3 === 0) {
        const imageData = ctx.createImageData(size, size);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const v = Math.random() * 255;
          imageData.data[i] = v;
          imageData.data[i + 1] = v;
          imageData.data[i + 2] = v;
          imageData.data[i + 3] = 30;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="grain-overlay"
      style={{
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
    />
  );
}
