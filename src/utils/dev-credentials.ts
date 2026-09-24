/**
 * Prefilled sign in details, for development only.
 *
 * Read this before adding anything here.
 *
 * `EXPO_PUBLIC_*` variables are not runtime configuration. Metro substitutes
 * them into the JavaScript at build time, so whatever they hold ends up as a
 * plain string inside the shipped bundle. `strings` on the binary will print
 * it. Keeping the value in a gitignored `.env` protects the repository and
 * does nothing at all for the app.
 *
 * I checked rather than assumed: with the test account in `.env`, both the
 * email and the password were readable in the exported bundle.
 *
 * So the prefill is gated on `__DEV__`. In any release build this returns
 * empty strings and the fields start blank, whatever `.env` happens to hold on
 * the machine that ran the build.
 *
 * Nothing secret should ever go in an `EXPO_PUBLIC_` variable. Anything the
 * app must keep secret belongs on the server.
 */
export const devCredentials = (): { email: string; password: string } => {
  if (!__DEV__) return { email: '', password: '' };

  return {
    email: process.env.EXPO_PUBLIC_DEMO_EMAIL ?? '',
    password: process.env.EXPO_PUBLIC_DEMO_PASSWORD ?? '',
  };
};
