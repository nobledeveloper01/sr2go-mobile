/**
 * Development only logging.
 *
 * A release build should be quiet. Warnings left in production end up in crash
 * reports and analytics pipelines, and the objects passed alongside them are
 * not always as harmless as they look. Everything here compiles away when
 * `__DEV__` is false.
 */
export const warn = (message: string, detail?: unknown): void => {
  if (!__DEV__) return;

  console.warn(message, detail);
};
