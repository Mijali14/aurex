"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./problem-recognition.module.css";

const problems = [
  ["Slow Replies", "Potential customers lose interest when they have to wait for a response."],
  ["Unqualified Enquiries", "Sales teams spend time speaking to people who are not ready or relevant."],
  ["Missed Opportunities", "High-intent visitors can disappear before the sales team knows they were interested."],
  ["Repetitive Questions", "Teams repeatedly answer the same basic questions instead of focusing on valuable conversations."],
];
const classifications = ["LOW INTENT", "WARM", "LOW INTENT", "HOT LEAD", "WARM"];

export function ProblemRecognition() {
  const visual = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const element = visual.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!motion.matches) setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="opportunity-gap" aria-labelledby="recognition-title">
      <div className={styles.container}>
        <div className={styles.editorial}>
          <header className={styles.intro}>
            <h2 id="recognition-title"><span>You&apos;re Already Getting Visitors.</span> You&apos;re Losing Opportunities.</h2>
            <p>When every enquiry looks the same, serious buying intent is easy to miss.</p>
          </header>

          <div className={styles.visual} ref={visual} data-entered={entered}>
            <div className={styles.visualHeading}>
              <h3>Same enquiries.<br />A clearer priority.</h3>
              <span>Illustrative example</span>
            </div>
            <table className={styles.enquiries}>
              <caption className={styles.srOnly}>An illustrative comparison of website enquiries before and with AUREX qualification.</caption>
              <thead><tr><th scope="col">Before AUREX</th><th scope="col">With AUREX</th></tr></thead>
              <tbody>{classifications.map((status, index) => (
                <tr key={index} style={{ "--order": index } as CSSProperties}>
                  <th scope="row"><span className={styles.visitorDot} />Website Visitor {String(index + 1).padStart(2, "0")}</th>
                  <td><span className={styles.pending} aria-hidden="true">Understanding…</span><span className={`${styles.status} ${index === 3 ? styles.hot : ""}`}>{status}</span></td>
                </tr>
              ))}</tbody>
            </table>
            <div className={styles.qualified}>
              <div className={styles.qualifiedHeading}><span>PRIORITY OPPORTUNITY</span><strong>Visitor 04</strong></div>
              <p>A consultation request gives your team a clear reason to follow up.</p>
            </div>
            <p className={styles.visualNote}>The same incoming enquiries. Buying intent made visible.</p>
          </div>

          <ol className={styles.problems}>{problems.map(([title, description], index) => (
            <li key={title}><span className={styles.number}>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>
          ))}</ol>
        </div>

        <div className={styles.insight}>
          <p className={styles.central}>Your sales team shouldn&apos;t have to treat every enquiry the same.</p>
          <p className={styles.explanation}>AUREX helps them focus on the people showing real buying intent.</p>
        </div>
      </div>
    </section>
  );
}
