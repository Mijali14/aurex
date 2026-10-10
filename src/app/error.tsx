"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="status-page"><p className="wordmark">AUREX</p><h1>Something went wrong.</h1><p>Please try again or return to the homepage.</p><div><button className="button button-primary" onClick={reset}>Try again</button><Link className="button button-ghost" href="/" prefetch={false} onClick={reset}>Return to homepage</Link></div></main>;
}
