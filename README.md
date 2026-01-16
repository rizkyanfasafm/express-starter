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

## Why pnpm?

This project uses [pnpm](https://pnpm.io) instead of npm because:

- **Faster** - Installs packages in parallel and caches them globally
- **Disk efficient** - Uses hard links to save disk space (packages stored once)
- **Strict** - Prevents phantom dependencies by using a non-flat node_modules

Learn more: [pnpm.io/motivation](https://pnpm.io/motivation)

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/express-starter.git
cd express-starter
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database
```bash
pnpm prisma migrate dev
```

5. Run development server
```bash
pnpm dev
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
