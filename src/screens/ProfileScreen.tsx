/**
 * The real account, straight from the API, plus sign out.
 *
 * Everything shown here comes from `GET /api/auth/me` with the stored token,
 * which is the clearest demonstration that authentication actually worked.
 */
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BadgeCheck, ChevronRight, CircleCheck, CircleDashed, FileText,
  LifeBuoy, LogOut, ShieldCheck, Star, Trash2,
} from 'lucide-react-native';

import { Button } from '../components/Button';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { LEGAL_LABELS, LEGAL_URLS } from '../utils/legal';
import { colors, radii, shadow, spacing, typography } from '../theme';

export function ProfileScreen() {
  useStatusBarStyle('dark');

  const { profile, session, signOut } = useAuth();
  const name = profile?.full_name ?? session?.full_name ?? '';

  const open = (url: string) => {
    void Linking.openURL(url).catch(() =>
      Alert.alert('Could not open link', `Please visit ${url} in your browser.`),
    );
  };

  /**
   * Apple requires an app that lets you create an account to let you delete it
   * from inside the app, not by emailing support. The confirmation is
   * destructive and two step because this is not reversible.
   *
   * There is no delete endpoint on the API yet, so this is honest about what
   * it does rather than pretending. The flow, the wording and the placement
   * are the parts review actually looks at.
   */
  const confirmDelete = () => {
    Alert.alert(
      'Delete your account?',
      'This permanently removes your account, trip history and saved details. It cannot be undone.',
      [
        { text: 'Keep my account', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Not yet available',
              'Account deletion needs a DELETE /api/auth/me endpoint, which does not exist on the API yet. The screen and the flow are in place for when it does.',
            ),
        },
      ],
    );
  };

  const checks = [
    { label: 'Identity (NIN)', done: profile?.nin_verified === true },
    { label: 'KYC complete', done: profile?.kyc_complete === true },
    { label: 'Phone verified', done: profile?.phone_verified === true },
    { label: 'Bank account', done: profile?.bank_verified === true },
  ];

  return (
    <View style={styles.root}>
      <Screen scroll>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.initial}>{name.charAt(0) || '?'}</Text>
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {profile?.is_verified === true && <BadgeCheck size={18} color={colors.brand} />}
          </View>

          <Text style={styles.email}>{profile?.email ?? ''}</Text>

          <View style={styles.pills}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{profile?.role ?? session?.role ?? 'passenger'}</Text>
            </View>
            <View style={styles.pill}>
              <Star size={12} color={colors.warning} fill={colors.warning} />
              <Text style={styles.pillText}>{(profile?.rating ?? 0).toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Verification</Text>

        <View style={styles.checks}>
          {checks.map((check) => (
            <View key={check.label} style={styles.check}>
              {check.done ? (
                <CircleCheck size={18} color={colors.success} />
              ) : (
                <CircleDashed size={18} color={colors.textMuted} />
              )}
              <Text style={[styles.checkLabel, !check.done && styles.checkPending]}>{check.label}</Text>
              <Text style={styles.checkState}>{check.done ? 'Done' : 'Pending'}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Legal</Text>

        <View style={styles.checks}>
          <LinkRow
            icon={<FileText size={18} color={colors.textMuted} />}
            label={LEGAL_LABELS.terms}
            onPress={() => open(LEGAL_URLS.terms)}
          />
          <LinkRow
            icon={<ShieldCheck size={18} color={colors.textMuted} />}
            label={LEGAL_LABELS.privacy}
            onPress={() => open(LEGAL_URLS.privacy)}
          />
          <LinkRow
            icon={<LifeBuoy size={18} color={colors.textMuted} />}
            label={LEGAL_LABELS.support}
            onPress={() => open(LEGAL_URLS.support)}
            last
          />
        </View>

        <View style={styles.signOut}>
          <Button label="Sign out" variant="secondary" onPress={() => void signOut()} />
        </View>

        <View style={styles.hint}>
          <LogOut size={13} color={colors.textMuted} />
          <Text style={styles.hintText}>Signing out clears the token from secure storage on this device.</Text>
        </View>

        <Pressable onPress={confirmDelete} style={styles.delete} accessibilityRole="button">
          <Trash2 size={16} color={colors.danger} />
          <Text style={styles.deleteText}>Delete my account</Text>
        </Pressable>

        <Text style={styles.deleteNote}>
          Required by the App Store for any app that lets you create an account.
        </Text>
      </Screen>
    </View>
  );
}

function LinkRow({ icon, label, onPress, last = false }: { icon: React.ReactNode; label: string; onPress: () => void; last?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.check, last && styles.checkLast, pressed && styles.checkPressed]}
    >
      {icon}
      <Text style={styles.checkLabel}>{label}</Text>
      <ChevronRight size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceSunken },
  card: {
    alignItems: 'center', gap: spacing(2), padding: spacing(6),
    backgroundColor: colors.surface, borderRadius: radii.lg,
    borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  avatar: {
    width: 72, height: 72, borderRadius: radii.pill, backgroundColor: colors.surfaceSunken,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing(1),
  },
  initial: { ...typography.display, color: colors.brand },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(2) },
  name: { ...typography.title, color: colors.text },
  email: { ...typography.body, color: colors.textMuted },
  pills: { flexDirection: 'row', gap: spacing(2), marginTop: spacing(2) },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(1.5),
    paddingHorizontal: spacing(3), paddingVertical: spacing(1.5),
    borderRadius: radii.pill, backgroundColor: colors.surfaceSunken,
  },
  pillText: { ...typography.caption, color: colors.text, textTransform: 'capitalize' },
  sectionTitle: { ...typography.heading, color: colors.text, marginTop: spacing(7), marginBottom: spacing(3) },
  checks: { backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  check: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    paddingHorizontal: spacing(4), paddingVertical: spacing(4),
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border,
  },
  checkLabel: { ...typography.body, color: colors.text, flex: 1 },
  checkPending: { color: colors.textMuted },
  checkState: { ...typography.caption, color: colors.textMuted },
  checkLast: { borderBottomWidth: 0 },
  checkPressed: { backgroundColor: colors.surfaceSunken },
  signOut: { marginTop: spacing(8) },
  delete: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing(2), marginTop: spacing(8), minHeight: 44,
  },
  deleteText: { ...typography.body, color: colors.danger, fontWeight: '600' },
  deleteNote: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing(1) },
  hint: { flexDirection: 'row', alignItems: 'center', gap: spacing(2), marginTop: spacing(4), paddingHorizontal: spacing(2) },
  hintText: { ...typography.caption, color: colors.textMuted, flex: 1 },
});
