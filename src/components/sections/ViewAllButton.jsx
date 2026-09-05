import React from "react";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

export function ViewAllButton({ onClick, count }) {
  const cursor = useCursorVariant();
  if (!count) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      {...cursor("VIEW")}
      className="eyebrow"
      style={{
        marginTop: "1rem",
        border: "1px solid var(--line)",
        padding: "0.6rem 1.1rem",
        display: "inline-block",
      }}
    >
      VIEW ALL ({count}) →
    </button>
  );
}
