import { useState, useEffect } from "react";
import logo from "../../Public/small-logo.jpeg";
/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  background: "#0d0d0d",
  surfaceContainer: "#111",
  outline: "#2a2a2a",
  outlineVariant: "#1e1e1e",
  primary: "#ccff80",
  secondary: "#5de6ff",
  onSurface: "#f3f4f6",
  onSurfaceVariant: "#6b7280",
};

/* ─── Nav Styles (scoped) ───────────────────────────────────── */
const NAV_CSS = `
  @keyframes logoSlideIn {
    0% {
      transform: translateX(calc(50vw - 100%)) scale(1.6);
      opacity: 0;
    }
    60% {
      opacity: 1;
    }
    100% {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
  @keyframes navFadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ctaFadeIn {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes bannerSlide {
    from { opacity: 0; transform: translateY(-100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes dotBlink {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.25; }
  }
  @keyframes mobileMenuSlide {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .h2s-logo {
    animation: logoSlideIn 1.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .h2s-nav-item {
    animation: navFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  .h2s-cta {
    animation: ctaFadeIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s both;
  }
  .h2s-banner {
    animation: bannerSlide 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s both;
  }
  .h2s-dot {
    animation: dotBlink 2s ease-in-out infinite;
  }
  .h2s-nav-link {
    position: relative;
    transition: color 0.2s, background 0.2s;
  }
  .h2s-nav-link:hover {
    color: #f3f4f6 !important;
    background: rgba(255,255,255,0.04);
  }
  .h2s-nav-link.active {
    color: #ccff80 !important;
  }
  .h2s-nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 20px;
    right: 20px;
    height: 2px;
    background: #ccff80;
    border-radius: 2px;
  }
  .h2s-cta-btn:hover {
    background: #b8f55a !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(204,255,128,0.22);
  }
  .h2s-banner-cta:hover {
    background: #ccff80 !important;
    color: #0d0d0d !important;
  }

  /* Hamburger button — hidden on desktop */
  .h2s-burger { display: none; }

  /* Mobile drawer links */
  .h2s-mobile-link {
    position: relative;
    transition: color 0.2s, background 0.2s;
  }
  .h2s-mobile-link:hover { background: rgba(255,255,255,0.04); }
  .h2s-mobile-link.active { color: #ccff80 !important; }

  @media (max-width: 900px) {
    .h2s-nav-links { display: none !important; }
    .h2s-header { padding: 0 24px !important; height: 80px !important; }
    .h2s-banner { padding: 12px 24px !important; flex-wrap: wrap; }
    /* Hide the desktop CTA, show the burger instead */
    .h2s-cta-desktop { display: none !important; }
    .h2s-burger {
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 46px; height: 46px;
      border-radius: 10px;
      border: 1px solid ${C.outline};
      background: ${C.surfaceContainer};
      color: ${C.onSurface};
      cursor: pointer;
      flex-shrink: 0;
      transition: border-color 0.2s, color 0.2s;
    }
    .h2s-burger:hover { border-color: ${C.primary}; color: ${C.primary}; }
  }

  @media (max-width: 480px) {
    .h2s-header { padding: 0 16px !important; }
    .h2s-logo-text { font-size: 19px !important; }
    .h2s-logo-box { width: 48px !important; height: 48px !important; }
  }
`;

/* ─── NAV LINKS ──────────────────────────────────────────────── */
const NAV_LINKS = [
  { id: "home",      label: "Home",      icon: true,  target: "top" },
  { id: "services",  label: "Services",  icon: false, target: "services" },
  { id: "why-us",    label: "Expertise", icon: false, target: "why-us" },
  { id: "portfolio", label: "Work",      icon: false, target: "portfolio" },
  { id: "contact",   label: "Contact",   icon: false, target: "contact" },
];

/* ─── Component ──────────────────────────────────────────────── */
export default function Nav({ openContact }) {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  // Track which section is in view for the active underline
  useEffect(() => {
    const sectionIds = NAV_LINKS.filter((l) => l.target !== "top").map((l) => l.target);
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const link = NAV_LINKS.find((l) => l.target === id);
            if (link) setActive(link.id);
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });

    // "Home" active when scrolled near top
    const onScroll = () => {
      if (window.scrollY < 200) setActive("home");
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      observers.forEach((o) => o && o.disconnect());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu on Escape; lock body scroll while open
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goTo = (link) => {
    setActive(link.id);
    if (link.target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(link.target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClick = (link) => (e) => {
    e.preventDefault();
    goTo(link);
  };

  const handleMobileClick = (link) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    // slight delay so the drawer closes before scrolling
    setTimeout(() => goTo(link), 80);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setActive("home");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style>{NAV_CSS}</style>

      {/* HEADER */}
      <header
        className="h2s-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: C.background,
          borderBottom: `1px solid ${C.outlineVariant}`,
          padding: "0 64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 100,
          gap: 32,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* LOGO — slides in from center on load */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="h2s-logo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            className="h2s-logo-box"
            style={{
              width: 58,
              height: 58,
              borderRadius: 13,
              border: `1.5px solid ${C.outline}`,
              background: C.surfaceContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src={logo}
              alt="H2S Volt"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span
              className="h2s-logo-text"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 23,
                fontWeight: 700,
                color: C.onSurface,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              H2S VOLT
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                fontWeight: 700,
                color: C.primary,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              Engineering
            </span>
          </div>
        </a>

        {/* NAV LINKS (desktop) */}
        <nav
          className="h2s-nav-links"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flex: 1,
            justifyContent: "center",
          }}
        >
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.id}
              href="#"
              onClick={handleClick(link)}
              className={`h2s-nav-link h2s-nav-item ${active === link.id ? "active" : ""}`}
              style={{
                animationDelay: `${0.2 + idx * 0.08}s`,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: C.onSurfaceVariant,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                borderRadius: 7,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {link.icon && (
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                  home
                </span>
              )}
              {link.label}
              {/* Divider after Home */}
              {link.id === "home" && (
                <span
                  style={{
                    position: "absolute",
                    right: -6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 1,
                    height: 22,
                    background: C.outlineVariant,
                  }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* CTA BUTTON (desktop) */}
        <button
          onClick={openContact}
          className="h2s-cta h2s-cta-btn h2s-cta-desktop"
          style={{
            background: C.primary,
            color: C.background,
            border: "none",
            padding: "15px 30px",
            borderRadius: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 9,
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            send
          </span>
          Send Inquiry
        </button>

        {/* HAMBURGER (mobile) */}
        <button
          className="h2s-burger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 26 }}>
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              top: 80,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 90,
            }}
          />
          {/* Panel */}
          <div
            style={{
              position: "fixed",
              top: 80,
              left: 0,
              right: 0,
              zIndex: 95,
              background: C.background,
              borderBottom: `1px solid ${C.outlineVariant}`,
              padding: "16px 24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              animation: "mobileMenuSlide 0.25s cubic-bezier(0.16,1,0.3,1) both",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href="#"
                onClick={handleMobileClick(link)}
                className={`h2s-mobile-link ${active === link.id ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "16px 14px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  fontWeight: 700,
                  color: active === link.id ? C.primary : C.onSurface,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  borderRadius: 8,
                  textDecoration: "none",
                  borderBottom: `1px solid ${C.outlineVariant}`,
                }}
              >
                {link.icon && (
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    home
                  </span>
                )}
                {link.label}
              </a>
            ))}

            {/* CTA inside the drawer */}
            <button
              onClick={() => { setMenuOpen(false); openContact && openContact(); }}
              className="h2s-cta-btn"
              style={{
                marginTop: 14,
                background: C.primary,
                color: C.background,
                border: "none",
                padding: "16px",
                borderRadius: 8,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                transition: "background 0.2s, transform 0.15s, box-shadow 0.2s",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                send
              </span>
              Send Inquiry
            </button>
          </div>
        </>
      )}
    </>
  );
}