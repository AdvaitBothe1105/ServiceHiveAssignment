# CLAUDE.md

## Project: SignalOps — Smart Leads Dashboard

## Stack
- Frontend: Next.js 14 (App Router), TypeScript, TailwindCSS
- Backend: Node.js, Express, TypeScript, MongoDB + Mongoose
- Auth: JWT + bcrypt, RBAC (admin / sales)
- Containerisation: Docker Compose

## Dev commands
- `docker-compose up --build` — start everything
- `cd server && npm run dev` — Express on :5000
- `cd client && npm run dev` — Next.js on :3000
- `npm run lint` — ESLint across both packages

## Conventions
- All API responses follow: `{ success, data, message, meta? }`
- Zod schemas live in /shared/validators — import from there, never redefine
- Services never import Mongoose directly — always go through repositories
- No `any` types. Use `unknown` and narrow, or add a proper interface
- Commits follow Conventional Commits: feat:, fix:, chore:, docs:

## Environment
- Copy .env.example to .env before running
- Never commit .env
- JWT_SECRET, MONGODB_URI, and PORT are required

## What to avoid
- Don't modify /shared/validators without updating both client and server usages
- Don't add business logic to controllers — that belongs in services