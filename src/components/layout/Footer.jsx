import React from "react";
import { profile } from "../../data/profile.js";
import { socialLinks, contact } from "../../data/social.js";
import { media } from "../../data/media.js";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

export function Footer() {
  const cursor = useCursorVariant();
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      style={{
        borderTop: "1px solid var(--line)",
        padding: "var(--space-6) var(--space-4) var(--space-4)",
      }}
    >
      <div className="section" style={{ padding: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: "clamp(1.8rem, 6vw, 4rem)",
            lineHeight: 1,
            maxWidth: "18ch",
          }}
        >
          The story is still being written.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2.5rem",
            marginTop: "var(--space-5)",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p className="eyebrow">Contact</p>
            <p style={{ marginTop: "0.6rem" }}>
              <a href={`mailto:${contact.email}`} {...cursor("OPEN")}>
                {contact.email}
              </a>
            </p>
            <p style={{ marginTop: "0.3rem", color: "var(--muted)" }}>{contact.phone}</p>
            <p style={{ marginTop: "0.3rem", color: "var(--muted)" }}>{contact.location}</p>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="eyebrow">Social</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.6rem" }}>
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.url} target="_blank" rel="noreferrer" {...cursor("OPEN")}>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div id="cv">
            <p className="eyebrow">Resume</p>
            <a
              href={media.cv}
              target="_blank"
              rel="noreferrer"
              {...cursor("VIEW")}
              style={{
                display: "inline-block",
                marginTop: "0.6rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
                border: "1px solid var(--line)",
                padding: "0.6rem 1.1rem",
              }}
            >
              VIEW / DOWNLOAD CV
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: "var(--space-6)",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.6rem",
            color: "var(--muted-dim)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.66rem",
            letterSpacing: "0.08em",
          }}
        >
          <span>© {year} {profile.name.toUpperCase()}</span>
          <span>FILM — MUSIC — VISUALS</span>
        </div>
      </div>
    </footer>
  );
}
