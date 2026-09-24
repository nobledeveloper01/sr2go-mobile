/**
 * Client side checks, purely so the user is told sooner.
 *
 * The server validates everything again and its answer is the one that counts.
 * These exist to save a nine second round trip to learn an email is missing an
 * at sign, not to be trusted.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** 0803..., 0703..., or the +234 form. The shape Nigerian users actually type. */
const NIGERIAN_MOBILE = /^(?:\+234|0)[789][01]\d{8}$/;

export type Errors<T> = Partial<Record<keyof T, string>>;

export const validateSignIn = (values: { email: string; password: string }) => {
  const errors: Errors<typeof values> = {};

  if (values.email.trim().length === 0) errors.email = 'Enter your email address.';
  else if (!EMAIL.test(values.email.trim())) errors.email = 'That does not look like an email address.';

  if (values.password.length === 0) errors.password = 'Enter your password.';

  return errors;
};

export const validateSignUp = (values: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}) => {
  const errors: Errors<typeof values> = {};

  if (values.full_name.trim().length < 2) errors.full_name = 'Enter your full name.';

  if (values.email.trim().length === 0) errors.email = 'Enter your email address.';
  else if (!EMAIL.test(values.email.trim())) errors.email = 'That does not look like an email address.';

  if (values.phone.trim().length === 0) errors.phone = 'Enter your phone number.';
  else if (!NIGERIAN_MOBILE.test(values.phone.replace(/\s/g, '')))
    errors.phone = 'Use a Nigerian mobile number, like 08031234567.';

  // Eight is the server's floor. Saying so beats "password too short".
  if (values.password.length < 8) errors.password = 'Use at least 8 characters.';

  return errors;
};

export const hasErrors = (errors: Record<string, string | undefined>): boolean =>
  Object.values(errors).some((message) => message !== undefined);
