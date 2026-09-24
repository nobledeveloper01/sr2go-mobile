/**
 * One trip, opened from the dashboard.
 *
 * Reads its trip from the same sample source the list uses, by id, which is
 * the shape a real `GET /api/trips/:id` would take. Booking is deliberately
 * not wired to anything: there is no booking endpoint in this task, and a
 * button that pretends to work is worse than one that says what it needs.
 */
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowRight, BadgeCheck, Clock, MapPin, ShieldCheck, Star, Users } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';

import { upcomingTrips } from '../api/sample-data';
import { Button } from '../components/Button';
import { GradientBackground } from '../components/GradientBackground';
import type { HomeStackParams } from '../navigation/types';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import { colors, radii, shadow, spacing, typography } from '../theme';
import { departure, naira } from '../utils/format';

type Props = NativeStackScreenProps<HomeStackParams, 'TripDetail'>;

export function TripDetailScreen({ route, navigation }: Props) {
  useStatusBarStyle('light');

  const insets = useSafeAreaInsets();
  const trip = upcomingTrips.find((item) => item.id === route.params.tripId);

  if (trip === undefined) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>That trip is no longer available.</Text>
        <Button label="Go back" variant="secondary" onPress={navigation.goBack} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + spacing(10) }} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { paddingTop: insets.top + spacing(3) }]}>
          <GradientBackground variant="hero" />

          <Pressable onPress={navigation.goBack} hitSlop={12} style={styles.back} accessibilityRole="button" accessibilityLabel="Go back">
            <ArrowLeft size={22} color={colors.textOnDark} />
          </Pressable>

          <View style={styles.routeRow}>
            <Text style={styles.city}>{trip.from}</Text>
            <ArrowRight size={20} color="rgba(255,255,255,0.8)" />
            <Text style={styles.city}>{trip.to}</Text>
          </View>

          <Text style={styles.when}>{departure(trip.departsAt)}</Text>

          <View style={styles.fareBox}>
            <Text style={styles.fare}>{naira(trip.farePerSeat)}</Text>
            <Text style={styles.fareUnit}>per seat</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <Row icon={<Clock size={18} color={colors.brand} />} label="Departs" value={departure(trip.departsAt)} />
            <Row icon={<Users size={18} color={colors.brand} />} label="Seats left" value={`${trip.seatsLeft} of 4`} />
            <Row icon={<MapPin size={18} color={colors.brand} />} label="Reference" value={trip.id} last />
          </View>

          <Text style={styles.sectionTitle}>Your driver</Text>

          <View style={styles.driverCard}>
            <View style={styles.avatar}>
              <Text style={styles.initial}>{trip.driverName.charAt(0)}</Text>
            </View>

            <View style={styles.driverText}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{trip.driverName}</Text>
                {trip.verified && <BadgeCheck size={15} color={colors.brand} />}
              </View>
              <Text style={styles.vehicle}>{trip.vehicle}</Text>
            </View>

            <View style={styles.rating}>
              <Star size={14} color={colors.warning} fill={colors.warning} />
              <Text style={styles.ratingText}>{trip.driverRating.toFixed(1)}</Text>
            </View>
          </View>

          {trip.verified && (
            <View style={styles.assurance}>
              <ShieldCheck size={18} color={colors.success} />
              <Text style={styles.assuranceText}>
                This driver has completed identity and vehicle verification.
              </Text>
            </View>
          )}

          <View style={styles.cta}>
            <Button label={`Book a seat for ${naira(trip.farePerSeat)}`} onPress={() => undefined} disabled />
            <Text style={styles.ctaNote}>
              Booking needs the trips and payments endpoints, which were outside the scope of this task.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ icon, label, value, last = false }: { icon: React.ReactNode; label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      {icon}
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceSunken },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing(4), padding: spacing(6) },
  missingText: { ...typography.body, color: colors.textMuted },
  hero: {
    paddingHorizontal: spacing(6), paddingBottom: spacing(7), gap: spacing(3),
    borderBottomLeftRadius: radii.xl, borderBottomRightRadius: radii.xl, overflow: 'hidden',
  },
  back: { width: 40, height: 40, justifyContent: 'center' },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(3), marginTop: spacing(2) },
  city: { ...typography.display, fontSize: 28, color: colors.textOnDark },
  when: { ...typography.body, color: colors.textOnDarkMuted },
  fareBox: { marginTop: spacing(2) },
  fare: { ...typography.display, color: colors.textOnDark },
  fareUnit: { ...typography.caption, color: colors.textOnDarkMuted },
  body: { paddingHorizontal: spacing(6), paddingTop: spacing(6), gap: spacing(3) },
  card: { backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    padding: spacing(4), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { ...typography.body, color: colors.textMuted, flex: 1 },
  rowValue: { ...typography.label, color: colors.text },
  sectionTitle: { ...typography.heading, color: colors.text, marginTop: spacing(4) },
  driverCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3), padding: spacing(4),
    backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  avatar: { width: 44, height: 44, borderRadius: radii.pill, backgroundColor: colors.surfaceSunken, alignItems: 'center', justifyContent: 'center' },
  initial: { ...typography.heading, color: colors.brand },
  driverText: { flex: 1 },
  driverNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  driverName: { ...typography.heading, color: colors.text },
  vehicle: { ...typography.caption, color: colors.textMuted },
  rating: { flexDirection: 'row', alignItems: 'center', gap: spacing(1) },
  ratingText: { ...typography.label, color: colors.text },
  assurance: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3), padding: spacing(4),
    backgroundColor: '#E9F9F1', borderRadius: radii.md, borderWidth: 1, borderColor: '#B7E7CE',
  },
  assuranceText: { ...typography.caption, color: '#14663F', flex: 1 },
  cta: { marginTop: spacing(5), gap: spacing(3) },
  ctaNote: { ...typography.caption, color: colors.textMuted, textAlign: 'center', lineHeight: 17 },
});
