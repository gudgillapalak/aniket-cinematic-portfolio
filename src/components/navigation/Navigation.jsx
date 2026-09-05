import React, { useEffect, useState } from "react";
import { navigation } from "../../data/navigation.js";
import { profile } from "../../data/profile.js";
import { useCursorVariant } from "../../hooks/useCursorVariant.js";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cursor = useCursorVariant();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -12, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.2rem 1.6rem",
          background: scrolled ? "rgba(7,11,16,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNav("#top");
          }}
          {...cursor("OPEN")}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            fontSize: "1rem",
            textTransform: "uppercase",
          }}
        >
          {profile.name.split(" ")[0]}
        </a>

        <nav
          aria-label="Primary"
          style={{ display: "flex", gap: "1.8rem" }}
          className="nav-desktop"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              {...cursor("VIEW")}
              onClick={(e) => {
                e.preventDefault();
                handleNav(item.href);
              }}
              className="eyebrow"
              style={{ fontSize: "0.68rem" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="eyebrow nav-menu-btn"
          {...cursor("MENU")}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </header>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 290,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1.2rem",
            padding: "2rem",
          }}
        >
          {navigation.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNav(item.href);
              }}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "clamp(2rem, 9vw, 3.5rem)",
                color: "var(--fg)",
                opacity: 0,
                animation: `navFadeIn 0.5s ${0.05 * i}s var(--ease-cinematic) forwards`,
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @keyframes navFadeIn {
          to { opacity: 1; transform: translateY(0); }
          from { transform: translateY(12px); }
        }
        .nav-menu-btn { display: none; }
        @media (max-width: 780px) {
          .nav-desktop { display: none; }
          .nav-menu-btn { display: inline-flex; }
        }
      `}</style>
    </>
  );
}
