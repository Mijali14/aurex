import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/site-url";
import styles from "./privacy.module.css";

const title = "Privacy Policy | AUREX";
const description = "Learn how AUREX handles information submitted through its website and demo request process.";
const privacyUrl = siteUrl ? new URL("/privacy", siteUrl).href : undefined;

export const metadata: Metadata = {
  title, description,
  alternates: privacyUrl ? { canonical: privacyUrl } : undefined,
  openGraph: { title, description, type: "website", siteName: "AUREX", url: privacyUrl },
  twitter: { card: "summary", title, description },
};

export default function PrivacyPage() {
  return <div className={styles.page}>
    <a className="skip-link" href="#privacy-content">Skip to privacy policy</a>
    <header className={styles.header}>
      <Link href="/" className="wordmark" aria-label="AUREX home">AUREX<span className="wordmark-point" aria-hidden="true" /></Link>
      <Link href="/" className={styles.back}>Back to AUREX <span aria-hidden="true">↗</span></Link>
    </header>
    <main id="privacy-content" className={styles.content} tabIndex={-1}>
      <div className={styles.intro}>
        <p className="eyebrow">YOUR INFORMATION</p>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: <time dateTime="2026-10-12">12 October 2026</time></p>
        <p>This policy explains how AUREX handles information provided through our website and demo request process.</p>
      </div>
      <section aria-labelledby="about"><h2 id="about">About AUREX</h2>
        <p>AUREX is an AI Sales Agent for your website. AUREX operates this website and receives enquiries and demo requests from businesses interested in our services. This policy covers that website and enquiry process.</p>
      </section>
      <section aria-labelledby="information"><h2 id="information">Information we collect</h2>
        <p>When you request a demo or contact us, you may provide:</p>
        <ul><li>Your name and work email address.</li><li>Your company name.</li><li>Your company website, if you choose to provide it.</li><li>Your message, enquiry details or information about your business needs.</li></ul>
        <p>We also process basic technical and security information reasonably needed to operate and protect the website. This includes submission times, notification status and protected identifiers derived from submissions to help detect duplicates and limit abuse. Our infrastructure providers may process request metadata and security logs as part of their services.</p>
      </section>
      <section aria-labelledby="uses"><h2 id="uses">How we use information</h2>
        <p>We use information to:</p>
        <ul><li>Respond to demo requests and enquiries.</li><li>Understand your business needs and arrange demonstrations or pilot discussions.</li><li>Provide relevant follow-up communication about your enquiry and AUREX.</li><li>Protect the website against spam, fraud and abuse.</li><li>Maintain the reliability and security of the service.</li><li>Meet applicable legal obligations.</li></ul>
      </section>
      <section aria-labelledby="providers"><h2 id="providers">Service providers</h2>
        <p>We use infrastructure and service providers needed to operate the website and process enquiries:</p>
        <ul><li><strong>Vercel</strong> — website hosting and application infrastructure.</li><li><strong>Supabase</strong> — database and data storage.</li><li><strong>Resend</strong> — email delivery and notifications.</li></ul>
        <p>These providers may process information as needed to provide their respective services, subject to their own terms and privacy practices. For example, demo-request details are stored in our database and may be included in an internal email notification so we can respond.</p>
      </section>
      <section aria-labelledby="retention"><h2 id="retention">Data retention</h2>
        <p>We retain demo-request information only for as long as reasonably necessary to respond to your enquiry, manage legitimate follow-up, maintain security and abuse-prevention records, and meet applicable legal or operational requirements.</p>
        <p>Information may be deleted or anonymized when it is no longer reasonably required. The appropriate retention period depends on the purpose of the information and any ongoing requirements.</p>
      </section>
      <section aria-labelledby="international"><h2 id="international">International processing</h2>
        <p>AUREX uses global cloud infrastructure. Our technology providers may process or store information in countries other than your own. Information is not necessarily stored or processed only in Malaysia.</p>
      </section>
      <section aria-labelledby="security"><h2 id="security">Data security</h2>
        <p>We use reasonable technical and organizational safeguards to protect information, including restricted access to demo-request storage and measures to limit abusive submissions. No method of transmission or storage can guarantee absolute security.</p>
      </section>
      <section aria-labelledby="choices"><h2 id="choices">Privacy choices and requests</h2>
        <p>You can contact us to request access to information you previously provided, ask for corrections, request deletion where appropriate, or ask questions about how your information is handled. You can also ask us to stop follow-up communication.</p>
        <p>We will review requests in accordance with applicable requirements. We may need to confirm your identity before acting on a request to protect your information.</p>
        <p>Send your request to <a href="mailto:mifzaljr14@gmail.com">mifzaljr14@gmail.com</a>.</p>
      </section>
      <section aria-labelledby="children"><h2 id="children">Children</h2>
        <p>Our website and AUREX business services are intended for businesses and professionals and are not designed for children. If you believe a child has provided personal information through the website, please contact us.</p>
      </section>
      <section aria-labelledby="changes"><h2 id="changes">Changes to this policy</h2>
        <p>We may update this policy as our services or practices change. The “Last updated” date will reflect significant revisions. Please review this page for the current policy.</p>
      </section>
      <section aria-labelledby="contact"><h2 id="contact">Contact</h2>
        <p>Privacy enquiries:<br /><a href="mailto:mifzaljr14@gmail.com">mifzaljr14@gmail.com</a></p>
      </section>
    </main>
    <footer className={styles.footer}><span>© {new Date().getFullYear()} AUREX</span><Link href="/">Back to AUREX</Link></footer>
  </div>;
}
