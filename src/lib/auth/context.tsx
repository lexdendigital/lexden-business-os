/**
 * Auth boundary.
 *
 * Non-negotiable #3: Supabase Postgres/Auth with strict tenant isolation
 * via RLS. This provider is the ONLY place in the app that is allowed to
 * know about Supabase auth. Screens consume `useAuth()`, never the
 * Supabase client directly.
 *
 * Day 1: `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set yet
 * (see .env.example), so this runs in "demo session" mode: a local,
 * unpersisted, clearly-labelled session object. The moment real env vars
 * are supplied, swap `createDemoSession` calls for actual
 * `@supabase/supabase-js` calls behind this same interface - no other
 * file needs to change.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Profile } from '@/types/domain';

export type AuthStatus = 'loading' | 'signed_out' | 'signed_in';

export interface AuthSession {
  status: AuthStatus;
  profile: Profile | null;
  isDemoSession: boolean;
}

export interface AuthContextValue extends AuthSession {
  signInDemo: (fullName: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    status: 'signed_out',
    profile: null,
    isDemoSession: !isSupabaseConfigured(),
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      ...session,
      signInDemo: (fullName: string) => {
        // TODO(Day 2): replace with supabase.auth.signInWithOtp / OAuth
        // once VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are configured.
        setSession({
          status: 'signed_in',
          profile: {
            id: 'demo-profile-local',
            fullName: fullName || 'Hustler',
            createdAt: new Date().toISOString(),
          },
          isDemoSession: true,
        });
      },
      signOut: () => {
        setSession({ status: 'signed_out', profile: null, isDemoSession: !isSupabaseConfigured() });
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
