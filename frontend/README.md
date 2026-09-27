# Ninety Frontend

The Ninety client is an Expo SDK 57 / React Native application using Expo Router, Redux Toolkit, and JavaScript. Its routes live in `app/`; UI, API clients, state, hooks, and styles live in `src/`.

## Requirements

- Node.js and npm compatible with Expo SDK 57
- A running Ninety API; see [backend setup](../backend/README.md)
- Expo Go for general UI development, or Android Studio / Xcode and a development build for native modules and remote push notifications
- An Expo account and EAS CLI for hosted builds

## Local development

From this directory:

```sh
npm ci
```

Create `.env` from the example (`cp .env.example .env`, or `Copy-Item .env.example .env` in PowerShell) and configure:

| Variable                  | Purpose                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_BACKEND_URL` | Base URL for the Ninety API; this value is included in the client bundle and is not a secret |

Address examples:

| Target                                    | Example API URL                 |
| ----------------------------------------- | ------------------------------- |
| Web or iOS simulator on the same computer | `http://localhost:8080`         |
| Android emulator                          | `http://10.0.2.2:8080`          |
| Physical device                           | `http://<computer-LAN-IP>:8080` |

For a physical device, make sure it can reach the computer over the network and that the firewall allows port `8080`.

Start the Expo development server:

```sh
npx expo start
```

Useful scripts/checks:

```sh
npm run android
npm run ios
npm run web
npm run lint
npx expo export --platform android
```

`npm run ios` requires macOS and Xcode. `npm run android` requires a configured Android SDK/emulator or connected device. There is no frontend test script configured yet.

## Push notifications

Remote push registration is not supported in Expo Go. Use a development or production build on a supported physical device. For Android, configure a Firebase Android app, provide `google-services.json` through `expo.android.googleServicesFile`, and upload an FCM V1 service-account key to the EAS project. Keep the service-account key private. For iOS, configure the app's APNs credentials through EAS.

The Android package identifiers must match across `app.json`, the native Gradle configuration, Firebase, and the app installed on the device. Currently `app.json` declares `com.config.ninety`, while `android/app/build.gradle` declares `com.khageswar.frontend`. Choose the intended production identifier and align these before creating/reinstalling a native build; a JavaScript reload cannot change the identifier embedded in an installed binary.

See the [Expo SDK 57 push setup guide](https://docs.expo.dev/versions/v57.0.0/push-notifications/push-notifications-setup/) for credential setup.

## Mobile builds and release

Authenticate with EAS from this directory:

```sh
npx eas-cli login
```

Build internal development and preview apps:

```sh
npx eas-cli build --profile development --platform android
npx eas-cli build --profile preview --platform all
```

Create store-ready production binaries:

```sh
npx eas-cli build --profile production --platform all
```

The profiles are in `eas.json`. `development` creates a development client; `preview` uses internal distribution; `production` uses remote app versioning and automatic build-number increments. The current `submit.production` configuration is empty, so configure Google Play / App Store submission credentials and identifiers before using EAS Submit. A production API URL must be supplied to the EAS build environment as `EXPO_PUBLIC_BACKEND_URL`.

EAS builds are build/distribution tooling, not a CI pipeline: this repository does not currently contain an automated workflow that runs checks or starts builds on pull requests.

## App structure

- `app/` — file-based routes, auth screens, tab screens, and nested layouts
- `src/API/` — API clients for backend feature areas
- `src/components/` — screens, settings, shared components, and modals
- `src/redux/` — Redux store and feature slices
- `src/hook/` — reusable hooks, including push notifications
- `src/themes/`, `src/styles/` — theme and styling
- `assets/` — fonts, icons, and images

For monorepo setup, see the [root README](../README.md).
