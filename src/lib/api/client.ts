/**
 * Server API boundary.
 *
 * The browser NEVER talks directly to Paystack, the LLM provider, or
 * Supabase with a service-role key - everything goes through Cloudflare
 * Pages/Functions (non-negotiables #3, #5, #7, #8). This client is the
 * single chokepoint the rest of the app uses to reach that layer.
 *
 * Day 1: no Cloudflare Functions exist yet, so every call resolves via
 * `demoFallback` and is clearly marked as such. Day 2+ wires real
 * endpoints in; call sites do not need to change.
 */

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Low-level fetch wrapper. In demo mode (no backend deployed yet) this
 * throws a typed `ApiError` with status 501 so callers can fall back to
 * local/demo data explicitly rather than silently pretending a network
 * call succeeded.
 */
export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  if (DEMO_MODE) {
    throw new ApiError(`Demo mode: no backend wired up yet for ${path}`, 501);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new ApiError(text || 'Request failed', response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * Wraps a real API call with a demo fallback. Used throughout the app so
 * every screen degrades gracefully to clearly-labelled demo data until
 * the matching Cloudflare Function ships.
 */
export async function withDemoFallback<T>(call: () => Promise<T>, demoValue: T): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (error instanceof ApiError && error.status === 501) {
      return demoValue;
    }
    throw error;
  }
}

export function isDemoMode(): boolean {
  return DEMO_MODE;
}
