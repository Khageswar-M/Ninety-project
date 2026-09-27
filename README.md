# Ninety

Ninety is a 90-day productivity and habit-tracking application. The repository is a monorepo containing an Expo / React Native client and a Spring Boot API.

## Repository layout

| Path | Purpose |
| --- | --- |
| `frontend/` | Expo SDK 57 mobile app (Android, iOS, and web) |
| `backend/` | Spring Boot REST API, MySQL persistence, Redis cache, email, AI, and push-notification integration |

See the [frontend guide](frontend/README.md) and [backend guide](backend/README.md) for app-specific setup and deployment instructions.

## Requirements

- Git
- Docker Desktop or Docker Engine with the Compose plugin
- Node.js and npm compatible with Expo SDK 57
- An Expo account and EAS CLI only when creating hosted mobile builds
- Android Studio for a local Android emulator/build; Xcode on macOS for local iOS builds

The default backend development environment runs MySQL, Redis, and the API in Docker. The frontend runs from Node on your computer.

## Quick start

1. Create the backend's local environment file:

	```sh
	cd backend
	cp .env.example .env
	```

	On Windows PowerShell, use `Copy-Item .env.example .env`. Review the values, replace the local-only secrets, and add provider keys for features you want to try. Never use the example secrets in a deployed environment.

2. Start MySQL, Redis, and the API:

	```sh
	docker compose up --build
	```

	The API listens on `http://localhost:8080`; Swagger UI is at `http://localhost:8080/swagger-ui.html`.

3. In another terminal, create the frontend environment file:

	```sh
	cd frontend
	cp .env.example .env
	```

	On Windows PowerShell, use `Copy-Item .env.example .env`. Set `EXPO_PUBLIC_BACKEND_URL` to an address reachable from the device. For an Android emulator, use `http://10.0.2.2:8080`; for a physical phone, use the computer's LAN IP and keep both devices on the same network.

4. Install and start the app:

	```sh
	npm ci
	npx expo start
	```

	Open the QR code in Expo Go or use an installed development build. Remote push notifications require a development/production build and native push credentials; Expo Go is not supported for remote push.

## Checks

From `frontend/`:

```sh
npm run lint
npx expo export --platform android
```

From `backend/`:

```sh
./mvnw test
```

On Windows, run `mvnw.cmd test`. There is currently no repository CI workflow or frontend test script; these commands are manual validation steps.

## Deployment overview

- **API:** Build and deploy the backend Docker image to a container host. Use managed MySQL and Redis in production, configure the environment variables listed in [backend/README.md](backend/README.md), and expose port `8080`. The included Compose stack is for local development, not production data hosting.
- **Mobile app:** Build with EAS using the profiles in `frontend/eas.json`. The `development` and `preview` profiles are for internal distribution; `production` enables remote app-version management and automatic build-number increments. Store submission credentials and targets are not configured in the current `submit.production` profile.
- **Secrets:** Configure API keys, signing credentials, database credentials, and push credentials in the appropriate deployment/EAS secret store. Do not put secrets in `EXPO_PUBLIC_*` variables; those values are bundled into the client app.

Before shipping Android, reconcile the Android application ID in `frontend/app.json` with `frontend/android/app/build.gradle` and the Firebase Android app configuration. They currently differ. See [frontend deployment notes](frontend/README.md#mobile-builds-and-release).

## Further reading

- [Frontend setup and EAS release guide](frontend/README.md)
- [Backend setup, configuration, and container deployment](backend/README.md)
- [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/)
