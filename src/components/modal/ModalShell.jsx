import React, { useEffect } from "react";

// Shared fullscreen overlay shell — Esc to close, scroll lock, click
// outside to dismiss. Used by every "View All" and lightbox popup so
// they all behave and feel identical.
export function ModalShell({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "rgba(7,11,16,0.97)",
        display: "flex",
        flexDirection: "column",
        padding: "2rem clamp(1rem, 4vw, 3rem)",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: wide ? "1400px" : "900px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.6rem" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
              margin: 0,
            }}
          >
            {title}
          </p>
          <button type="button" onClick={onClose} className="eyebrow">
            CLOSE ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
