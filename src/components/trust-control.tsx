import { evidence, messages } from "@/lib/demo-sequence";
import styles from "./trust-control.module.css";

export function TrustControl() {
  return (
    <section className={styles.section} id="trust-control" aria-labelledby="trust-title">
      <div className={styles.container}>
        <header className={styles.intro}>
          <h2 id="trust-title">AI Should Help Your Sales Team.<br /><span>Not Become A Risk To It.</span></h2>
          <p>AUREX is designed around business-controlled knowledge, visible qualification, and clear human handoff.</p>
        </header>
        <div className={styles.ownership}><p>Your knowledge <span aria-hidden="true">/</span> Your rules <span aria-hidden="true">/</span> Your sales team</p><span>AUREX helps in between.</span></div>

        <div className={styles.story}>
          <article className={styles.principle} aria-labelledby="trust-knowledge-title">
            <p className={styles.number}>01 / APPROVED INFORMATION</p>
            <h3 id="trust-knowledge-title">Your Business Knowledge</h3>
            <p className={styles.description}>AUREX answers using information your business has approved.</p>
            <div className={styles.knowledge}>
              <div className={styles.uiHeading}><span>Business Knowledge</span><span>Approved</span></div>
              <div className={styles.sourceUsed}><span>Source used</span><strong>Product Information / Growth Plan</strong><small>Approved source</small></div>
            </div>
          </article>
          <article className={styles.principle} aria-labelledby="trust-qualification-title">
            <p className={styles.number}>02 / VISIBLE EVIDENCE</p>
            <h3 id="trust-qualification-title">Visible Qualification</h3>
            <p className={styles.description}>Your team can see why an opportunity was prioritized.</p>
            <div className={styles.qualification}>
              <p className={styles.uiLabel}>Evidence behind the Lead Score</p>
              <ul className={styles.evidence}>{evidence.map(item => <li key={item.label}><span aria-hidden="true">✓</span>{item.label}<small>+{item.points}</small></li>)}</ul>
            </div>
          </article>
          <p className={styles.exampleNote}>Illustrative product views · Approved information → visible evidence</p>
        </div>

        <div className={`${styles.story} ${styles.humanStory}`}>
          <article className={styles.principle} aria-labelledby="trust-human-title">
            <p className={styles.number}>03 / HUMAN OWNERSHIP</p>
            <h3 id="trust-human-title">Humans Stay In Control</h3>
            <p className={styles.description}>AUREX handles the first conversation and qualification. Your team handles the customer relationship when it matters.</p>
            <ol className={styles.handoff}>
              <li><span className={styles.node} aria-hidden="true" /><div><strong>AUREX</strong><span>Conversation complete</span></div></li>
              <li><span className={styles.node} aria-hidden="true" /><div><strong>Qualified opportunity</strong><span>Customer context ready for review</span></div></li>
              <li><span className={styles.node} aria-hidden="true" /><div><strong>Assigned to sales</strong><span>Your team takes the next step</span></div></li>
              <li><span className={styles.node} aria-hidden="true" /><div><strong>Human follow-up</strong><span>The relationship stays with your team</span></div></li>
            </ol>
          </article>
          <article className={styles.principle} aria-labelledby="trust-history-title">
            <p className={styles.number}>04 / REVIEWABLE CONTEXT</p>
            <h3 id="trust-history-title">Conversation History</h3>
            <p className={styles.description}>Your team can review what the customer asked, what AUREX answered, and why the lead was qualified.</p>
            <div className={styles.history}>
              <div className={styles.historyHeading}><strong>Alex Morgan</strong><span>Conversation summary</span></div>
              <p className={styles.context}>Review the customer’s own words alongside the qualification evidence.</p>
              <details className={styles.transcript}>
                <summary><span className={styles.closedLabel}>View full conversation</span><span className={styles.openLabel}>Hide full conversation</span><span className={styles.disclosureArrow} aria-hidden="true">→</span></summary>
                <ol aria-label="Illustrative conversation transcript">{messages.map((message, index) => <li key={index}><strong>{message.role === "agent" ? "AUREX" : "Alex Morgan"}</strong><p>{message.text}</p></li>)}</ol>
                <p className={styles.transcriptNote}>Qualification evidence: business need, enquiry volume, buying timeline, and a consultation request.</p>
              </details>
            </div>
          </article>
          <p className={styles.exampleNote}>Illustrative product views · Conversation context → human action</p>
        </div>

        <p className={styles.trustStatement}>AUREX should never ask your team to trust a score they can&apos;t understand.</p>
      </div>
    </section>
  );
}
