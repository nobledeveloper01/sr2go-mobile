/**
 * Safe area, keyboard behaviour and scrolling, decided once.
 *
 * Without this every screen re-derives its own padding and half of them get
 * the notch or the keyboard wrong. `scroll` is opt in because a dashboard and
 * a login form want different things.
 */
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '../theme';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  /** Skip the top inset when a gradient is meant to run under the status bar. */
  edgeToEdge?: boolean;
}

export function Screen({ children, scroll = false, edgeToEdge = false }: Props) {
  const insets = useSafeAreaInsets();

  const padding = {
    paddingTop: edgeToEdge ? 0 : insets.top + spacing(2),
    paddingBottom: insets.bottom + spacing(4),
    paddingHorizontal: spacing(6),
  };

  const body = scroll ? (
    <ScrollView
      // flexGrow, never flex. `flex: 1` on a scroll view's content container
      // caps the content at the viewport height, so it can never overflow and
      // the view silently refuses to scroll. flexGrow lets short content still
      // fill the screen while long content extends past it.
      contentContainerStyle={[padding, styles.content]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[padding, styles.fill]}>{children}</View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.fill}
      // iOS moves the whole view; Android already resizes the window, and
      // doing both there pushes the form off the top of the screen.
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {body}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flexGrow: 1 },
});
