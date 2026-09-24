/**
 * The decoration inside the dashboard header.
 *
 * A flat gradient behind a greeting is fine but forgettable. This adds three
 * things: two large circles bleeding off the corners for depth, and a dotted
 * route line running across the header, which is the product's own idea drawn
 * rather than described.
 *
 * All of it sits behind the content and none of it sits under text that has to
 * be read, so nothing here affects contrast.
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { GradientBackground } from './GradientBackground';

export function HeroBackdrop() {
  const drift = useRef(new Animated.Value(0)).current;
  const travel = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 7000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 7000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );

    // A dot making its way along the route line, slowly. The motif is the
    // whole point of the app: someone going the same way as you.
    const ride = Animated.loop(
      Animated.timing(travel, { toValue: 1, duration: 5200, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
    );

    float.start();
    ride.start();

    return () => {
      float.stop();
      ride.stop();
    };
  }, [drift, travel]);

  const shift = (x: number, y: number) => ({
    transform: [
      { translateX: drift.interpolate({ inputRange: [0, 1], outputRange: [0, x] }) },
      { translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, y] }) },
    ],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <GradientBackground variant="hero" />

      <Animated.View style={[styles.orbTop, shift(-14, 10)]} />
      <Animated.View style={[styles.orbBottom, shift(16, -12)]} />

      {/* The route: a start dot, a dotted path, an end dot, and a marker
          travelling between them. */}
      <View style={styles.route}>
        <View style={styles.stop} />
        <View style={styles.path}>
          {Array.from({ length: 16 }).map((_, index) => (
            <View key={index} style={styles.tick} />
          ))}
          <Animated.View
            style={[
              styles.marker,
              {
                opacity: travel.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, 1, 1, 0] }),
                transform: [
                  { translateX: travel.interpolate({ inputRange: [0, 1], outputRange: [0, 150] }) },
                ],
              },
            ]}
          />
        </View>
        <View style={[styles.stop, styles.stopEnd]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orbTop: {
    position: 'absolute', top: -120, right: -70,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  orbBottom: {
    position: 'absolute', bottom: -150, left: -90,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  route: {
    // Sits below the header row so it never runs behind the bell.
    position: 'absolute', top: 132, right: 18,
    flexDirection: 'row', alignItems: 'center', gap: 6, opacity: 0.5,
  },
  stop: {
    width: 7, height: 7, borderRadius: 3.5,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.85)',
  },
  stopEnd: { backgroundColor: 'rgba(255,255,255,0.85)' },
  path: { flexDirection: 'row', alignItems: 'center', gap: 5, width: 160 },
  tick: { width: 5, height: 1.5, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.55)' },
  marker: {
    position: 'absolute', left: 0,
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFFFFF',
  },
});
