---
id: 1
title: "Better Auth Integration Spec"
stage: spec
date_iso: 2026-01-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: auth-integration
branch: "001-auth-integration"
user: claude
command: "/sp.specify"
labels: ["auth", "integration", "jwt", "better-auth", "frontend", "backend"]
links:
  spec: "specs/001-auth-integration/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/001-auth-integration/spec.md"
  - "specs/001-auth-integration/checklists/requirements.md"
tests_yaml:
  - "spec quality validation"
  - "requirement completeness check"
---

# PHR: Better Auth Integration Spec

## Prompt Text

/sp.specify

Project: Todo Full-Stack Multi-User Web Application - Phase II
Current Status:
- Frontend (Next.js 16+ App Router) already built and working (UI for tasks list, create, edit, delete, toggle complete)
- Backend (Python FastAPI + SQLModel + Neon PostgreSQL) already implemented with:
  - User model + password hashing (bcrypt)
  - JWT verification using remote JWKS from Better Auth
  - Protected task endpoints: /api/{user_id}/tasks/... (all CRUD + complete toggle)
  - Ownership enforcement (user_id match)
  - Signup endpoint (optional)

Objective:
Create a detailed specification for securely CONNECTING the existing Next.js frontend to the FastAPI backend, using Better Auth for authentication and JWT tokens for API authorization.

Focus Areas:
- Complete integration of Better Auth in Next.js with JWT issuance
- Automatic attachment of JWT to all API requests from frontend
- Proper handling of authenticated user ID
- Error handling (401 → redirect to login, 403 → forbidden message, 404 → not found)
- Environment variable management for both sides
- CORS configuration (if not already done in backend)

Must-have Requirements (ALL must be covered):

1. Better Auth Setup in Frontend (Next.js):
   - Install and configure Better Auth with JWT plugin (asymmetric keys preferred)
   - Enable JWT issuance after successful login/signup
   - Use client-side token access (authClient.token())

2. API Client in Frontend:
   - Create a centralized API client (axios or fetch wrapper)
   - Automatically add Authorization: Bearer <jwt-token> header to EVERY request
   - Handle token refresh/expiry (if Better Auth supports) or redirect to login on 401
   - Base URL from env: NEXT_PUBLIC_API_URL=http://localhost:8000 (or production)

3. User/Session Management in Frontend:
   - Use Better Auth hooks/session to get current user
   - Extract user ID (from session or token payload) to use in API paths (/api/${userId}/tasks)
   - Protected pages/routes: redirect to login if not authenticated

4. Backend Side Adjustments (only if needed):
   - Ensure CORS allows frontend origin (localhost:3000 + production domain)
   - Confirm JWKS_URL, JWT_ISSUER, JWT_AUDIENCE in backend .env match frontend values
   - No new endpoints needed — just verify existing ones work with JWT

5. Connection Flow:
   1. User logs in on frontend → Better Auth creates session + issues JWT
   2. Frontend stores token (or fetches on demand)
   3. When calling any task API → attach Bearer token
   4. Backend verifies token → extracts user ID → checks path user_id matches
   5. Success → return data, Failure → appropriate error

6. Environment Variables:
   Frontend (.env.local):
   - NEXT_PUBLIC_API_URL=http://localhost:8000
   - NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth  (or whatever base)

   Backend (.env):
   - JWKS_URL=http://localhost:3000/api/auth/jwks
   - JWT_ISSUER=http://localhost:3000
   - JWT_AUDIENCE=http://localhost:3000

7. Error & UX Handling:
   - 401 → redirect to login page with toast/message
   - 403 → show "You don't have permission" message
   - 404 → "Task not found"
   - Network errors → show loading/error states in UI

8. Testing Scenarios to Document:
   - Unauthenticated user tries to access tasks → redirect to login
   - Wrong token → 401
   - Valid token but wrong user_id in path → 403
   - Correct flow → tasks load, create, update, delete work

Task:
Generate a COMPLETE /sp.specify document focused ONLY on the connection/integration between frontend and backend.

Structure the spec like this:
- Project Status & Objective
- Connection Architecture Overview (flow diagram in text)
- Frontend Integration Requirements
- Backend Verification Requirements
- Environment Variables (both sides)
- API Client Implementation Rules
- Authentication & Token Handling
- Error Handling & User Experience
- Testing & Validation Checklist
- Potential Pitfalls & Solutions

Make it extremely detailed and clear so that an implementation agent can connect both parts perfectly without missing anything.

Do NOT include full backend or frontend code — only the connection-specific descriptions, patterns, and rules.

Begin writing the full specification now.

## Response Text

Created a comprehensive specification for integrating Better Auth with JWT between the Next.js frontend and FastAPI backend, covering all required areas including architecture overview, integration requirements, environment variables, API client rules, authentication handling, error handling, testing scenarios, and potential pitfalls.

## Outcome

Successfully created a detailed specification document at specs/001-auth-integration/spec.md that addresses all the requirements for connecting the frontend and backend with proper authentication and authorization flows.

## Evaluation

The specification covers all the required aspects of the auth integration including the connection architecture, frontend and backend requirements, environment configuration, API client implementation, token handling, error management, testing scenarios, and potential issues. The document is structured to guide an implementation team in connecting the existing frontend and backend components securely.