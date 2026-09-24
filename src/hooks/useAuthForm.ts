/**
 * The bit sign in and sign up would otherwise both write.
 *
 * Holds values, per field errors, the busy flag and the one line of server
 * error, and knows to clear a field's error as soon as the user edits it.
 * Both screens then only describe their own fields.
 */
import { useCallback, useState } from 'react';

import { ApiError } from '../api/client';
import type { Errors } from '../utils/validation';
import { hasErrors } from '../utils/validation';

export function useAuthForm<T extends Record<string, string>>(
  initial: T,
  validate: (values: T) => Errors<T>,
  submit: (values: T) => Promise<void>,
) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const setField = useCallback((key: keyof T, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear as they type. Leaving a stale error under a field the user has
    // already corrected is the most irritating thing a form can do.
    setErrors((current) => ({ ...current, [key]: undefined }));
    setFormError(null);
  }, []);

  const onSubmit = useCallback(async () => {
    const found = validate(values);
    setErrors(found);

    if (hasErrors(found)) return;

    setBusy(true);
    setFormError(null);

    try {
      await submit(values);
    } catch (error) {
      if (error instanceof ApiError) {
        // The server can reject individual fields. Put those back on the
        // fields rather than in one generic line at the top.
        if (error.fieldErrors !== undefined) setErrors(error.fieldErrors as Errors<T>);
        else setFormError(error.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }, [submit, validate, values]);

  return { values, errors, formError, busy, setField, onSubmit };
}
