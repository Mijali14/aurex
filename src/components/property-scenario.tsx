"use client";

import { useRef, useState } from "react";
import styles from "./property-scenario.module.css";

const conversation = [
  ["Visitor", "I'm looking for something mainly for investment."],
  ["AUREX", "Absolutely. Are you more focused on rental income or long-term appreciation?"],
  ["Visitor", "Rental income. My budget is around $320,000."],
  ["AUREX", "Got it. Aurelia has options within that range. Are you planning to purchase soon, or are you still exploring?"],
  ["Visitor", "Hopefully within the next two months."],
  ["AUREX", "Understood. Would you like me to help arrange a viewing or consultation with the sales team?"],
  ["Visitor", "Yes, this weekend if possible."],
];
const signals = [
  { step: 0, points: 22, label: "Clear investment intent" },
  { step: 2, points: 28, label: "Budget matches project" },
  { step: 4, points: 24, label: "Active purchase timeline" },
  { step: 6, points: 20, label: "Viewing requested" },
];
const fields = [
  { label: "Purpose", value: "Investment", step: 0 },
  { label: "Priority", value: "Rental income", step: 2 },
  { label: "Budget", value: "~$320,000", step: 2 },
  { label: "Timeline", value: "Within 2 months", step: 4 },
  { label: "Viewing", value: "Requested", step: 6 },
];

export function PropertyScenario() {
  const [step, setStep] = useState(6);
  const conversationRef = useRef<HTMLDivElement>(null);
  const complete = step === 6;
  const score = signals.filter(signal => signal.step <= step).reduce((sum, signal) => sum + signal.points, 0);

  function viewConversation() {
    conversationRef.current?.scrollIntoView({ block: "start" });
    conversationRef.current?.focus({ preventScroll: true });
  }

  return (
    <section className={styles.section} id="property-example" aria-labelledby="property-title">
      <div className={styles.container}>
        <header className={styles.intro}>
          <div><p className={styles.eyebrow}>REAL-WORLD USE CASE</p><h2 id="property-title">From Property Enquiry<br /><span>To Qualified Buyer.</span></h2></div>
          <p>AUREX can handle the first conversation, answer project questions, understand buyer intent, and hand serious prospects to the sales team.</p>
        </header>

        <div className={styles.canvas}>
          <div className={styles.canvasHeading}><span>Conversation → Evidence → Opportunity</span><span>Illustrative property example · Fictional project</span></div>
          <div className={styles.arrival}>
            <div className={styles.project}>
              <p className={styles.stage}>01 / PROJECT PAGE</p>
              <div className={styles.architecture} aria-hidden="true"><svg viewBox="0 0 360 160" fill="none"><path d="M0 146H360M62 146V54L148 20L234 54V146M148 20V146M234 146V79L300 55V146M62 75L148 43L234 75M62 98L148 67L234 98M62 122L148 91L234 122M85 45V146M116 32V146M176 32V146M205 43V146M258 70V146M281 62V146" /></svg></div>
              <h3>AURELIA RESIDENCES</h3><p className={styles.price}>From $280,000</p>
              <p className={styles.location}>1–3 Bedroom Residences<br />Central City</p>
              <dl className={styles.projectDetails}><div><dt>Purpose</dt><dd>Own stay / Investment</dd></div><div><dt>Viewing</dt><dd>Available by appointment</dd></div></dl>
              <button type="button" className={styles.ask} onClick={viewConversation}>Ask AUREX <span aria-hidden="true">→</span></button>
            </div>

            <div className={styles.conversation} ref={conversationRef} tabIndex={-1} aria-label="Illustrative property buyer conversation">
              <div className={styles.conversationHeading}><div><p className={styles.stage}>02 / CUSTOMER CONVERSATION</p><h3>A buyer with a clear goal.</h3></div><span className={styles.assistantLabel}>AUREX</span></div>
              <ol className={styles.messages}>{conversation.map(([role, text], index) => index <= step && <li key={index} className={role === "AUREX" ? styles.agent : undefined}><span>{role}</span><p>{text}</p></li>)}</ol>
              <div className={styles.playback}>
                <p role="status">{complete ? "Conversation complete · Viewing requested" : `Message ${step + 1} of 7 · Buyer information updates below`}</p>
                <div className={styles.controls}>{complete ? <button type="button" onClick={() => setStep(0)}>Replay example <span aria-hidden="true">↺</span></button> : <><button type="button" onClick={() => setStep(current => Math.min(6, current + 1))}>Next message <span aria-hidden="true">→</span></button><button type="button" onClick={() => setStep(6)}>Show complete example</button></>}</div>
              </div>
            </div>
          </div>

          <div className={styles.outcome}>
            <div className={styles.buyer}>
              <p className={styles.stage}>03 / BUYER REQUIREMENTS & QUALIFICATION</p>
              <h3>Intent, made visible.</h3>
              <dl className={styles.fields}>{fields.map(field => <div key={field.label} data-known={step >= field.step}><dt>{field.label}</dt><dd>{step >= field.step ? field.value : "Not yet shared"}</dd></div>)}</dl>
              <div className={styles.scoreLine}><div><span>Lead Score · Illustrative</span><strong>{score}<small>/ 100</small></strong></div><span className={complete ? styles.hot : styles.pending}>{complete ? "HOT LEAD" : "QUALIFYING"}</span></div>
              <p className={styles.qualificationLabel}>{complete ? "QUALIFIED BUYER" : "BUYING SIGNALS DISCOVERED"}</p>
              <ul className={styles.evidence}>{signals.map(signal => <li key={signal.label} data-known={step >= signal.step}><span aria-hidden="true">{step >= signal.step ? "✓" : "—"}</span>{signal.label}<small>{step >= signal.step ? `+${signal.points}` : "Pending"}</small></li>)}</ul>
            </div>

            <div className={styles.handoff}>
              <p className={styles.stage}>04 / PROPERTY AGENT</p>
              <h3>A clear reason to follow up.</h3>
              {complete ? <div className={styles.opportunity}>
                <p className={styles.opportunityLabel}>NEW QUALIFIED OPPORTUNITY</p><h4>Maya Chen</h4><p className={styles.identityNote}>Illustrative buyer identity</p>
                <div className={styles.action}><span>Recommended Action</span><strong>Arrange property viewing</strong></div>
                <div className={styles.summary}><span>Conversation Summary</span><p>Investment buyer focused on rental income. Budget approximately $320K. Looking to purchase within two months. Requested a weekend viewing.</p></div>
                <div className={styles.actions}><button type="button" disabled>Contact Lead</button><button type="button" onClick={viewConversation}>View Conversation <span aria-hidden="true">↑</span></button></div>
                <p className={styles.mockNote}>Illustrative handoff. Contact action is a preview; no viewing is booked.</p>
              </div> : <div className={styles.waiting}><span className={styles.assistantLabel}>AUREX IS QUALIFYING</span><p>The opportunity summary appears after the buyer&apos;s requirements and viewing request are understood.</p></div>}
            </div>
          </div>
          <p className={styles.exampleNote}>Fictional project, buyer and conversation. Scores demonstrate this example only; they are not a universal scoring model.</p>
        </div>

        <p className={styles.positioning}>Starting with property.<br /><span>Built for high-intent sales conversations everywhere.</span></p>
      </div>
    </section>
  );
}
