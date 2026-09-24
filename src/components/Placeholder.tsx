/**
 * The honest version of a screen that is not in scope.
 *
 * A tab bar with four tabs and three dead ones looks broken. This says what
 * the screen is for and why it is empty, which reads as deliberate rather
 * than unfinished.
 */
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from './Screen';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import { colors, radii, spacing, typography } from '../theme';

export function Placeholder({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  useStatusBarStyle('dark');

  return (
    <View style={styles.root}>
      <Screen>
        <View style={styles.centre}>
          <View style={styles.badge}>{icon}</View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceSunken },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(3), paddingHorizontal: spacing(6) },
  badge: {
    width: 72, height: 72, borderRadius: radii.xl, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: spacing(2),
  },
  title: { ...typography.title, color: colors.text, textAlign: 'center' },
  body: { ...typography.body, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
