# Inventory Service

The **Inventory Service** manages product stock, validates item availability, and supports the Order Service when processing orders.

## Technology Stack
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma
- **HTTP Client:** Axios

## Getting Started Locally

### Prerequisites
- Node.js (v20+)
- Docker (for local MySQL database)

### Installation
```bash
npm install
```

### Database Setup
Ensure your local MySQL container is running, then apply migrations and seed the database:
```bash
npx prisma db push
npx prisma db seed
```

### Running the App
```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Testing
```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
