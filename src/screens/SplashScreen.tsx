/**
 * What the user looks at while the stored session is checked.
 *
 * It is a real screen rather than a static image because the check is a
 * network call, and this API can take several seconds cold. The sequence is
 * deliberately unhurried: mark, then wordmark, then tagline, then a progress
 * line that keeps moving for as long as the wait lasts. A splash that snaps
 * through in 300ms reads as a flicker; this one reads as the product opening.
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Car } from 'lucide-react-native';

import { GradientBackground } from '../components/GradientBackground';
import { colors, radii, spacing, typography } from '../theme';

/** Held for at least this long, so a fast restore still feels composed. */
export const MINIMUM_SPLASH_MS = 2200;

export function SplashScreen() {
  // One driver for the entrance, so the pieces cannot drift out of step.
  const entrance = useRef(new Animated.Value(0)).current;
  const halo = useRef(new Animated.Value(0)).current;
  const sweep = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const intro = Animated.timing(entrance, {
      toValue: 1,
      duration: 1600,
      easing: Easing.bezier(0.16, 1, 0.3, 1), // a long, soft settle
      useNativeDriver: true,
    });

    // A slow breath behind the mark. Continues for as long as the wait does,
    // so the screen never looks frozen no matter how long the API takes.
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(halo, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(halo, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );

    const progress = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
    );

    intro.start();
    breathe.start();
    progress.start();

    return () => {
      intro.stop();
      breathe.stop();
      progress.stop();
    };
  }, [entrance, halo, sweep]);

  /** Each element fades and lifts in, staggered across the entrance. */
  const stagger = (from: number, to: number) => ({
    opacity: entrance.interpolate({ inputRange: [from, to], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [from, to],
          outputRange: [14, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  });

  const markScale = entrance.interpolate({ inputRange: [0, 0.45], outputRange: [0.82, 1], extrapolate: 'clamp' });

  return (
    <View style={styles.root}>
      <GradientBackground variant="deep" />

      <View style={styles.centre}>
        <View style={styles.markWrap}>
          <Animated.View
            style={[
              styles.halo,
              {
                opacity: halo.interpolate({ inputRange: [0, 1], outputRange: [0.14, 0.32] }),
                transform: [{ scale: halo.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] }) }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.mark,
              stagger(0, 0.45),
              { transform: [{ scale: markScale }] },
            ]}
          >
            <Car size={34} color={colors.textOnDark} strokeWidth={2.2} />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.word, stagger(0.3, 0.7)]}>SR2Go</Animated.Text>
        <Animated.Text style={[styles.tag, stagger(0.5, 0.9)]}>Share the Ride. Reach Together.</Animated.Text>
      </View>

      <Animated.View style={[styles.footer, stagger(0.7, 1)]}>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.bar,
              {
                transform: [
                  {
                    translateX: sweep.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-90, 140],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        <Text style={styles.status}>Getting things ready</Text>
      </Animated.View>
    </View>
  );
}

const MARK = 88;

const styles = StyleSheet.create({
  root: { flex: 1 },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(4) },
  markWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing(4) },
  halo: {
    position: 'absolute', width: MARK + 56, height: MARK + 56,
    borderRadius: (MARK + 56) / 2, backgroundColor: colors.brandBright,
  },
  mark: {
    width: MARK, height: MARK, borderRadius: radii.xl,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.26)',
  },
  word: { ...typography.display, fontSize: 36, color: colors.textOnDark, letterSpacing: -0.6 },
  tag: { ...typography.body, color: colors.textOnDarkMuted, letterSpacing: 0.2 },
  footer: { alignItems: 'center', gap: spacing(4), paddingBottom: spacing(20) },
  track: {
    width: 120, height: 3, borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.14)', overflow: 'hidden',
  },
  bar: { width: 70, height: 3, borderRadius: radii.pill, backgroundColor: colors.brandBright },
  status: { ...typography.caption, color: colors.textOnDarkMuted, letterSpacing: 0.6 },
});
