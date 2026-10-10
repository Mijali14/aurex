"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./setup-journey.module.css";

const steps = [
  { id: "business", label: "Business", title: "Introduce Your Business", description: "Start with your business details and sales goal." },
  { id: "knowledge", label: "Knowledge", title: "Approve Your Business Knowledge", description: "Choose the information AUREX can use to answer customers." },
  { id: "agent", label: "Agent", title: "Make AUREX Your Own", description: "Set its name, welcome message, tone, and sales objective." },
  { id: "website", label: "Website", title: "Add AUREX To Your Website", description: "Use the website widget installation instructions, with your developer’s help if needed." },
  { id: "opportunities", label: "Opportunities", title: "Review Your Opportunities", description: "See incoming conversations and decide where to focus next." },
];

function BusinessPreview() {
  return <><div className={styles.screenHeader}><span>Business details</span></div><dl className={styles.formFields}>{[["Business Name", "Northstar"], ["Industry", "Software"], ["Website", "northstar.example"], ["Primary Sales Goal", "Qualify inbound enquiries"]].map(([label, value]) => <div key={label} className={label === "Website" || label === "Primary Sales Goal" ? styles.fullField : undefined}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></>;
}
function KnowledgePreview() {
  return <><div className={styles.screenHeader}><span>Business Knowledge</span></div><ul className={styles.sources}>{["Website", "FAQs", "Product Information", "Documents", "Manual Information"].map(source => <li key={source}><span>{source}</span><span>Approved <span aria-hidden="true">✓</span></span></li>)}</ul></>;
}
function AgentPreview() {
  return <><div className={styles.screenHeader}><span>Your sales agent</span></div><dl className={styles.formFields}><div><dt>Agent Name</dt><dd>AUREX</dd></div><div><dt>Primary Objective</dt><dd>Qualify sales enquiries</dd></div><div className={styles.fullField}><dt>Welcome Message</dt><dd>Hi — how can I help?</dd></div></dl><div className={styles.tone}><span>Tone</span><ul aria-label="Illustrative tone options; Professional selected">{["Friendly", "Professional", "Concise", "Consultative"].map(tone => <li key={tone} data-selected={tone === "Professional"}>{tone}{tone === "Professional" && <span aria-hidden="true"> ✓</span>}</li>)}</ul></div></>;
}
function WebsitePreview() {
  return <><div className={styles.screenHeader}><span>Installation</span></div><div className={styles.installation}><div className={styles.widgetTitle}><strong>Website Widget</strong><span>Ready to Install</span></div><div className={styles.sitePreview}><div className={styles.browserBar}><span aria-hidden="true">○ ○ ○</span><span>northstar.example</span></div><div className={styles.websiteLines} aria-hidden="true"><span /><span /><span /></div><div className={styles.widget}><span>AUREX</span><p>Hi — how can I help?</p></div></div><button type="button" disabled className={styles.installButton}>Copy Installation Code</button><p className={styles.installNote}>Installation preview only. No live embed code or website connection is available in this example.</p></div></>;
}
function OpportunitiesPreview() {
  return <><div className={styles.screenHeader}><span>Opportunities</span></div><dl className={styles.metrics}>{[["Conversations", "24"], ["Qualified Leads", "7"], ["Hot Leads", "3"], ["Bookings", "2"]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className={styles.screenNote}>Illustrative numbers, not customer results.</p></>;
}
const previews = [BusinessPreview, KnowledgePreview, AgentPreview, WebsitePreview, OpportunitiesPreview];

export function SetupJourney() {
  const [active, setActive] = useState(0);
  const journey = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panels = journey.current?.querySelectorAll<HTMLElement>("article");
    if (!panels) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(Number((visible[0].target as HTMLElement).dataset.step));
    }, { rootMargin: "-15% 0px -50% 0px", threshold: 0 });
    panels.forEach(panel => observer.observe(panel));
    return () => observer.disconnect();
  }, []);

  return <section className={styles.section} id="getting-started" aria-labelledby="setup-title"><div className={styles.container}>
    <header className={styles.intro}><h2 id="setup-title">From Business Knowledge<br /><span>To AI Sales Agent.</span></h2><p>Five steps from your business information to your website.<span className={styles.previewNote}>Illustrative setup previews. Live setup is not connected.</span></p></header>
    <div className={styles.journey} ref={journey}>
      <nav className={styles.progress} aria-label="Explore the five setup steps"><p>YOUR SETUP JOURNEY</p><ol>{steps.map((step, index) => <li key={step.id}><a href={`#setup-${step.id}`} aria-current={active === index ? "step" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{step.label}</a></li>)}</ol><span className={styles.progressNote}>Your business knowledge.<br />Your sales experience.</span></nav>
      <div className={styles.steps}>{steps.map((step, index) => { const Preview = previews[index]; return <article id={`setup-${step.id}`} key={step.id} data-step={index} className={styles.step} aria-labelledby={`setup-${step.id}-title`}><div className={styles.stepCopy}><p className={styles.stepNumber}>STEP {String(index + 1).padStart(2, "0")} / 05</p><h3 id={`setup-${step.id}-title`}>{step.title}</h3><p>{step.description}</p></div><div className={styles.screen}><Preview /></div></article>; })}</div>
    </div>
  </div></section>;
}
