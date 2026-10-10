import { MarketingHero } from "@/components/marketing-hero";
import { OpportunityFlow } from "@/components/opportunity-flow";
import { ProblemRecognition } from "@/components/problem-recognition";
import { CoreCapabilities } from "@/components/core-capabilities";
import { TrustControl } from "@/components/trust-control";
import { PropertyScenario } from "@/components/property-scenario";
import { SetupJourney } from "@/components/setup-journey";
import { FaqSection } from "@/components/faq-section";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  alternates: siteUrl ? { canonical: siteUrl.href } : undefined,
};

export default function Home() {
  return <MarketingHero><OpportunityFlow /><ProblemRecognition /><CoreCapabilities /><TrustControl /><PropertyScenario /><SetupJourney /><FaqSection /></MarketingHero>;
}
