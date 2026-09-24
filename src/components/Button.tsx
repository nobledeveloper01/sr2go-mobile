/**
 * One button for the whole app.
 *
 * It owns the busy state on purpose: a caller that has to remember to disable
 * its own button while a request is in flight will eventually forget, and on
 * an API where login takes nine seconds that means duplicate submissions.
 */
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, gradients, radii, spacing, typography } from '../theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  busy?: boolean;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', busy = false, disabled = false }: Props) {
  const inactive = busy || disabled;

  const content = (
    <View style={styles.content}>
      {busy ? (
        <ActivityIndicator color={variant === 'primary' ? colors.textOnDark : colors.brand} />
      ) : (
        <Text style={[styles.label, variant !== 'primary' && styles.labelDark]}>{label}</Text>
      )}
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy }}
      // 48pt tall, comfortably over the 44pt minimum touch target, and the
      // press feedback is a slight dim rather than a scale so it stays legible
      // for anyone with reduce motion turned on.
      style={({ pressed }) => [styles.base, inactive && styles.inactive, pressed && styles.pressed]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[...gradients.bright]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.fill, variant === 'secondary' ? styles.secondary : styles.ghost]}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.md, overflow: 'hidden' },
  fill: { minHeight: 52, justifyContent: 'center' },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing(2) },
  label: { ...typography.heading, color: colors.textOnDark },
  labelDark: { color: colors.brand },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  inactive: { opacity: 0.55 },
  pressed: { opacity: 0.85 },
});
