/**
 * Feature flag boundary for FREE / PRO gating.
 *
 * Non-negotiable #11: Pro features must be enforced server-side. This
 * client-side flag set controls UI affordances only (what to show/hide,
 * what to label "Pro") - it is NOT the source of truth for entitlement.
 * Any server action that is Pro-only MUST re-check entitlement in the
 * Cloudflare Function/Worker before executing, regardless of what the
 * client believes its tier is.
 *
 * Non-negotiable #12: Free and Pro both exist from day one; Pro can run
 * in "dev mode" (`devUnlockPro`) until live billing is wired up.
 */
import type { PlanTier } from '@/types/domain';

export interface FeatureFlags {
  planTier: PlanTier;
  /** True while billing isn't live yet - Pro screens are visible but
   * clearly labelled, and real server-side entitlement checks still
   * apply once a backend exists. */
  devUnlockPro: boolean;
}

export const PRO_FEATURES = [
  'ai_business_generator_unlimited',
  'whatsapp_broadcast_studio',
  'advanced_analytics',
  'multi_business_workspace',
] as const;

export type ProFeature = (typeof PRO_FEATURES)[number];

export function isProUnlocked(flags: FeatureFlags): boolean {
  return flags.planTier === 'PRO' || flags.devUnlockPro;
}

export function getDefaultFlags(): FeatureFlags {
  const demoMode = import.meta.env.VITE_DEMO_MODE !== 'false';
  return {
    planTier: 'FREE',
    // In demo mode we unlock Pro UI for evaluation purposes; this must
    // never be relied on as an actual entitlement check server-side.
    devUnlockPro: demoMode,
  };
}
