import { Icon } from "./icon";
import styles from "./final-conversion.module.css";

export function FinalConversion({ onRequestDemo, onSeeDemo }: { onRequestDemo: () => void; onSeeDemo: () => void }) {
  return <section className={styles.section} id="request-demo" aria-labelledby="conversion-title"><div className={styles.container}>
    <div className={styles.copy}>
      <h2 id="conversion-title">Your Next Sales Opportunity<br /><span>Could Already Be On Your Website.</span></h2>
      <p className={styles.value}>Tell us about your business and we’ll show you how AUREX could fit your sales process.</p>
      <div className={styles.actions}><button type="button" className="button button-primary" onClick={onRequestDemo}>Request a Demo <Icon name="arrow" /></button><button type="button" className="button button-ghost" onClick={onSeeDemo}>See AUREX in Action <Icon name="arrow" /></button></div>
      <div className={styles.pilot}><p className={styles.pilotLabel}>EARLY CUSTOMER PILOT</p><p>Selected early customers may be invited to test AUREX with their business for 7 days, with limited usage.</p><p className={styles.pilotDetail}>After a demo and business discussion, invited customers can review real enquiries and the opportunities AUREX identifies. Continuing after the pilot would require a paid plan.</p></div>
    </div>
    <figure className={styles.visual}>
      <figcaption>Illustrative opportunity</figcaption>
      <div className={styles.opportunity}>
        <p className={styles.label}>FROM ENQUIRY TO NEXT STEP</p><h3>Consultation requested.</h3>
        <p className={styles.outcome}>Alex Morgan · Northstar</p>
        <div className={styles.nextStep}><span>Recommended Action</span><strong>Schedule consultation</strong></div>
      </div>
    </figure>
    <p className={styles.supporting}>Built for businesses where every serious enquiry matters.</p>
  </div></section>;
}
