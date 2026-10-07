/**
 * LEXDEN FORGE domain types.
 *
 * These mirror the entities in the "Core data model" document
 * (profiles, organisations, businesses, products, services, customers,
 * sales, expenses, inventory_events, orders, payments, goals, experiments,
 * agent_policies, agent_runs, agent_actions, research_sources,
 * content_assets, campaigns, subscriptions, events).
 *
 * Day 1 scope only implements the MVP subset needed for the demo UI
 * (Business, Product, Customer, Sale). The rest are typed here as
 * forward-looking contracts so later days can slot in Supabase-backed
 * implementations without changing the shape the UI already depends on.
 *
 * IDs are `string` (uuid in Postgres). All money fields are stored as
 * integer kobo/naira units at the lowest denomination accepted by the
 * calculation layer - never computed or formatted by the LLM (see
 * lib/format/money.ts and non-negotiable #10).
 */

export type ID = string;
export type ISODateString = string;

export type PlanTier = 'FREE' | 'PRO';

export interface Profile {
  id: ID;
  fullName: string;
  email?: string;
  createdAt: ISODateString;
}

export interface Organisation {
  id: ID;
  name: string;
  ownerProfileId: ID;
  planTier: PlanTier;
  createdAt: ISODateString;
}

export type BusinessType =
  | 'Fashion'
  | 'Food'
  | 'Phone Accessories'
  | 'Digital Services'
  | 'Campus Sales'
  | 'Beauty'
  | 'Freelancing'
  | 'Other';

export type BusinessGoal =
  | 'Make More Sales'
  | 'Start a Business'
  | 'Track Money Better'
  | 'Grow Online';

export interface Business {
  id: ID;
  organisationId: ID;
  name: string;
  type: BusinessType;
  goal: BusinessGoal;
  currency: 'NGN';
  createdAt: ISODateString;
}

export interface Product {
  id: ID;
  businessId: ID;
  name: string;
  qty: number;
  costPriceKobo: number;
  sellPriceKobo: number;
  lowStockThreshold: number;
  createdAt: ISODateString;
}

export interface ServiceOffering {
  id: ID;
  businessId: ID;
  name: string;
  priceKobo: number;
  createdAt: ISODateString;
}

export interface Customer {
  id: ID;
  businessId: ID;
  name: string;
  phone?: string;
  totalOwedKobo: number;
  createdAt: ISODateString;
}

export interface Sale {
  id: ID;
  businessId: ID;
  customerId?: ID;
  customerName: string;
  itemDescription: string;
  totalKobo: number;
  paidKobo: number;
  balanceKobo: number;
  createdAt: ISODateString;
}

export interface Expense {
  id: ID;
  businessId: ID;
  label: string;
  amountKobo: number;
  createdAt: ISODateString;
}

export type InventoryEventType = 'restock' | 'sale_deduction' | 'adjustment';

export interface InventoryEvent {
  id: ID;
  businessId: ID;
  productId: ID;
  type: InventoryEventType;
  qtyDelta: number;
  createdAt: ISODateString;
}

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled';

export interface Order {
  id: ID;
  businessId: ID;
  customerId?: ID;
  status: OrderStatus;
  totalKobo: number;
  createdAt: ISODateString;
}

export type PaymentProvider = 'paystack' | 'manual';
export type PaymentStatus = 'pending' | 'verified' | 'failed';

export interface Payment {
  id: ID;
  businessId: ID;
  orderId?: ID;
  provider: PaymentProvider;
  status: PaymentStatus;
  amountKobo: number;
  reference?: string;
  createdAt: ISODateString;
}

export interface Goal {
  id: ID;
  businessId: ID;
  label: string;
  targetKobo?: number;
  dueDate?: ISODateString;
  createdAt: ISODateString;
}

export interface Experiment {
  id: ID;
  businessId: ID;
  hypothesis: string;
  status: 'proposed' | 'running' | 'concluded';
  createdAt: ISODateString;
}

/** See lib/agent/types.ts for the full agent runtime contract. */
export interface AgentPolicy {
  id: ID;
  businessId: ID;
  toolName: string;
  requiresApproval: boolean;
}

export interface AgentRun {
  id: ID;
  businessId: ID;
  goal: string;
  status: 'observing' | 'diagnosing' | 'researching' | 'planning' | 'executing' | 'verifying' | 'done' | 'blocked';
  createdAt: ISODateString;
}

export interface AgentAction {
  id: ID;
  agentRunId: ID;
  toolName: string;
  input: unknown;
  output: unknown;
  policyApproved: boolean;
  createdAt: ISODateString;
}

export interface ResearchSource {
  id: ID;
  businessId: ID;
  url: string;
  title?: string;
  fetchedAt: ISODateString;
}

export interface ContentAsset {
  id: ID;
  businessId: ID;
  kind: 'whatsapp_status' | 'promo' | 'countdown' | 'followup' | 'broadcast' | 'other';
  text: string;
  createdAt: ISODateString;
}

export interface Campaign {
  id: ID;
  businessId: ID;
  name: string;
  channel: 'whatsapp' | 'email' | 'social';
  createdAt: ISODateString;
}

export interface Subscription {
  id: ID;
  organisationId: ID;
  planTier: PlanTier;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'dev_mode';
  currentPeriodEnd?: ISODateString;
}

export type EventName =
  | 'onboarding_completed'
  | 'business_created'
  | 'sale_recorded'
  | 'product_added'
  | 'marketing_generated'
  | 'ai_idea_generated'
  | 'coach_tip_viewed';

export interface DomainEvent {
  id: ID;
  businessId?: ID;
  name: EventName;
  properties?: Record<string, unknown>;
  createdAt: ISODateString;
}
