# Smart Udhaar

Smart Udhaar is a full-stack web app for shopkeepers to keep customer records and track credit and payment transactions. It includes a dashboard summarizing balances and recent activity.

## Features

- Register and log in with a shop name, phone number, email, and password.
- Add and view customer records.
- Record credit and payment transactions for a customer.
- View transaction history for one customer or across the shop.
- View a dashboard summary with total credit, total payments, pending amount, customer count, top debtors, and recent transactions.
- Keep customer and transaction data scoped to the signed-in user through authenticated API routes.

## Tech stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT stored in an HTTP-only cookie; passwords are hashed with bcrypt

## Project structure

```text
Smart-Udhaar/
├── backend/
│   ├── server/
│   │   ├── config/       # MongoDB connection
│   │   ├── controllers/  # Authentication, customer, transaction, dashboard logic
│   │   ├── middleware/   # Authentication middleware
│   │   ├── models/       # Mongoose models
│   │   └── routes/       # API routes
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── layouts/
    │   ├── pages/        # Login, register, customers, dashboard, transactions
    │   ├── utils/
    │   └── App.jsx
    └── package.json
```

## Requirements

- Node.js and npm
- A MongoDB instance

## Run locally

### 1. Configure the backend

```sh
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
secretKey=replace-this-with-a-long-random-secret
```

The backend appends the database name `creditMangament` to `MONGODB_URI`. Set `MONGODB_URI` to the MongoDB connection prefix without a trailing slash.

Start the backend:

```sh
npm run dev
```

The API listens on port `3000` by default.

### 2. Configure and run the frontend

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173`. The frontend’s API client defaults to `http://localhost:3000/api`. To use another API base URL, set `VITE_API_URL` in `frontend/.env`, including the `/api` path.

The backend’s CORS configuration currently allows `http://localhost:5173` with credentials.

## API overview

All API paths below are relative to `http://localhost:3000`.

| Method | Path | Purpose | Authentication |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a shop account | No |
| `POST` | `/api/auth/login` | Log in and set the authentication cookie | No |
| `POST` | `/api/auth/logOut` | Clear the authentication cookie | No |
| `GET` | `/api/customers` | List the signed-in user’s customers | Yes |
| `POST` | `/api/customers` | Add a customer | Yes |
| `GET` | `/api/transactions` | List the signed-in user’s transactions | Yes |
| `GET` | `/api/transactions/:customerId` | List transactions for a customer | Yes |
| `POST` | `/api/transactions` | Add a credit or payment transaction | Yes |
| `GET` | `/api/dashboard` | Get the signed-in user’s dashboard summary | Yes |

Authenticated requests use the HTTP-only `token` cookie set during login or registration.

## Current scope

This is an early version focused on account access, customer records, transaction tracking, and dashboard summaries. The current API provides customer creation and listing, plus transaction creation and listing; it does not currently expose customer or transaction update and delete routes. The backend is configured for local frontend development at `http://localhost:5173`; update that CORS origin if you deploy the frontend elsewhere.
