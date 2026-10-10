import type { MouseEvent } from "react";
import styles from "./site-footer.module.css";

type FooterProps = {
  onProduct: () => void;
  onHowItWorks: () => void;
  onFaq: () => void;
  onRequestDemo: () => void;
};

export function SiteFooter({ onProduct, onHowItWorks, onFaq, onRequestDemo }: FooterProps) {
  function navigate(event: MouseEvent<HTMLAnchorElement>, action: () => void) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    action();
  }

  function showProperty() {
    const target = document.getElementById("property-example");
    if (!target) return;
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  return <footer className={styles.footer} id="footer"><div className={styles.container}>
    <div className={styles.top}>
      <div className={styles.brand}><p className={styles.wordmark}>AUREX<span aria-hidden="true" /></p><p>AI Sales Agent for your website.</p><span className={styles.signature}>Conversation → Evidence → Opportunity</span></div>
      <nav className={styles.navigation} aria-label="Footer navigation">
        <div className={styles.group}><h2>Product</h2><ul><li><a href="#capabilities" onClick={event => navigate(event, onProduct)}>Product</a></li><li><a href="#how-it-works" onClick={event => navigate(event, onHowItWorks)}>How It Works</a></li><li><a href="#faq" onClick={event => navigate(event, onFaq)}>FAQ</a></li><li><button type="button" onClick={onRequestDemo}>Request a Demo</button></li></ul></div>
        <div className={styles.group}><h2>Solutions</h2><ul><li><a href="#property-example" onClick={event => navigate(event, showProperty)}>Property</a></li></ul></div>
        {/* Company, contact, and legal links stay omitted until real destinations exist. */}
      </nav>
    </div>
    <div className={styles.bottom}><span>© {new Date().getFullYear()} AUREX</span><span>All rights reserved.</span></div>
  </div></footer>;
}
