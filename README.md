# Chirpy

A small Twitter-style REST API built with Express, TypeScript, Drizzle ORM, and PostgreSQL (boot.dev "Learn Web Servers" project).

## Stack

- Express 5
- TypeScript
- Drizzle ORM + PostgreSQL
- argon2 (password hashing) + JWT (access/refresh tokens)
- Vitest

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root:
   ```
   DB_URL=postgres://user:password@localhost:5432/chirpy?sslmode=disable
   PLATFORM=dev
   JWT_SECRET=your-secret
   POLKA_KEY=your-polka-api-key
   ```
3. Make sure PostgreSQL is running and the `chirpy` database exists.

## Running

```
npm run dev    # compile and start
npm run build  # compile only
npm start      # run compiled output (dist/index.js)
npm test       # run vitest
```

The server runs on `http://localhost:8080` and applies pending Drizzle migrations on startup.

## API

| Method | Path                    | Description                          |
|--------|-------------------------|---------------------------------------|
| GET    | `/api/healthz`          | Health check                          |
| GET    | `/api/chirps`           | List chirps                           |
| GET    | `/api/chirps/:chirpId`  | Get a single chirp                    |
| POST   | `/api/chirps`           | Create a chirp                        |
| DELETE | `/api/chirps/:chirpId`  | Delete a chirp                        |
| POST   | `/api/users`            | Create a user                         |
| PUT    | `/api/users`            | Update user credentials               |
| POST   | `/api/login`            | Log in                                |
| POST   | `/api/refresh`          | Refresh access token                  |
| POST   | `/api/revoke`           | Revoke refresh token                  |
| POST   | `/api/polka/webhooks`   | Polka payment webhook (Chirpy Red)     |
| GET    | `/admin/metrics`        | Request count                         |
| POST   | `/admin/reset`          | Reset app state (dev only)            |
| GET    | `/app`                  | Static frontend                       |

## Project layout

```
src/
  api/        route handlers and middleware
  db/         drizzle schema, migrations, and queries
  app/        static frontend assets
```
