# ADR-001: Authentication and Authorization Architecture with Better Auth and JWT

## Status

Accepted

## Date

2026-01-14

## Context

The todo application requires secure authentication and authorization to ensure users can only access their own tasks. The existing frontend (Next.js 16+ App Router) and backend (FastAPI with SQLModel) needed to be connected with a robust authentication system. We needed to choose an approach that would provide:

- Secure JWT-based authentication
- Proper user isolation for data access
- Easy integration with existing codebase
- Good developer experience
- Industry-standard security practices

## Decision

We chose to implement an authentication and authorization architecture using Better Auth with JWT tokens for API authorization. This includes:

**Frontend Components:**
- Better Auth client with JWT plugin for token management
- Centralized API client that automatically attaches JWT tokens to requests
- Protected route components that restrict access based on authentication status
- User ID extraction hooks for consistent access to authenticated user context

**Backend Components:**
- JWT verification using Better Auth's JWKS endpoint
- User ID extraction from JWT payload and comparison with API path parameters
- Proper CORS configuration to allow frontend-backend communication
- 403 Forbidden responses when user ID mismatch occurs

**Integration Pattern:**
- API endpoints follow pattern `/api/{user_id}/tasks/...` where user_id comes from JWT token
- All authenticated requests include `Authorization: Bearer <jwt-token>` header
- Backend validates JWT and enforces ownership (token user_id must match path user_id)

## Consequences

**Positive:**
- Strong security model with JWT-based authentication
- Clear separation of concerns between authentication and authorization
- Good user experience with automatic token handling
- Proper data isolation ensuring users can only access their own tasks
- Standard HTTP status codes for different error scenarios (401, 403, 404)

**Negative:**
- Additional complexity compared to simpler session-based approaches
- Need to manage token refresh and expiration on frontend
- Requires careful configuration of CORS and security headers
- More complex error handling for different authentication states

## Alternatives

**Alternative 1: Traditional Session-Based Authentication**
- Store session data on server, use cookies for identification
- Pros: Simpler token management, automatic handling by browsers
- Cons: Requires server-side session storage, more complex scaling

**Alternative 2: OAuth with Third-Party Providers Only**
- Use Google, GitHub, etc. for authentication only
- Pros: Leverages trusted identity providers, reduces account management
- Cons: Limits user signup options, relies on external services

**Alternative 3: Custom JWT Implementation**
- Build JWT handling from scratch without Better Auth
- Pros: Complete control over implementation
- Cons: Higher risk of security vulnerabilities, more maintenance

## References

- specs/001-auth-integration/spec.md
- specs/001-auth-integration/plan.md
- specs/001-auth-integration/tasks.md
- frontend/src/services/task-service.ts
- backend/routers/tasks.py
- backend/dependencies/auth.py