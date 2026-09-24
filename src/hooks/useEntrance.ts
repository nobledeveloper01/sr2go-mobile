/**
 * A staggered fade and lift for the pieces of a screen.
 *
 * One driver shared by every element, so they cannot drift apart, and each
 * element picks its slice of the timeline. Used by the auth screens so the
 * form arrives in order rather than appearing all at once.
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function useEntrance(duration = 900) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const run = Animated.timing(progress, {
      toValue: 1,
      duration,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      useNativeDriver: true,
    });

    run.start();

    return () => run.stop();
  }, [duration, progress]);

  /** `at(0, 0.4)` fades in over the first 40% of the run. */
  const at = (from: number, to: number, lift = 12) => ({
    opacity: progress.interpolate({ inputRange: [from, to], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [from, to],
          outputRange: [lift, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  });

  return { at };
}
