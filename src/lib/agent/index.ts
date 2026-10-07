/**
 * Day 1 agent entry point.
 *
 * No real LLM provider is called from the client (and never will be -
 * the provider router is server-side, see Production architecture doc).
 * These functions produce clearly-labelled DEMO content so the UI can be
 * fully exercised. Day 2+ should swap the function bodies for calls to
 * `lib/api` -> Cloudflare Function -> provider router, keeping these
 * signatures stable so `routes/` never need to change.
 */
export * from './types';

export interface BusinessIdeaPlan {
  nameIdeas: string[];
  targetAudience: string;
  brandStory: string;
  startupChecklist: string[];
  pricingGuidance: string;
  launchPlan: string[];
  whatsappPromo: string;
  pitch: string;
  confidenceScore: number;
  isDemoContent: true;
}

export function generateBusinessIdeaPlan(idea: string): BusinessIdeaPlan {
  const trimmed = idea.trim() || 'your hustle';
  return {
    nameIdeas: ['HustleWave', 'NaijaBoost', 'StreetProfit Hub'],
    targetAudience: 'Students, young workers and mobile-first buyers.',
    brandStory: `Built to deliver value, affordability and convenience around ${trimmed}.`,
    startupChecklist: ['Source products', 'Create a WhatsApp catalog', 'Post daily', 'Track every sale'],
    pricingGuidance: 'Target a 35%-60% margin where the market allows it.',
    launchPlan: ['Week 1: Awareness', 'Week 2: First customers', 'Week 3: Referrals', 'Week 4: Repeat sales'],
    whatsappPromo: `🔥 Fresh deals on ${trimmed} available now. Fast delivery, trusted service.`,
    pitch: `I help customers get quality ${trimmed} at affordable prices.`,
    confidenceScore: 80,
    isDemoContent: true,
  };
}

export type MarketingContentType = 'status' | 'promo' | 'countdown' | 'followup' | 'broadcast';

export interface MarketingContent {
  short: string;
  long: string;
  isDemoContent: true;
}

export function generateMarketingContent(product: string, type: MarketingContentType): MarketingContent {
  const name = product.trim() || 'your product';
  const templates: Record<MarketingContentType, string> = {
    status: `🔥 ${name} available today. Order now.`,
    promo: `Special offer on ${name} this week only.`,
    countdown: `⏳ Sale on ${name} ends tonight - don't miss out.`,
    followup: `Hi, just checking if you're still interested in ${name}.`,
    broadcast: `Hello everyone, new stock of ${name} is available now.`,
  };
  const short = templates[type];
  return {
    short,
    long: `${short} Fast response, affordable pricing and trusted service.`,
    isDemoContent: true,
  };
}

const COACH_TIPS = [
  'Post customer proof today - a photo or voice note from a happy buyer builds trust fast.',
  'Bundle a slow-moving item with your best seller to clear stock without discounting it directly.',
  'Follow up with 3 old customers today - a short "still interested?" message often reopens a sale.',
  'If demand is strong, raise your price slightly on your next restock instead of running a sale.',
  'Restock your best-selling item first - don\u2019t let your top earner go out of stock.',
];

export interface CoachTip {
  tip: string;
  isDemoContent: true;
}

export function generateCoachTip(): CoachTip {
  const tip = COACH_TIPS[Math.floor(Math.random() * COACH_TIPS.length)];
  return { tip, isDemoContent: true };
}

/**
 * Lightweight, deterministic natural-language sale parser for the quick
 * "type a sentence" entry box. This is NOT an LLM call - it's a regex
 * heuristic so sales entry works fully offline in demo mode. Replace
 * with a server-side agent tool (with policy check + audit record) once
 * the AGENT RUNTIME exists, per non-negotiables #6-#7.
 */
export interface ParsedSale {
  customerName: string;
  itemDescription: string;
  totalNaira: number;
  paidNaira: number;
}

export function parseSaleText(text: string): ParsedSale {
  const totalMatch = text.match(/for\s+(\d+)/i);
  const paidMatch = text.match(/paid\s+(\d+)/i);
  const customerMatch = text.match(/to\s+([A-Za-z][A-Za-z\s]{0,30}?)(?:,|\s+for|\s+she|\s+he|$)/i);
  const itemMatch = text.match(/^sold\s+(.+?)\s+to\s+/i);

  return {
    customerName: customerMatch?.[1]?.trim() || 'Customer',
    itemDescription: itemMatch?.[1]?.trim() || 'Item',
    totalNaira: totalMatch ? Number(totalMatch[1]) : 0,
    paidNaira: paidMatch ? Number(paidMatch[1]) : 0,
  };
}
