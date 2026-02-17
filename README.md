# Payment Collection App — Backend

Production-ready REST API for managing loan customer payments, built with Node.js, Express, and PostgreSQL.

---

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Runtime     | Node.js 20                     |
| Framework   | Express.js 4                   |
| Database    | PostgreSQL 15+                 |
| ORM         | Prisma 5                       |
| Validation  | express-validator              |
| Security    | helmet, cors                   |
| Logging     | morgan                         |
| Process Mgr | PM2 (production)               |

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── customerController.js
│   │   └── paymentController.js
│   ├── routes/
│   │   ├── customerRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── index.js
│   ├── services/
│   │   ├── customerService.js
│   │   └── paymentService.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── catchAsync.js
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── docs/
│   └── deployment-guide.md
├── .github/workflows/
│   └── backend-ci.yml
├── server.js
├── package.json
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 15
- npm ≥ 9

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/payment-collection-backend.git
cd payment-collection-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Set Up the Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed sample data
npx prisma db seed
```

### 5. Start the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server runs at `http://localhost:3000` by default.

---

## Environment Variables

| Variable       | Description                  | Default                  |
|----------------|------------------------------|--------------------------|
| `PORT`         | Server port                  | `3000`                   |
| `NODE_ENV`     | Environment mode             | `development`            |
| `DATABASE_URL` | PostgreSQL connection string | *(required)*             |
| `CORS_ORIGIN`  | Allowed CORS origin          | `*`                      |

---

## API Documentation

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-16T12:00:00.000Z"
}
```

---

### Get All Customers

```
GET /api/customers
```

**Response** `200 OK`:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "accountNumber": "ACC-10001",
      "issueDate": "2024-12-15T00:00:00.000Z",
      "interestRate": 8.5,
      "tenure": 12,
      "monthlyInstallment": 10000.00,
      "emiDue": 10000.00,
      "totalBalance": 120000.00,
      "nextDueDate": "2025-01-15T00:00:00.000Z",
      "lastInterestCalc": null
    }
  ]
}
```

---

### Get Customer by Account Number

```
GET /api/customers/:accountNumber
```

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "accountNumber": "ACC-10001",
    "issueDate": "2024-01-15T00:00:00.000Z",
    "interestRate": 8.5,
    "tenure": 36,
    "emiDue": 15250.00,
    "payments": []
  }
}
```

**Response** `404 Not Found`:
```json
{
  "success": false,
  "status": "fail",
  "message": "Customer with account number \"ACC-99999\" not found"
}
```

---

### Create Payment

```
POST /api/payments
Content-Type: application/json
```

**Body:**
```json
{
  "account_number": "ACC-10001",
  "amount": 15250.00
}
```

**Response** `201 Created`:
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "id": 1,
    "customerId": 1,
    "paymentDate": "2026-02-16T12:00:00.000Z",
    "amount": 15250.00,
    "status": "success",
    "customer": {
      "accountNumber": "ACC-10001",
      "emiDue": 15250.00
    }
  }
}
```

**Validation Errors** `400`:
```json
{
  "success": false,
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    { "field": "account_number", "message": "Account number is required" },
    { "field": "amount", "message": "Amount must be a number greater than 0" }
  ]
}
```

---

### Get Payment History

```
GET /api/payments/:accountNumber
```

**Response** `200 OK`:
```json
{
  "success": true,
  "data": {
    "accountNumber": "ACC-10001",
    "totalPayments": 2,
    "payments": [
      {
        "id": 2,
        "paymentDate": "2026-02-16T12:00:00.000Z",
        "amount": 15250.00,
        "status": "success"
      }
    ]
  }
}
```

---

## Deployment

See [docs/deployment-guide.md](./docs/deployment-guide.md) for full AWS EC2 deployment instructions.

---

## CI/CD

GitHub Actions automatically:
1. **On PR/Push** → Lint → Prisma generate
2. **On merge to main** → Deploy to EC2 via SSH, run migrations, restart PM2

---

## License

ISC
