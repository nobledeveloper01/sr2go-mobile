/**
 * A popular route, for the horizontal rail on the dashboard.
 *
 * Sized to a fixed width so the rail can snap, and narrow enough that the next
 * card always peeks past the edge. That peek is the point: a row of cards that
 * ends flush looks like the list ends there, while a deliberate sliver tells
 * you to keep scrolling without needing an arrow to say so.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from 'lucide-react-native';

import { colors, radii, spacing, typography } from '../theme';
import { naira } from '../utils/format';

/** Exported so the rail's snap interval and the card cannot disagree. */
export const ROUTE_CARD_WIDTH = 168;
export const ROUTE_CARD_GAP = 12;

interface Props {
  from: string;
  to: string;
  fromPrice: number;
  /** Shifts the accent along the rail so the row is not four identical cards. */
  tone: number;
  onPress?: () => void;
}

const TONES = [
  ['#0D6BFF', '#0A46A8'],
  ['#1E90FF', '#0B47B0'],
  ['#4FA8FF', '#0D6BFF'],
  ['#0099F9', '#063C8F'],
] as const;

export function RouteCard({ from, to, fromPrice, tone, onPress }: Props) {
  const colours = TONES[tone % TONES.length];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${from} to ${to}, from ${naira(fromPrice)}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient colors={[...colours]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

      {/* A circle bleeding off the corner, so each card has some geometry in
          it rather than being a flat rectangle of colour. */}
      <View style={styles.blob} />

      <View style={styles.top}>
        <Text style={styles.city}>{from}</Text>
        <ArrowRight size={13} color="rgba(255,255,255,0.75)" />
        <Text style={styles.city}>{to}</Text>
      </View>

      <View>
        <Text style={styles.priceLabel}>from</Text>
        <Text style={styles.price}>{naira(fromPrice)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: ROUTE_CARD_WIDTH, height: 104, borderRadius: radii.lg,
    padding: spacing(4), justifyContent: 'space-between', overflow: 'hidden',
  },
  pressed: { opacity: 0.9 },
  blob: {
    position: 'absolute', top: -34, right: -26, width: 96, height: 96,
    borderRadius: 48, backgroundColor: 'rgba(255,255,255,0.12)',
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  city: { ...typography.label, color: colors.textOnDark },
  priceLabel: { ...typography.caption, color: 'rgba(255,255,255,0.72)' },
  price: { ...typography.heading, color: colors.textOnDark },
});
