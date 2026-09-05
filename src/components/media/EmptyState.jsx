import React from "react";

// Graceful placeholder for any media slot that hasn't been filled in yet.
// Never presents fake/stock media as if it were finished work — this is
// the only thing shown until a real file is registered in src/data/media.js.
export function EmptyState({ label = "Media coming soon", hint }) {
  return (
    <div className="empty-state">
      <div>
        <div>{label}</div>
        {hint && (
          <div style={{ marginTop: "0.5rem", opacity: 0.7, fontSize: "0.65rem" }}>
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}
