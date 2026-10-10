import { FINAL_PHASE, leadScore } from "@/lib/demo-sequence";
import styles from "./core-capabilities.module.css";

const customerFields = [
  ["Customer Need", "Enquiry automation"],
  ["Monthly Volume", "~500"],
  ["Timeline", "Within 2 months"],
  ["Intent", "High"],
];
const leads = [
  { name: "Alex Morgan", status: "HOT", score: leadScore(FINAL_PHASE) },
  { name: "Jamie Lee", status: "WARM", score: 61 },
  { name: "Taylor Smith", status: "LOW INTENT", score: 28 },
];

export function CoreCapabilities() {
  return (
    <section className={styles.section} id="capabilities" tabIndex={-1} aria-labelledby="capabilities-title">
      <div className={styles.container}>
        <header className={styles.intro}>
          <h2 id="capabilities-title">More Than An AI Chatbot.</h2>
          <p>Answers are only the beginning. AUREX connects customer questions to the information needed for follow-up.</p>
        </header>

        <div className={styles.workflow}>
          <article className={styles.chapter} aria-labelledby="knowledge-heading">
            <div className={styles.copy}>
              <p className={styles.stage}><span>01</span> Knowledge</p>
              <h3 id="knowledge-heading">Answers Using Your Business Knowledge</h3>
              <p>Give visitors relevant answers grounded in information your business has approved.</p>
            </div>
            <figure className={`${styles.visual} ${styles.knowledge}`}>
              <figcaption className={styles.caption}><span>Business Knowledge</span><span>Illustrative example</span></figcaption>
              <div className={styles.knowledgeBody}>
                <div className={styles.sources}>
                  <p className={styles.label}>Approved sources</p>
                  <ul>{["Website", "FAQs", "Product Information", "Documents"].map(source => <li key={source}><span className={styles.sourceMark} aria-hidden="true" />{source}</li>)}</ul>
                </div>
                <div className={styles.answer}>
                  <p className={styles.label}>Customer question</p>
                  <blockquote>“Does this plan support multiple locations?”</blockquote>
                  <div className={styles.response}>
                    <p className={styles.agentLabel}>AUREX</p>
                    <p>Yes. The Growth plan supports multiple locations under one account.</p>
                    <span>Source: Product Information · Growth plan</span>
                  </div>
                </div>
              </div>
            </figure>
          </article>

          <article className={styles.chapter} aria-labelledby="understanding-heading">
            <div className={styles.copy}>
              <p className={styles.stage}><span>02</span> Understanding</p>
              <h3 id="understanding-heading">Understands What Customers Actually Need</h3>
              <p>AUREX turns natural conversations into structured customer information.</p>
            </div>
            <figure className={`${styles.visual} ${styles.understanding}`}>
              <figcaption className={styles.caption}><span>Conversation → Evidence</span><span>Illustrative example</span></figcaption>
              <blockquote className={styles.excerpt}><span>Conversation · Alex Morgan</span>“We need to automate customer enquiries. Around 500 a month. We&apos;d like it in place within two months. I&apos;d like a consultation.”</blockquote>
              <div className={styles.extractionLabel}><span aria-hidden="true">↓</span> Customer information</div>
              <dl className={styles.fields}>{customerFields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </figure>
          </article>

          <article className={styles.chapter} aria-labelledby="qualification-heading">
            <div className={styles.copy}>
              <p className={styles.stage}><span>03</span> Qualification</p>
              <h3 id="qualification-heading">Qualifies And Prioritizes Leads</h3>
              <p>Not every enquiry deserves the same level of attention. AUREX identifies which prospects are showing stronger buying signals.</p>
            </div>
            <figure className={`${styles.visual} ${styles.qualification}`}>
              <figcaption className={styles.caption}><span>Lead priorities</span><span>Illustrative scores</span></figcaption>
              <table className={styles.leads}>
                <caption className={styles.srOnly}>Illustrative prospects ranked by buying intent; scores are out of 100.</caption>
                <thead><tr><th scope="col">Prospect</th><th scope="col">Intent</th><th scope="col">Score / 100</th></tr></thead>
                <tbody>{leads.map((lead, index) => <tr key={lead.name} className={index === 0 ? styles.priority : undefined}>
                  <th scope="row">{lead.name}</th><td><span className={styles.badge}>{lead.status}</span></td><td><strong>{lead.score}</strong><span className={styles.scoreTrack} aria-hidden="true"><span style={{ width: `${lead.score}%` }} /></span></td>
                </tr>)}</tbody>
              </table>
              <p className={styles.tableNote}>Stronger buying signals. A clearer order for follow-up.</p>
            </figure>
          </article>

          <article className={`${styles.chapter} ${styles.actionChapter}`} aria-labelledby="action-heading">
            <div className={styles.copy}>
              <p className={styles.stage}><span>04</span> Action</p>
              <h3 id="action-heading">Gives Your Sales Team A Clear Next Step</h3>
              <p>When a serious opportunity appears, AUREX summarizes what matters and tells your team what to do next.</p>
            </div>
            <figure className={`${styles.visual} ${styles.handoff}`}>
              <figcaption className={styles.caption}><span>Qualified Opportunity</span><span>Illustrative example</span></figcaption>
              <div className={styles.handoffBody}>
                <div className={styles.person}><div><h4>Alex Morgan</h4><p>Northstar · alex@northstar.example</p></div></div>
                <div className={styles.summary}><p className={styles.label}>Conversation Summary</p><p>Looking for a solution to handle ~500 enquiries per month. Wants implementation within two months.</p></div>
                <div className={styles.nextStep}><span>Recommended Action</span><strong>Schedule product consultation</strong><p>Consultation requested by Alex.</p></div>
              </div>
            </figure>
          </article>
        </div>
      </div>
    </section>
  );
}
