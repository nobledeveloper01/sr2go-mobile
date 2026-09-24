/**
 * A labelled text field with room for an error.
 *
 * The error slot is always rendered, even when empty, so a form does not jump
 * a line taller the moment validation fails. That shift is small and it is the
 * difference between a form feeling solid and feeling flimsy.
 */
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { colors, radii, spacing, typography } from '../theme';

interface Props extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  /** Renders the show and hide control and starts obscured. */
  secure?: boolean;
  icon?: React.ReactNode;
}

export function Input({ label, error, secure = false, icon, ...rest }: Props) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.field, focused && styles.fieldFocused, error !== undefined && styles.fieldError]}>
        {icon !== undefined && <View style={styles.icon}>{icon}</View>}

        <TextInput
          {...rest}
          style={styles.input}
          secureTextEntry={hidden}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
        />

        {secure && (
          <Pressable
            onPress={() => setHidden((value) => !value)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
          >
            {hidden ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
          </Pressable>
        )}
      </View>

      <Text style={styles.error} numberOfLines={1}>
        {error ?? ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing(1.5) },
  label: { ...typography.label, color: colors.textMuted },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(2.5),
    minHeight: 52,
    paddingHorizontal: spacing(4),
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.field,
  },
  fieldFocused: { borderColor: colors.brandInk, backgroundColor: colors.surface },
  fieldError: { borderColor: colors.danger },
  icon: { opacity: 0.85 },
  input: { flex: 1, ...typography.body, color: colors.text },
  // Reserved height, so showing an error never moves the rest of the form.
  error: { ...typography.caption, color: colors.danger, minHeight: 16 },
});
