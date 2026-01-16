# Express Starter

A starter template for Express.js with TypeScript and Prisma ORM.

## Tech Stack

### Core
- **Express** - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript
- **Prisma** - ORM with MariaDB adapter

### Security & Validation
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing
- **Bcrypt** - Password hashing
- **JSON Web Token** - Authentication tokens
- **Zod** - Schema validation

### Utilities
- **Dayjs** - Date manipulation
- **Dotenv** - Environment variables
- **Pino** - Fast JSON logger

### Development
- **Vitest** - Testing framework
- **Supertest** - HTTP testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart on changes
- **TSX** - TypeScript execution

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Run production build |
| `pnpm test` | Run tests |
| `pnpm lint` | Check code style |
| `pnpm lint:fix` | Fix code style |
| `pnpm format` | Format code |
