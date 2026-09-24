/**
 * A checkbox with a tappable label.
 *
 * The whole row is the target, not just the 20pt square, because a 20pt hit
 * area fails the 44pt minimum and is genuinely hard to hit one handed.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';

import { colors, radii, spacing } from '../theme';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  children: ReactNode;
  accessibilityLabel: string;
}

export function Checkbox({ checked, onChange, children, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      style={styles.row}
      hitSlop={6}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked && <Check size={14} color={colors.textOnDark} strokeWidth={3} />}
      </View>
      <View style={styles.label}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing(3), minHeight: 44, paddingVertical: spacing(2) },
  box: {
    width: 22, height: 22, borderRadius: radii.sm, marginTop: 1,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.38)',
  },
  boxChecked: { backgroundColor: colors.brandDeep, borderColor: colors.brandDeep },
  label: { flex: 1 },
});
