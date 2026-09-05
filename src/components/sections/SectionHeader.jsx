import React from "react";

export function SectionHeader({ eyebrow, title, description, index }) {
  return (
    <div style={{ marginBottom: "var(--space-4)" }}>
      <p className="eyebrow">{index ? `${index} — ${eyebrow}` : eyebrow}</p>
      <h2 className="section-heading">{title}</h2>
      {description && (
        <p style={{ maxWidth: "60ch", color: "var(--muted)", fontSize: "1.05rem" }}>{description}</p>
      )}
    </div>
  );
}
