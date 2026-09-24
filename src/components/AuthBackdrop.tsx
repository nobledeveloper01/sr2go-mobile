/**
 * The backdrop behind the auth screens.
 *
 * The first version was a flat gradient, which was clean but anonymous. This
 * adds depth with three soft shapes: a wide glow behind the heading, a ring
 * that breaks the edge, and a low warm blue lift at the bottom. They are
 * blurred circles rather than images, so they cost nothing to ship and scale
 * to any screen.
 *
 * Everything is drawn from the same three brand colours the gradients use, so
 * it reads as depth rather than decoration.
 */
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { GradientBackground } from './GradientBackground';
import { colors } from '../theme';

export function AuthBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <GradientBackground variant="deep" />

      {/* Behind the heading, lifting the top third away from the flat navy. */}
      <LinearGradient
        colors={[colors.brandBright, 'transparent']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.glow}
      />

      {/* An outlined circle running off the right edge. Breaking the frame
          stops the composition feeling like a centred template. */}
      <View style={styles.ring} />
      <View style={styles.ringInner} />

      {/* A quiet lift at the foot, so the bottom of the screen is not the
          darkest part of it. */}
      <LinearGradient
        colors={['transparent', 'rgba(13,107,255,0.28)']}
        style={styles.floor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute', top: -180, left: -120,
    width: 420, height: 420, borderRadius: 210, opacity: 0.22,
  },
  ring: {
    position: 'absolute', top: 120, right: -150,
    width: 300, height: 300, borderRadius: 150,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  ringInner: {
    position: 'absolute', top: 190, right: -80,
    width: 170, height: 170, borderRadius: 85,
    borderWidth: 1, borderColor: 'rgba(79,168,255,0.22)',
  },
  floor: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 320 },
});
