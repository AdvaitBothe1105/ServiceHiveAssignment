# Smart Leads Dashboard

Full-stack Lead Management Dashboard built with MERN + TypeScript. Designed to match the internship assignment requirements with clean architecture, reusable UI, and production-grade API patterns.

## Features

- JWT auth (register, login, logout, protected routes, httpOnly cookies)
- RBAC (admin / sales)
- Leads CRUD + single-lead detail view
- Advanced filters (status, source, search name/email, sort latest/oldest)
- Debounced search
- Backend pagination with metadata (limit 10)
- CSV export (admin only)
- Analytics + stats endpoints
- Loading, empty, and error states
- Dark mode support

## Tech Stack

Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
Backend: Node.js, Express, TypeScript, MongoDB + Mongoose

## Project Structure

- client: Next.js UI
- server: Express API
- shared: Zod schemas used by both client and server

## Setup

1) Install dependencies
```
npm install
```

2) Configure environment
- Copy .env.example to server/.env
- Copy client/.env.example to client/.env.local

3) Run dev servers (client + server)
```
npm run dev
```

Optional seed data
```
npm --workspace server run seed:users
npm --workspace server run seed:leads
```

## Scripts (root)

- npm run dev: start client + server
- npm run build: build client + server
- npm run lint: lint client + server

## API Documentation

See docs/API.md

## Deployment

- Add deployment link here if available.

## Notes

- All API responses follow { success, data, message, meta? }.
