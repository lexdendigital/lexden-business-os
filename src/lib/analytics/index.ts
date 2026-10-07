/**
 * Analytics / audit-log boundary.
 *
 * Every tracked event is typed against `EventName` (see types/domain.ts),
 * which maps 1:1 onto the `events` table in the Core data model. Day 1
 * has no backend, so events are appended to an in-memory buffer and
 * mirrored to console in development. Day 2+ should POST these through
 * `lib/api` to a Cloudflare Function that writes to Supabase `events`,
 * keeping this call site unchanged.
 */
import type { DomainEvent, EventName } from '@/types/domain';

const buffer: DomainEvent[] = [];

export function trackEvent(name: EventName, properties?: Record<string, unknown>, businessId?: string): void {
  const event: DomainEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    businessId,
    name,
    properties,
    createdAt: new Date().toISOString(),
  };

  buffer.push(event);

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event.name, event.properties ?? {});
  }
}

/** Exposed for Settings > diagnostics and for tests. Not persisted. */
export function getBufferedEvents(): ReadonlyArray<DomainEvent> {
  return buffer;
}

export function clearBufferedEvents(): void {
  buffer.length = 0;
}
