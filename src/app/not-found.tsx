import Link from "next/link";

export default function NotFound() {
  return <main className="status-page"><p className="wordmark">AUREX</p><h1>Page not found.</h1><p>The page you’re looking for isn’t available.</p><Link className="button button-primary" href="/" prefetch={false}>Return to homepage</Link></main>;
}
