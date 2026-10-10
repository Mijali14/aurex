"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Icon } from "./icon";
import { ProductDemo } from "./product-demo";
import { FinalConversion } from "./final-conversion";
import { SiteFooter } from "./site-footer";

const DemoRequestModal = dynamic(() => import("./demo-request-modal").then(module => module.DemoRequestModal));

export function MarketingHero({ children }: { children?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuButton.current?.getAttribute("aria-expanded") === "true") { setMenuOpen(false); menuButton.current.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    window.addEventListener("keydown", onEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onEscape); desktop.removeEventListener("change", closeOnDesktop); };
  }, []);

  function showDemo() {
    setMenuOpen(false);
    const demo = document.getElementById("product-demo");
    demo?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    demo?.focus({ preventScroll: true });
  }

  function requestDemo() {
    if (menuOpen) menuButton.current?.focus();
    setMenuOpen(false);
    setRequestOpen(true);
  }

  function showHowItWorks() {
    setMenuOpen(false);
    const section = document.getElementById("how-it-works");
    section?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    section?.focus({ preventScroll: true });
  }

  function showFaq() {
    setMenuOpen(false);
    const section = document.getElementById("faq");
    window.history.replaceState(null, "", "#faq");
    section?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    section?.focus({ preventScroll: true });
  }

  function showProduct() {
    setMenuOpen(false);
    const section = document.getElementById("capabilities");
    section?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    section?.focus({ preventScroll: true });
  }

  const links = <><button type="button" onClick={showProduct}>Product</button><button type="button" onClick={showHowItWorks}>How It Works</button><button type="button" onClick={showFaq}>FAQ</button></>;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-container">
          <a className="wordmark" href="#main" aria-label="AUREX home">AUREX<span className="wordmark-point" /></a>
          <nav className="desktop-nav" aria-label="Main navigation">{links}</nav>
          <div className="nav-actions"><button type="button" className="nav-watch" onClick={showDemo}>See AUREX in Action <Icon name="arrow" /></button><button type="button" className="button button-primary nav-cta" onClick={requestDemo}>Request a Demo <Icon name="arrow" /></button></div>
          <button ref={menuButton} type="button" className="mobile-menu-button" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((value) => !value)}><span>{menuOpen ? "Close" : "Menu"}</span><Icon name={menuOpen ? "close" : "menu"} /></button>
        </div>
        {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{links}<button type="button" onClick={showDemo}>See AUREX in Action <Icon name="arrow" /></button><button type="button" className="button button-primary" onClick={requestDemo}>Request a Demo <Icon name="arrow" /></button></nav>}
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-rule" />AI SALES AGENT FOR YOUR WEBSITE</p>
            <h1 id="hero-title"><span className="headline-line">Turn Website</span>{" "}<span className="headline-line">Conversations Into</span>{" "}<span className="headline-line headline-outcome">Sales Opportunities.</span></h1>
            <p className="hero-description">AUREX answers visitors using your business knowledge, understands what they need, and finds the people worth following up with.</p>
            <div className="hero-actions"><button type="button" className="button button-primary" onClick={requestDemo}>Request a Demo <Icon name="arrow" /></button><button type="button" className="button button-secondary" onClick={showDemo}><Icon name="play" /> See AUREX in Action</button></div>
            <p className="hero-reassurance"><span className="signal-dot" />Available 24/7. Built to qualify, not just reply.</p>
          </div>
          <ProductDemo />
        </section>
        {children}
        <FinalConversion onRequestDemo={requestDemo} onSeeDemo={showDemo} />
      </main>
      <SiteFooter onProduct={showProduct} onHowItWorks={showHowItWorks} onFaq={showFaq} onRequestDemo={requestDemo} />
      {requestOpen && <DemoRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />}
    </>
  );
}
