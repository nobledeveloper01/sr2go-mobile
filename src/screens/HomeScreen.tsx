/**
 * The dashboard the user lands on after signing in.
 *
 * The trip content is placeholder, since the brief covered authentication and
 * the trip endpoints were not in scope. The name, role and verification state
 * in the header are real, read from `GET /api/auth/me`, so the screen proves
 * the token works rather than only that navigation happened.
 */
import { useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, BadgeCheck, Bell, Leaf, Plus, Search, ShieldAlert, Wallet } from 'lucide-react-native';

import { popularRoutes, upcomingTrips, walletSummary } from '../api/sample-data';
import { HeroBackdrop } from '../components/HeroBackdrop';
import { ROUTE_CARD_GAP, ROUTE_CARD_WIDTH, RouteCard } from '../components/RouteCard';
import { TripCard } from '../components/TripCard';
import { useAuth } from '../context/AuthContext';
import type { HomeStackParams } from '../navigation/types';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import { colors, radii, shadow, spacing, typography } from '../theme';
import { naira } from '../utils/format';

const greeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export function HomeScreen() {
  useStatusBarStyle('light');

  const { profile, session } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParams>>();

  const openTrip = useCallback(
    (tripId: string) => navigation.navigate('TripDetail', { tripId }),
    [navigation],
  );

  // Falls back to the name the login response carried, so the header is never
  // blank even if the profile call failed.
  const name = profile?.full_name ?? session?.full_name ?? 'there';
  const firstName = useMemo(() => name.split(' ')[0], [name]);

  return (
    <View style={styles.root}>
      <FlatList
        data={upcomingTrips}
        keyExtractor={(trip) => trip.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing(24) }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={[styles.hero, { paddingTop: insets.top + spacing(4) }]}>
              <HeroBackdrop />

              <View style={styles.heroTop}>
                <View style={styles.identity}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase()}</Text>
                    {profile?.nin_verified === true && (
                      <View style={styles.avatarBadge}>
                        <BadgeCheck size={13} color="#FFFFFF" />
                      </View>
                    )}
                  </View>

                  <View style={styles.identityText}>
                    <Text style={styles.greeting}>{greeting()}</Text>
                    <Text style={styles.name} numberOfLines={1}>{firstName}</Text>
                  </View>
                </View>

                <Pressable style={styles.bell} accessibilityRole="button" accessibilityLabel="Notifications">
                  <Bell size={20} color={colors.textOnDark} />
                  <View style={styles.dot} />
                </Pressable>
              </View>

              <Pressable style={styles.search} accessibilityRole="search" accessibilityLabel="Search for a trip">
                <Search size={18} color={colors.textMuted} />
                <Text style={styles.searchText}>Where are you going?</Text>
              </Pressable>

              <View style={styles.stats}>
                {/* The balance is what people open a wallet to see, so it gets
                    the width and the weight. The other two are context. */}
                <View style={[styles.stat, styles.statLead]}>
                  <View style={styles.statTop}>
                    <Wallet size={15} color={colors.textOnDark} />
                    <Text style={styles.statLabel}>Wallet</Text>
                  </View>

                  <Text style={styles.statLead1}>{naira(walletSummary.balance)}</Text>

                  {/* Fills the height with something useful rather than air,
                      and is the action people actually come to a wallet for. */}
                  <Pressable
                    style={styles.topUp}
                    // The visual pill is 30pt so the card stays compact, but
                    // the tappable area is extended to clear 44pt.
                    hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                    accessibilityRole="button"
                    accessibilityLabel="Top up your wallet"
                  >
                    <Plus size={14} color={colors.textOnDark} />
                    <Text style={styles.topUpText}>Top up</Text>
                  </Pressable>
                </View>

                <View style={styles.statPair}>
                  <View style={styles.stat}>
                    <View style={styles.statTop}>
                      <ArrowRight size={13} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.statLabel}>Trips</Text>
                    </View>
                    <Text style={styles.statValue}>{walletSummary.tripsTaken}</Text>
                  </View>

                  <View style={styles.stat}>
                    <View style={styles.statTop}>
                      <Leaf size={13} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.statLabel}>CO2 saved</Text>
                    </View>
                    <Text style={styles.statValue}>{walletSummary.co2SavedKg}kg</Text>
                  </View>
                </View>
              </View>
            </View>

            {profile?.phone_verified === false && (
              <View style={styles.notice}>
                <ShieldAlert size={18} color={colors.warning} />
                <Text style={styles.noticeText}>Verify your phone number to start booking rides.</Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Popular routes</Text>
            <FlatList
              horizontal
              data={popularRoutes}
              keyExtractor={(route) => route.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routes}
              // Snapping to one card width means a flick always lands on a
              // card edge rather than halfway through one.
              snapToInterval={ROUTE_CARD_WIDTH + ROUTE_CARD_GAP}
              decelerationRate="fast"
              renderItem={({ item, index }) => (
                <RouteCard from={item.from} to={item.to} fromPrice={item.fromPrice} tone={index} />
              )}
            />

            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Trips leaving soon</Text>
              <Text style={styles.sectionAction}>See all</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <TripCard trip={item} onPress={() => openTrip(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceSunken },
  list: { paddingBottom: spacing(10) },
  hero: {
    paddingHorizontal: spacing(6), paddingBottom: spacing(6), gap: spacing(4),
    borderBottomLeftRadius: radii.xl, borderBottomRightRadius: radii.xl, overflow: 'hidden',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing(3), flex: 1 },
  avatar: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitial: { ...typography.title, color: colors.textOnDark },
  avatarBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.success, borderWidth: 2, borderColor: '#1360B8',
  },
  identityText: { flex: 1 },
  greeting: { ...typography.caption, color: colors.textOnDarkMuted },
  name: { ...typography.display, fontSize: 27, color: colors.textOnDark },
  bell: {
    width: 44, height: 44, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
  },
  dot: { position: 'absolute', top: 11, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    backgroundColor: colors.surface, borderRadius: radii.md, paddingHorizontal: spacing(4), minHeight: 52,
  },
  searchText: { ...typography.body, color: colors.textMuted },
  stats: { flexDirection: 'row', gap: spacing(3) },
  stat: {
    flex: 1, justifyContent: 'center', gap: spacing(1.5), paddingHorizontal: spacing(3.5),
    paddingVertical: spacing(2.5), minHeight: 62,
    borderRadius: radii.md, backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  // The lead card matches the stacked pair beside it exactly, so the row has
  // one height rather than one card stretching to fill a gap.
  statLead: { flex: 1.15, justifyContent: 'space-between', gap: spacing(2), paddingVertical: spacing(3) },
  statPair: { flex: 1, gap: spacing(2) },
  topUp: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing(1.5),
    minHeight: 30, borderRadius: radii.sm, backgroundColor: 'rgba(255,255,255,0.18)',
  },
  topUpText: { ...typography.caption, color: colors.textOnDark, fontWeight: '700' },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5) },
  statLead1: { ...typography.title, fontSize: 21, color: colors.textOnDark },
  statValue: { ...typography.heading, fontSize: 18, color: colors.textOnDark },
  statLabel: { ...typography.caption, color: colors.textOnDarkMuted },
  notice: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    marginHorizontal: spacing(6), marginTop: spacing(5), padding: spacing(4),
    backgroundColor: '#FFF7E8', borderRadius: radii.md, borderWidth: 1, borderColor: '#F7D9A0',
  },
  noticeText: { ...typography.caption, color: '#7A5A12', flex: 1 },
  sectionTitle: { ...typography.heading, color: colors.text, marginTop: spacing(7), marginHorizontal: spacing(6) },
  sectionRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingRight: spacing(6) },
  sectionAction: { ...typography.caption, color: colors.brand, fontWeight: '700', marginTop: spacing(7) },
  routes: { paddingHorizontal: spacing(6), gap: ROUTE_CARD_GAP, paddingTop: spacing(4) },
  cardWrap: { paddingHorizontal: spacing(6), paddingTop: spacing(4) },
});
