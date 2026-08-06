import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./index.css";

const services = [
  ["01", "Web platforms", "Fast, secure web applications built around real business workflows and measurable outcomes."],
  ["02", "Mobile applications", "Cross-platform products designed for consistent performance and intuitive use."],
  ["03", "Custom software", "Purpose-built systems that remove friction, automate work and support growth."],
  ["04", "Cybersecurity", "Security reviews, penetration testing and safer engineering practices from the start."],
  ["05", "Dedicated product teams", "A focused remote team that works as a dependable extension of your business."],
];

const models = [
  ["Fixed-scope project", "Defined deliverables, milestones and timeline for a focused launch."],
  ["Dedicated team", "A consistent product team aligned to your roadmap and working rhythm."],
  ["Staff augmentation", "Add the engineering capability your internal team needs right now."],
  ["White-label partnership", "Reliable behind-the-scenes delivery for agencies and consultancies."],
];

const process = [
  ["01", "Discovery", "We learn your goals, users, constraints and definition of success."],
  ["02", "Scope & estimate", "You receive a clear delivery plan, team, milestones and commercial structure."],
  ["03", "Build & weekly demos", "Progress stays visible through focused sprints, demonstrations and honest updates."],
  ["04", "QA, launch & support", "We test, deploy, document and support the product after release."],
];

const caseStudies = [
  {
    eyebrow: "Compliance technology",
    title: "Pak Trace",
    description: "A blockchain-based AML and KYC framework with AI-supported detection and structured reporting.",
    image: "/pak-trace.jpeg",
    alt: "Pak Trace platform interface",
  },
  {
    eyebrow: "Gamified learning",
    title: "Cyber Quest",
    description: "An interactive cybersecurity awareness platform built around practice, progress and engagement.",
    image: "/cyber-quest.jpeg",
    alt: "Cyber Quest platform interface",
  },
  {
    eyebrow: "Blockchain security",
    title: "BlockAudit",
    description: "Automated vulnerability analysis with verifiable on-chain audit records, pairing Slither static scans with AI-generated remediation summaries.",
    image: "/Ai-powered-smart-contract-auditor.png",
    alt: "AI-Powered Smart Contract Auditor dashboard",
    cropRight: true,
  },
  {
    eyebrow: "Email security",
    title: "PhishGuard AI",
    description: "Adaptive phishing detection for safer inboxes, combining a local ML model with real-time domain reputation and link analysis.",
    image: "/phishguard%20ai.png",
    alt: "PhishGuard AI inbox analysis dashboard",
    cropRight: true,
  },
  {
    eyebrow: "Identity & access",
    title: "GateSync",
    description: "Secure attendance and identity verification for institutions, combining RFID and QR scanning with real-time logging and reporting.",
    image: "/RF%20Id%20an%20qr%20auth%20system.png",
    alt: "RFID & QR Authentication attendance dashboard",
    cropRight: true,
  },
];

const clients = [
  { name: "Y-SCENTS", image: "/client-yscents.jpeg", theme: "light" },
  { name: "Excel", image: "/client-excel.jpeg", theme: "light" },
  { name: "DreamFyre", image: "/client-dreamfyre.jpeg", theme: "dark" },
];

function ClientShowcase() {
  const [activeClient, setActiveClient] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pointerStart = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveClient((index) => (index + 1) % clients.length);
    }, 3400);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const move = (direction) => {
    setActiveClient((index) => (index + direction + clients.length) % clients.length);
  };

  const positionFor = (index) => {
    const raw = (index - activeClient + clients.length) % clients.length;
    if (raw === 0) return "center";
    return raw === 1 ? "right" : "left";
  };

  const handlePointerDown = (event) => {
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 42) return;
    move(distance < 0 ? 1 : -1);
  };

  return (
    <div
      className="client-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className="client-stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        {clients.map((client, index) => {
          const position = positionFor(index);
          const isActive = position === "center";
          return (
            <button
              type="button"
              key={client.name}
              className={`client-card client-${position} client-theme-${client.theme}`}
              onClick={() => setActiveClient(index)}
              aria-label={`Show ${client.name} logo`}
              aria-current={isActive ? "true" : undefined}
              tabIndex={isActive ? 0 : -1}
            >
              <span className="client-logo-shell">
                <img src={client.image} alt={`${client.name} logo`} width="1200" height="800" loading="lazy" />
              </span>
              <span className="client-name">{client.name}</span>
            </button>
          );
        })}
      </div>
      <div className="client-controls" aria-label="Client logo carousel controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous client">←</button>
        <div className="client-dots">
          {clients.map((client, index) => (
            <button
              type="button"
              key={client.name}
              className={index === activeClient ? "active" : ""}
              onClick={() => setActiveClient(index)}
              aria-label={`Show ${client.name}`}
              aria-current={index === activeClient ? "true" : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next client">→</button>
      </div>
    </div>
  );
}

function CaseStudyDialog({ caseStudy, onClose }) {
  const dialogPanel = useRef(null);
  const closeButton = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!caseStudy) return undefined;

    previousFocus.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButton.current?.focus(), 30);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const focusable = dialogPanel.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus.current?.focus?.();
    };
  }, [caseStudy, onClose]);

  if (!caseStudy) return null;

  return (
    <div className="case-dialog" role="presentation" onMouseDown={onClose}>
      <div className="case-dialog-backdrop" />
      <article
        ref={dialogPanel}
        className="case-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-dialog-title"
        aria-describedby="case-dialog-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeButton} className="case-dialog-close" type="button" onClick={onClose} aria-label="Close case study">×</button>
        <div className={caseStudy.cropRight ? "case-dialog-image crop-right" : "case-dialog-image"}>
          <img src={caseStudy.image} alt={caseStudy.alt} width="1536" height="1024" />
        </div>
        <div className="case-dialog-copy">
          <p>{caseStudy.eyebrow}</p>
          <h3 id="case-dialog-title">{caseStudy.title}</h3>
          <span id="case-dialog-description">{caseStudy.description}</span>
          <a href="#contact" onClick={onClose}>Discuss a similar platform <b>↗</b></a>
        </div>
      </article>
    </div>
  );
}

async function sendInquiry(inquiry) {
  const payload = {
    name: inquiry.name,
    email: inquiry.email,
    reply_to: inquiry.email,
    service: inquiry.engagement,
    timeline: inquiry.timeline,
    message: `Timeline: ${inquiry.timeline}\n\n${inquiry.brief}`,
    referral: "No",
    referral_type: "N/A",
    referral_contact: "N/A",
    company_email: "info@h2svolt.com",
  };

  // These identifiers are intentionally public: EmailJS browser keys and
  // template IDs are included in every client build. Environment variables
  // can override them for another deployment without changing source.
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "h2s-gmail-service";
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "vEekeW-4lTtrBKLqV";
  const userTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_USER || "template_eamjebv";
  const notifyTemplate = import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFY || "template_lcspymp";
  const sheetEndpoint = import.meta.env.VITE_SHEET_ENDPOINT || "https://script.google.com/macros/s/AKfycbykhvZJKUfug_qT5URtiqAjGP75M4Uf8I3cQEMtsNtbCfoVQZGotZlWdR47r2eN-yoJ/exec";

  if (!serviceId || !publicKey || !userTemplate || !notifyTemplate) {
    throw new Error("Contact service is not configured.");
  }

  const saveToSheet = sheetEndpoint
    ? fetch(sheetEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiry.name,
          email: inquiry.email,
          message: inquiry.brief,
          service: inquiry.engagement,
          timeline: inquiry.timeline,
          referral: "No",
          referral_type: "N/A",
          referral_contact: "N/A",
        }),
      })
    : Promise.resolve();

  await Promise.all([
    saveToSheet,
    emailjs.send(serviceId, userTemplate, payload, publicKey),
    emailjs.send(serviceId, notifyTemplate, payload, publicKey),
  ]);
}

export default function App() {
  const [formPhase, setFormPhase] = useState(0);
  const [formError, setFormError] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = document.querySelectorAll(
      ".clients-heading, .client-showcase, .section-label, .service-list article, .editorial-image, .extension-statement, .advantage-grid article, .model-grid article, .case-tile, .process-heading h2, .process-grid, .process-grid article, .assurance > .eyebrow, .assurance > h2, .assurance-grid article, .faq > div:first-child, .faq-list details, .contact-intro, .contact form",
    );

    revealTargets.forEach((element) => element.classList.add("motion-reveal"));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => element.classList.add("in-view"));
      return () => root.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -7% 0px" },
    );

    revealTargets.forEach((element) => observer.observe(element));

    const header = document.querySelector(".site-header");
    const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const heroArt = document.querySelector(".hero-art");
    const onPointerMove = (event) => {
      if (!heroArt) return;
      const bounds = heroArt.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      heroArt.style.setProperty("--spot-x", `${x}%`);
      heroArt.style.setProperty("--spot-y", `${y}%`);
      heroArt.style.setProperty("--move-x", `${(x - 50) * -0.045}px`);
      heroArt.style.setProperty("--move-y", `${(y - 50) * -0.035}px`);
    };
    const resetPointer = () => {
      heroArt?.style.setProperty("--spot-x", "68%");
      heroArt?.style.setProperty("--spot-y", "44%");
      heroArt?.style.setProperty("--move-x", "0px");
      heroArt?.style.setProperty("--move-y", "0px");
    };
    heroArt?.addEventListener("pointermove", onPointerMove);
    heroArt?.addEventListener("pointerleave", resetPointer);

    const proof = document.querySelector(".proof");
    const counter = document.querySelector("[data-counter]");
    let counterFrame = 0;
    const counterObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !counter) return;
        const start = performance.now();
        const duration = 900;
        const tick = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = `${Math.round(eased * 10)}+`;
          if (progress < 1) counterFrame = requestAnimationFrame(tick);
        };
        counterFrame = requestAnimationFrame(tick);
        counterObserver.disconnect();
      },
      { threshold: 0.55 },
    );
    if (proof) counterObserver.observe(proof);

    return () => {
      observer.disconnect();
      counterObserver.disconnect();
      cancelAnimationFrame(counterFrame);
      window.removeEventListener("scroll", onScroll);
      heroArt?.removeEventListener("pointermove", onPointerMove);
      heroArt?.removeEventListener("pointerleave", resetPointer);
      root.classList.remove("motion-ready");
    };
  }, []);

  const handleProjectSubmit = async (event) => {
    event.preventDefault();
    if (formPhase > 0) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pause = (duration) => new Promise((resolve) => setTimeout(resolve, reduced ? 40 : duration));
    const inquiry = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      engagement: String(data.get("engagement") || ""),
      timeline: String(data.get("timeline") || ""),
      brief: String(data.get("brief") || ""),
      company: String(data.get("company") || ""),
    };

    // Quietly accept bot submissions caught by the hidden field.
    if (inquiry.company) {
      form.reset();
      return;
    }

    setFormError("");
    try {
      setFormPhase(1);
      await pause(420);
      setFormPhase(2);
      await sendInquiry(inquiry);
      setFormPhase(3);
      await pause(420);
      setFormPhase(4);
      form.reset();
      window.setTimeout(() => setFormPhase(0), 6000);
    } catch {
      setFormPhase(0);
      setFormError("We couldn’t send your brief just now. Please email info@h2svolt.com or message us on WhatsApp.");
    }
  };

  return (
    <main>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="H2S VOLT home">
          <img src="/h2svolt-logo.png" alt="H2S VOLT" width="58" height="58" />
          <span><b>H2S VOLT</b><small>ENGINEERING PARTNER</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#clients">Clients</a><a href="#services">Services</a><a href="#why">Why H2S</a><a href="#work">Work</a><a href="#process">Process</a><a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#contact">Start a project <span>↗</span></a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span></span><span></span></summary>
          <nav><a href="#clients">Clients</a><a href="#services">Services</a><a href="#why">Why H2S</a><a href="#work">Work</a><a href="#process">Process</a><a href="#contact">Contact</a></nav>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow">Remote product engineering · Global delivery</p>
          <h1 aria-label="Engineering partnerships built for global ambition.">
            <span className="headline-line"><span>Engineering partnerships</span></span>
            <span className="headline-line"><span>built for <em>global ambition.</em></span></span>
          </h1>
          <p className="hero-lead hero-sequence">A senior remote product team for international businesses that need thoughtful strategy, secure engineering and dependable delivery.</p>
          <div className="hero-actions hero-sequence">
            <a className="button button-primary" href="#contact">Start a conversation <span>↗</span></a>
            <a className="button button-secondary" href="#work">Explore our work</a>
          </div>
          <div className="hero-notes hero-sequence"><span>NDA available</span><span>Flexible engagement</span><span>Open, documented handover</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract architectural engineering visual">
          <img src="/midnight-hero-architecture.png" alt="Abstract midnight architectural structure" width="1536" height="960" />
          <div className="hero-spotlight" aria-hidden="true" />
          <div className="hero-lines" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
          <span className="art-caption">Strategy / Engineering / Security</span>
        </div>
      </section>

      <section className="proof" aria-label="Delivery assurances">
        <div><span className="proof-mark" data-counter="10">10+</span><p>Projects delivered</p></div>
        <div><span className="proof-mark">NDA</span><p>Available before discovery</p></div>
        <div><span className="proof-mark">Zero</span><p>Black-box delivery</p></div>
        <div><span className="proof-mark">Weekly</span><p>Progress demonstrations</p></div>
      </section>

      <section className="clients-section" id="clients">
        <div className="clients-heading">
          <div>
            <p className="eyebrow">Selected client partnerships</p>
            <h2>Brands that trusted H2S VOLT to build.</h2>
          </div>
          <p>Drag, swipe or use the controls to explore the businesses and products we have worked with.</p>
        </div>
        <ClientShowcase />
      </section>

      <section className="section services" id="services">
        <div className="section-label"><span>01</span><p>Capabilities</p></div>
        <div className="services-layout">
          <div className="service-list">
            {services.map(([number, title, copy]) => (
              <article key={number}><span>{number}</span><h2>{title}</h2><p>{copy}</p><a href="#contact" aria-label={`Discuss ${title}`}>↗</a></article>
            ))}
          </div>
          <figure className="editorial-image">
            <img src="/midnight-staircase.png" alt="Sculptural midnight staircase" width="1122" height="1402" loading="lazy" />
            <figcaption><span>One accountable partner.</span><b>From first scope to successful launch.</b></figcaption>
          </figure>
        </div>
      </section>

      <section className="section extension" id="why">
        <div className="extension-statement"><p className="eyebrow">Built for international outsourcing</p><h2>We operate as an extension of your team, with your goals at the centre.</h2><p>Distance should never create uncertainty. Our delivery model is designed around direct communication, visible progress and shared accountability.</p></div>
        <div className="advantage-grid">
          <article><span>01</span><h3>Direct engineer access</h3><p>Work with the people building your product—not layers of account management.</p></article>
          <article><span>02</span><h3>Timezone alignment</h3><p>We agree productive overlap for decisions, demonstrations and collaboration.</p></article>
          <article><span>03</span><h3>Transparent reporting</h3><p>Clear milestones, documented decisions and honest weekly progress updates.</p></article>
          <article><span>04</span><h3>Secure delivery</h3><p>Controlled access, safer development practices and IP protection throughout.</p></article>
        </div>
      </section>

      <section className="section engagement" id="engagement">
        <div className="section-label"><span>02</span><p>Engagement models</p></div>
        <div className="model-grid">{models.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><a href="#contact">Discuss this model ↗</a></article>)}</div>
      </section>

      <section className="section work" id="work">
        <div className="work-heading"><div className="section-label"><span>03</span><p>Selected work</p></div><div className="work-title"><h2>Complex products, made clear.</h2><img className="work-logo" src="/h2svolt-logo.png" alt="" width="92" height="92" aria-hidden="true" /></div></div>
        <div className="case-list">
          {caseStudies.map((caseStudy, index) => (
            <article className="case-tile" key={caseStudy.title}>
              <button type="button" className="case-trigger" onClick={() => setSelectedCase(caseStudy)} aria-label={`Open ${caseStudy.title} case study`}>
                <span className={caseStudy.cropRight ? "case-thumbnail crop-right" : "case-thumbnail"}>
                  <img src={caseStudy.image} alt={caseStudy.alt} width="1536" height="1024" loading="lazy" />
                </span>
                <span className="case-tile-copy">
                  <small>{caseStudy.eyebrow}</small>
                  <strong>{caseStudy.title}</strong>
                  <i aria-hidden="true">+</i>
                </span>
                <span className="case-index" aria-hidden="true">0{index + 1}</span>
              </button>
            </article>
          ))}
        </div>
        <CaseStudyDialog caseStudy={selectedCase} onClose={() => setSelectedCase(null)} />
      </section>

      <section className="section process" id="process">
        <div className="process-heading"><div className="section-label"><span>04</span><p>Delivery process</p></div><h2>A clear path from brief to launch.</h2></div>
        <div className="process-grid">{process.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="assurance">
        <p className="eyebrow">Lower-risk outsourcing</p><h2>Confidence built into every milestone.</h2>
        <div className="assurance-grid">
          <article><span>◇</span><h3>NDA & confidentiality</h3><p>Protect sensitive ideas before detailed discovery begins.</p></article>
          <article><span>◇</span><h3>Clean handover, no lock-in</h3><p>Documented code, access and decisions keep your product portable.</p></article>
          <article><span>◇</span><h3>Milestone visibility</h3><p>Track real progress through demonstrations and documented updates.</p></article>
          <article><span>◇</span><h3>Post-launch support</h3><p>Continue with maintenance, monitoring and planned improvements.</p></article>
        </div>
      </section>

      <section className="section faq">
        <div><p className="eyebrow">Before we begin</p><h2>The practical questions, answered.</h2></div>
        <div className="faq-list">
          <details><summary>How will we communicate across time zones?<span>+</span></summary><p>We define shared working hours, channels, decision owners and a consistent demonstration schedule before delivery starts.</p></details>
          <details><summary>Can H2S VOLT work with our existing team?<span>+</span></summary><p>Yes. We can own a defined workstream, extend your engineering team or deliver quietly as a white-label partner.</p></details>
          <details><summary>Who owns the final product?<span>+</span></summary><p>The agreed source code and intellectual-property rights transfer to the client under the project contract.</p></details>
          <details><summary>What happens after launch?<span>+</span></summary><p>We provide a clear handover and can continue with an agreed support, maintenance or product-development plan.</p></details>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-intro"><p className="eyebrow">Start with a conversation</p><h2>Build with a team that treats your ambition like its own.</h2><p>Tell us what you need to achieve. We’ll send an immediate confirmation and reply within one business day with the right questions and a practical next step.</p><div className="contact-links"><a href="mailto:info@h2svolt.com">info@h2svolt.com ↗</a><a href="https://wa.me/923368048644" target="_blank" rel="noreferrer" aria-label="Contact H2S VOLT on WhatsApp">WhatsApp ↗</a></div></div>
        <form onSubmit={handleProjectSubmit}>
          <label className="honeypot" aria-hidden="true">Company website<input name="company" tabIndex="-1" autoComplete="off" /></label>
          <label>Name<input name="name" required placeholder="Your name" /></label>
          <label>Work email<input name="email" type="email" required placeholder="you@company.com" /></label>
          <label>Engagement<select name="engagement" defaultValue="" required><option disabled value="">Select an option</option><option>Fixed-scope project</option><option>Dedicated team</option><option>Staff augmentation</option><option>White-label partnership</option></select></label>
          <label>Timeline<select name="timeline" defaultValue="" required><option disabled value="">Select a timeline</option><option>As soon as possible</option><option>Within 1–2 months</option><option>Within 3–6 months</option><option>Still exploring</option></select></label>
          <label className="full">Project brief<textarea name="brief" required placeholder="What are you looking to build, improve or secure?" /></label>
          {formPhase > 0 && <div className="submit-sequence" aria-live="polite"><span className={formPhase >= 1 ? "active" : ""}>Brief prepared</span><span className={formPhase >= 2 ? "active" : ""}>Sending securely</span><span className={formPhase >= 3 ? "active" : ""}>Reply queued</span></div>}
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <button type="submit" disabled={formPhase > 0 && formPhase < 4}>
            {formPhase === 0 && <>Send project brief <span>↗</span></>}{formPhase === 1 && "Preparing your brief…"}{formPhase === 2 && "Sending your enquiry…"}{formPhase === 3 && "Preparing your confirmation…"}{formPhase === 4 && <>Message sent — check your inbox <span>✓</span></>}
          </button>
        </form>
      </section>

      <footer>
        <div className="footer-brand"><img src="/h2svolt-logo.png" alt="H2S VOLT" width="84" height="84" /><p>Pakistan-based remote engineering team serving international clients.</p><div className="founder-credit">
  <p>Co-founded by</p>

  <a
    href="https://www.linkedin.com/in/hamza-yousuf-6a8b1334a"
    target="_blank"
    rel="author me noreferrer"
  >
    Hamza Yousuf ↗
  </a>

  <a
    href="https://www.linkedin.com/in/muhammad-sohaib-jaber-306b29218/"
    target="_blank"
    rel="author me noreferrer"
  >
    Muhammad Sohaib Jaber ↗
  </a>

  <a
    href="https://www.linkedin.com/in/abdul-hadi-14a9462a5/"
    target="_blank"
    rel="author me noreferrer"
  >
    Abdul Hadi Khan ↗
  </a>
</div></div>
        <div><b>Explore</b><a href="#services">Services</a><a href="#engagement">Engagements</a><a href="#work">Work</a><a href="#process">Process</a></div>
        <div><b>Connect</b><a href="mailto:info@h2svolt.com">info@h2svolt.com</a><a href="https://www.linkedin.com/company/h2s-volt" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://wa.me/923368048644" target="_blank" rel="noreferrer" aria-label="Contact H2S VOLT on WhatsApp">WhatsApp ↗</a></div>
        <p className="copyright">© 2026 H2S VOLT. All rights reserved.</p>
      </footer>
    </main>
  );
}
