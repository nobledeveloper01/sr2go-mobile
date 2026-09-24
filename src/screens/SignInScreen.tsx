import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock, Mail } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Brand } from '../components/Brand';
import { Button } from '../components/Button';
import { AuthBackdrop } from '../components/AuthBackdrop';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { useAuthForm } from '../hooks/useAuthForm';
import type { AuthStackParams } from '../navigation/types';
import { colors, radii, spacing, typography } from '../theme';
import { validateSignIn } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParams, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const { signIn } = useAuth();

  const submit = useCallback(
    async (values: { email: string; password: string }) => {
      await signIn(values.email, values.password);
    },
    [signIn],
  );

  const form = useAuthForm(
    {
      // Prefilled from the environment so a reviewer can sign in without
      // typing. Empty in any build that does not set them, and never committed.
      email: process.env.EXPO_PUBLIC_DEMO_EMAIL ?? '',
      password: process.env.EXPO_PUBLIC_DEMO_PASSWORD ?? '',
    },
    validateSignIn,
    submit,
  );

  return (
    <View style={styles.root}>
      <AuthBackdrop />

      <Screen scroll>
        <View style={styles.header}>
          <Brand />
        </View>

        <View style={styles.intro}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to find a ride going your way.</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email address"
            value={form.values.email}
            onChangeText={(text) => form.setField('email', text)}
            error={form.errors.email}
            icon={<Mail size={18} color={colors.textOnDarkMuted} />}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />

          <Input
            label="Password"
            value={form.values.password}
            onChangeText={(text) => form.setField('password', text)}
            error={form.errors.password}
            icon={<Lock size={18} color={colors.textOnDarkMuted} />}
            placeholder="Your password"
            secure
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={form.onSubmit}
          />

          {form.formError !== null && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{form.formError}</Text>
            </View>
          )}

          <Button
            label={form.busy ? 'Signing in' : 'Sign in'}
            onPress={form.onSubmit}
            busy={form.busy}
          />

          {/* The API can take several seconds cold. Saying so turns a wait that
              looks broken into one that looks expected. */}
          {form.busy && <Text style={styles.waiting}>This can take a few seconds</Text>}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to SR2Go?</Text>
          <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
            <Text style={styles.footerLink}>Create an account</Text>
          </Pressable>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { marginBottom: spacing(10) },
  intro: { gap: spacing(2), marginBottom: spacing(7) },
  title: { ...typography.display, color: colors.textOnDark },
  subtitle: { ...typography.body, color: colors.textOnDarkMuted },
  form: { gap: spacing(2) },
  banner: {
    backgroundColor: 'rgba(229,72,77,0.16)',
    borderWidth: 1, borderColor: 'rgba(229,72,77,0.4)',
    borderRadius: radii.md, padding: spacing(3.5), marginBottom: spacing(2),
  },
  bannerText: { ...typography.body, color: '#FFB4B4' },
  waiting: { ...typography.caption, color: colors.textOnDarkMuted, textAlign: 'center', marginTop: spacing(3) },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing(2), marginTop: 'auto', paddingTop: spacing(10) },
  footerText: { ...typography.body, color: colors.textOnDarkMuted },
  footerLink: { ...typography.body, color: colors.brandBright, fontWeight: '700' },
});
