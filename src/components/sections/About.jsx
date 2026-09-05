import React from "react";
import { experience, education, skills, languages, certifications } from "../../data/profile.js";
import { SectionHeader } from "./SectionHeader.jsx";

export function About() {
  return (
    <section id="about" className="section">
      <SectionHeader eyebrow="Identity" title="About" index="01" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--space-5)",
        }}
      >
        <div>
          <p className="eyebrow">Experience</p>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            {experience.map((role) => (
              <div key={role.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 500 }}>{role.title}</span>
                  <span className="eyebrow" style={{ color: "var(--muted)" }}>{role.period}</span>
                </div>
                {role.points.map((p, i) => (
                  <p key={i} style={{ color: "var(--muted)", marginTop: "0.4rem", fontSize: "0.92rem" }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">Education</p>
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            {education.map((ed) => (
              <div key={ed.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 500 }}>{ed.title}</span>
                  <span className="eyebrow" style={{ color: "var(--muted)" }}>{ed.period}</span>
                </div>
                <p style={{ color: "var(--muted)", marginTop: "0.3rem", fontSize: "0.92rem" }}>{ed.org}</p>
                {ed.points.map((p, i) => (
                  <p key={i} style={{ color: "var(--muted)", marginTop: "0.3rem", fontSize: "0.88rem" }}>
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <p className="eyebrow" style={{ marginTop: "2rem" }}>Skills</p>
          <p style={{ marginTop: "0.6rem", color: "var(--muted)" }}>{skills.join(" · ")}</p>

          <p className="eyebrow" style={{ marginTop: "1.4rem" }}>Certifications</p>
          <p style={{ marginTop: "0.6rem", color: "var(--muted)" }}>{certifications.join(" · ")}</p>

          <p className="eyebrow" style={{ marginTop: "1.4rem" }}>Languages</p>
          <p style={{ marginTop: "0.6rem", color: "var(--muted)" }}>{languages.join(" · ")}</p>
        </div>
      </div>
    </section>
  );
}
