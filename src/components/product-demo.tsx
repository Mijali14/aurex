"use client";

import { useEffect, useRef, useState } from "react";
import { evidence, FINAL_PHASE, leadScore, messages, PHASE_DELAYS } from "@/lib/demo-sequence";
import { Icon } from "./icon";

const fields = [
  { label: "Company need", value: "Enquiry automation", phase: 1 },
  { label: "Monthly enquiries", value: "~500", phase: 3 },
  { label: "Timeline", value: "Within 2 months", phase: 4 },
  { label: "Intent", value: "High", phase: 6 },
] as const;

const phaseStatus = [
  "Understanding the business need",
  "Business need identified · +24",
  "Reading volume and timeline",
  "Enquiry volume identified · +28",
  "Buying timeline identified · +24",
  "Reading the consultation request",
  "Consultation requested · +16",
  "Qualified for sales follow-up",
];

export function ProductDemo() {
  const [step, setStep] = useState<number>(FINAL_PHASE);
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const score = leadScore(step);
  const completed = step === FINAL_PHASE;
  const qualified = step >= 6;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(preference.matches);
      setStep(preference.matches ? FINAL_PHASE : 0);
      setRunning(!preference.matches);
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    if (root.current) observer.observe(root.current);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running || !visible || !pageVisible || reducedMotion || completed) return;
    const timer = window.setTimeout(() => setStep((current) => Math.min(FINAL_PHASE, current + 1)), PHASE_DELAYS[step]);
    return () => window.clearTimeout(timer);
  }, [running, visible, pageVisible, reducedMotion, completed, step]);

  function replay() {
    if (reducedMotion) return;
    setStep(0);
    setRunning(true);
  }

  return (
    <div ref={root} className="demo-wrap" id="product-demo" tabIndex={-1} aria-label="AUREX conversation to opportunity demonstration">
      <div className="demo-caption">
        <div className="transformation-path" aria-label="Conversation to evidence to opportunity">
          <span>Conversation</span><Icon name="arrow" /><span className={step > 0 ? "path-active" : ""}>Evidence</span><Icon name="arrow" /><span className={qualified ? "path-active" : ""}>Opportunity</span>
        </div>
        <span className="example-label">Illustrative example</span>
      </div>
      <div className="product-demo" data-step={step}>
        <div className="demo-panels">
          <section className="conversation-panel" aria-labelledby="conversation-title">
            <div className="panel-heading"><h2 id="conversation-title">Customer conversation</h2></div>
            <div className="transcript" aria-label="Example conversation transcript">
              {messages.map((message, index) => (
                <div
                  className={`message message-${message.role} ${message.step <= step ? "message-visible" : "message-pending"}`}
                  key={index}
                  aria-hidden={message.step > step}
                >
                  <span className="message-author">{message.role === "agent" ? "AUREX" : step >= 5 ? "Alex Morgan" : "Visitor"}</span>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="opportunity-panel" aria-labelledby="opportunity-title">
            <div className="panel-heading"><h2 id="opportunity-title">Lead qualification</h2></div>
            <div className="opportunity-body">
              <dl className="lead-fields" aria-label="Information understood by AUREX">
                {fields.map((field) => (
                  <div key={field.phase} className={`lead-field ${step === field.phase && !reducedMotion ? "field-discovered" : ""}`}>
                    <dt>{field.label}</dt>
                    <dd className={step < field.phase ? "pending-field" : ""} key={step >= field.phase ? "known" : "unknown"}>{step >= field.phase ? field.value : "—"}</dd>
                  </div>
                ))}
              </dl>

              <div className="qualification">
                <h3>{qualified ? "Why this lead qualifies" : "Qualification signals"}</h3>
                <ul>
                  {evidence.map((item) => (
                    <li key={item.step} className={step >= item.step ? "evidence-found" : "evidence-pending"} aria-hidden={step < item.step}>
                      <Icon name="check" /><span>{item.label}</span><span className="mono evidence-points">+{item.points}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="opportunity-summary">
                <div className="score-block">
                  <div className="score-label"><span>LEAD SCORE</span>{qualified && <span className="lead-badge">HOT LEAD</span>}</div>
                  <strong className="mono score-number">{score}<span> / 100</span></strong>
                  <div className="score-track" role="meter" aria-label="Illustrative lead score" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}><span style={{ transform: `scaleX(${score / 100})` }} /></div>
                </div>
                <div className={`final-opportunity ${completed ? "opportunity-ready" : ""}`} aria-hidden={!completed}>
                  <p className="lead-person">Alex Morgan <span>· Northstar</span></p>
                  <div className="recommended-action"><span>Recommended action</span><strong>Schedule product consultation</strong></div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="demo-bottom">
          <span className="sequence-status" role="status" aria-live="polite"><Icon name={completed ? "check" : "arrow"} />{phaseStatus[step]}</span>
          <div className="demo-controls">
            {!reducedMotion && !completed && <button type="button" onClick={() => setRunning((value) => !value)} aria-label={running ? "Pause demonstration" : "Resume demonstration"}><Icon name={running ? "pause" : "play"} />{running ? "Pause" : "Resume"}</button>}
            {!reducedMotion && <button type="button" onClick={replay} aria-label="Replay demonstration"><Icon name="replay" />Replay</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
