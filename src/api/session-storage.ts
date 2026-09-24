/**
 * Where the tokens live.
 *
 * expo-secure-store, not AsyncStorage. A JWT is a credential: on iOS this puts
 * it in the Keychain and on Android in EncryptedSharedPreferences, both backed
 * by the OS. AsyncStorage is an unencrypted file, readable on a rooted or
 * jailbroken device and by anything that can read the app sandbox.
 */
import * as SecureStore from 'expo-secure-store';

import { warn } from '../utils/log';

import type { AuthSession } from './endpoints';

const KEY = 'sr2go.session';

/**
 * Secure storage is not available everywhere.
 *
 * It throws outright on web, and a keychain read can fail on a device too. A
 * throw here happens during launch, so letting it escape leaves the app on the
 * splash screen forever with no way out. Every function below fails closed:
 * the worst case is the user signs in again, which is recoverable, unlike a
 * frozen splash.
 */
export const saveSession = async (session: AuthSession): Promise<void> => {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(session));
  } catch (error) {
    // The session still works for this run, it just will not survive a
    // restart. Better than refusing a sign in that already succeeded, but it
    // is a real fault, so it is not swallowed silently in development.
    warn('[session] could not save to secure storage', error);
  }
};

export const loadSession = async (): Promise<AuthSession | null> => {
  try {
    const raw = await SecureStore.getItemAsync(KEY);

    if (raw === null) return null;

    return JSON.parse(raw) as AuthSession;
  } catch (error) {
    // Unavailable, unreadable, or stored in an older shape. All of them mean
    // the same thing to the caller: there is no session to restore.
    warn('[session] could not read secure storage', error);
    await clearSession();
    return null;
  }
};

export const clearSession = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // Nothing to do. There is no state worth failing a sign out over.
  }
};
