/**
 * Sets the status bar style while this screen is the focused one.
 *
 * Rendering <StatusBar> per screen does not work under a tab navigator: every
 * tab stays mounted, so whichever one mounted last keeps winning and the bar
 * ends up dark over a dark header. Tying it to focus instead means the bar
 * always matches the screen you are actually looking at.
 */
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import type { StatusBarStyle } from 'expo-status-bar';

export function useStatusBarStyle(style: StatusBarStyle): void {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle(style);
    }, [style]),
  );
}
