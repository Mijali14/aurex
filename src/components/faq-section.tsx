"use client";

import { useState } from "react";
import styles from "./faq-section.module.css";

const faqs = [
  {
    question: "What exactly is AUREX?",
    answer: "AUREX is an AI Sales Agent for your website. It answers questions using approved Business Knowledge, captures customer needs and contact details, and identifies enquiries worth following up.",
  },
  {
    question: "Is AUREX just a chatbot?",
    answer: "Answering questions is only part of it. AUREX also collects qualification information, identifies buying signals, and gives your team a customer summary with a Recommended Action.",
  },
  {
    question: "Where does AUREX get its answers?",
    answer: "AUREX is designed around business-controlled knowledge. You choose what it can use: website content, FAQs, product information, approved documents, and manually added business information. The goal is to ground customer responses in information your business has provided or approved.",
  },
  {
    question: "Can AUREX make mistakes?",
    answer: "Yes. AI systems can make mistakes. AUREX is designed around approved business knowledge, visible conversation history, and human handoff rather than asking businesses to blindly trust every response. Important customer decisions should still involve appropriate human review.",
  },
  {
    question: "How does AUREX decide whether a lead is hot?",
    answer: "AUREX can evaluate signals shared in the conversation, such as customer need, buying intent, budget or business fit, urgency, timeline, and a requested consultation or appointment. The website uses illustrative scoring, not a scientifically validated model. Actual qualification rules are intended to be configurable for the business and use case.",
  },
  {
    question: "Does AUREX replace my sales team?",
    answer: "No. AUREX is designed to handle repetitive first conversations and organize inbound opportunities. Your team remains responsible for customer relationships, consultation, negotiation, and closing. The aim is to help salespeople spend more time on the conversations that matter.",
  },
  {
    question: "Can my team review the customer conversation?",
    answer: "The product direction includes conversation history and structured lead summaries so your team can review what customers asked, what information was collected, and why an opportunity was prioritized. The views on this website are illustrative previews; a live conversation-history backend is not yet connected.",
  },
  {
    question: "How do I add AUREX to my website?",
    answer: "AUREX is being designed as a website sales-agent experience. The planned setup flow lets you configure your business knowledge and agent before adding it to your website. Installation shown here is currently illustrative while the product backend is being developed.",
  },
  {
    question: "Is AUREX only for property businesses?",
    answer: "No. Property is our first demonstration and validation use case. AUREX is intended for businesses where visitors ask questions before a meaningful purchase or booking. Support for other use cases still needs to be validated.",
  },
  {
    question: "Can AUREX work internationally?",
    answer: "AUREX is being designed as a global product rather than a country-specific system, with an experience intended for businesses across different markets. Availability for specific markets, languages, currencies, and channels still needs to be confirmed as the product develops.",
  },
  {
    question: "How much does AUREX cost?",
    answer: "AUREX is being prepared for early customer testing, so final pricing has not been published. Pricing will be validated through what we learn from early customers. Businesses interested in testing AUREX can request a demo.",
  },
  {
    question: "Can I try AUREX?",
    answer: "AUREX is moving toward early customer testing. Use the Request a Demo form to tell us about your business and use case. A demo request does not provide a free trial, instant access, or an account.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return <section className={styles.section} id="faq" tabIndex={-1} aria-labelledby="faq-title"><div className={styles.container}>
    <header className={styles.intro}><p className={styles.eyebrow}>QUESTIONS</p><h2 id="faq-title">Before You Put AI<br /><span>In Front Of Your Customers.</span></h2><p className={styles.supporting}>Clear answers about how AUREX works, what your team controls, and what to expect.</p></header>
    <div className={styles.questions}>{faqs.map((faq, index) => {
      const expanded = open === index;
      return <div className={styles.item} key={faq.question}>
        <h3><button type="button" id={`faq-question-${index}`} aria-expanded={expanded} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(expanded ? null : index)}><span>{faq.question}</span><span className={styles.disclosure} data-open={expanded} aria-hidden="true" /></button></h3>
        <div className={styles.answer} data-open={expanded} id={`faq-answer-${index}`} aria-labelledby={`faq-question-${index}`} aria-hidden={!expanded} inert={!expanded}><div className={styles.answerInner}><p>{faq.answer}</p></div></div>
      </div>;
    })}</div>
  </div></section>;
}
