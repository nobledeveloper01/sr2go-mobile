/** One trip in the feed. Used by the dashboard and reusable anywhere a trip is listed. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, BadgeCheck, Clock, Star, Users } from 'lucide-react-native';

import type { Trip } from '../api/sample-data';
import { colors, radii, shadow, spacing, typography } from '../theme';
import { departure, naira } from '../utils/format';

export function TripCard({ trip, onPress }: { trip: Trip; onPress?: () => void }) {
  const almostFull = trip.seatsLeft <= 1;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${trip.from} to ${trip.to}, ${naira(trip.farePerSeat)} per seat`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.route}>
        <Text style={styles.city}>{trip.from}</Text>
        <ArrowRight size={16} color={colors.brand} />
        <Text style={styles.city}>{trip.to}</Text>

        <View style={styles.fareWrap}>
          <Text style={styles.fare}>{naira(trip.farePerSeat)}</Text>
          <Text style={styles.fareUnit}>per seat</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Clock size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{departure(trip.departsAt)}</Text>
        </View>

        <View style={styles.metaItem}>
          <Users size={14} color={almostFull ? colors.warning : colors.textMuted} />
          <Text style={[styles.metaText, almostFull && styles.metaWarn]}>
            {trip.seatsLeft} {trip.seatsLeft === 1 ? 'seat' : 'seats'} left
          </Text>
        </View>
      </View>

      <View style={styles.driver}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>{trip.driverName.charAt(0)}</Text>
        </View>

        <View style={styles.driverText}>
          <View style={styles.driverNameRow}>
            <Text style={styles.driverName}>{trip.driverName}</Text>
            {trip.verified && <BadgeCheck size={14} color={colors.brand} />}
          </View>
          <Text style={styles.vehicle}>{trip.vehicle}</Text>
        </View>

        <View style={styles.rating}>
          <Star size={13} color={colors.warning} fill={colors.warning} />
          <Text style={styles.ratingText}>{trip.driverRating.toFixed(1)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing(4),
    gap: spacing(3), borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  pressed: { opacity: 0.9 },
  route: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },
  city: { ...typography.heading, color: colors.text },
  fareWrap: { marginLeft: 'auto', alignItems: 'flex-end' },
  fare: { ...typography.heading, color: colors.brand },
  fareUnit: { ...typography.caption, color: colors.textMuted },
  meta: { flexDirection: 'row', gap: spacing(5) },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  metaText: { ...typography.caption, color: colors.textMuted },
  metaWarn: { color: colors.warning, fontWeight: '700' },
  driver: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing(3),
  },
  avatar: {
    width: 36, height: 36, borderRadius: radii.pill,
    backgroundColor: colors.surfaceSunken, alignItems: 'center', justifyContent: 'center',
  },
  initial: { ...typography.label, color: colors.brand },
  driverText: { flex: 1 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  driverName: { ...typography.label, color: colors.text },
  vehicle: { ...typography.caption, color: colors.textMuted },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing(1) },
  ratingText: { ...typography.caption, color: colors.text, fontWeight: '700' },
});
