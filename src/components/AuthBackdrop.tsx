/**
 * The backdrop behind the auth screens.
 *
 * Light rather than dark, for a measured reason. On the earlier navy version
 * the placeholder text inside the fields measured 2.28:1 against its
 * background, well under the 4.5:1 WCAG AA asks for. On white the same grey
 * measures 4.54:1 and passes. Form fields are the one place a user has to read
 * small, low emphasis text, so the form decides the background.
 *
 * The brand colour is still here, as shapes behind the content rather than
 * underneath the text. Colour that fills a shape has no contrast requirement;
 * colour behind a word does.
 *
 * The shapes drift slowly and continuously. The movement is small enough to
 * read as depth rather than decoration, and it is the only thing on the screen
 * that moves once the form has settled.
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../theme';

export function AuthBackdrop() {
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 9000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );

    loop.start();

    return () => loop.stop();
  }, [drift]);

  /** Each shape moves a slightly different distance, so they never look welded together. */
  const float = (x: number, y: number, scale = 1) => ({
    transform: [
      { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
      { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, y] }) },
      { scale: drift.interpolate({ inputRange: [0, 1], outputRange: [1, scale] }) },
    ],
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.base]} pointerEvents="none">
      <Animated.View style={[styles.washWrap, float(14, 10, 1.05)]}>
        <LinearGradient
          colors={['rgba(79,168,255,0.26)', 'rgba(79,168,255,0)']}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.ring, float(-18, 12, 1.04)]} />
      <Animated.View style={[styles.ringInner, float(12, -14, 0.96)]} />
      <Animated.View style={[styles.corner, float(-10, 8, 1.08)]} />

      {/* A small solid dot low on the left, to stop the bottom half of the
          screen being completely empty once the keyboard is down. */}
      <Animated.View style={[styles.dot, float(8, -12, 1.1)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.surface },
  washWrap: { position: 'absolute', top: -140, left: -90, width: 460, height: 420, borderRadius: 230, overflow: 'hidden' },
  ring: {
    position: 'absolute', top: 96, right: -160,
    width: 300, height: 300, borderRadius: 150,
    borderWidth: 1.5, borderColor: 'rgba(11,95,208,0.16)',
  },
  ringInner: {
    position: 'absolute', top: 168, right: -92,
    width: 170, height: 170, borderRadius: 85,
    borderWidth: 1.5, borderColor: 'rgba(0,153,249,0.22)',
  },
  corner: {
    position: 'absolute', top: -70, right: -70,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(0,153,249,0.14)',
  },
  dot: {
    position: 'absolute', bottom: 120, left: -46,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(11,95,208,0.07)',
  },
});
