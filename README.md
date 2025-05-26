# WaleBackend

A Node.js backend for a wallet and transaction management system, supporting user and admin authentication, wallet operations, Stripe integration, and admin controls.

## [Postman Documentation](https://documenter.getpostman.com/view/40416552/2sB2qcD1yr) 

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

4. **Expose port for Stripe webhooks (if developing locally)**

- Use ngrok or similar tool to expose your local server:
- Update your Stripe webhook URLs in the dashboard to use the generated ngrok HTTPS URL.

5. **Run the server**
- npm run server

## Environment Variables

See `.env.example` for required variables:
- `PORT`
- `FRONT_PORT`
- `DB_URL`
- `SECRET`
- `STRIPE_PRIVATE_KEY`
- `WEBHOOK_SECRET`
- `WEBHOOK_WITHDRAWAL_SECRET`
- `FIXER_API_KEY`

## API Endpoints

### Auth
- `POST /api/user-register`
- `POST /api/user-login`
- `POST /api/admin-register`
- `POST /api/admin-login`
- `GET /api/logout`

### Wallet
- `GET /api/get-balance` 

### Stripe
- `GET /api/stripe-check` 
- `GET /api/stripe-withdraw` 
- `POST /api/webhooks`
- `POST /api/webhooks/withdrawal`

### Transactions
- `POST /api/transfer-funds` 
- `GET /api/get-transaction` 

### Admin
- `GET /api/admin/get-flagged-transactions` 
- `POST /api/admin/enable-user` 
- `POST /api/admin/delete-user`

## Development

- Uses **nodemon** for auto-reloading in development (`npm run server`).
- All API responses are JSON.

## License

ISC

---
