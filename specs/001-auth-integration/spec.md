# Specification: Better Auth Integration with JWT for Frontend-Backend Connection

## Project Status & Objective

**Current Status:**
- Frontend (Next.js 16+ App Router) already built and working with UI for tasks list, create, edit, delete, toggle complete
- Backend (Python FastAPI + SQLModel + Neon PostgreSQL) already implemented with:
  - User model + password hashing (bcrypt)
  - JWT verification using remote JWKS from Better Auth
  - Protected task endpoints: /api/{user_id}/tasks/... (all CRUD + complete toggle)
  - Ownership enforcement (user_id match)
  - Signup endpoint (optional)

**Objective:**
Create a detailed specification for securely connecting the existing Next.js frontend to the FastAPI backend, using Better Auth for authentication and JWT tokens for API authorization.

## Connection Architecture Overview

The connection architecture follows this flow:

1. **User Authentication Flow:**
   - User visits Next.js frontend application
   - User attempts to access protected routes or performs login/signup
   - Better Auth handles authentication and creates session
   - JWT token is issued and stored/client-accessible
   - All subsequent API calls include the JWT token in Authorization header

2. **API Request Flow:**
   - Frontend makes request to backend API endpoint: `/api/{user_id}/tasks/...`
   - Centralized API client automatically attaches `Authorization: Bearer <jwt-token>` header
   - Backend receives request and validates JWT using Better Auth's JWKS endpoint
   - Backend extracts user ID from token payload
   - Backend compares extracted user ID with user_id in URL path for ownership verification
   - Backend processes request and returns appropriate response

3. **Error Flow:**
   - Invalid/missing token → 401 Unauthorized → Redirect to login
   - Valid token but wrong user_id in path → 403 Forbidden → Show permission error
   - Valid token and correct ownership → Process request normally

## Frontend Integration Requirements

**Better Auth Configuration:**
- Integrate Better Auth with JWT plugin using asymmetric key pairs for enhanced security
- Configure JWT issuance upon successful login/signup with proper claims structure
- Implement client-side token access using `authClient.token()` for dynamic token retrieval
- Set appropriate token expiration times balancing security and user experience

**API Client Implementation:**
- Create a centralized API client module that wraps fetch/axios for consistent behavior
- Implement automatic attachment of `Authorization: Bearer <token>` header to all authenticated requests
- Handle token refresh mechanisms if supported by Better Auth or implement token expiry detection
- Centralize base URL configuration using `NEXT_PUBLIC_API_URL` environment variable
- Implement retry logic for failed requests with proper error handling

**Session Management:**
- Utilize Better Auth hooks and session providers for consistent user state management
- Extract authenticated user ID from session data or JWT payload for API path construction
- Implement protected route guards that redirect unauthenticated users to login
- Maintain user session state across application navigation and page refreshes

## Backend Verification Requirements

**JWKS Endpoint Verification:**
- Verify that backend can successfully fetch and validate JWTs from Better Auth's JWKS endpoint
- Confirm JWT signature algorithm compatibility (preferably RS256 for asymmetric signing)
- Validate token claims including issuer, audience, and expiration
- Ensure proper extraction of user ID from token subject claim

**Ownership Enforcement:**
- Maintain existing user_id path parameter validation mechanism
- Verify that user ID extracted from JWT matches the user_id in the API path
- Return appropriate 403 Forbidden responses when ownership validation fails
- Log security events for audit trail when unauthorized access attempts occur

**CORS Configuration:**
- Configure CORS middleware to allow requests from frontend origins (localhost:3000 and production domain)
- Allow credentials to be sent with requests for proper session handling
- Permit necessary HTTP headers including Authorization header
- Configure appropriate CORS timing for development and production environments

## Environment Variables (Both Sides)

**Frontend (.env.local):**
- `NEXT_PUBLIC_API_URL`: Base URL for backend API (e.g., http://localhost:8000 or production URL)
- `NEXT_PUBLIC_BETTER_AUTH_URL`: Base URL for Better Auth endpoints (e.g., http://localhost:3000/api/auth)

**Backend (.env):**
- `JWKS_URL`: URL to fetch JWT public keys from Better Auth (e.g., http://localhost:3000/api/auth/jwks)
- `JWT_ISSUER`: Expected issuer value in JWT claims (e.g., http://localhost:3000)
- `JWT_AUDIENCE`: Expected audience value in JWT claims (e.g., http://localhost:3000)
- `DATABASE_URL`: Database connection string for Neon PostgreSQL
- `SECRET_KEY`: Secret key for additional security layers if needed

## API Client Implementation Rules

**Centralized Request Handling:**
- All API calls must go through the centralized client to ensure consistent authentication
- Automatically detect and attach JWT token to requests requiring authentication
- Implement request/response interceptors for consistent error handling and logging
- Support both GET and mutation requests with appropriate headers and content types

**Authentication Token Management:**
- Dynamically fetch JWT token using Better Auth client methods
- Cache token temporarily to avoid repeated fetch calls within the same operation
- Handle token refresh or re-authentication when tokens expire
- Implement token validation before making requests to avoid unnecessary network calls

**Request/Response Processing:**
- Normalize error responses for consistent frontend error handling
- Implement request/response logging for debugging in development mode
- Support request cancellation for improved user experience
- Handle different content types appropriately (JSON, form data, etc.)

## Authentication & Token Handling

**Token Lifecycle Management:**
- Tokens should be obtained on-demand using Better Auth's client-side token methods
- Implement token caching with appropriate TTL to balance performance and security
- Handle token renewal automatically when approaching expiration
- Store tokens securely using browser storage mechanisms appropriate for the environment

**Session State Management:**
- Maintain consistent user session state across application components
- Implement session persistence across browser refreshes and navigation
- Handle session invalidation gracefully with proper cleanup
- Coordinate between Better Auth session state and application-level user state

**Security Considerations:**
- Use HTTPS in production to protect token transmission
- Implement token binding to prevent token replay attacks
- Validate token integrity and freshness on both client and server
- Apply appropriate security headers to protect against XSS and CSRF attacks

## Error Handling & User Experience

**HTTP Status Code Handling:**
- **401 Unauthorized**: Redirect user to login page with appropriate messaging
- **403 Forbidden**: Display "You don't have permission" message and prevent access to resource
- **404 Not Found**: Display "Resource not found" message and allow navigation away
- **Network errors**: Show appropriate loading states and error messages in UI
- **Validation errors**: Display field-specific error messages for form validation failures

**User Feedback Mechanisms:**
- Implement toast notifications for authentication-related events
- Show loading states during authentication and API operations
- Provide clear error messages that guide users toward resolution
- Maintain consistent UI/UX patterns for error presentation

**Graceful Degradation:**
- Handle offline scenarios with appropriate messaging
- Implement retry mechanisms for transient network failures
- Preserve user data during authentication flow interruptions
- Provide clear pathways for users to recover from authentication errors

## Testing & Validation Checklist

**Authentication Flow Testing:**
- [ ] Unauthenticated user attempts to access protected routes → Redirect to login
- [ ] Valid login credentials → Successful authentication and JWT issuance
- [ ] Invalid login credentials → Appropriate error message without revealing account existence
- [ ] Session expiration → Automatic redirect to login with preserved destination intent
- [ ] Token refresh functionality → Seamless continuation of authenticated activities

**API Authorization Testing:**
- [ ] Valid token with correct user_id → Successful API request processing
- [ ] Valid token with incorrect user_id in path → 403 Forbidden response
- [ ] Invalid/expired token → 401 Unauthorized response and redirect to login
- [ ] Missing token for protected endpoint → 401 Unauthorized response
- [ ] Malformed token → Appropriate error handling without system exposure

**Integration Testing:**
- [ ] End-to-end task operations (create, read, update, delete) work with proper authentication
- [ ] Cross-origin requests work properly with configured CORS settings
- [ ] Error handling displays appropriate messages to users
- [ ] Session state persists across page refreshes and navigation
- [ ] Token management works correctly across multiple simultaneous requests

## Potential Pitfalls & Solutions

**Token Expiration & Refresh:**
- *Pitfall*: Tokens expiring mid-session causing disruption to user workflow
- *Solution*: Implement proactive token refresh mechanisms and seamless re-authentication

**CORS Misconfiguration:**
- *Pitfall*: CORS restrictions blocking legitimate API requests between frontend and backend
- *Solution*: Carefully configure CORS policies for development and production environments

**Race Conditions:**
- *Pitfall*: Concurrent API requests attempting to refresh tokens simultaneously
- *Solution*: Implement token refresh queuing and coordination mechanisms

**Security Vulnerabilities:**
- *Pitfall*: Improper token storage or transmission exposing authentication credentials
- *Solution*: Follow security best practices for token handling and implement secure storage

**Environment Mismatch:**
- *Pitfall*: Different environment configurations causing authentication failures
- *Solution*: Maintain consistent environment variable naming and validation across environments

**Session Synchronization:**
- *Pitfall*: Better Auth session state becoming inconsistent with application state
- *Solution*: Implement proper session synchronization and state management patterns

---
**Spec Version:** 1.0
**Created Date:** 2026-01-14
**Last Updated:** 2026-01-14
**Status:** Ready for Planning