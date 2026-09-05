import React, { useState } from "react";
import { ModalShell } from "./ModalShell.jsx";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

// "View All" popup for a video or image gallery — shows every item in a
// grid at once (no scrolling strip hiding anything), and clicking one
// opens it large right there in the same modal.
export function ViewAllMediaModal({ title, items = [], type = "video", onClose }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const cursor = useCursorVariant();
  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <ModalShell title={title} onClose={onClose} wide>
      {active ? (
        <div>
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="eyebrow"
            style={{ marginBottom: "1rem" }}
          >
            ← BACK TO ALL
          </button>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {type === "video" ? (
              <video
                src={active.video}
                poster={active.thumbnail}
                controls
                autoPlay
                playsInline
                style={{ maxWidth: "100%", maxHeight: "70vh" }}
              />
            ) : (
              <img
                src={active.image}
                alt={active.title || ""}
                style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain" }}
              />
            )}
          </div>
          {(active.title || active.category) && (
            <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--muted)" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--fg)" }}>{active.title}</span>
              {active.category ? ` — ${active.category}` : ""}
              {active.year ? ` · ${active.year}` : ""}
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {items.map((item, i) => (
            <figure
              key={item.title ? `${item.title}-${i}` : i}
              onClick={() => setActiveIndex(i)}
              {...cursor(type === "video" ? "PLAY" : "VIEW")}
              style={{ margin: 0, cursor: "pointer" }}
            >
              <div style={{ aspectRatio: "4 / 3", background: "var(--bg-alt)", overflow: "hidden" }}>
                {type === "video" ? (
                  item.thumbnail ? (
                    <img src={item.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <video src={item.video} muted playsInline preload="metadata" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )
                ) : (
                  <img src={item.image} alt={item.title || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              <figcaption style={{ marginTop: "0.4rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </ModalShell>
  );
}
