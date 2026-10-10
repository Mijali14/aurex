// Reading time alternates with a deliberate extraction beat (12 seconds total).
export const PHASE_DELAYS = [1400, 2000, 1000, 1400, 2200, 1400, 2600] as const;
export const FINAL_PHASE = PHASE_DELAYS.length;

// Illustrative qualification criteria, not a claim about a production scoring model.
// Scores are the sum of observed evidence; contact details alone add no points.
export const evidence = [
  { step: 1, points: 24, label: "Clear business need", detail: "Customer enquiry automation" },
  { step: 3, points: 28, label: "High enquiry volume", detail: "Around 500 enquiries per month" },
  { step: 4, points: 24, label: "Active buying timeline", detail: "Implementation within two months" },
  { step: 6, points: 16, label: "Consultation requested", detail: "Explicit request to discuss the product" },
] as const;

export const messages = [
  { role: "visitor", step: 0, text: "We need a better way to handle customer enquiries for our sales team." },
  { role: "agent", step: 0, text: "How many enquiries do you receive each month?" },
  { role: "visitor", step: 2, text: "Around 500. We'd like a solution in place within two months." },
  { role: "agent", step: 4, text: "Would you like a product consultation? Just share your name and work email." },
  { role: "visitor", step: 5, text: "Yes, please. Alex Morgan at Northstar — alex@northstar.example." },
  { role: "agent", step: 7, text: "Thanks, Alex. I'll pass your requirements to the sales team." },
] as const;

export function leadScore(step: number) {
  return evidence.filter((item) => item.step <= step).reduce((total, item) => total + item.points, 0);
}
