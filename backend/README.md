# Ninety Backend

The backend is a Spring Boot 3.3.4 REST API built with Java 21 and Maven. It uses MySQL for persistence, Redis for caching, and integrates with Resend, Google Gemini, and Expo Push Service. API documentation is served by Springdoc at `/swagger-ui.html`.

## Requirements

- Docker Engine / Docker Desktop with Docker Compose v2 for the full local stack
- Java 21 and Maven only if building or running outside Docker; the repository includes Maven Wrapper scripts
- Provider credentials for features that use email, AI, Firebase Admin, or push notifications

## Run locally with Docker Compose

From this directory, create a local environment file:

```sh
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Review `.env`. The template contains local development values only. Replace passwords and the JWT secret, and supply valid API keys for services you intend to use. Then start the stack:

```sh
docker compose up --build
```

Compose starts MySQL 8.4, Redis 7, and the API. MySQL and Redis data persist in named Docker volumes. The API is available at `http://localhost:8080`; Swagger UI is at `http://localhost:8080/swagger-ui.html`.

Stop containers while preserving database data:

```sh
docker compose down
```

To intentionally delete the local databases and cache as well:

```sh
docker compose down --volumes
```

The last command permanently deletes the Compose-managed MySQL and Redis data.

## Environment variables

| Variable                                       | Purpose                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `DB_NAME`                                      | MySQL database name                                                                              |
| `DB_USERNAME` / `DB_PASSWORD`                  | MySQL application user credentials                                                               |
| `MYSQL_ROOT_PASSWORD`                          | Local MySQL root password used by Compose                                                        |
| `DB_HOST` / `DB_PORT`                          | Database host/port when running the app outside Compose; Compose sets these to its MySQL service |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Redis connection; Compose supplies its service address and an empty local password               |
| `JWT_SECRET`                                   | Signing secret for auth tokens; use a strong, private value outside local development            |
| `JWT_ACCESS_EXP` / `JWT_REFRESH_EXP`           | Access- and refresh-token lifetimes in milliseconds                                              |
| `OTP_EXPIRY_MIN` / `OTP_LENGTH`                | One-time-password expiry and digit count                                                         |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL`         | Email delivery credentials and sender identity                                                   |
| `GEMINI_API_KEY`                               | Google Gemini API credential                                                                     |
| `OPEN_AI_KEY`                                  | OpenAI API credential, if that integration is enabled                                            |

The API loads its configuration from `src/main/resources/application.yml`; the `docker` profile overrides the Redis hostname. Empty provider API keys may allow startup but provider-dependent features will not work until valid credentials are configured.

## Development and tests

Run backend tests from this directory:

```sh
./mvnw test
```

On Windows:

```powershell
./mvnw.cmd test
```

Build the executable JAR:

```sh
./mvnw clean package
```

On Windows use `./mvnw.cmd clean package`. The Docker image build skips tests; run the test command separately before release.

## Container deployment

The `Dockerfile` builds with Maven and Java 21, then runs the JAR on a Java 21 JRE. Build locally with:

```sh
docker build -t ninety-backend .
```

For deployment, publish the image to a container registry and run it on a container platform with port `8080` exposed. Configure the production environment variables above using the platform's secret manager. Use managed MySQL and Redis services, not the local Compose volumes; configure network access, backups, TLS, and monitoring for those services. Set `SPRING_PROFILES_ACTIVE` and `REDIS_HOST`/`REDIS_PORT` for the target environment as appropriate.

The included Compose file is for local development. It does not define production TLS, backups, horizontal scaling, or a production secrets manager.

## Troubleshooting

- **Database connection refused:** Wait for MySQL's health check; verify Docker is running and the DB variables in `.env` agree. Port `3306` must be available on the host.
- **API can't reach Redis:** Use Compose (`docker compose up`) so the app can resolve the `redis` service name; `localhost` inside the app container refers to that container itself.
- **Missing configuration placeholder:** Ensure `.env` contains every variable from `.env.example`; Compose reads it for `${...}` substitutions.
- **Email or AI feature errors:** Add valid Resend/Gemini credentials. Placeholder values are not service credentials.
- **Port conflict:** Change the host side of the Compose mapping (for example, `8081:8080`) and update the frontend API URL.

For monorepo and frontend setup, see the [root README](../README.md) and [frontend guide](../frontend/README.md).
