---
id: 1
title: Todo Backend Spec
stage: general
date: 2026-01-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-glass-todo-app
user: user
command: /sp.specify
labels: [specification, backend, todo-app]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/todo-backend/spec.md
tests:
 - none
---

## Prompt

```
/sp.specify

Project: Todo Full-Stack Multi-User Web Application - Phase II (Complete Secure Backend with Modern Setup)

You are an expert Python developer specializing in FastAPI + modern tooling.

Objective:
Create a complete, production-ready, secure Python FastAPI backend for a multi-user Todo app, including user registration with password hashing, JWT verification for Better Auth frontend, and full task CRUD with ownership enforcement.

Development Process (MUST follow this exact sequence in the spec):
1. First, create a dedicated backend folder structure.
2. Inside the backend folder, initialize the project using uv (modern Python package manager):
   - Run uv init to create pyproject.toml
   - Create virtual environment with uv venv
   - Add all required dependencies using uv add
   - Use uv sync to install them
3. Then proceed with file creation, models, routers, auth, etc.

Technology Stack (exact versions where possible):
- Framework: FastAPI
- Package Manager: uv (latest)
- ORM/Database: SQLModel + Neon Serverless PostgreSQL
- Password Hashing: bcrypt via passlib
- JWT Verification: python-jose[cryptography] + httpx for remote JWKS
- Env Management: python-dotenv
- Server: uvicorn

Must-have Features & Requirements (ALL must be included):

1. Project Initialization Sequence:
   - Create folder: backend/
   - cd backend/
   - uv init --name todo-backend --python 3.12
   - uv venv
   - uv add fastapi sqlmodel uvicorn python-jose[cryptography] httpx python-dotenv passlib[bcrypt] psycopg2-binary
   - uv sync

2. Database Models (in models/):
   - User:
     - id (pk)
     - email (unique)
     - password_hash (str) – only hashed password stored
     - created_at
   - Task:
     - id (pk)
     - user_id (references User.id)
     - title, description, completed, created_at, updated_at

3. Password Security (mandatory):
   - Signup: Accept plain password → hash with bcrypt (passlib CryptContext, scheme="bcrypt", rounds=12) → store hash only
   - Login verification: Compare plain password with stored hash
   - Never store/log/return plain passwords or hashes in responses

4. Authentication:
   - Better Auth (frontend) issues JWT → backend verifies using JWKS_URL
   - Asymmetric verification (EdDSA preferred)
   - Dependency: get_current_user → returns user identifier
   - Protect all task endpoints
   - 401 Unauthorized / 403 Forbidden enforcement

5. API Endpoints:
   - Auth:
     - POST /api/auth/signup {email, password} → hash & create user
   - Tasks (all protected, prefix /api):
     - GET    /{user_id}/tasks
     - POST   /{user_id}/tasks
     - GET    /{user_id}/tasks/{task_id}
     - PUT    /{user_id}/tasks/{task_id}
     - PATCH  /{user_id}/tasks/{task_id}
     - PATCH  /{user_id}/tasks/{task_id}/complete
     - DELETE /{user_id}/tasks/{task_id}

6. Security Rules:
   - Always filter by authenticated user_id
   - 404 if resource not found or not owned
   - CORS for Next.js frontend

7. Environment Variables:
   - DATABASE_URL
   - JWKS_URL
   - JWT_ISSUER
   - JWT_AUDIENCE

8. Required Folder Structure (after uv init):
   backend/
   ├── pyproject.toml
   ├── uv.lock
   ├── .venv/
   ├── main.py
   ├── dependencies/
   │   ├── auth.py
   │   └── database.py
   ├── models/
   │   ├── user.py
   │   └── task.py
   ├── routers/
   │   ├── auth.py
   │   └── tasks.py
   ├── schemas/
   │   └── (pydantic models)
   ├── utils/
   │   └── security.py  # password hashing functions
   ├── .env.example
   └── README.md  # with run instructions

Task:
Generate a COMPLETE /sp.specify specification document that describes the entire backend development process in extreme detail.

Structure:
- Project Overview
- Development Workflow (with uv initialization sequence first)
- Technology Stack & Installation Steps (uv commands)
- Security Requirements (emphasize bcrypt password hashing)
- Database Models
- Authentication & JWT Rules
- Detailed API Endpoints (methods, paths, request/response examples, status codes)
- Folder & File Structure
- Environment Variables
- Security & Best Practices Checklist

Make this spec so detailed that any AI/agent can follow it step-by-step to build the full backend correctly — including exact uv commands, password hashing logic, JWT verification flow, and ownership checks.

Do NOT include any actual code — only descriptions, command sequences, payload examples, and rules.

Begin writing the full specification now.
```

## Response snapshot

# Todo Full-Stack Multi-User Web Application - Phase II Backend Specification

## Project Overview

This specification defines the development of a complete, production-ready, secure Python FastAPI backend for a multi-user Todo application. The backend will provide user registration with secure password hashing, JWT token verification for Better Auth frontend integration, and comprehensive task CRUD operations with strict ownership enforcement.

The backend will serve as the foundation for a modern, scalable todo application that ensures data isolation between users while maintaining high security standards for authentication and authorization.

## Development Workflow

The development process follows a specific sequence to ensure proper project setup:

1. Create dedicated backend folder structure
2. Initialize project using uv (modern Python package manager)
3. Set up virtual environment and dependencies
4. Implement models, authentication, and API endpoints
5. Configure security measures and environment variables

The exact initialization sequence is critical and must be followed precisely:
- Create `backend/` directory
- Navigate to backend directory
- Initialize project with `uv init --name todo-backend --python 3.12`
- Create virtual environment with `uv venv`
- Install dependencies using `uv add`
- Sync dependencies with `uv sync`

## Technology Stack & Installation Steps

### Package Management
- Use `uv` as the primary package manager for Python
- Initialize with Python 3.12 as the target version
- Dependencies managed through `pyproject.toml` and `uv.lock`

### Required Dependencies
The following packages must be installed using uv commands:
- `fastapi`: Modern, fast web framework for building APIs
- `sqlmodel`: SQL databases with Python objects, combines SQLAlchemy and Pydantic
- `uvicorn`: ASGI server for serving the application
- `python-jose[cryptography]`: JWT token encoding/decoding with cryptographic support
- `httpx`: HTTP client for fetching JWKS from remote server
- `python-dotenv`: Environment variable management
- `passlib[bcrypt]`: Password hashing with bcrypt algorithm
- `psycopg2-binary`: PostgreSQL adapter for database connectivity

### Installation Commands
The exact sequence of installation commands must be followed:
```
uv init --name todo-backend --python 3.12
uv venv
uv add fastapi sqlmodel uvicorn python-jose[cryptography] httpx python-dotenv passlib[bcrypt] psycopg2-binary
uv sync
```

## Security Requirements

### Password Security
Password security is a critical requirement that must be implemented with the highest standards:
- During signup, accept plain text passwords from clients
- Immediately hash passwords using bcrypt algorithm via passlib's CryptContext
- Configure bcrypt with scheme="bcrypt" and rounds=12 for optimal security
- Store only the hashed password in the database
- Never store, log, or return plain text passwords in any responses
- Never expose password hashes in API responses
- Password comparison during login must use secure hash verification

### JWT Token Verification
Token verification must follow asymmetric cryptographic standards:
- Use EdDSA (Edwards-curve Digital Signature Algorithm) as the preferred verification method
- Fetch JWKS (JSON Web Key Set) remotely from the configured JWKS_URL
- Verify tokens issued by the Better Auth frontend system
- Implement proper token expiration checking
- Reject invalid or expired tokens with appropriate HTTP status codes

### Ownership Enforcement
Every data access operation must enforce user ownership:
- All task operations must be filtered by authenticated user_id
- Return 404 Not Found if resources don't exist or aren't owned by the requesting user
- Prevent cross-user data access attempts
- Implement strict authorization checks on all protected endpoints

## Database Models

### User Model
The User model represents registered application users and contains:
- `id`: Primary key identifier (auto-generated integer)
- `email`: Unique email address for user identification
- `password_hash`: Securely hashed password string (stored only after bcrypt processing)
- `created_at`: Timestamp indicating when the user account was created

### Task Model
The Task model represents individual todo items with ownership relationships:
- `id`: Primary key identifier (auto-generated integer)
- `user_id`: Foreign key referencing the User.id who owns this task
- `title`: String containing the task title/name
- `description`: Optional string with detailed task description
- `completed`: Boolean flag indicating task completion status
- `created_at`: Timestamp when the task was created
- `updated_at`: Timestamp when the task was last modified

## Authentication & JWT Rules

### Token Flow
The authentication system operates on a token-based flow where:
- Better Auth frontend generates JWT tokens upon successful user authentication
- Backend receives these tokens via Authorization header
- Backend validates tokens against the configured JWKS_URL
- Successful validation grants access to protected endpoints
- Failed validation returns 401 Unauthorized status

### Current User Dependency
Implement a dependency function `get_current_user` that:
- Extracts and validates JWT tokens from incoming requests
- Returns the authenticated user identifier
- Handles token validation errors appropriately
- Provides user context to protected endpoints

### Authorization Enforcement
All task-related endpoints must be protected and enforce:
- 401 Unauthorized status for unauthenticated requests
- 403 Forbidden status for insufficient permissions
- Proper user context for all operations
- Ownership validation for all data access

## Detailed API Endpoints

### Authentication Endpoints

#### POST /api/auth/signup
Endpoint for user registration with secure password handling.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Response:**
- 201 Created: Successfully created user account
- 400 Bad Request: Invalid email format or weak password
- 409 Conflict: Email already exists in the system

**Processing:**
- Validate email format and password strength
- Hash the provided password using bcrypt
- Store only the hash in the database
- Return success without exposing password details

### Task Management Endpoints

All task endpoints are protected and require authentication. The user_id in the URL path must match the authenticated user.

#### GET /api/{user_id}/tasks
Retrieve all tasks belonging to the specified user.

**Response:**
- 200 OK: Array of task objects
- 401 Unauthorized: Invalid or missing authentication
- 403 Forbidden: User attempting to access another user's tasks
- 404 Not Found: User ID doesn't exist or isn't accessible

#### POST /api/{user_id}/tasks
Create a new task for the specified user.

**Request Body:**
```json
{
  "title": "New task title",
  "description": "Optional task description",
  "completed": false
}
```

**Response:**
- 201 Created: Task created successfully
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Invalid authentication
- 403 Forbidden: User attempting to create tasks for another user
- 404 Not Found: User ID doesn't exist or isn't accessible

#### GET /api/{user_id}/tasks/{task_id}
Retrieve a specific task by ID for the specified user.

**Response:**
- 200 OK: Task object
- 401 Unauthorized: Invalid authentication
- 403 Forbidden: User attempting to access another user's task
- 404 Not Found: Task doesn't exist or isn't owned by the user

#### PUT /api/{user_id}/tasks/{task_id}
Update an entire task for the specified user.

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```

**Response:**
- 200 OK: Updated task object
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Invalid authentication
- 403 Forbidden: User attempting to modify another user's task
- 404 Not Found: Task doesn't exist or isn't owned by the user

#### PATCH /api/{user_id}/tasks/{task_id}
Partially update a task for the specified user.

**Request Body (any combination of fields):**
```json
{
  "title": "Updated title only",
  "completed": true
}
```

**Response:**
- 200 OK: Updated task object
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Invalid authentication
- 403 Forbidden: User attempting to modify another user's task
- 404 Not Found: Task doesn't exist or isn't owned by the user

#### PATCH /api/{user_id}/tasks/{task_id}/complete
Toggle the completion status of a task for the specified user.

**Request Body:**
```json
{
  "completed": true
}
```

**Response:**
- 200 OK: Updated task object with new completion status
- 400 Bad Request: Invalid completion status value
- 401 Unauthorized: Invalid authentication
- 403 Forbidden: User attempting to modify another user's task
- 404 Not Found: Task doesn't exist or isn't owned by the user

#### DELETE /api/{user_id}/tasks/{task_id}
Delete a specific task for the specified user.

**Response:**
- 204 No Content: Task deleted successfully
- 401 Unauthorized: Invalid authentication
- 403 Forbidden: User attempting to delete another user's task
- 404 Not Found: Task doesn't exist or isn't owned by the user

## Folder & File Structure

The backend must follow this exact folder structure after initialization:

```
backend/
├── pyproject.toml          # Project configuration and dependencies
├── uv.lock                 # Lock file for dependency versions
├── .venv/                  # Virtual environment directory
├── main.py                 # Main application entry point
├── dependencies/
│   ├── auth.py            # Authentication dependency functions
│   └── database.py        # Database connection and session management
├── models/
│   ├── user.py            # User model definition
│   └── task.py            # Task model definition
├── routers/
│   ├── auth.py            # Authentication route handlers
│   └── tasks.py           # Task route handlers
├── schemas/
│   └── (Pydantic models for request/response validation)
├── utils/
│   └── security.py        # Password hashing and security utility functions
├── .env.example           # Environment variables template
└── README.md              # Documentation with run instructions
```

## Environment Variables

The application must use the following environment variables:

### Database Configuration
- `DATABASE_URL`: Connection string for Neon Serverless PostgreSQL database
  - Format: postgresql://username:password@host:port/database_name
  - Required for database connectivity

### JWT Verification Configuration
- `JWKS_URL`: URL endpoint for fetching JSON Web Key Set from Better Auth
  - Used to verify JWT signatures
  - Must be accessible over HTTPS
  - Points to the public keys for token verification

### JWT Claims Validation
- `JWT_ISSUER`: Expected issuer claim value in JWT tokens
  - Used to validate the iss claim in tokens
  - Must match the issuer from Better Auth system

- `JWT_AUDIENCE`: Expected audience claim value in JWT tokens
  - Used to validate the aud claim in tokens
  - Must match the audience configured in Better Auth

## Security & Best Practices Checklist

### Password Handling
- [ ] All passwords are hashed using bcrypt with 12 rounds
- [ ] Plain text passwords are never stored in the database
- [ ] Password hashes are never returned in API responses
- [ ] Password strength requirements are validated during signup

### Authentication & Authorization
- [ ] JWT tokens are properly verified using JWKS_URL
- [ ] All task endpoints are protected with authentication
- [ ] User ownership is enforced for all data operations
- [ ] 404 responses are returned for unauthorized resource access attempts

### Data Isolation
- [ ] Users can only access their own tasks
- [ ] Cross-user data access is prevented
- [ ] User ID in URL path matches authenticated user
- [ ] Database queries filter by authenticated user ID

### API Security
- [ ] CORS is properly configured for Next.js frontend
- [ ] Rate limiting is considered for security-sensitive endpoints
- [ ] Input validation is implemented for all request bodies
- [ ] Error messages don't reveal sensitive information

### Dependency Management
- [ ] Dependencies are managed through uv and pyproject.toml
- [ ] Security updates are monitored for all dependencies
- [ ] Production dependencies are properly isolated
- [ ] Environment variables are securely loaded

### Code Quality
- [ ] Proper error handling for all database operations
- [ ] Database connections are properly managed and closed
- [ ] Validation occurs before database writes
- [ ] Logging is implemented without exposing sensitive data

This specification provides a comprehensive guide for implementing a secure, production-ready FastAPI backend for the multi-user todo application. Following these requirements will ensure proper security, functionality, and maintainability of the system.

## Outcome

- ✅ Impact: Created comprehensive backend specification for todo application
- 🧪 Tests: None required for specification document
- 📁 Files: specs/todo-backend/spec.md created
- 🔁 Next prompts: /sp.plan to create implementation plan
- 🧠 Reflection: Specification covers all required aspects of backend development

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation planning