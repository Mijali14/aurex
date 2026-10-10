"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "./icon";
import styles from "./opportunity-flow.module.css";

function Stage({ number, title, children, outcome = false }: {
  number: number;
  title: string;
  children: ReactNode;
  outcome?: boolean;
}) {
  return (
    <li className={`${styles.stage} ${outcome ? styles.outcomeStage : ""}`} style={{ "--stage-order": number - 1 } as CSSProperties}>
      <span className={styles.node} aria-hidden="true" />
      <h3 className={styles.stageTitle}><span className={styles.stageNumber} aria-hidden="true">0{number}</span>{title}</h3>
      <div className={styles.stageBody}>{children}</div>
    </li>
  );
}

export function OpportunityFlow() {
  const flow = useRef<HTMLOListElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setEntered(true);
      observer.disconnect();
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    if (flow.current) observer.observe(flow.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="how-it-works" tabIndex={-1} aria-labelledby="flow-title">
      <div className={styles.container}>
        <header className={styles.intro}>
          <h2 id="flow-title">Your Website Gets Visitors.<br /><span>AUREX Finds The Opportunities.</span></h2>
          <p>From a first question to a clear next step. Here’s how a visitor becomes a sales opportunity.</p>
        </header>

        <ol ref={flow} className={styles.flow} data-entered={entered} aria-label="From website visitor to qualified sales opportunity">
          <Stage number={1} title="Visitor">
            <p className={styles.bodyHeading}>Website Visitor</p>
            <blockquote className={styles.visitorQuote}>“I’m looking for a better way to handle customer enquiries.”</blockquote>
          </Stage>

          <Stage number={2} title="Conversation">
            <p className={styles.bodyHeading}>AUREX starts the conversation.</p>
            <blockquote className={styles.agentQuote}>“How many enquiries does your team currently receive?”</blockquote>
            <span className={styles.responseLabel}>24/7 response</span>
          </Stage>

          <Stage number={3} title="Understanding">
            <p className={styles.stageDescription}>Customer needs, enquiry volume, and buying timeline become structured information.</p>
          </Stage>

          <Stage number={4} title="Qualification">
            <p className={styles.stageDescription}>Buying signals inform the Lead Score, with evidence your team can review.</p>
            <p className={styles.intentSignal}><Icon name="check" />Priority backed by context</p>
          </Stage>

          <Stage number={5} title="Opportunity" outcome>
            <div className={styles.opportunity}>
              <p className={styles.outcomeLabel}>Ready for human follow-up</p>
              <p className={styles.stageDescription}>Contact details, customer context, and a Recommended Action in one place.</p>
            </div>
          </Stage>
        </ol>

        <div className={styles.ending}>
          <p>AUREX doesn’t just answer.<br className={styles.mobileBreak} /> <strong>It helps your team know who to act on.</strong></p>
          <span>Illustrative example</span>
        </div>
      </div>
    </section>
  );
}
