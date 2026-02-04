# Quickstart Guide: Better Auth Integration

## Prerequisites
- Node.js 18+ for frontend
- Python 3.9+ for backend
- Better Auth account/configured instance
- Running FastAPI backend with JWT verification

## Setup Steps

### 1. Frontend Setup
```bash
cd frontend
npm install @better-auth/react @better-auth/client
```

### 2. Environment Configuration
Create `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth
```

### 3. Backend Configuration
Ensure backend `.env` contains:
```
JWKS_URL=http://localhost:3000/api/auth/jwks
JWT_ISSUER=http://localhost:3000
JWT_AUDIENCE=http://localhost:3000
```

## Implementation Order
Follow the tasks in the plan.md in sequence, starting with Phase 1.

## Key Integration Points
- API calls must use the centralized client with JWT tokens
- User ID from auth session must be used in API paths
- Error handling should redirect on 401, show messages on 403/404
- Protected routes must verify authentication before rendering