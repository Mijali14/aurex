import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

const title = "AUREX — AI Sales Agent for Your Website";
const description = "AUREX helps businesses turn website conversations into sales opportunities by answering questions, understanding customer needs, and identifying buying intent.";
const images = siteUrl ? [{ url: new URL("/og.png", siteUrl).href, width: 1200, height: 630, alt: "AUREX — AI Sales Agent for your website. Conversation → Evidence → Opportunity." }] : [];

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  robots: { index: Boolean(siteUrl), follow: Boolean(siteUrl) },
  openGraph: { title, description, siteName: "AUREX", type: "website", locale: "en_US", url: siteUrl?.href, images },
  twitter: { card: "summary_large_image", title, description, images },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
