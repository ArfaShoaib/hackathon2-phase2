---
id: 2
title: Todo Backend Spec
stage: spec
date: 2026-01-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-backend
branch: 001-glass-todo-app
user: user
command: /sp.specify
labels: [specification, backend, todo-app, fastapi]
links:
  spec: specs/002-todo-backend/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-todo-backend/spec.md
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

Begin writing the full specification now. dont make useless files named tmpclaude-3e49-cwd in roort folder and in any folder
```

## Response snapshot

Created a comprehensive backend specification document for the Todo Full-Stack Multi-User Web Application. The specification includes:

- Project Overview: Defines the scope of the secure Python FastAPI backend for the multi-user Todo application
- Development Workflow: Details the exact sequence for project setup with uv package manager
- Technology Stack & Installation Steps: Lists all required dependencies and exact uv commands
- Security Requirements: Emphasizes bcrypt password hashing, JWT verification, and ownership enforcement
- Database Models: Specifies User and Task models with all required fields
- Authentication & JWT Rules: Details token flow and authorization enforcement
- Detailed API Endpoints: Provides comprehensive documentation for all endpoints with request/response examples
- Folder & File Structure: Specifies the exact project structure to follow
- Environment Variables: Lists all required environment variables
- Security & Best Practices Checklist: Ensures all security measures are implemented

The specification was created in the dedicated backend specs folder (specs/002-todo-backend/spec.md) to separate it from frontend specifications.

## Outcome

- ✅ Impact: Created comprehensive backend specification for todo application with proper separation from frontend specs
- 🧪 Tests: None required for specification document
- 📁 Files: specs/002-todo-backend/spec.md created
- 🔁 Next prompts: /sp.plan to create implementation plan for backend
- 🧠 Reflection: Specification covers all required aspects of backend development with security as priority

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin backend implementation planning