import React, { useEffect } from "react";

export function ReelModal({ src, poster, title, onClose }) {
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
        background: "rgba(7,11,16,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="eyebrow"
        style={{ position: "absolute", top: "1.6rem", right: "1.8rem" }}
      >
        CLOSE ✕
      </button>
      <video
        src={src}
        poster={poster || undefined}
        controls
        autoPlay
        playsInline
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "80vh" }}
      />
    </div>
  );
}
