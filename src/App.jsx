import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./index.css";

const services = [
  ["01", "Web platforms", "Fast, secure web applications built around real business workflows and measurable outcomes."],
  ["02", "Shopify & ecommerce", "Brand-led storefronts, structured catalogues and considered shopping experiences, from product discovery to checkout."],
  ["03", "Mobile applications", "Cross-platform products designed for consistent performance and intuitive use."],
  ["04", "Custom software", "Purpose-built systems that remove friction, automate work and support growth."],
  ["05", "Cybersecurity", "Security reviews, penetration testing and safer engineering practices from the start."],
  ["06", "Dedicated product teams", "A focused remote team that works as a dependable extension of your business."],
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
    title: "PakTrace",
    description: "A blockchain-based AML and KYC framework with AI-supported detection and structured reporting.",
    image: "/pak-trace.jpeg",
    alt: "Pak Trace platform interface",
  },
  {
    eyebrow: "Gamified learning",
    title: "CyberQuest",
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

const portfolio = [
  { title: "Y-SCENTS", eyebrow: "Fragrance · Shopify", description: "A considered shopping experience for a fragrance brand, bringing together collection discovery, product storytelling and a clear path to checkout.", image: "/portfolio/yscents.webp", alt: "Y-SCENTS fragrance storefront", url: "https://www.yscents.store/", scope: ["Storefront design", "Shopify development", "Product presentation"] },
  { title: "Bays Attire", eyebrow: "Fashion · Shopify", description: "An editorial storefront for a womenswear label. Collection browsing, product detail and sizing guidance help customers explore the brand and choose their next piece.", image: "/portfolio/baysattire.webp", alt: "Bays Attire fashion storefront", url: "https://baysattire.com/", scope: ["Shopify storefront", "Collection pages", "Mobile experience"] },
  { title: "JYCreation", eyebrow: "Handmade goods · Ecommerce", description: "A distinctive online home for handmade creations, with organised collections, product browsing and a dedicated route for custom orders.", image: "/portfolio/jycreation.webp", alt: "JYCreation handmade goods storefront", url: "https://www.jycreations.store/", scope: ["Custom storefront", "Collection discovery", "Custom order enquiries"] },
  { title: "Vape Planet", eyebrow: "Retail · Custom ecommerce", description: "A custom retail platform built around a structured catalogue, category navigation and product search, with an administration experience for managing the store.", image: "/portfolio/vapeplanet.webp", alt: "Vape Planet retail website interface", scope: ["Catalogue architecture", "Storefront development", "Admin tools"] },
  { title: "DreamFyre", eyebrow: "Digital platform", description: "A platform project with distinct player, staff and administrator experiences. The work brings account access, dashboards and operational workflows into one interface.", image: "/client-dreamfyre.jpeg", alt: "DreamFyre brand identity", brandOnly: true, scope: ["Interface design", "Account experiences", "Administration workflows"] },
  { title: "Excel", eyebrow: "Brand partnership", description: "Part of the H2S VOLT client portfolio.", image: "/client-excel.jpeg", alt: "Excel client brand identity", brandOnly: true },
  ...caseStudies.slice(0, 3).map(project => ({ ...project, personal: true, eyebrow: `Personal project · ${project.eyebrow}` })),
];

function MotionEnhancements() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let dispose = () => {};
    const configure = () => {
      dispose();
      if (preference.matches) return;
      const targets = [...document.querySelectorAll(".portfolio-heading, .portfolio-card, .service-list article, .extension-statement, .advantage-grid article, .model-grid article, .case-tile, .process-grid article, .faq-list details, .contact-intro")];
      let observer;
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }), { threshold: 0.08 });
        targets.forEach((target, index) => {
          // Never hide content already in view or currently focused.
          if (target.getBoundingClientRect().top < window.innerHeight || target.contains(document.activeElement)) return;
          target.style.setProperty("--reveal-delay", `${index % 2 * 70}ms`);
          target.classList.add("scroll-reveal");
          observer.observe(target);
        });
      }
      const cards = [...document.querySelectorAll(".hero-project, .portfolio-visual")];
      const cleanups = [];
      if (finePointer.matches) cards.forEach(card => {
        let frame = 0;
        const move = event => {
          if (event.pointerType !== "mouse") return;
          const {clientX, clientY} = event;
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            const box = card.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (clientX - box.left) / box.width));
            const y = Math.max(0, Math.min(1, (clientY - box.top) / box.height));
            card.style.setProperty("--tilt-x", `${(0.5 - y) * 10}deg`);
            card.style.setProperty("--tilt-y", `${(x - 0.5) * 12}deg`);
            card.style.setProperty("--shift-x", `${(x - 0.5) * 8}px`);
            card.style.setProperty("--shift-y", `${(y - 0.5) * 8}px`);
            card.style.setProperty("--light-x", `${x * 100}%`);
            card.style.setProperty("--light-y", `${y * 100}%`);
            card.classList.add("tilting");
          });
        };
        const reset = () => {
          cancelAnimationFrame(frame);
          card.classList.remove("tilting");
          ["--tilt-x", "--tilt-y", "--light-x", "--light-y", "--shift-x", "--shift-y"].forEach(key => card.style.removeProperty(key));
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", reset);
        card.addEventListener("pointercancel", reset);
        card.addEventListener("blur", reset);
        cleanups.push(() => {
          reset();
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", reset);
          card.removeEventListener("pointercancel", reset);
          card.removeEventListener("blur", reset);
        });
      });
      dispose = () => {
        observer?.disconnect();
        targets.forEach(target => {
          target.classList.remove("scroll-reveal", "is-visible");
          target.style.removeProperty("--reveal-delay");
        });
        cleanups.forEach(cleanup => cleanup());
      };
    };
    configure();
    preference.addEventListener("change", configure);
    finePointer.addEventListener("change", configure);
    return () => {
      dispose();
      preference.removeEventListener("change", configure);
      finePointer.removeEventListener("change", configure);
    };
  }, []);
  return null;
}

function ClientShowcase() {
  return <div className="brand-strip">{portfolio.filter(project => !project.personal).map(project => <a key={project.title} href="#work">{project.title}</a>)}</div>;
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
        <div className={`case-dialog-image ${caseStudy.brandOnly ? "brand-image" : ""}`}>
          <img src={caseStudy.image} alt={caseStudy.alt} width="1536" height="1024" />
        </div>
        <div className="case-dialog-copy">
          <p>{caseStudy.eyebrow}</p>
          <h3 id="case-dialog-title">{caseStudy.title}</h3>
          <span id="case-dialog-description">{caseStudy.description}</span>
          {caseStudy.scope && <ul className="scope-list">{caseStudy.scope.map(item => <li key={item}>{item}</li>)}</ul>}
          {caseStudy.url && <a href={caseStudy.url} target="_blank" rel="noreferrer">Visit website <b>↗</b></a>}
          <a href="#contact" onClick={onClose}>Discuss your project <b>↗</b></a>
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
    const header = document.querySelector(".site-header");
    const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <MotionEnhancements />
      <header className="site-header">
        <a href="#top" className="brand" aria-label="H2S VOLT home">
          <img src="/h2svolt-logo.png" alt="H2S VOLT" width="58" height="58" />
          <span><b>H2S VOLT</b><small>BUILD · INNOVATE · ELEVATE</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">Our work</a><a href="#services">Services</a><a href="#why">The studio</a><a href="#process">Process</a><a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#contact">Start a project <span>↗</span></a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span></span><span></span></summary>
          <nav><a href="#work">Our work</a><a href="#services">Services</a><a href="#why">The studio</a><a href="#process">Process</a><a href="#contact">Contact</a></nav>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Independent digital studio · Pakistan / Worldwide</p>
          <h1>Your next chapter.<br /><em>Built with Volt.</em></h1>
          <p className="hero-lead">Distinctive websites. Thoughtful software. We turn ambitious ideas into digital experiences your customers remember.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore our work <span>↗</span></a>
            <a className="button button-secondary" href="#contact">Tell us your idea</a>
          </div>
          <div className="hero-notes"><span>Design</span><span>Development</span><span>Ongoing support</span></div>
        </div>
        <button className="hero-project" onClick={() => setSelectedCase(portfolio[0])} aria-label="View Y-SCENTS project">
          <span className="project-window"><span>Selected project / 01</span><span>yscents.store ↗</span></span>
          <img src="/portfolio/yscents.webp" alt="The Y-SCENTS website designed by H2S VOLT" width="1348" height="926" fetchPriority="high" />
          <span className="hero-project-caption"><strong>Y-SCENTS</strong><span>Fragrance, expressed digitally.</span></span>
        </button>
      </section>
      <section className="clients-section" id="clients" aria-label="Selected client brands">
        <p className="eyebrow">Different brands. Shared ambition.</p>
        <ClientShowcase />
      </section>
      <section className="section portfolio" id="work">
        <div className="portfolio-heading"><div><p className="eyebrow">01 / Selected portfolio</p><h2>Good work.<br /><em>Built with purpose.</em></h2></div><p>Client partnerships and personal projects. Explore our storefronts, custom platforms and work in cybersecurity.</p></div>
        <div className="portfolio-grid">{portfolio.map((project,index) => <article className={`portfolio-card ${project.brandOnly ? "brand-project" : ""}`} key={project.title}>
          <button className="portfolio-visual" onClick={() => setSelectedCase(project)} aria-label={`View ${project.title} project`}>
            <img src={project.image} alt={project.alt} width="1348" height="926" loading="lazy" />
            <span className="view-project">View project ↗</span>
          </button>
          <div className="portfolio-meta"><div><p>{project.eyebrow}</p><h3><button onClick={() => setSelectedCase(project)}>{project.title}</button></h3></div><span className="project-number">{String(index+1).padStart(2,"0")}</span></div>
          <p className="portfolio-description">{project.description}</p>
          {project.scope && <div className="project-tags">{project.scope.map(item => <span key={item}>{item}</span>)}</div>}
        </article>)}</div>
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
        <div className="extension-statement"><p className="eyebrow">The people behind the pixels</p><h2>A small team. Invested in your big picture.</h2><p>Work directly with the people designing and building your product. We connect the visual details with the practical needs of your business, from the first conversation through launch and support.</p><div className="founder-intro" id="hamza-yousuf"><p className="eyebrow">Co-founder</p><h3>Hamza Yousuf</h3><p>Hamza Yousuf is a co-founder of H2S VOLT, our software development and cybersecurity company based in Pakistan.</p><a href="/hamza-yousuf/">Meet Hamza Yousuf ↗</a><a href="https://www.linkedin.com/in/hamza-yousuf-h2svolt" target="_blank" rel="me noreferrer">Hamza on LinkedIn ↗</a></div><div className="founder-intro" id="muhammad-sohaib-jaber"><p className="eyebrow">Co-founder</p><h3>Muhammad Sohaib Jaber</h3><p>Muhammad Sohaib Jaber is a co-founder of H2S VOLT, our software development and cybersecurity company based in Pakistan.</p><a href="/muhammad-sohaib-jaber/">Meet Muhammad Sohaib Jaber ↗</a><a href="https://www.linkedin.com/in/muhammad-sohaib-jaber-306b29218/" target="_blank" rel="me noreferrer">Sohaib on LinkedIn ↗</a></div></div>
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

      <section className="section work" id="technical-work">
        <div className="work-heading"><div className="section-label"><span>03</span><p>Technical projects</p></div><div className="work-title"><h2>Beyond the storefront.</h2><img className="work-logo" src="/h2svolt-logo.png" alt="" width="92" height="92" aria-hidden="true" /></div></div>
        <div className="case-list">
          {caseStudies.slice(3).map((caseStudy, index) => (
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
        <div className="process-heading"><div className="section-label"><span>04</span><p>Delivery process</p></div><h2>A clear process. A better launch.</h2></div>
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
        <div className="contact-intro"><p className="eyebrow">Start with a conversation</p><h2>Have something in mind? Let’s build it.</h2><p>Tell us what you need to achieve. We’ll send an immediate confirmation and reply within one business day with the right questions and a practical next step.</p><div className="contact-links"><a href="mailto:info@h2svolt.com">info@h2svolt.com ↗</a><a href="https://wa.me/923368048644" target="_blank" rel="noreferrer" aria-label="Contact H2S VOLT on WhatsApp">WhatsApp ↗</a></div></div>
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
    href="https://www.linkedin.com/in/hamza-yousuf-h2svolt"
    target="_blank"
    rel="author me noreferrer"
  >
    Hamza Yousuf · Co-Founder ↗
  </a>
  <a href="/hamza-yousuf/">About Hamza Yousuf</a>

  <a
    href="https://www.linkedin.com/in/muhammad-sohaib-jaber-306b29218/"
    target="_blank"
    rel="author me noreferrer"
  >
    Muhammad Sohaib Jaber · Co-Founder ↗
  </a>
  <a href="/muhammad-sohaib-jaber/">About Muhammad Sohaib Jaber</a>
</div></div>
        <div><b>Explore</b><a href="#services">Services</a><a href="#engagement">Engagements</a><a href="#work">Work</a><a href="#process">Process</a></div>
        <div><b>Connect</b><a href="mailto:info@h2svolt.com">info@h2svolt.com</a><a href="https://www.linkedin.com/company/h2s-volt" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://www.linkedin.com/in/abdul-hadi-14a9462a5/" target="_blank" rel="noreferrer">Abdul Hadi Khan ↗</a><a href="https://wa.me/923368048644" target="_blank" rel="noreferrer" aria-label="Contact H2S VOLT on WhatsApp">WhatsApp ↗</a></div>
        <p className="copyright">© 2026 H2S VOLT. All rights reserved.</p>
      </footer>
    </main>
  );
}
