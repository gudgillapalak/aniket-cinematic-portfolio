import React from "react";
import { LazyImage } from "../media/LazyImage.jsx";
import { EmptyState } from "../media/EmptyState.jsx";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

// Editorial Frames layout:
// - First image is a large "hero" frame spanning 2 columns at 3:2 ratio
// - Remaining images fill a 3-column grid at uniform 4:5 ratio
// - Every image uses object-fit: cover so no frame is cropped to invisibility
// - Grid collapses gracefully to 2 cols on tablet, 1 col on mobile
export function FrameGrid({ items = [], onOpen }) {
  const cursor = useCursorVariant();

  if (!items.length) {
    return (
      <EmptyState
        label="Frames coming soon"
        hint="Drop images into public/assets/images/frames and register them in src/data/media.js"
      />
    );
  }

  const [featured, ...rest] = items;

  return (
    <div className="frame-editorial">
      {/* Featured first frame — spans 2 columns */}
      <figure
        className="frame-featured"
        onClick={() => onOpen?.(0)}
        {...cursor("VIEW")}
        style={{ margin: 0, cursor: onOpen ? "pointer" : "default" }}
      >
        <div style={{ aspectRatio: "3 / 2", background: "var(--bg-alt)", overflow: "hidden" }}>
          <LazyImage
            src={featured.image}
            alt={featured.title || ""}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        {(featured.title || featured.category) && (
          <figcaption style={{ marginTop: "0.6rem", display: "flex", justifyContent: "space-between", gap: "0.8rem" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1rem" }}>
              {featured.title}
            </span>
            <span className="eyebrow" style={{ whiteSpace: "nowrap" }}>{featured.category}</span>
          </figcaption>
        )}
      </figure>

      {/* Remaining frames — uniform 4:5 portrait grid */}
      {rest.map((item, i) => (
        <figure
          key={item.title ? `${item.title}-${i}` : i + 1}
          onClick={() => onOpen?.(i + 1)}
          {...cursor("VIEW")}
          style={{ margin: 0, cursor: onOpen ? "pointer" : "default" }}
        >
          <div style={{ aspectRatio: "4 / 5", background: "var(--bg-alt)", overflow: "hidden" }}>
            <LazyImage
              src={item.image}
              alt={item.title || ""}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {(item.title || item.category) && (
            <figcaption style={{ marginTop: "0.5rem", display: "flex", justifyContent: "space-between", gap: "0.8rem" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.9rem" }}>
                {item.title}
              </span>
              <span className="eyebrow" style={{ whiteSpace: "nowrap", fontSize: "0.62rem" }}>{item.category}</span>
            </figcaption>
          )}
        </figure>
      ))}

      <style>{`
        .frame-editorial {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          align-items: start;
        }
        .frame-featured {
          grid-column: span 2;
        }
        @media (max-width: 720px) {
          .frame-editorial {
            grid-template-columns: repeat(2, 1fr);
          }
          .frame-featured {
            grid-column: span 2;
          }
        }
        @media (max-width: 480px) {
          .frame-editorial {
            grid-template-columns: 1fr;
          }
          .frame-featured {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
