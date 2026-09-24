/** The SR2Go mark, drawn rather than shipped as an image so it stays crisp. */
import { StyleSheet, Text, View } from 'react-native';
import { Car } from 'lucide-react-native';

import { colors, radii, spacing, typography } from '../theme';

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={[styles.badge, compact && styles.badgeCompact]}>
        <Car size={compact ? 18 : 24} color={colors.textOnDark} strokeWidth={2.4} />
      </View>
      <View>
        <Text style={[styles.word, compact && styles.wordCompact]}>SR2Go</Text>
        {!compact && <Text style={styles.tag}>Share the Ride. Reach Together.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  badge: {
    width: 48, height: 48, borderRadius: radii.lg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.24)',
  },
  badgeCompact: { width: 36, height: 36, borderRadius: radii.md },
  word: { ...typography.title, color: colors.textOnDark },
  wordCompact: { ...typography.heading, color: colors.textOnDark },
  tag: { ...typography.caption, color: colors.textOnDarkMuted, marginTop: 2 },
});
