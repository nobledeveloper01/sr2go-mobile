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
- **Dashboard** with your real name and verification status from the API
- **Trip detail**, opened by tapping a trip
- **Profile** showing your real account, with legal links, sign out and account deletion
- **Stay signed in** across restarts, with the token in secure storage

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
