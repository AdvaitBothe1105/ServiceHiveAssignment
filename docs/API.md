# API Documentation

Base URL (local): http://localhost:5000/api/v1

Response shape (all endpoints)
{
  success: boolean,
  data: T | null,
  message: string,
  meta?: { page, limit, total, totalPages }
}

Auth
- POST /auth/register
  - Body: { name, email, password }
  - Notes: role defaults to sales
- POST /auth/login
  - Body: { email, password }
  - Notes: sets httpOnly cookie "token"
- POST /auth/logout
- GET /auth/me
  - Notes: returns { user, expiresAt }

Leads
- GET /leads
  - Query: page, limit, status, source, search, sort
  - Notes: pagination metadata in response
- POST /leads
  - Body: { name, email, status, source, assignedTo? }
- GET /leads/:id
- PUT /leads/:id
  - Body: partial lead fields
- DELETE /leads/:id
  - Admin only
- GET /leads/export
  - Admin only, CSV file download
- GET /leads/stats
  - Notes: { total, newThisWeek, qualified, contacted, lost }
- GET /leads/analytics
  - Notes: totals, trends, breakdowns, recent activity

Users
- GET /users
  - Admin only, paginated
- PATCH /users/:id/role
  - Admin only, body: { role }


Roles
- admin: full access
- sales: scoped to assigned leads
