import { useState, useEffect, useRef } from "react";
import logo from "../Public/small-logo.jpeg";
import Nav from "./components/Nav.jsx";/* ─── Design Tokens ─────────────────────────────────────────── */
import amlImage from "../Public/AML.jpeg";
import cyberImage from "../Public/Cyber-aware.jpeg";
import emailjs from "@emailjs/browser";
const C = {
  background: "#0D0D0D",
  surface: "#0D0D0D",
  surfaceContainer: "#0f100d",
  surfaceContainerHigh: "#1a1a17",
  outline: "#2a2a2a",
  outlineVariant: "#1e1e1e",
  primary: "#ccff80",
  secondary: "#5de6ff",
  onBackground: "#f3f4f6",
  onSurface: "#f3f4f6",
  onSurfaceVariant: "#9ca3af",
};

/* ─── Inquiry Helper ─────────────────────────────────────────── */
/* Centralized send so every form/button uses the same logic.
   Saves the query (including referral + sender's email) to a Google
   Sheet AND sends the notification emails via EmailJS. */
async function sendInquiry(form) {
  const payload = {
    name: form.name,
    email: form.email,
    message: form.message,
    service: form.service || "Not specified",
    referral: form.hasReferral === "yes" ? "Yes" : "No",
    referral_type: form.hasReferral === "yes" ? form.referralType : "N/A",
    referral_contact: form.hasReferral === "yes" ? form.referralContact : "N/A",
  };

  /* 1) Save to Google Sheet (persistent record of email + referral). */
  const SHEET_ENDPOINT = import.meta.env.VITE_SHEET_ENDPOINT;
  const saveToSheet = SHEET_ENDPOINT
    ? fetch(SHEET_ENDPOINT, {
        method: "POST",
        // 'no-cors' avoids CORS errors with Apps Script; the row still
        // gets written. We can't read the response body in this mode.
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    : Promise.resolve();

  /* 2) Send notification emails via EmailJS. */
  const SERVICE_ID      = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const PUBLIC_KEY      = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const TEMPLATE_USER   = import.meta.env.VITE_EMAILJS_TEMPLATE_USER;
  const TEMPLATE_NOTIFY = import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFY;

  await Promise.all([
    saveToSheet,
    emailjs.send(SERVICE_ID, TEMPLATE_USER,   payload, PUBLIC_KEY),
    emailjs.send(SERVICE_ID, TEMPLATE_NOTIFY, payload, PUBLIC_KEY),
  ]);
}

/* Maps the chosen referral type to an input type + placeholder. */
const REFERRAL_FIELDS = {
  email:   { label: "Referral Email",        placeholder: "referrer@email.com", type: "email" },
  linkedin:{ label: "Referral LinkedIn URL", placeholder: "linkedin.com/in/...", type: "text" },
  contact: { label: "Referral Contact No.",  placeholder: "+92 300 0000000",    type: "tel" },
};

/* ─── Global Styles ──────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    background: #0D0D0D;
    color: #f3f4f6;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0D0D0D; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #ccff80; }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: inherit;
    line-height: 1;
    display: inline-block;
    user-select: none;
  }

  .text-gradient {
    background: linear-gradient(90deg, #ccff80 0%, #5de6ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Reveal Animations ── */
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal.active { opacity: 1; transform: translateY(0); }
  .reveal.delay-100 { transition-delay: 0.1s; }
  .reveal.delay-200 { transition-delay: 0.2s; }
  .reveal.delay-300 { transition-delay: 0.3s; }
  .reveal.delay-400 { transition-delay: 0.4s; }

  /* ── Fade-in from left/right ── */
  .reveal-left  { opacity:0; transform:translateX(-32px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .reveal-right { opacity:0; transform:translateX(32px);  transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
  .reveal-left.active, .reveal-right.active { opacity:1; transform:translateX(0); }

  .btn-primary {
    background: #ccff80;
    color: #0D0D0D;
    font-weight: 700;
    transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
    cursor: pointer;
    border: none;
  }
  .btn-primary:hover {
    background: #b8f55a;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(163,230,53,0.28);
  }
  .btn-primary:active { transform: translateY(0); }

  input, textarea, select {
    background: transparent;
    color: #f3f4f6;
    border: none;
    border-bottom: 1px solid #2a2a2a;
    outline: none;
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    padding: 14px 0;
    width: 100%;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus { border-bottom-color: #ccff80; }
  input::placeholder, textarea::placeholder { color: #4b5563; }

  /* ── Dynamic Background ── */
  .canvas-bg {
    position: fixed;
    inset: 0;
    z-index: -10;
  }

  .orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: -5;
    filter: blur(100px);
    will-change: transform;
  }
  .orb-1 {
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(204,255,128,0.13), transparent 65%);
    top: -200px; left: -200px;
    animation: orbFloat1 20s ease-in-out infinite alternate;
  }
  .orb-2 {
    width: 800px; height: 800px;
    background: radial-gradient(circle, rgba(93,230,255,0.10), transparent 65%);
    bottom: -250px; right: -250px;
    animation: orbFloat2 26s ease-in-out infinite alternate;
  }
  .orb-3 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(204,255,128,0.07), transparent 65%);
    top: 50%; left: 50%;
    animation: orbFloat3 15s ease-in-out infinite alternate;
  }

  @keyframes orbFloat1 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(280px,180px) scale(1.15); }
  }
  @keyframes orbFloat2 {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(-260px,-180px) scale(1.2); }
  }
  @keyframes orbFloat3 {
    from { transform: translate(-50%,-50%) scale(0.8); opacity:0.5; }
    to   { transform: translate(-30%,-60%) scale(1.1); opacity:0.3; }
  }

  /* ── Grid background animated ── */
  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: -8;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 80px 80px;
    animation: gridDrift 40s linear infinite;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
  @keyframes gridDrift {
    from { background-position: 0 0; }
    to   { background-position: 80px 80px; }
  }

  /* ── Cursor glow ── */
  .cursor-glow {
    position: fixed;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(204,255,128,0.06), transparent 65%);
    transform: translate(-50%,-50%);
    pointer-events: none;
    z-index: -3;
    transition: opacity 0.3s;
  }

  /* ── Particle dots ── */
  .particle {
    position: fixed;
    width: 2px; height: 2px;
    border-radius: 50%;
    background: #ccff80;
    pointer-events: none;
    z-index: -4;
    animation: particleDrift linear infinite;
  }
  @keyframes particleDrift {
    0%   { opacity: 0; transform: translateY(0) translateX(0); }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.3; }
    100% { opacity: 0; transform: translateY(-120vh) translateX(var(--drift)); }
  }

  /* ── Scan line hero ── */
  .scanline {
    position: absolute;
    left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(204,255,128,0.3), transparent);
    animation: scanMove 6s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes scanMove {
    0%   { top: 0%; opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 0.5; }
    100% { top: 100%; opacity: 0; }
  }

  /* ── Typing cursor ── */
  .type-cursor::after {
    content: '|';
    animation: blink 0.85s step-end infinite;
    color: #ccff80;
    margin-left: 2px;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* ── Logo ── */
  .logo-rounded {
    border-radius: 12px;
    overflow: hidden;
  }
  .logo-rounded-circle {
    border-radius: 50%;
    overflow: hidden;
  }

  /* ── Nav ── */
  .nav-link-animated {
    position: relative;
  }
  .nav-link-animated::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 0; height: 1px;
    background: #ccff80;
    transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .nav-link-animated:hover::after,
  .nav-link-animated.active::after { width: 100%; }

  /* ── Service card border glow ── */
  .service-card {
    transition: background 0.3s, box-shadow 0.3s, transform 0.3s;
    position: relative;
  }
  .service-card:hover {
    box-shadow: inset 0 0 0 1px rgba(204,255,128,0.15);
    transform: translateY(-2px);
  }

  /* ── Counter animation ── */
  .stat-number {
    font-variant-numeric: tabular-nums;
  }

  /* ── Noise texture overlay ── */
  .noise {
    position: fixed;
    inset: 0;
    z-index: -6;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    pointer-events: none;
  }

  /* ── Shimmer line ── */
  .shimmer-line {
    background: linear-gradient(90deg, transparent 0%, rgba(204,255,128,0.4) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 3s ease infinite;
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  /* ── Responsive: Tablet ── */
  @media (max-width: 900px) {
    .section-pad { padding: 90px 40px !important; }
    .stats-bar { padding: 28px 40px !important; }
    .footer-pad { padding: 48px 40px !important; }
    .two-col { gap: 56px !important; }
  }

  /* ── Responsive: Mobile ── */
  @media (max-width: 768px) {
    .nav-links { display: none !important; }
    .hero-title { font-size: clamp(30px, 9vw, 52px) !important; }
    .hero-sub { font-size: 15px !important; }
    .two-col { grid-template-columns: 1fr !important; gap: 48px !important; }
    .four-col { grid-template-columns: 1fr 1fr !important; }
    .section-pad { padding: 72px 20px !important; }
    .stats-bar { padding: 28px 20px !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
    .footer-pad { padding: 44px 20px !important; }
    .footer-row { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 24px !important; }
    .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .form-card { padding: 28px !important; }
    .name-email-row { grid-template-columns: 1fr !important; gap: 24px !important; }
    .section-header-row { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
    .services-header { flex-direction: column !important; }
    .hero-cta { width: 100% !important; }
    .hero-cta > button, .hero-cta > a { width: 100% !important; justify-content: center !important; }
    .why-stat-card { left: 0 !important; right: 0 !important; bottom: -16px !important; }
    .popup-card { padding: 28px !important; }
    .section-heading-lg { font-size: clamp(30px, 8vw, 44px) !important; }
  }

  /* ── Responsive: Small Mobile ── */
  @media (max-width: 420px) {
    .four-col { grid-template-columns: 1fr !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
    .section-pad { padding: 60px 16px !important; }
    .form-card { padding: 22px !important; }
    .popup-card { padding: 22px !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

/* ─── Hooks ──────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("active"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}


function useTypewriter(words, speed = 90) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    const delay = deleting ? speed / 2 : speed;
    const timeout = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setText(current.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      } else if (deleting && charIdx > 0) {
        setText(current.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      } else if (!deleting && charIdx === current.length) {
        setTimeout(() => setDeleting(true), 1800);
      } else if (deleting && charIdx === 0) {
        setDeleting(false);
        setWordIdx(wordIdx + 1);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed]);

  return text;
}

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

/* ─── Icon ───────────────────────────────────────────────────── */
function Icon({ name, style }) {
  return <span className="material-symbols-outlined" style={style}>{name}</span>;
}

/* ─── Referral Fields (shared component) ─────────────────────── */
/* Renders the "Do you have a referral?" yes/no toggle and, when "yes",
   a type selector (email / linkedin / contact) + the matching input. */
function ReferralFields({ form, setForm }) {
  const labelStyle = {
    fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase",
    letterSpacing: "0.2em", color: C.onSurfaceVariant, fontWeight: 700,
  };

  const toggleBtn = (active) => ({
    flex: 1, padding: "12px 0", borderRadius: 8, cursor: "pointer",
    fontFamily: "'JetBrains Mono'", fontSize: 10, textTransform: "uppercase",
    letterSpacing: "0.15em", fontWeight: 700, transition: "all 0.2s",
    border: `1px solid ${active ? C.primary : C.outline}`,
    background: active ? "rgba(204,255,128,0.08)" : "transparent",
    color: active ? C.primary : C.onSurfaceVariant,
  });

  const typeChip = (active) => ({
    padding: "8px 16px", borderRadius: 100, cursor: "pointer",
    fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase",
    letterSpacing: "0.15em", fontWeight: 700, transition: "all 0.2s",
    border: `1px solid ${active ? C.secondary : C.outline}`,
    background: active ? "rgba(93,230,255,0.08)" : "transparent",
    color: active ? C.secondary : C.onSurfaceVariant,
  });

  const field = form.referralType ? REFERRAL_FIELDS[form.referralType] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
      <label style={labelStyle}>Do you have a referral?</label>
      <div style={{ display: "flex", gap: 12 }}>
        <button type="button" style={toggleBtn(form.hasReferral === "yes")}
          onClick={() => setForm({ ...form, hasReferral: "yes" })}>Yes</button>
        <button type="button" style={toggleBtn(form.hasReferral === "no")}
          onClick={() => setForm({ ...form, hasReferral: "no", referralType: "", referralContact: "" })}>No</button>
      </div>

      {form.hasReferral === "yes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
          <label style={labelStyle}>How can we reach your referral?</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.keys(REFERRAL_FIELDS).map((key) => (
              <button type="button" key={key} style={typeChip(form.referralType === key)}
                onClick={() => setForm({ ...form, referralType: key, referralContact: "" })}>
                {key === "contact" ? "Contact No." : key}
              </button>
            ))}
          </div>
          {field && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              <label style={labelStyle}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form.referralContact}
                onChange={(e) => setForm({ ...form, referralContact: e.target.value })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Animated Background ────────────────────────────────────── */
function AnimatedBackground() {
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const fn = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: `${Math.random() * 20 + 15}s`,
    delay: `${Math.random() * 15}s`,
    drift: `${(Math.random() - 0.5) * 200}px`,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <>
      <div className="noise" />
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div
        className="cursor-glow"
        style={{ left: mouse.x, top: mouse.y }}
      />
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            "--drift": p.drift,
            opacity: p.opacity,
          }}
        />
      ))}
    </>
  );
}

/* ─── NAV ────────────────────────────────────────────────────── */


/* ─── HERO ───────────────────────────────────────────────────── */
function Hero({ openContact }) {
  const typed = useTypewriter(["Bold Ideas.", "Elite Products.", "Real Results.", "Zero Compromise."]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <header style={{
      position: "relative", minHeight: "100vh", width: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      paddingTop: 96, overflow: "hidden",
    }}>
      {/* Scan line */}
      <div className="scanline" />

      {/* Center glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 900, height: 900, maxWidth: "100vw",
        background: "radial-gradient(circle, rgba(163,230,53,0.06), transparent 55%)",
        pointerEvents: "none",
        animation: "orbFloat3 12s ease-in-out infinite alternate",
      }} />

      <div style={{
        position: "relative", zIndex: 2, textAlign: "center",
        padding: "0 20px", maxWidth: 920,
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Logo */}
        
        

        <style>{`
          @keyframes logoGlow {
            from { box-shadow: 0 0 40px rgba(204,255,128,0.08), 0 0 80px rgba(204,255,128,0.03); }
            to   { box-shadow: 0 0 80px rgba(204,255,128,0.18), 0 0 140px rgba(204,255,128,0.06); }
          }
        `}</style>

        {/* Label */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          border: `1px solid ${C.outline}`, borderRadius: 100,
          padding: "7px 20px", marginBottom: 36,
          background: "rgba(204,255,128,0.04)",
        }}>
          
          
        </div>

        <h1 className="hero-title" style={{
          fontFamily: "'Space Grotesk'",
          fontSize: "clamp(40px, 7vw, 88px)", fontWeight: 700,
          lineHeight: 1.05, marginBottom: 12, letterSpacing: "-0.03em",
        }}>
          High-Performance Software
        </h1>
        <h1 className="hero-title" style={{
          fontFamily: "'Space Grotesk'",
          fontSize: "clamp(40px, 7vw, 88px)", fontWeight: 700,
          lineHeight: 1.05, marginBottom: 40, letterSpacing: "-0.03em",
        }}>
          for <span className="text-gradient type-cursor">{typed}</span>
        </h1>

        <p className="hero-sub" style={{
          maxWidth: 560, margin: "0 auto 56px",
          color: C.onSurfaceVariant, fontSize: 17, lineHeight: 1.75,
        }}>
          Elite digital engineering for startups and enterprises demanding zero-latency performance and superior technical standards.
        </p>

        <div className="hero-cta" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={openContact} style={{
            padding: "18px 44px", borderRadius: 10,
            fontFamily: "'JetBrains Mono'", fontSize: 12,
            textTransform: "uppercase", letterSpacing: "0.12em",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            Initiate Sequence
            <Icon name="arrow_forward" style={{ fontSize: 16 }} />
          </button>
          <a href="#portfolio" style={{
            padding: "18px 44px", borderRadius: 10, cursor: "pointer",
            border: `1px solid ${C.outline}`, color: C.onSurface,
            fontFamily: "'JetBrains Mono'", fontSize: 12,
            textTransform: "uppercase", letterSpacing: "0.12em",
            background: "rgba(13,13,13,0.5)", transition: "border-color 0.25s, color 0.25s",
            textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.outline; e.currentTarget.style.color = C.onSurface; }}
          >View Our Work</a>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4 }}>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, transparent, #ccff80)", animation: "scanMove 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", color: C.primary }}>Scroll</span>
        </div>
      </div>
    </header>
  );
}

/* ─── STATS BAR ──────────────────────────────────────────────── */
function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const p = useCounter(10, 1800, visible);
  const u = useCounter(99, 1600, visible);
  const d = useCounter(24, 1400, visible);

  const stats = [
    { value: `${p}+`, label: "Projects Shipped" },
    { value: `${u}.9%`, label: "Uptime Guaranteed" },
    { value: `< ${d}h`, label: "Response Time" },
    { value: "5★", label: "Client Rating" },
  ];

  return (
    <div ref={ref} className="stats-bar" style={{
      padding: "32px 80px",
      borderTop: `1px solid ${C.outlineVariant}`,
      borderBottom: `1px solid ${C.outlineVariant}`,
      background: "rgba(204,255,128,0.02)",
    }}>
      <div className="stats-grid" style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 40,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p className="stat-number text-gradient" style={{
              fontFamily: "'Space Grotesk'", fontSize: 32, fontWeight: 700, lineHeight: 1,
            }}>{s.value}</p>
            <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 8 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SERVICES ───────────────────────────────────────────────── */
const SERVICES = [
  { icon: "code",           color: C.primary,   bg: "rgba(204,255,128,0.08)", title: "Software Development",     desc: "Robust, scalable software solutions engineered for performance, reliability, and rapid delivery." },
  { icon: "web",            color: C.secondary, bg: "rgba(93,230,255,0.08)",  title: "Web Applications",         desc: "Expertly crafted React and Next.js applications optimized for speed, UX, and conversion." },
  { icon: "phone_iphone",   color: C.primary,   bg: "rgba(204,255,128,0.08)", title: "Mobile Applications",      desc: "Native and cross-platform mobile apps built for iOS and Android with seamless experiences." },
  { icon: "shield_lock",    color: C.secondary, bg: "rgba(93,230,255,0.08)",  title: "Cybersecurity Solutions",   desc: "Penetration testing, security audits, and data protection protocols for total peace of mind." },
];

function ServiceCard({ icon, color, bg, title, desc, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="service-card reveal"
      style={{ transitionDelay: `${index * 0.08}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        padding: 40,
        background: hovered ? C.surfaceContainerHigh : "transparent",
        transition: "all 0.3s",
        height: "100%",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          width: 52, height: 52, background: hovered ? color : bg,
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 28, fontSize: 22,
          transition: "all 0.3s",
        }}>
          <Icon name={icon} style={{ color: hovered ? "#0D0D0D" : color, transition: "color 0.3s" }} />
        </div>
        <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 18, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>{title}</h3>
        <p style={{ color: C.onSurfaceVariant, fontSize: 13, lineHeight: 1.75, marginBottom: 28, flex: 1 }}>{desc}</p>
        <a href="#contact" style={{
          color, fontFamily: "'JetBrains Mono'", fontSize: 10,
          textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700,
          display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
          transition: "gap 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.gap = "14px"; }}
          onMouseLeave={(e) => { e.currentTarget.style.gap = "8px"; }}
        >
          Learn More <Icon name="arrow_forward" style={{ fontSize: 13, color }} />
        </a>
      </div>
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="section-pad" style={{
      padding: "120px 80px",
      background: C.surfaceContainer,
      borderTop: `1px solid ${C.outlineVariant}`,
      borderBottom: `1px solid ${C.outlineVariant}`,
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="services-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 72, gap: 32, flexWrap: "wrap" }}>
          <div className="reveal" style={{ maxWidth: 480 }}>
            <span style={{ color: C.primary, fontFamily: "'JetBrains Mono'", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 700, display: "block", marginBottom: 14 }}>Capabilities</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(32px,4vw,48px)", fontWeight: 700, letterSpacing: "-0.03em" }}>Precision Engineering</h2>
          </div>
          <p className="reveal delay-200" style={{ color: C.onSurfaceVariant, maxWidth: 380, fontSize: 16, lineHeight: 1.75, alignSelf: "flex-end" }}>
            We design and build robust digital architectures that scale with your vision, ensuring speed, security, and exceptional user experience.
          </p>
        </div>
        <div className="four-col" style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          border: `1px solid ${C.outlineVariant}`, borderRadius: 16, overflow: "hidden",
          gap: 1, background: C.outlineVariant,
        }}>
          {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY US ─────────────────────────────────────────────────── */
function WhyUs() {
  return (
    <section id="why-us" className="section-pad" style={{ padding: "120px 80px", background: C.surface }}>
      <div className="two-col" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>
        <div className="reveal-left">
          <span style={{ color: C.primary, fontFamily: "'JetBrains Mono'", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 700, display: "block", marginBottom: 14 }}>The H2S Edge</span>
          <h2 className="section-heading-lg" style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 36, letterSpacing: "-0.03em" }}>
            Engineering <br /><span className="text-gradient">Excellence.</span>
          </h2>
          <p style={{ fontSize: 16, color: C.onSurfaceVariant, marginBottom: 52, maxWidth: 420, lineHeight: 1.75 }}>
            We combine local support with global engineering standards to deliver digital products that truly outperform the competition.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {[
              { icon: "verified", color: C.primary,   title: "Local Support",    desc: "Direct access to lead engineers throughout your project lifecycle. No middle-men, just results." },
              { icon: "public",   color: C.secondary, title: "Global Standards", desc: "Utilizing industry-leading technologies and methodologies used by the world's top tech firms." },
              { icon: "bolt",     color: C.primary,   title: "Rapid Delivery",   desc: "Agile workflows and proven processes ensure your product ships on time, every time." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 20 }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  background: item.color === C.primary ? "rgba(204,255,128,0.08)" : "rgba(93,230,255,0.08)",
                  borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>
                  <Icon name={item.icon} style={{ color: item.color, fontSize: 20 }} />
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.01em" }}>{item.title}</h4>
                  <p style={{ color: C.onSurfaceVariant, fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-right" style={{ position: "relative" }}>
          <div style={{
            borderRadius: 20, overflow: "hidden",
            border: `1px solid ${C.outlineVariant}`,
            aspectRatio: "4/3",
            boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          }}>
            <img
  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
  alt="Tech Infrastructure"
  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.8)", transition: "filter 0.8s" }}
  onMouseEnter={(e) => (e.target.style.filter = "grayscale(0) brightness(1)")}
  onMouseLeave={(e) => (e.target.style.filter = "grayscale(1) brightness(0.8)")}
/>
          </div>
          {/* Floating stat card */}
          <div className="why-stat-card" style={{
            position: "absolute", bottom: -20, left: -24,
            padding: "24px 28px",
            background: "rgba(13,13,13,0.95)",
            backdropFilter: "blur(20px)",
            border: `1px solid ${C.outline}`,
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}>
            <p className="text-gradient" style={{ fontFamily: "'Space Grotesk'", fontSize: 36, fontWeight: 700, lineHeight: 1 }}>99.9%</p>
            <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, marginTop: 6, color: C.onSurfaceVariant }}>Reliability Guaranteed</p>
          </div>
          {/* Accent line */}
          <div style={{
            position: "absolute", top: -1, left: "20%", right: "20%",
            height: 2, borderRadius: 4,
          }} className="shimmer-line" />
        </div>
      </div>
    </section>
  );
}

/* ─── PORTFOLIO ──────────────────────────────────────────────── */
const PROJECTS = [
  { img: amlImage, title: "Pak Trace", sub: "Anti Money Laundering System", tag: "Compliance Technology" },
  { img: cyberImage, title: "Cyber Quest", sub: "Cyber Awareness Platform", tag: "Gamified Learning" },
];

function ProjectCard({ img, title, sub, tag, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="reveal"
      style={{ transitionDelay: `${index * 0.15}s`, cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative", aspectRatio: "16/11",
        overflow: "hidden", borderRadius: 16,
        border: `1px solid ${hovered ? C.outline : C.outlineVariant}`,
        marginBottom: 24,
        transition: "border-color 0.3s",
        boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.5)" : "0 8px 30px rgba(0,0,0,0.3)",
      }}>
        <img src={img} alt={title} style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.06)" : "scale(1)",
          transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: hovered ? "rgba(13,13,13,0.1)" : "rgba(13,13,13,0.3)",
          transition: "background 0.4s",
        }} />
        <div style={{
          position: "absolute", top: 20, right: 20,
          background: "rgba(13,13,13,0.8)", backdropFilter: "blur(12px)",
          border: `1px solid ${C.outline}`, borderRadius: 100,
          padding: "5px 14px",
          fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.primary,
          textTransform: "uppercase", letterSpacing: "0.2em",
        }}>{tag}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk'", fontSize: 21, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.02em" }}>{title}</h3>
          <p style={{ color: C.onSurfaceVariant, fontSize: 13 }}>{sub}</p>
        </div>
        
      </div>
    </div>
  );
}

function Portfolio() {
  return (
    <section id="portfolio" className="section-pad" style={{ padding: "120px 80px", background: C.surfaceContainer }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72 }}>
          <div className="reveal">
            <span style={{ color: C.secondary, fontFamily: "'JetBrains Mono'", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 700, display: "block", marginBottom: 14 }}>Archive</span>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(32px,4vw,48px)", fontWeight: 700, letterSpacing: "-0.03em" }}>Case Studies</h2>
          </div>
          <a className="reveal delay-200" href="#" style={{
            color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono'", fontSize: 10,
            textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s, gap 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; e.currentTarget.style.gap = "14px"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.onSurfaceVariant; e.currentTarget.style.gap = "8px"; }}
          >View All Case Studies <Icon name="arrow_forward" style={{ fontSize: 14 }} /></a>
        </div>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} {...p} index={i} />)}
        </div>
      </div>
    </section>
  );
}



/* ─── CONTACT ────────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", service: "", message: "",
    hasReferral: "", referralType: "", referralContact: "",
  });
  const [status, setStatus] = useState({ sending: false, sent: false, error: "" });

  const SERVICE_OPTIONS = [
    "Web Development",
    "Mobile App Development",
    "Cybersecurity Solutions",
    "SaaS Product Development",
    "Custom Software",
    "Other",
  ];

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.service || !form.message) {
      setStatus({ sending: false, sent: false, error: "Please fill all fields." });
      return;
    }
    if (form.hasReferral === "yes" && (!form.referralType || !form.referralContact)) {
      setStatus({ sending: false, sent: false, error: "Please provide your referral's contact details." });
      return;
    }

    setStatus({ sending: true, sent: false, error: "" });

    try {
      await sendInquiry(form);
      setStatus({ sending: false, sent: true, error: "" });
      setForm({ name: "", email: "", service: "", message: "", hasReferral: "", referralType: "", referralContact: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ sending: false, sent: false, error: `Failed: ${err?.text || err?.message || "Unknown"}` });
    }
  };

  return (
    <section id="contact" className="section-pad" style={{
      padding: "120px 80px",
      background: C.surfaceContainer,
      borderTop: `1px solid ${C.outlineVariant}`,
    }}>
      <div className="two-col" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "start" }}>
        <div className="reveal-left">
          <span style={{ color: C.primary, fontFamily: "'JetBrains Mono'", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", fontWeight: 700, display: "block", marginBottom: 14 }}>Uplink</span>
          <h2 className="section-heading-lg" style={{ fontFamily: "'Space Grotesk'", fontSize: "clamp(36px,5vw,60px)", fontWeight: 700, textTransform: "uppercase", lineHeight: 0.95, marginBottom: 28, letterSpacing: "-0.03em" }}>
            Start Your <br /> Sequence
          </h2>
          <p style={{ color: C.onSurfaceVariant, fontSize: 16, maxWidth: 380, lineHeight: 1.75, marginBottom: 48 }}>
            Ready to elevate your digital presence? Send a brief message and our lead engineer will contact you within 12 hours.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { icon: "mail",        label: "Email",        value: "info.h2svolt@gmail.com" },
              { icon: "location_on", label: "HQ",           value: "Remote, Karachi"  },
              { icon: "schedule",    label: "Response",     value: "< 12 hours guaranteed"     },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                  width: 44, height: 44, flexShrink: 0,
                  background: C.surfaceContainerHigh,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 12, border: `1px solid ${C.outlineVariant}`, fontSize: 20,
                }}>
                  <Icon name={item.icon} style={{ color: C.primary, fontSize: 18 }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700 }}>{item.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 500, marginTop: 3, color: C.onSurface, wordBreak: "break-word" }}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-right form-card" style={{
          background: C.surfaceContainerHigh, padding: 48,
          border: `1px solid ${C.outlineVariant}`, borderRadius: 20,
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1 }} className="shimmer-line" />

          {/* Name + Email row */}
          <div className="name-email-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: C.onSurfaceVariant, fontWeight: 700 }}>Full Name</label>
              <input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: C.onSurfaceVariant, fontWeight: 700 }}>Email</label>
              <input type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          {/* Project Type Dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: C.onSurfaceVariant, fontWeight: 700 }}>Project Type</label>
            <div style={{ position: "relative" }}>
              <select
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: form.service ? C.onSurface : "#4b5563",
                  border: "none",
                  borderBottom: `1px solid ${C.outline}`,
                  outline: "none",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16,
                  padding: "14px 28px 14px 0",
                  appearance: "none",
                  WebkitAppearance: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = C.primary)}
                onBlur={(e) => (e.target.style.borderBottomColor = C.outline)}
              >
                <option value="" disabled style={{ background: C.surfaceContainerHigh, color: "#4b5563" }}>Select a service...</option>
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} style={{ background: C.surfaceContainerHigh, color: C.onSurface }}>{opt}</option>
                ))}
              </select>
              <Icon
                name="expand_more"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: C.onSurfaceVariant,
                  fontSize: 20,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Message */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: C.onSurfaceVariant, fontWeight: 700 }}>Project Details</label>
            <textarea rows={5} placeholder="Tell us about your technical requirements and goals..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>

          {/* Referral */}
          <ReferralFields form={form} setForm={setForm} />

          {/* Status message */}
          {status.sent && (
            <p style={{ color: C.primary, fontFamily: "'JetBrains Mono'", fontSize: 11, marginBottom: 16, letterSpacing: "0.05em" }}>
              ✓ Message sent successfully. We'll be in touch soon.
            </p>
          )}
          {status.error && (
            <p style={{ color: "#f87171", fontFamily: "'JetBrains Mono'", fontSize: 11, marginBottom: 16, letterSpacing: "0.05em" }}>
              ✕ {status.error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={status.sending}
            className="btn-primary"
            style={{
              width: "100%", padding: "18px", borderRadius: 10,
              fontFamily: "'JetBrains Mono'", fontSize: 11,
              textTransform: "uppercase", letterSpacing: "0.2em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              opacity: status.sending ? 0.6 : 1,
              cursor: status.sending ? "not-allowed" : "pointer",
            }}
          >
            {status.sending ? "Sending..." : "Send Inquiry"}
            {!status.sending && <Icon name="send" style={{ fontSize: 16 }} />}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer-pad" style={{ padding: "56px 80px", background: C.surface, borderTop: `1px solid ${C.outlineVariant}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="footer-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="logo-rounded" style={{
              width: 36, height: 36, borderRadius: 10,
              border: `1px solid ${C.outline}`,
              overflow: "hidden", background: "#0D0D0D",
            }}>
              <img src={logo} alt="H2S Volt" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk'", fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>H2S VOLT</span>
          </div>
          <div style={{ display: "flex", gap: 36, flexWrap: "wrap", justifyContent: "center" }}>
            {["LinkedIn"].map((l) => (
              <a key={l} href="https://www.linkedin.com/company/h2s-volt/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono'", fontSize: 10,
                textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 700,
                textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => (e.target.style.color = C.primary)}
                onMouseLeave={(e) => (e.target.style.color = C.onSurfaceVariant)}
              >{l}</a>
            ))}
          </div>
          <div style={{ color: C.onSurfaceVariant, fontFamily: "'JetBrains Mono'", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            © 2026 H2S VOLT. All Rights Reserved.
          </div>
        </div>
        {/* Bottom accent */}
        <div style={{ height: 1, width: "100%" }} className="shimmer-line" />
      </div>
    </footer>
  );
}

/* ─── CONTACT POPUP ──────────────────────────────────────────── */
function ContactPopup({ open, onClose }) {
  const [form, setForm] = useState({
    name: "", email: "", message: "",
    hasReferral: "", referralType: "", referralContact: "",
  });
  const [status, setStatus] = useState({ sending: false, sent: false, error: "" });

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Reset form whenever the popup is reopened
  useEffect(() => {
    if (open) {
      setForm({ name: "", email: "", message: "", hasReferral: "", referralType: "", referralContact: "" });
      setStatus({ sending: false, sent: false, error: "" });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus({ sending: false, sent: false, error: "Please fill all fields." });
      return;
    }
    if (form.hasReferral === "yes" && (!form.referralType || !form.referralContact)) {
      setStatus({ sending: false, sent: false, error: "Please provide your referral's contact details." });
      return;
    }

    setStatus({ sending: true, sent: false, error: "" });

    try {
      await sendInquiry({ ...form, service: "General Inquiry (Popup)" });
      setStatus({ sending: false, sent: true, error: "" });
      setForm({ name: "", email: "", message: "", hasReferral: "", referralType: "", referralContact: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ sending: false, sent: false, error: `Failed: ${err?.text || err?.message || "Unknown"}` });
    }
  };

  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999,
        animation: "fadeIn 0.25s ease",
        padding: 20,
      }}
    >
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        className="popup-card"
        style={{
          width: "100%", maxWidth: 560,
          maxHeight: "90vh", overflowY: "auto",
          background: C.surfaceContainerHigh,
          border: `1px solid ${C.outline}`,
          borderRadius: 20, padding: "48px",
          animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1 }} className="shimmer-line" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk'", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>Start a Project</h2>
            <p style={{ color: C.onSurfaceVariant, fontSize: 13, marginTop: 6 }}>We'll respond within 12 hours.</p>
          </div>
          <button onClick={onClose} style={{
            background: C.surfaceContainerHigh, border: `1px solid ${C.outline}`,
            color: C.onSurfaceVariant, width: 36, height: 36, borderRadius: 8,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, transition: "all 0.2s", flexShrink: 0,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.outline; e.currentTarget.style.color = C.onSurfaceVariant; }}
          >✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.2em" }}>Full Name</label>
          <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 24 }} />
          <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.2em" }}>Email Address</label>
          <input placeholder="you@company.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ marginBottom: 24 }} />
          <label style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.2em" }}>Project Details</label>
          <textarea rows="4" placeholder="Tell us about your project goals..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} style={{ marginBottom: 28 }} />
        </div>

        {/* Referral */}
        <ReferralFields form={form} setForm={setForm} />

        {/* Status message */}
        {status.sent && (
          <p style={{ color: C.primary, fontFamily: "'JetBrains Mono'", fontSize: 11, marginBottom: 16, letterSpacing: "0.05em" }}>
            ✓ Message sent successfully. We'll be in touch soon.
          </p>
        )}
        {status.error && (
          <p style={{ color: "#f87171", fontFamily: "'JetBrains Mono'", fontSize: 11, marginBottom: 16, letterSpacing: "0.05em" }}>
            ✕ {status.error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={status.sending}
          className="btn-primary"
          style={{
            width: "100%", padding: "17px", borderRadius: 10,
            fontFamily: "'JetBrains Mono'", fontSize: 11,
            textTransform: "uppercase", letterSpacing: "0.2em",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            opacity: status.sending ? 0.6 : 1,
            cursor: status.sending ? "not-allowed" : "pointer",
          }}
        >
          {status.sending ? "Sending..." : "Send Inquiry"}
          {!status.sending && <Icon name="send" style={{ fontSize: 15 }} />}
        </button>
      </div>
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  useReveal();

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <AnimatedBackground />
      <ContactPopup open={contactOpen} onClose={() => setContactOpen(false)} />
      <Nav openContact={() => setContactOpen(true)} />
      <Hero openContact={() => setContactOpen(true)} />
      <StatsBar />
      <Services />
      <WhyUs />
      <Portfolio />
      
      <Contact />
      <Footer />
    </>
  );
}