# Subscription API

A lightweight Node.js + Express subscription management API with user auth, subscription CRUD, scheduled workflows, email notifications, and basic abuse protection (Arcjet).

## Features

- User authentication (sign-up, sign-in, sign-out) using JWT
- Subscription management: create, read, update, delete, cancel
- Upcoming renewals and reminder workflow endpoint
- Email templates and sending via Nodemailer
- Protection and rate-limiting via Arcjet
- QStash / Upstash workflow integration for scheduled tasks

## Tech Stack

- Node.js (ES modules)
- Express
- MongoDB / Mongoose
- JWT for auth
- Nodemailer for email
- Arcjet for request shielding and rate limits

## Project Structure

Top-level layout:

- `app.js` — application entry
- `config/` — config and environment mapping
- `controllers/` — request handlers
- `router/` — Express routers and API routes
- `models/` — Mongoose models
- `middlewares/` — auth, error handling, Arcjet middleware
- `utils/` — helper functions (email templates, send-email)

## Prerequisites

- Node.js (v18+ recommended)
- npm
- A running MongoDB instance (URI in env)

## Installation

Install dependencies:

```bash
npm install
```

Start in development mode:

```bash
npm run dev
```

Start production:

```bash
npm start
```

## Environment

Environment variables are loaded from `.env.<NODE_ENV>.local` (see `config/env.js`). The project expects the following variables:

- `PORT` — server port (e.g. 3000)
- `NODE_ENV` — environment (development|production)
- `DB_URI` — MongoDB connection URI
- `JWT_SECRET` — secret for signing JWTs
- `JWT_EXPIRES_IN` — token expiry (e.g. 7d)
- `ARCJET_ENV` — Arcjet environment
- `ARCJET_KEY` — Arcjet API key
- `QSTASH_URL` — QStash webhook URL (if using Upstash workflows)
- `QSTASH_TOKEN` — QStash secret token
- `SERVER_URL` — public server URL (used in emails/links)
- `EMAIL_PASSWORD` — SMTP password for sending email

Create a `.env.development.local` file (or the appropriate file for your `NODE_ENV`) with these values.

## Configuration files

- Arcjet is configured in `config/arcjet.js` and uses `ARCJET_KEY`.
- App environment mapping is in `config/env.js`.
- Other integrations: `config/nodemailer.js`, `config/upstash.js`.

## API Reference

Base path (typical): `/api` — the app mounts routers under versioned paths in `app.js` (check `app.js` for exact prefixes).

Auth

- POST `/api/auth/v1/sign-up` — register a new user
	- Body (example): `{ "email": "you@example.com", "password": "secret" }`
- POST `/api/auth/v1/sign-in` — login, returns JWT
	- Body (example): `{ "email": "you@example.com", "password": "secret" }`
- POST `/api/auth/v1/sign-out` — sign out (invalidate token on client)

Users

- GET `/api/users/v1/` — list users
- GET `/api/users/v1/:id` — get user (protected)
- POST `/api/users/v1/` — create user (placeholder route)
- PUT `/api/users/v1/:id` — update user (placeholder route)
- DELETE `/api/users/v1/:id` — delete user (placeholder route)

Subscriptions

- GET `/api/subscriptions/v1/` — list all subscriptions
- GET `/api/subscriptions/v1/upcoming-renewals` — list upcoming renewals
- GET `/api/subscriptions/v1/:id` — get a subscription (protected)
- POST `/api/subscriptions/v1/` — create a subscription (protected)
	- Body (example): `{ "userId": "<userId>", "plan": "monthly", "price": 9.99 }`
- PUT `/api/subscriptions/v1/:id` — update a subscription (protected)
- PUT `/api/subscriptions/v1/:id/cancel` — cancel a subscription (protected)
- DELETE `/api/subscriptions/v1/:id` — delete a subscription (protected)
- GET `/api/subscriptions/v1/user/:id` — get subscriptions for a user (protected)

Workflow

- POST `/api/workflow/v1/subscription/reminder` — trigger sending subscription reminder emails (used by schedulers or QStash)

Notes: many routes require the `authorize` middleware found in `middlewares/auth.middleware.js` — include an `Authorization: Bearer <token>` header for protected endpoints.

## Email

- Email templates live in `utils/email-template.js` and email sending is implemented in `utils/send-email.js`.
- SMTP settings are configured via `config/nodemailer.js` and credentials come from environment variables.

## Running scheduled workflows

- The project includes a workflow endpoint to send reminders. You can trigger it from a scheduler or use Upstash / QStash to call the webhook on a schedule.

## Development tips

- Use `nodemon` during development (`npm run dev`).
- Inspect `controllers/` to see expected request bodies and responses for each route.
- Use Postman or curl to exercise endpoints. Example sign-up:

```bash
curl -X POST http://localhost:3000/api/auth/v1/sign-up \
	-H 'Content-Type: application/json' \
	-d '{"email":"you@example.com","password":"secret"}'
```

## Tests

There are no automated tests included. Add tests under a `tests/` folder and include a test runner like Jest or Mocha if desired.

## Contributing

- Fork the repo, create a feature branch, test your changes, and open a PR.
- Keep API changes backward compatible when possible and update this README with any new endpoints or env variables.

## License

Add your license here (e.g., MIT) or include a `LICENSE` file in the repository.

## Maintainers / Contact

For questions about the code, inspect the controllers in `controllers/` or open an issue in the repository.
