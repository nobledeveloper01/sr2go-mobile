/**
 * The brand gradient, in one place.
 *
 * Every dark surface in the app uses this rather than its own copy of the
 * colour stops, which is what keeps the auth screens and the dashboard header
 * looking like the same product.
 */
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { gradients } from '../theme';

interface Props {
  children?: ReactNode;
  variant?: keyof typeof gradients;
  style?: StyleProp<ViewStyle>;
}

export function GradientBackground({ children, variant = 'hero', style }: Props) {
  return (
    <LinearGradient
      colors={[...gradients[variant]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFill, style]}
    >
      {children}
    </LinearGradient>
  );
}
