/**
 * Forgot password.
 *
 * The API has no reset endpoint. I checked: `/api/auth/forgot-password` and
 * the other likely paths all return 404. So this screen collects and validates
 * the email, then shows the confirmation state a real reset would show, and
 * says plainly that the mail is not actually sent.
 *
 * It is here because a sign in screen with no way out of a forgotten password
 * is a dead end, and because the screen, the validation and the confirmation
 * are the parts that stay the same once the endpoint exists. Wiring it up
 * later is one function call.
 */
import { useCallback, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthBackdrop } from '../components/AuthBackdrop';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { useEntrance } from '../hooks/useEntrance';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import type { AuthStackParams } from '../navigation/types';
import { colors, radii, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<AuthStackParams, 'ForgotPassword'>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ForgotPasswordScreen({ navigation }: Props) {
  useStatusBarStyle('dark');

  const { at } = useEntrance();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = useCallback(() => {
    const value = email.trim();

    if (value.length === 0) {
      setError('Enter your email address.');
      return;
    }

    if (!EMAIL.test(value)) {
      setError('That does not look like an email address.');
      return;
    }

    setError(undefined);
    setBusy(true);

    // Stands in for the request. The delay is here so the button's busy state
    // is visible, which is the behaviour being demonstrated.
    setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 900);
  }, [email]);

  if (sent) {
    return (
      <View style={styles.root}>
        <AuthBackdrop />

        <Screen>
          <Animated.View style={[styles.done, at(0, 0.6)]}>
            <View style={styles.badge}>
              <MailCheck size={30} color={colors.brandInk} />
            </View>

            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.body}>
              If an account exists for {email.trim()}, a reset link is on its way. The link expires in
              30 minutes.
            </Text>

            <View style={styles.note}>
              <Text style={styles.noteText}>
                Nothing has actually been sent. The API has no password reset endpoint yet, so this
                screen shows the flow rather than pretending to run it.
              </Text>
            </View>

            <View style={styles.doneActions}>
              <Button label="Back to sign in" onPress={() => navigation.navigate('SignIn')} />
            </View>
          </Animated.View>
        </Screen>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AuthBackdrop />

      <Screen scroll>
        <Animated.View style={at(0, 0.35)}>
          <Pressable
            onPress={navigation.goBack}
            hitSlop={12}
            style={styles.back}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.intro, at(0.1, 0.55)]}>
          <Text style={styles.title}>Forgot your password?</Text>
          <Text style={styles.body}>
            Enter the email on your account and we will send you a link to set a new one.
          </Text>
        </Animated.View>

        <Animated.View style={at(0.25, 0.75)}>
          <Input
            label="Email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(undefined);
            }}
            error={error}
            icon={<Mail size={18} color={colors.textMuted} />}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="go"
            onSubmitEditing={submit}
          />
        </Animated.View>

        <Animated.View style={at(0.4, 0.9)}>
          <Button label={busy ? 'Sending' : 'Send reset link'} onPress={submit} busy={busy} />
        </Animated.View>

        <Animated.View style={[styles.footer, at(0.55, 1)]}>
          <Text style={styles.footerText}>Remembered it?</Text>
          <Pressable onPress={navigation.goBack} hitSlop={8}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </Animated.View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 40, height: 40, justifyContent: 'center', marginBottom: spacing(4) },
  intro: { gap: spacing(2), marginBottom: spacing(7) },
  title: { ...typography.display, color: colors.text },
  body: { ...typography.body, color: colors.textMuted, lineHeight: 22 },
  done: { flex: 1, justifyContent: 'center', gap: spacing(3) },
  badge: {
    width: 68, height: 68, borderRadius: radii.xl, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E8F1FE', marginBottom: spacing(3),
  },
  note: {
    marginTop: spacing(4), padding: spacing(4), borderRadius: radii.md,
    backgroundColor: colors.surfaceSunken, borderWidth: 1, borderColor: colors.border,
  },
  noteText: { ...typography.caption, color: colors.textMuted, lineHeight: 18 },
  doneActions: { marginTop: spacing(8) },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing(2), marginTop: 'auto', paddingTop: spacing(10) },
  footerText: { ...typography.body, color: colors.textMuted },
  footerLink: { ...typography.body, color: colors.brandInk, fontWeight: '700' },
});
