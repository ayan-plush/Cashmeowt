# WaleBackend

A Node.js backend for a wallet and transaction management system, supporting user and admin authentication, wallet operations, Stripe integration, and admin controls.

## Features

- **User & Admin Authentication** (JWT, bcrypt)
- **Wallet Operations:** Balance check, top-up, withdrawal (Stripe)
- **Transaction Management:** Transfer funds, transaction limits, fraud flagging
- **Admin Controls:** Enable/disable users, soft delete, view flagged transactions
- **Currency Conversion:** Automatic conversion to USD (Fixer API)
- **RESTful API** with Express.js
- **MongoDB** via Mongoose

## Project Structure


## Setup

1. **Clone the repository**

2. **Install dependencies**


3. **Configure environment variables**

- Copy `.env.example` to `.env` and fill in the required values.

4. **Run the server**


## Environment Variables

See `.env.example` for required variables:
- `PORT`
- `FRONT_PORT`
- `DB_URL`
- `SECRET`
- `STRIPE_PRIVATE_KEY`
- `WEBHOOK_SECRET`
- `WEBHOOK_WITHDRAWL_SECRET`
- `FIXER_API_KEY`

## API Endpoints

### Auth
- `POST /api/user-register`
- `POST /api/user-login`
- `POST /api/admin-register`
- `POST /api/admin-login`
- `GET /api/logout`

### Wallet
- `GET /api/get-balance` (auth required)

### Stripe
- `GET /api/stripe-check` (auth required)
- `GET /api/stripe-withdraw` (auth required)
- `POST /api/webhooks`
- `POST /api/webhooks/withdrawl`

### Transactions
- `POST /api/transfer-funds` (auth required)
- `GET /api/get-transaction` 

### Admin
- `GET /api/admin/get-flagged-transactions` (admin required)
- `POST /api/admin/enable-user` (admin required)
- `POST /api/admin/delete-user`(admin required)

## Development

- Uses **nodemon** for auto-reloading in development (`npm run server`).
- All API responses are JSON.

## License

ISC

---