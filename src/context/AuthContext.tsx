/**
 * Who is signed in, and the three things you can do about it.
 *
 * The navigator reads `status` and decides which stack to show, so no screen
 * ever calls navigate() after signing in or out. The tree changes because the
 * state changed, which is the difference between a flow that survives a back
 * button and one that does not.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import * as api from '../api/endpoints';
import { MINIMUM_SPLASH_MS } from '../screens/SplashScreen';
import type { AuthSession, Profile } from '../api/endpoints';
import { clearSession, loadSession, saveSession } from '../api/session-storage';

type Status = 'restoring' | 'signedIn' | 'signedOut';

interface AuthValue {
  status: Status;
  session: AuthSession | null;
  profile: Profile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (body: api.RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('restoring');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  /**
   * Runs once on launch. A stored token is not proof of a live session, so it
   * is checked against the server before the user is let in. If that check
   * fails the stored token is thrown away rather than kept around to fail
   * again on the next screen.
   */
  useEffect(() => {
    let cancelled = false;

    // Held so the splash always plays through rather than flashing past on a
    // fast restore. A branded opening that appears for 200ms reads as a
    // glitch; the wait costs nothing because it overlaps the network call.
    const openedAt = Date.now();

    const settle = async (next: Status) => {
      const elapsed = Date.now() - openedAt;
      if (elapsed < MINIMUM_SPLASH_MS) {
        await new Promise((resolve) => setTimeout(resolve, MINIMUM_SPLASH_MS - elapsed));
      }
      if (!cancelled) setStatus(next);
    };

    const restore = async () => {
      // One try around the whole thing. Anything that throws during launch
      // has to end with a decision, because a status left on 'restoring' is a
      // splash screen the user can never get past.
      try {
        const stored = await loadSession();

        if (stored === null) {
          await settle('signedOut');
          return;
        }

        const current = await api.me(stored.access_token);
        if (cancelled) return;

        setSession(stored);
        setProfile(current);
        await settle('signedIn');
      } catch (error) {
        console.warn('[auth] session restore failed', error);
        await clearSession();
        await settle('signedOut');
      }
    };

    void restore();

    return () => {
      cancelled = true;
    };
  }, []);

  /** Shared by signIn and signUp, because both end the same way. */
  const establish = useCallback(async (next: AuthSession) => {
    await saveSession(next);
    setSession(next);
    setStatus('signedIn');

    // The profile is a nicety, not a gate. If it fails the user is still
    // signed in, and the dashboard falls back to the name the token carried.
    try {
      setProfile(await api.me(next.access_token));
    } catch {
      setProfile(null);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await establish(await api.login({ email: email.trim().toLowerCase(), password }));
    },
    [establish],
  );

  const signUp = useCallback(
    async (body: api.RegisterRequest) => {
      await establish(
        await api.register({ ...body, email: body.email.trim().toLowerCase() }),
      );
    },
    [establish],
  );

  const signOut = useCallback(async () => {
    // The API has no logout route, so signing out is local: drop the token and
    // the session it proves. Nothing is left on the device to restore from.
    await clearSession();
    setSession(null);
    setProfile(null);
    setStatus('signedOut');
  }, []);

  const value = useMemo<AuthValue>(
    () => ({ status, session, profile, signIn, signUp, signOut }),
    [status, session, profile, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);

  if (value === null) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return value;
}
