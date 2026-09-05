import React from "react";
import { ModalShell } from "./ModalShell.jsx";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

// "View All" popup for the tracklist — mainly useful once the library
// gets large; picking a track here jumps the main player straight to it.
export function ViewAllAudioModal({ tracks = [], onSelect, onClose }) {
  const cursor = useCursorVariant();

  return (
    <ModalShell title="Audio" onClose={onClose}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {tracks.map((t, i) => (
          <li key={t.title || i} style={{ borderTop: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={() => {
                onSelect(i);
                onClose();
              }}
              {...cursor("PLAY")}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                padding: "1rem 0.2rem",
                textAlign: "left",
              }}
            >
              <span>
                <span className="eyebrow" style={{ marginRight: "0.8rem" }}>{String(i + 1).padStart(2, "0")}</span>
                {t.title}
                {t.youtubeId ? <span className="eyebrow" style={{ marginLeft: "0.6rem", color: "var(--accent-rose-bright)" }}>YT</span> : null}
              </span>
              <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{t.duration}</span>
            </button>
          </li>
        ))}
      </ul>
    </ModalShell>
  );
}
