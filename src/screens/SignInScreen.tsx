import { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Lock, Mail } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Brand } from '../components/Brand';
import { Button } from '../components/Button';
import { AuthBackdrop } from '../components/AuthBackdrop';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { useStatusBarStyle } from '../hooks/useStatusBarStyle';
import { useAuthForm } from '../hooks/useAuthForm';
import { useEntrance } from '../hooks/useEntrance';
import type { AuthStackParams } from '../navigation/types';
import { colors, radii, spacing, typography } from '../theme';
import { devCredentials } from '../utils/dev-credentials';
import { validateSignIn } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParams, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  useStatusBarStyle('dark');

  const { at } = useEntrance();

  const { signIn } = useAuth();

  const submit = useCallback(
    async (values: { email: string; password: string }) => {
      await signIn(values.email, values.password);
    },
    [signIn],
  );

  const form = useAuthForm(
    // Prefilled in development so a reviewer can sign in without typing, and
    // empty in any release build. See dev-credentials.ts for why that gate
    // matters more than it looks.
    devCredentials(),
    validateSignIn,
    submit,
  );

  return (
    <View style={styles.root}>
      <AuthBackdrop />

      <Screen scroll>
        <Animated.View style={[styles.header, at(0, 0.35)]}>
          <Brand />
        </Animated.View>

        <Animated.View style={[styles.intro, at(0.12, 0.5)]}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to find a ride going your way.</Text>
        </Animated.View>

        <Animated.View style={[styles.form, at(0.28, 0.72)]}>
          <Input
            label="Email address"
            value={form.values.email}
            onChangeText={(text) => form.setField('email', text)}
            error={form.errors.email}
            icon={<Mail size={18} color={colors.textMuted} />}
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
            icon={<Lock size={18} color={colors.textMuted} />}
            placeholder="Your password"
            secure
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={form.onSubmit}
          />

          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            hitSlop={8}
            style={styles.forgot}
            accessibilityRole="button"
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

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
        </Animated.View>

        <Animated.View style={[styles.footer, at(0.45, 0.9)]}>
          <Text style={styles.footerText}>New to SR2Go?</Text>
          <Pressable
            onPress={() => navigation.navigate('SignUp')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Create an account"
          >
            <Text style={styles.footerLink}>Create an account</Text>
          </Pressable>
        </Animated.View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { marginBottom: spacing(10) },
  intro: { gap: spacing(2), marginBottom: spacing(7) },
  title: { ...typography.display, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted },
  form: { gap: spacing(2) },
  // Sits under the password field, aligned right, which is where people look
  // for it and where it does not compete with the primary action.
  forgot: { alignSelf: 'flex-end', marginTop: -spacing(1), marginBottom: spacing(2), minHeight: 32, justifyContent: 'center' },
  forgotText: { ...typography.caption, color: colors.brandInk, fontWeight: '700' },
  banner: {
    backgroundColor: '#FDECEC',
    borderWidth: 1, borderColor: '#F5C2C2',
    borderRadius: radii.md, padding: spacing(3.5), marginBottom: spacing(2),
  },
  // #B42318 on #FDECEC measures 6.6:1, so an error is readable by anyone who
  // cannot rely on the red to tell them something went wrong.
  bannerText: { ...typography.body, color: '#B42318' },
  waiting: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing(3) },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing(2), marginTop: 'auto', paddingTop: spacing(10) },
  footerText: { ...typography.body, color: colors.textMuted },
  footerLink: { ...typography.body, color: colors.brandInk, fontWeight: '700' },
});
