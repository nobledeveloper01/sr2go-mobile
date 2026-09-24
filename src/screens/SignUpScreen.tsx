import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowLeft, Lock, Mail, Phone, User } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { LegalLink } from '../components/LegalLink';
import { AuthBackdrop } from '../components/AuthBackdrop';
import { Input } from '../components/Input';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { useAuthForm } from '../hooks/useAuthForm';
import type { AuthStackParams } from '../navigation/types';
import { colors, radii, spacing, typography } from '../theme';
import { LEGAL_LABELS, LEGAL_URLS } from '../utils/legal';
import { validateSignUp } from '../utils/validation';

type Props = NativeStackScreenProps<AuthStackParams, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();

  /**
   * Both stores expect the user to agree before an account is created, and
   * the agreement has to be an explicit action rather than a pre-ticked box
   * or a line of small print under the button.
   */
  const [accepted, setAccepted] = useState(false);

  const submit = useCallback(
    async (values: { full_name: string; email: string; phone: string; password: string }) => {
      await signUp(values);
    },
    [signUp],
  );

  const form = useAuthForm(
    { full_name: '', email: '', phone: '', password: '' },
    validateSignUp,
    submit,
  );

  return (
    <View style={styles.root}>
      <AuthBackdrop />

      <Screen scroll>
        <Pressable onPress={navigation.goBack} hitSlop={12} style={styles.back} accessibilityRole="button" accessibilityLabel="Go back">
          <ArrowLeft size={22} color={colors.textOnDark} />
        </Pressable>

        <View style={styles.intro}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join verified riders travelling between cities.</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full name"
            value={form.values.full_name}
            onChangeText={(text) => form.setField('full_name', text)}
            error={form.errors.full_name}
            icon={<User size={18} color={colors.textOnDarkMuted} />}
            placeholder="Marvellous Bamisaye"
            autoCapitalize="words"
            autoComplete="name"
          />

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
          />

          <Input
            label="Phone number"
            value={form.values.phone}
            onChangeText={(text) => form.setField('phone', text)}
            error={form.errors.phone}
            icon={<Phone size={18} color={colors.textOnDarkMuted} />}
            placeholder="08031234567"
            keyboardType="phone-pad"
            autoComplete="tel"
          />

          <Input
            label="Password"
            value={form.values.password}
            onChangeText={(text) => form.setField('password', text)}
            error={form.errors.password}
            icon={<Lock size={18} color={colors.textOnDarkMuted} />}
            placeholder="At least 8 characters"
            secure
            autoComplete="new-password"
            returnKeyType="go"
            onSubmitEditing={form.onSubmit}
          />

          {form.formError !== null && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>{form.formError}</Text>
            </View>
          )}

          <View style={styles.consent}>
            <Checkbox
              checked={accepted}
              onChange={setAccepted}
              accessibilityLabel="Accept the terms of service and privacy policy"
            >
              <View style={styles.consentText}>
                <Text style={styles.consentLead}>I agree to the </Text>
                <LegalLink url={LEGAL_URLS.terms} label={LEGAL_LABELS.terms} />
                <Text style={styles.consentLead}> and </Text>
                <LegalLink url={LEGAL_URLS.privacy} label={LEGAL_LABELS.privacy} />
                <Text style={styles.consentLead}>.</Text>
              </View>
            </Checkbox>
          </View>

          <Button
            label={form.busy ? 'Creating account' : 'Create account'}
            onPress={form.onSubmit}
            busy={form.busy}
            // Disabled rather than hidden, so the reason is visible: the box
            // above it is plainly the thing standing in the way.
            disabled={!accepted}
          />

          {form.busy && <Text style={styles.waiting}>This can take a few seconds</Text>}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={navigation.goBack} hitSlop={8}>
            <Text style={styles.footerLink}>Sign in</Text>
          </Pressable>
        </View>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  back: { width: 40, height: 40, justifyContent: 'center', marginBottom: spacing(4) },
  intro: { gap: spacing(2), marginBottom: spacing(6) },
  title: { ...typography.display, color: colors.textOnDark },
  subtitle: { ...typography.body, color: colors.textOnDarkMuted },
  form: { gap: spacing(1) },
  consent: { marginTop: spacing(2), marginBottom: spacing(3) },
  consentText: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  consentLead: { ...typography.caption, color: colors.textOnDarkMuted, lineHeight: 19 },
  banner: {
    backgroundColor: 'rgba(229,72,77,0.16)', borderWidth: 1, borderColor: 'rgba(229,72,77,0.4)',
    borderRadius: radii.md, padding: spacing(3.5), marginBottom: spacing(2),
  },
  bannerText: { ...typography.body, color: '#FFB4B4' },
  waiting: { ...typography.caption, color: colors.textOnDarkMuted, textAlign: 'center', marginTop: spacing(3) },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: spacing(2), marginTop: 'auto', paddingTop: spacing(8) },
  footerText: { ...typography.body, color: colors.textOnDarkMuted },
  footerLink: { ...typography.body, color: colors.brandBright, fontWeight: '700' },
});
