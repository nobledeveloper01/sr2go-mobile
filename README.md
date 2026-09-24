# SR2Go Mobile

A React Native app for SR2Go, built for the technical task. It signs in against
the live API, keeps you signed in, and opens on a dashboard.

Built with Expo and TypeScript. Runs on iOS and Android from one codebase.

## What the task asked for

> Build a login screen in React Native that calls `POST /api/auth/login` with
> email and password, handles the JWT token response, and navigates to a basic
> home screen on success.

That is all working. I also built out the rest of the authentication flow,
because a login screen on its own cannot show session handling, and session
handling is the part that is actually easy to get wrong.

## What is here

- **Splash** that checks for a saved session while it plays
- **Sign in** against `POST /api/auth/login`
- **Sign up** against `POST /api/auth/register`, with terms acceptance
- **Forgot password**, as a working screen against an endpoint that does not exist yet
- **Dashboard** with your real name and verification status from the API
- **Trip detail**, opened by tapping a trip
- **Profile** showing your real account, with legal links, sign out and account deletion
- **Stay signed in** across restarts, with the token in secure storage

## The screens

All twelve captured from a release build on an iPhone 17 simulator, signed in
against the live API.

### Getting in

| Splash | Sign in | Sign up |
|---|---|---|
| ![Splash](docs/screenshots/01-splash.png) | ![Sign in](docs/screenshots/02-sign-in.png) | ![Sign up](docs/screenshots/03-sign-up.png) |
| Held for 2.2 seconds while the stored session is checked. The mark breathes and the bar keeps sweeping, so a slow API never looks like a frozen screen. | Note the empty fields. Development builds prefill the test account; release builds never do. | The button is disabled until the terms box is ticked, which is what both stores require. |

| Forgot password | Reset sent | Validation |
|---|---|---|
| ![Forgot password](docs/screenshots/04-forgot-password.png) | ![Reset sent](docs/screenshots/05-reset-sent.png) | ![Validation](docs/screenshots/09-validation.png) |
| A sign in screen with no way out of a forgotten password is a dead end, so the screen exists even though the endpoint does not. | The confirmation a real reset would show, and a note saying plainly that nothing was sent. | Errors appear under the field they belong to, and the space for them is always reserved so the form never jumps. |

### Signed in

| Dashboard | Trip detail |
|---|---|
| ![Dashboard](docs/screenshots/06-dashboard.png) | ![Trip detail](docs/screenshots/07-trip-detail.png) |
| The name, the verified tick and the amber prompt are all real, read from `GET /api/auth/me`. The trip content is sample data. Behind the header a dotted route line runs with a marker travelling along it. | Opens over the dashboard so the tab bar stays put. Booking is visibly disabled and says what it needs. |

| Profile | Account deletion | Trips | Wallet |
|---|---|---|---|
| ![Profile](docs/screenshots/11-profile.png) | ![Account deletion](docs/screenshots/12-account-deletion.png) | ![Trips](docs/screenshots/08-trips.png) | ![Wallet](docs/screenshots/10-wallet.png) |
| Everything here is live: name, email, role, rating, and all four verification flags. | Legal links and in app account deletion, both required by the stores. | Says what it is for rather than showing a blank screen. | Same. |

## Running it

You need Node 20 or newer, and Xcode or Android Studio.

```bash
npm install
cp .env.example .env     # then add the test credentials
npx expo run:ios         # or: npx expo run:android
```

The app points at `https://shareride2go.com` by default.

`.env` holds the test account so you do not have to type it on every launch. It
is gitignored and not in this repository. Credentials do not belong in source
control, even test ones.

## How the code is arranged

```
src/
  api/          the only place that talks HTTP, plus secure token storage
  components/   reusable pieces: Button, Input, Screen, cards, backdrop
  context/      who is signed in
  hooks/        shared form logic, status bar handling
  navigation/   which screens exist and how they connect
  screens/      one file per screen
  theme/        colours, spacing, gradients, type scale
  utils/        validation and formatting
```

A screen never calls `fetch`, never sees a status code, and never touches a
token. It calls a named function and gets back typed data or a clear error.

## Decisions worth explaining

### The colours are measured, not eyeballed

The auth screens started dark. They are light now because the placeholder text
inside the form fields measured **2.28:1** against the navy background, well
under the 4.5:1 that WCAG AA asks for. The same grey on white measures 4.54:1.

Two more failures turned up once I started measuring:

- The marketing blue `#0099F9` measures **3.03:1** on white, so it fails as
  text. There is now a separate `brandInk` (`#0B5FD0`, 5.90:1) for anything a
  person has to read. Use the bright blue to fill a shape, the ink to write.
- The primary button's gradient started at `#4FA8FF`, where a white label
  measures **2.51:1**. The gradient is darker now and the label passes across
  the whole sweep.

The brand colour did not go away, it moved. It is in the shapes behind the
content, where nothing has to be read on top of it and contrast does not apply.

### The token is in secure storage, not AsyncStorage

A JWT is a credential. `expo-secure-store` puts it in the iOS Keychain and in
EncryptedSharedPreferences on Android, both handled by the operating system.
AsyncStorage is a plain unencrypted file that anything with access to the app
sandbox can read.

### The network timeout is 30 seconds, on purpose

A cold login against this API measured **9.7 seconds** from Lagos. The usual 10
second default would turn a slow but successful request into a failure the user
can do nothing about.

So the timeout is set well clear of the real worst case, and the interface
carries the wait instead: the button shows a spinner, it disables itself so
nobody submits twice, and a line appears underneath saying it can take a few
seconds. A nine second wait that explains itself is tolerable. A nine second
wait that looks frozen is not.

### Signing in does not navigate

There is no `navigate()` call after signing in or out anywhere in this app. The
navigator looks at whether there is a session and mounts either the auth stack
or the tab bar. The signed in screens do not exist while you are signed out, so
no back gesture can reach them.

### Failures during launch always resolve

Reading secure storage can fail. If that error escapes, the app sits on the
splash screen forever with no way out. Every path through the launch check ends
by deciding signed in or signed out, and the worst case is signing in again.

### The splash is held for 2.2 seconds

Long enough to play through. A branded opening that flashes past in 200
milliseconds reads as a glitch, and the wait costs nothing because it overlaps
the network call that is already happening.

## App Store and Play Store requirements

Both stores reject apps that miss these, so they are built in rather than left
for later:

- **Terms and privacy accepted at sign up**, as a deliberate tick, not a
  pre-ticked box or small print under the button
- **Reachable privacy policy and terms**, linked from sign up and from Profile
- **Account deletion from inside the app**. Apple requires any app that lets
  you create an account to let you delete it, and will reject an app that tells
  you to email support instead. The flow and the two step confirmation are in
  place. It needs a `DELETE /api/auth/me` endpoint, which the API does not have
  yet, and the app says so plainly rather than pretending to delete anything.

## Security review

I audited this before submitting rather than after. One real vulnerability, found and fixed.

### The one that mattered: credentials in the shipped bundle

The sign in form was prefilled from `EXPO_PUBLIC_DEMO_EMAIL` and
`EXPO_PUBLIC_DEMO_PASSWORD`, held in a gitignored `.env`. That felt safe and
was not.

`EXPO_PUBLIC_*` variables are **not runtime configuration**. Metro substitutes
them into the JavaScript at build time. I exported the bundle and searched it:

```
FOUND IN BUNDLE: Test@1234567
FOUND IN BUNDLE: referred_test@sr2go.com
```

Anyone who downloaded the app could have run `strings` on it and read the
password. Gitignoring `.env` protects the repository and does nothing for the
binary.

The prefill is now gated on `__DEV__`, so a release build ignores those
variables entirely. Re-exported to confirm:

```
gone from bundle: Test@1234567
gone from bundle: referred_test@sr2go.com
```

The sign in screenshot above shows the same thing from the other side: empty
fields in a release build.

### Where the tokens are kept

`expo-secure-store`, under one key. On iOS that is the **Keychain**; on Android
**EncryptedSharedPreferences**. Both are handled by the operating system.

`AsyncStorage` appears nowhere in this codebase except in a comment explaining
why it is not used: it is an unencrypted file in the app sandbox, readable on a
rooted or jailbroken device. A JWT is a credential and belongs behind the OS.

Signing out deletes the key, so nothing is left to restore from.

### The rest of the audit

| Check | Result |
|---|---|
| Credentials in git history | None. `.env` was never tracked |
| Transport | HTTPS only. No plain `http` anywhere in the source |
| Token exposure | Only ever an `Authorization` header, only to the API base |
| Tokens in logs | None. Logging is compiled out of release builds entirely |
| Deep links | `Linking.openURL` only ever receives hardcoded legal URLs |
| Dependencies | 10 moderate, all inside `@expo/cli` build tooling. None ship in the app |

One thing worth crediting to the API: a wrong password and an unknown email
both return the same `Invalid credentials`. That prevents user enumeration and
is the right choice.

### Accessibility, measured not guessed

Contrast was calculated rather than eyeballed, which turned up three failures
against WCAG AA:

| | Before | After |
|---|---|---|
| Placeholder text in fields | 2.28:1 | 4.54:1 |
| Brand blue as body text | 3.03:1 | 5.90:1 |
| White label on the primary button | 2.51:1 | 5.90:1 to 10.24:1 |

That last one existed in the original design. The button gradient started at
`#4FA8FF`, which is too light to carry white text.

Three navigation links also had no `accessibilityRole`, so a screen reader
announced them as plain text rather than buttons, and the wallet Top up control
was a 30pt target against a 44pt minimum. Both fixed.

## What is placeholder, and why

The task covered authentication. The trips, wallet and booking endpoints were
not part of it, so:

- Dashboard trip content is sample data, in one file, shaped the way a trips
  endpoint would return it. Swapping in the real call is a change to one import.
- Trips and Wallet tabs say what they are for rather than showing a blank
  screen or fake content.
- The booking button on a trip is visibly disabled and explains what it needs.

Everything that comes from the API is real: your name, email, role, rating and
all four verification flags on the Profile screen are read from
`GET /api/auth/me` with the stored token.

## The API, as I found it

There is no published specification, so I mapped it by hand:

| Endpoint | Body | Returns |
|---|---|---|
| `POST /api/auth/login` | `email`, `password` | `access_token`, `refresh_token`, `token_type`, `user_id`, `role`, `full_name`, `phone_verified` |
| `POST /api/auth/register` | `full_name`, `email`, `phone`, `password` | same shape as login |
| `POST /api/auth/refresh` | `refresh_token` | same shape as login |
| `GET /api/auth/me` | bearer token | full profile |

Errors come back two ways: `{"detail": "Invalid credentials"}` for a plain
failure, and a list of per field problems for a validation failure. The client
turns both into one error type, and puts field errors back on the fields they
belong to instead of showing one generic line at the top.

## What I would do next

- **Refresh the token automatically.** The refresh endpoint is wired up and
  typed but not yet used. A 401 should try once with the refresh token before
  signing the user out.
- **Tell a dead network apart from a rejected token.** Right now any failure
  during launch signs you out. Only a 401 should do that; a network error
  should keep the session and retry.
- **Real trips.** The list, the detail screen and booking, against the real
  endpoints.
- **Tests.** The validators and the error mapping in the API client are pure
  functions and worth covering first.
- **Phone verification**, since the API already reports `phone_verified` and the
  dashboard already prompts for it.
- **Password reset for real.** The screen, the validation and the confirmation
  state are built. It needs a reset endpoint, which the API does not have.
