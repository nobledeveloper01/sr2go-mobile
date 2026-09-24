/** Opens a legal page in the system browser, with the failure handled. */
import { Alert, Linking, Pressable, StyleSheet, Text } from 'react-native';

import { colors, typography } from '../theme';

export function LegalLink({ url, label, onDark = true }: { url: string; label: string; onDark?: boolean }) {
  const open = async () => {
    try {
      await Linking.openURL(url);
    } catch {
      // A dead link should say so rather than doing nothing, which users read
      // as the app being broken.
      Alert.alert('Could not open link', `Please visit ${url} in your browser.`);
    }
  };

  return (
    <Pressable onPress={() => void open()} hitSlop={8} accessibilityRole="link" accessibilityLabel={label}>
      <Text style={[styles.link, !onDark && styles.linkOnLight]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: { ...typography.caption, color: colors.brandInk, fontWeight: '700' },
  linkOnLight: { color: colors.brandInk },
});
