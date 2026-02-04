# Implementation Plan: Better Auth Integration with JWT for Frontend-Backend Connection

## Technical Context

**Project**: Todo Full-Stack Multi-User Web Application - Phase II
**Objective**: Securely connect existing Next.js frontend to existing FastAPI backend using Better Auth + JWT
**Current State**:
- Frontend (Next.js 16+ App Router) already built with UI for tasks
- Backend (FastAPI + SQLModel + Neon PostgreSQL) with JWT verification using Better Auth JWKS
- Protected task endpoints: /api/{user_id}/tasks/... with ownership enforcement

**Architecture**:
- Frontend: Next.js 16+ with App Router
- Backend: Python FastAPI with SQLModel and Neon PostgreSQL
- Authentication: Better Auth with JWT tokens
- Authorization: JWT verification with user_id path parameter matching

## Constitution Check

This plan aligns with the project constitution regarding security, maintainability, and user experience requirements. All implementation will follow established patterns and security best practices.

## Phase 0: Research & Prerequisites

### Task 0.1: Verify Better Auth Installation Compatibility
- **Description**: Confirm Better Auth version compatibility with Next.js 16+ and JWT plugin availability
- **Files**: package.json (to be created/updated)
- **Dependencies**: None
- **Acceptance Criteria**: Better Auth and JWT plugin versions are identified and compatible

### Task 0.2: Identify Current Frontend Structure
- **Description**: Map existing frontend files and structure to understand where to add auth components
- **Files**: frontend/src/**/*
- **Dependencies**: None
- **Acceptance Criteria**: Complete understanding of frontend directory structure documented

### Task 0.3: Identify Current Backend Endpoints
- **Description**: Map existing backend API endpoints to understand integration points
- **Files**: backend/**/*
- **Dependencies**: None
- **Acceptance Criteria**: Complete mapping of backend API endpoints documented

## Phase 1: Preparation & Environment Setup

### Task 1.1: Create Frontend Environment Files
- **Description**: Set up environment configuration files for frontend with required variables
- **Files**: frontend/.env.local
- **Dependencies**: None
- **Acceptance Criteria**:
  - File contains NEXT_PUBLIC_API_URL=http://localhost:8000
  - File contains NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000/api/auth
  - File is properly configured for local development

### Task 1.2: Create Backend Environment Files
- **Description**: Set up environment configuration files for backend with required variables
- **Files**: backend/.env
- **Dependencies**: None
- **Acceptance Criteria**:
  - File contains JWKS_URL=http://localhost:3000/api/auth/jwks
  - File contains JWT_ISSUER=http://localhost:3000
  - File contains JWT_AUDIENCE=http://localhost:3000
  - File contains DATABASE_URL for PostgreSQL connection

### Task 1.3: Install Better Auth Dependencies in Frontend
- **Description**: Add Better Auth and related packages to the frontend project
- **Files**: frontend/package.json, frontend/package-lock.json
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - @better-auth/react and @better-auth/client packages are installed
  - JWT plugin dependencies are installed if needed

### Task 1.4: Verify CORS Configuration in Backend
- **Description**: Check and configure CORS settings to allow frontend origin
- **Files**: backend/main.py (or equivalent entry point)
- **Dependencies**: Task 1.2
- **Acceptance Criteria**:
  - CORS middleware allows requests from localhost:3000
  - Credentials are properly allowed for authentication
  - Authorization header is permitted

## Phase 2: Better Auth + JWT Configuration in Frontend

### Task 2.1: Create Better Auth Provider Component
- **Description**: Set up the Better Auth provider wrapper for the Next.js application
- **Files**: frontend/src/providers/AuthProvider.jsx (or .tsx)
- **Dependencies**: Task 1.3
- **Acceptance Criteria**:
  - AuthProvider component is created with proper initialization
  - Better Auth client is configured with JWT plugin
  - Provider is properly exported for use in app layout

### Task 2.2: Initialize Better Auth in Root Layout
- **Description**: Wrap the application root with Better Auth provider
- **Files**: frontend/src/app/layout.jsx (or .tsx)
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Root layout imports and uses AuthProvider
  - Better Auth context is available throughout the application

### Task 2.3: Configure Better Auth Client Instance
- **Description**: Create a centralized Better Auth client instance for token access
- **Files**: frontend/src/lib/auth-client.js (or .ts)
- **Dependencies**: Task 1.3
- **Acceptance Criteria**:
  - authClient is properly initialized with correct configuration
  - JWT plugin is enabled and configured
  - Client can access tokens using authClient.token()

### Task 2.4: Create Authentication Hook
- **Description**: Develop a custom hook to access authentication state consistently
- **Files**: frontend/src/hooks/useAuth.js (or .ts)
- **Dependencies**: Task 2.3
- **Acceptance Criteria**:
  - Hook provides user data, loading state, and authentication functions
  - Hook can retrieve user ID from session or token
  - Hook handles authentication state changes properly

## Phase 3: API Client Creation & Token Interceptor

### Task 3.1: Create Centralized API Client Module
- **Description**: Build a centralized API client that handles all backend communications
- **Files**: frontend/src/lib/api-client.js (or .ts)
- **Dependencies**: Task 2.3
- **Acceptance Criteria**:
  - API client is created using fetch or axios
  - Client uses NEXT_PUBLIC_API_URL from environment variables
  - Basic request/response handling is implemented

### Task 3.2: Implement JWT Token Interceptor
- **Description**: Add automatic JWT token attachment to all authenticated requests
- **Files**: frontend/src/lib/api-client.js (or .ts)
- **Dependencies**: Task 3.1, Task 2.3
- **Acceptance Criteria**:
  - Authorization header with Bearer token is automatically added to requests
  - Token is retrieved dynamically using authClient.token()
  - Requests without authentication don't include the header

### Task 3.3: Add Token Refresh Logic
- **Description**: Implement token refresh handling when tokens expire
- **Files**: frontend/src/lib/api-client.js (or .ts)
- **Dependencies**: Task 3.2
- **Acceptance Criteria**:
  - API client detects expired tokens and refreshes them automatically
  - Failed requests due to expired tokens are retried after refresh
  - Proper error handling for refresh failures is implemented

### Task 3.4: Create API Service Functions
- **Description**: Develop specific service functions for task operations
- **Files**: frontend/src/services/task-service.js (or .ts)
- **Dependencies**: Task 3.2
- **Acceptance Criteria**:
  - Functions exist for getAllTasks(userId), createTask(userId, data), updateTask(userId, taskId, data), deleteTask(userId, taskId), toggleComplete(userId, taskId)
  - All functions use the centralized API client
  - Proper error handling is implemented

## Phase 4: User/Session & Protected Routes Handling

### Task 4.1: Create Protected Route Component
- **Description**: Build a component that restricts access based on authentication status
- **Files**: frontend/src/components/ProtectedRoute.jsx (or .tsx)
- **Dependencies**: Task 2.4
- **Acceptance Criteria**:
  - Component checks authentication status before rendering children
  - Unauthenticated users are redirected to login page
  - Loading state is handled while checking authentication

### Task 4.2: Implement User ID Extraction
- **Description**: Create logic to extract user ID from session or token for API paths
- **Files**: frontend/src/hooks/useUserId.js (or .ts)
- **Dependencies**: Task 2.4
- **Acceptance Criteria**:
  - Hook can reliably extract user ID from session or JWT payload
  - Fallback mechanisms are in place for different token structures
  - Error handling for missing user ID is implemented

### Task 4.3: Update Task Pages to Use Authentication
- **Description**: Modify existing task pages to use authenticated user ID
- **Files**: frontend/src/app/tasks/page.jsx (or .tsx), and other task-related pages
- **Dependencies**: Task 4.2, Task 3.4
- **Acceptance Criteria**:
  - Task pages use authenticated user ID in API calls
  - Pages are wrapped with ProtectedRoute component
  - User-specific task data is properly loaded and displayed

### Task 4.4: Create Login Redirect Logic
- **Description**: Implement automatic redirection to login when authentication fails
- **Files**: frontend/src/middleware.js (or equivalent auth handling)
- **Dependencies**: Task 4.1
- **Acceptance Criteria**:
  - Middleware or auth handler redirects unauthenticated users to login
  - Destination URL is preserved for redirect after login
  - Protected routes properly enforce authentication

## Phase 5: Backend CORS & Env Verification

### Task 5.1: Verify Existing CORS Configuration
- **Description**: Check current CORS settings and ensure they support the frontend origin
- **Files**: backend/main.py
- **Dependencies**: Task 1.4
- **Acceptance Criteria**:
  - CORS settings allow requests from frontend origin
  - All necessary headers including Authorization are permitted
  - Credentials are properly configured for cross-origin requests

### Task 5.2: Verify JWT Verification Implementation
- **Description**: Confirm backend JWT verification works with Better Auth's JWKS
- **Files**: backend/auth/jwt.py (or equivalent auth module)
- **Dependencies**: Task 1.2
- **Acceptance Criteria**:
  - Backend can successfully fetch and validate JWTs from Better Auth's JWKS
  - JWT signature verification works with RS256 algorithm
  - Token claims (issuer, audience, expiration) are properly validated

### Task 5.3: Test User ID Extraction from JWT
- **Description**: Verify that backend correctly extracts user ID from JWT payload
- **Files**: backend/auth/jwt.py, backend/api/tasks.py (or equivalent)
- **Dependencies**: Task 5.2
- **Acceptance Criteria**:
  - User ID is correctly extracted from JWT subject claim
  - Extracted user ID matches the one in API path for ownership validation
  - Proper error handling for malformed tokens is in place

## Phase 6: Connection Flow Implementation

### Task 6.1: Integrate API Client in Task Components
- **Description**: Replace existing API calls with the new authenticated API client
- **Files**: frontend/src/components/TaskList.jsx, frontend/src/components/TaskForm.jsx, and other task components
- **Dependencies**: Task 3.4, Task 4.3
- **Acceptance Criteria**:
  - All task operations (CRUD + toggle complete) use the new API client
  - User ID is properly passed from authenticated session
  - API responses are handled correctly in UI components

### Task 6.2: Test Task Creation Flow
- **Description**: Verify the complete task creation flow with authentication
- **Files**: frontend/src/components/TaskForm.jsx, frontend/src/services/task-service.js
- **Dependencies**: Task 6.1
- **Acceptance Criteria**:
  - Authenticated user can create tasks successfully
  - Created tasks are associated with the correct user ID
  - Error handling works properly for failed creations

### Task 6.3: Test Task Retrieval Flow
- **Description**: Verify the complete task retrieval flow with authentication
- **Files**: frontend/src/components/TaskList.jsx, frontend/src/services/task-service.js
- **Dependencies**: Task 6.1
- **Acceptance Criteria**:
  - Authenticated user can retrieve their own tasks
  - User can only see tasks associated with their user ID
  - Loading and error states are properly handled

### Task 6.4: Test Task Update and Delete Flows
- **Description**: Verify the complete task update and delete flows with authentication
- **Files**: frontend/src/components/TaskItem.jsx, frontend/src/services/task-service.js
- **Dependencies**: Task 6.1
- **Acceptance Criteria**:
  - Authenticated user can update and delete their own tasks
  - Operations fail appropriately for tasks owned by other users
  - Success and error feedback is properly displayed

## Phase 7: Error Handling & UX Feedback

### Task 7.1: Implement 401 Unauthorized Handling
- **Description**: Create proper handling for 401 responses leading to login redirects
- **Files**: frontend/src/lib/api-client.js, frontend/src/components/ErrorBoundary.jsx (or equivalent)
- **Dependencies**: Task 3.3
- **Acceptance Criteria**:
  - 401 responses trigger automatic redirect to login page
  - User-friendly message is displayed during redirect
  - Original destination is preserved for post-login redirect

### Task 7.2: Implement 403 Forbidden Handling
- **Description**: Create proper handling for 403 responses showing permission errors
- **Files**: frontend/src/lib/api-client.js, frontend/src/components/ErrorMessage.jsx
- **Dependencies**: Task 7.1
- **Acceptance Criteria**:
  - 403 responses show "You don't have permission" message
  - User remains on current page with error notification
  - Appropriate UI feedback is provided to user

### Task 7.3: Implement 404 Not Found Handling
- **Description**: Create proper handling for 404 responses showing resource not found
- **Files**: frontend/src/lib/api-client.js, frontend/src/components/NotFound.jsx
- **Dependencies**: Task 7.2
- **Acceptance Criteria**:
  - 404 responses show "Resource not found" message
  - Graceful degradation is provided for missing resources
  - User is informed appropriately without system exposure

### Task 7.4: Add Toast Notifications for Auth Events
- **Description**: Implement toast notifications for authentication-related events
- **Files**: frontend/src/components/Toast.jsx, frontend/src/providers/ToastProvider.jsx
- **Dependencies**: Task 7.3
- **Acceptance Criteria**:
  - Success notifications appear for login/logout events
  - Error notifications appear for authentication failures
  - Consistent UI/UX for all auth-related feedback

## Phase 8: Final Testing & Validation

### Task 8.1: End-to-End Authentication Flow Test
- **Description**: Test the complete authentication flow from login to task operations
- **Files**: All frontend and backend files
- **Dependencies**: All previous tasks
- **Acceptance Criteria**:
  - User can successfully log in via Better Auth
  - JWT token is properly issued and stored
  - All task operations work with authenticated user context

### Task 8.2: Cross-Origin Request Test
- **Description**: Test that frontend can successfully make requests to backend
- **Files**: All frontend API client files
- **Dependencies**: Task 8.1
- **Acceptance Criteria**:
  - All API requests from frontend reach backend successfully
  - CORS headers are properly handled
  - Authentication tokens are transmitted correctly

### Task 8.3: Security Boundary Test
- **Description**: Test that users cannot access other users' data
- **Files**: backend/api/tasks.py, frontend services
- **Dependencies**: Task 8.2
- **Acceptance Criteria**:
  - Users can only access tasks associated with their user ID
  - Attempts to access other users' data result in 403 errors
  - Ownership validation works correctly on backend

### Task 8.4: Error Scenario Testing
- **Description**: Test all error handling scenarios comprehensively
- **Files**: All error handling components and services
- **Dependencies**: Task 8.3
- **Acceptance Criteria**:
  - 401, 403, and 404 scenarios all handled correctly
  - Token expiration and refresh scenarios work properly
  - Network errors are handled gracefully with appropriate UX

### Task 8.5: Integration Test Checklist
- **Description**: Execute comprehensive checklist to verify all requirements are met
- **Files**: All project files
- **Dependencies**: All previous tasks
- **Acceptance Criteria**:
  - Better Auth is properly integrated with JWT plugin
  - API client automatically attaches JWT tokens to requests
  - User ID is properly extracted and used in API paths
  - All error scenarios (401, 403, 404) are handled correctly
  - Environment variables are properly configured on both sides
  - CORS is configured correctly for frontend-backend communication
  - All testing scenarios from spec are verified working