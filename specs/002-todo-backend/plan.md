# Todo Full-Stack Multi-User Web Application - Backend Development Plan

## Phase 1: Project Initialization & Folder Setup

### 1. Create Backend Directory
- **What**: Create the main backend directory
- **File/Folder**: Create `backend/` directory at project root
- **Dependencies**: None
- **Acceptance Criteria**: `backend/` directory exists and is empty

### 2. Create Project Folder Structure
- **What**: Create all required subdirectories as specified
- **File/Folder**: Create the following directory structure in backend/:
  - dependencies/
  - models/
  - routers/
  - schemas/
  - utils/
- **Dependencies**: Task 1 (backend directory exists)
- **Acceptance Criteria**: All subdirectories exist with correct names

## Phase 2: Environment & Dependencies

### 3. Initialize Project with UV
- **What**: Initialize the Python project using uv with Python 3.12
- **File/Folder**: Run `uv init --name todo-backend --python 3.12` in backend/ directory
- **Dependencies**: Task 1 and 2 (directory structure exists)
- **Acceptance Criteria**: pyproject.toml and uv.lock files are created in backend/

### 4. Create Virtual Environment
- **What**: Create the virtual environment for the project
- **File/Folder**: Run `uv venv` in backend/ directory
- **Dependencies**: Task 3 (project initialized)
- **Acceptance Criteria**: .venv/ directory is created in backend/

### 5. Install Dependencies
- **What**: Install all required dependencies using uv
- **File/Folder**: Run `uv add fastapi sqlmodel uvicorn python-jose[cryptography] httpx python-dotenv passlib[bcrypt] psycopg2-binary` in backend/
- **Dependencies**: Task 4 (virtual environment created)
- **Acceptance Criteria**: All dependencies are added to pyproject.toml and installed in virtual environment

### 6. Sync Dependencies
- **What**: Sync the installed dependencies
- **File/Folder**: Run `uv sync` in backend/ directory
- **Dependencies**: Task 5 (dependencies added)
- **Acceptance Criteria**: All dependencies are properly synced and locked in uv.lock

### 7. Create Environment Variables Template
- **What**: Create the .env.example file with all required environment variables
- **File/Folder**: Create `backend/.env.example` with:
  ```
  DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
  JWKS_URL=https://your-better-auth-domain/api/auth/jwks
  JWT_ISSUER=your-issuer
  JWT_AUDIENCE=your-audience
  ```
- **Dependencies**: Task 1 (backend directory exists)
- **Acceptance Criteria**: .env.example file exists with all required environment variables

## Phase 3: Database & Models

### 8. Create User Model
- **What**: Implement the User model with all required fields
- **File/Folder**: Create `backend/models/user.py` with User SQLModel containing:
  - id (primary key, auto-generated)
  - email (unique string)
  - password_hash (string)
  - created_at (datetime)
- **Dependencies**: Task 2 (models directory exists)
- **Acceptance Criteria**: User model is properly defined with all required fields and relationships

### 9. Create Task Model
- **What**: Implement the Task model with all required fields and user relationship
- **File/Folder**: Create `backend/models/task.py` with Task SQLModel containing:
  - id (primary key, auto-generated)
  - user_id (foreign key referencing User.id)
  - title (string)
  - description (optional string)
  - completed (boolean, default False)
  - created_at (datetime)
  - updated_at (datetime)
- **Dependencies**: Task 8 (User model exists)
- **Acceptance Criteria**: Task model is properly defined with all required fields and user relationship

### 10. Create Database Dependency
- **What**: Implement database session management
- **File/Folder**: Create `backend/dependencies/database.py` with:
  - Database engine creation
  - Session dependency function
  - Database URL configuration from environment
- **Dependencies**: Task 2 (dependencies directory exists), Task 7 (environment variables exist)
- **Acceptance Criteria**: Database dependency module exists with proper session management

## Phase 4: Security Utilities (Password Hashing)

### 11. Create Security Utilities Module
- **What**: Implement password hashing utilities using bcrypt
- **File/Folder**: Create `backend/utils/security.py` with:
  - bcrypt CryptContext configured with bcrypt scheme and 12 rounds
  - Password hashing function
  - Password verification function
  - Password validation functions
- **Dependencies**: Task 2 (utils directory exists)
- **Acceptance Criteria**: Security utilities module exists with proper bcrypt implementation

## Phase 5: Authentication & JWT Verification

### 12. Create JWT Authentication Dependency
- **What**: Implement JWT token verification using Better Auth JWKS
- **File/Folder**: Create `backend/dependencies/auth.py` with:
  - HTTPX client for fetching JWKS
  - JWT token verification function
  - get_current_user dependency function
  - Token validation with issuer and audience checks
- **Dependencies**: Task 2 (dependencies directory exists), Task 7 (environment variables exist), Task 8 (User model exists)
- **Acceptance Criteria**: Auth dependency module exists with proper JWT verification

## Phase 6: Auth Router (Signup)

### 13. Create Auth Router Module
- **What**: Create the basic router structure for authentication endpoints
- **File/Folder**: Create `backend/routers/auth.py` with:
  - FastAPI router instance
  - Import statements for required dependencies
- **Dependencies**: Task 2 (routers directory exists)
- **Acceptance Criteria**: Auth router module exists with basic structure

### 14. Create Pydantic Schemas for Auth
- **What**: Define request/response models for authentication
- **File/Folder**: Create `backend/schemas/__init__.py` and `backend/schemas/auth.py` with:
  - UserCreate schema for signup
  - UserResponse schema for user data
- **Dependencies**: Task 2 (schemas directory exists)
- **Acceptance Criteria**: Auth schemas exist with proper field definitions

### 15. Implement Signup Endpoint
- **What**: Create the POST /api/auth/signup endpoint
- **File/Folder**: Update `backend/routers/auth.py` to include:
  - POST /api/auth/signup endpoint
  - Email validation
  - Password hashing using security utils
  - User creation in database
  - Proper response codes (201, 400, 409)
- **Dependencies**: Task 13 (auth router exists), Task 14 (auth schemas exist), Task 8 (User model), Task 11 (security utils)
- **Acceptance Criteria**: Signup endpoint works correctly with proper validation and hashing

## Phase 7: Task Router & Endpoints

### 16. Create Task Schemas
- **What**: Define request/response models for task operations
- **File/Folder**: Update `backend/schemas/task.py` with:
  - TaskCreate schema
  - TaskUpdate schema
  - TaskResponse schema
  - TaskPatchComplete schema
- **Dependencies**: Task 2 (schemas directory exists)
- **Acceptance Criteria**: Task schemas exist with proper field definitions

### 17. Create Task Router Module
- **What**: Create the basic router structure for task endpoints
- **File/Folder**: Create `backend/routers/tasks.py` with:
  - FastAPI router instance
  - Import statements for required dependencies
- **Dependencies**: Task 2 (routers directory exists)
- **Acceptance Criteria**: Task router module exists with basic structure

### 18. Implement GET /api/{user_id}/tasks Endpoint
- **What**: Create the endpoint to retrieve all tasks for a specific user
- **File/Folder**: Update `backend/routers/tasks.py` to include:
  - GET /api/{user_id}/tasks endpoint
  - Authentication dependency
  - User ownership validation
  - Return 404 if user doesn't exist or isn't authenticated user
- **Dependencies**: Task 17 (task router exists), Task 9 (Task model), Task 12 (auth dependency)
- **Acceptance Criteria**: GET tasks endpoint works with proper authentication and ownership checks

### 19. Implement POST /api/{user_id}/tasks Endpoint
- **What**: Create the endpoint to create a new task for a specific user
- **File/Folder**: Update `backend/routers/tasks.py` to include:
  - POST /api/{user_id}/tasks endpoint
  - Authentication dependency
  - User ownership validation
  - Task creation in database
  - Proper response codes (201, 400, 401, 403, 404)
- **Dependencies**: Task 17 (task router exists), Task 9 (Task model), Task 16 (task schemas), Task 12 (auth dependency)
- **Acceptance Criteria**: POST task endpoint works with proper authentication and ownership checks

### 20. Implement GET /api/{user_id}/tasks/{task_id} Endpoint
- **What**: Create the endpoint to retrieve a specific task for a specific user
- **File/Folder**: Update `backend/routers/tasks.py` to include:
  - GET /api/{user_id}/tasks/{task_id} endpoint
  - Authentication dependency
  - User ownership validation
  - Return 404 if task doesn't exist or isn't owned by user
- **Dependencies**: Task 17 (task router exists), Task 9 (Task model), Task 12 (auth dependency)
- **Acceptance Criteria**: GET specific task endpoint works with proper authentication and ownership checks

### 21. Implement PUT /api/{user_id}/tasks/{task_id} Endpoint
- **What**: Create the endpoint to update an entire task for a specific user
- **File/Folder**: Update `backend/routers/tasks.py` to include:
  - PUT /api/{user_id}/tasks/{task_id} endpoint
  - Authentication dependency
  - User ownership validation
  - Complete task update in database
  - Proper response codes (200, 400, 401, 403, 404)
- **Dependencies**: Task 17 (task router exists), Task 9 (Task model), Task 16 (task schemas), Task 12 (auth dependency)
- **Acceptance Criteria**: PUT task endpoint works with proper authentication and ownership checks

### 22. Implement PATCH /api/{user_id}/tasks/{task_id} Endpoint
- **What**: Create the endpoint to partially update a task for a specific user
- **File/Folder**: Update `backend/routers/tasks.py` to include:
  - PATCH /api/{user_id}/tasks/{task_id} endpoint
  - Authentication dependency
  - User ownership validation
  - Partial task update in database
  - Proper response codes (200, 400, 401, 403, 404)
- **Dependencies**: Task 17 (task router exists), Task 9 (Task model), Task 16 (task schemas), Task 12 (auth dependency)
- **Acceptance Criteria**: PATCH task endpoint works with proper authentication and ownership checks

### 23. Implement PATCH /api/{user_id}/tasks/{task_id}/complete Endpoint
- **What**: Create the endpoint to toggle completion status of a task
- **File/Folder**: Update `backend/routers/tasks.py` to include:
  - PATCH /api/{user_id}/tasks/{task_id}/complete endpoint
  - Authentication dependency
  - User ownership validation
  - Toggle completion status in database
  - Proper response codes (200, 400, 401, 403, 404)
- **Dependencies**: Task 17 (task router exists), Task 9 (Task model), Task 16 (task schemas), Task 12 (auth dependency)
- **Acceptance Criteria**: PATCH complete endpoint works with proper authentication and ownership checks

### 24. Implement DELETE /api/{user_id}/tasks/{task_id} Endpoint
- **What**: Create the endpoint to delete a specific task for a specific user
- **File/Folder**: Update `backend/routers/tasks.py` to include:
  - DELETE /api/{user_id}/tasks/{task_id} endpoint
  - Authentication dependency
  - User ownership validation
  - Task deletion from database
  - Proper response codes (204, 401, 403, 404)
- **Dependencies**: Task 17 (task router exists), Task 9 (Task model), Task 12 (auth dependency)
- **Acceptance Criteria**: DELETE task endpoint works with proper authentication and ownership checks

## Phase 8: Main App Wiring + CORS + Startup

### 25. Create Main Application Entry Point
- **What**: Create the main FastAPI application with all routers mounted
- **File/Folder**: Create `backend/main.py` with:
  - FastAPI app instance
  - CORS middleware configuration for Next.js frontend
  - Mount auth and tasks routers
  - Database initialization on startup
- **Dependencies**: Task 2 (all directories exist), Task 13 (auth router), Task 17 (task router), Task 10 (database dependency)
- **Acceptance Criteria**: Main application file exists with proper configuration

### 26. Configure CORS Middleware
- **What**: Add CORS configuration to allow requests from Next.js frontend
- **File/Folder**: Update `backend/main.py` to include:
  - CORS middleware with appropriate origins
  - Allow credentials, methods, and headers as needed
- **Dependencies**: Task 25 (main file exists)
- **Acceptance Criteria**: CORS is properly configured for frontend integration

## Phase 9: Documentation & Final Checks

### 27. Create README Documentation
- **What**: Create comprehensive README with setup and run instructions
- **File/Folder**: Create `backend/README.md` with:
  - Project overview
  - Prerequisites
  - Installation steps
  - Environment setup
  - Running instructions
  - API endpoints documentation
- **Dependencies**: All previous tasks completed
- **Acceptance Criteria**: README file exists with complete setup and usage instructions

### 28. Create Smoke Test Checklist
- **What**: Develop a checklist for basic functionality testing
- **File/Folder**: Add section to `backend/README.md` with:
  - Test user registration flow
  - Test JWT authentication
  - Test all task CRUD operations
  - Test ownership enforcement
  - Verify error responses
- **Dependencies**: Task 27 (README exists), all endpoint implementations completed
- **Acceptance Criteria**: Comprehensive testing checklist exists for verifying functionality

### 29. Final Integration Test
- **What**: Perform end-to-end testing of all functionality
- **File/Folder**: Execute tests manually or with test runner
- **Dependencies**: All previous tasks completed
- **Acceptance Criteria**: All endpoints work correctly with proper authentication, validation, and error handling

### 30. Code Review and Cleanup
- **What**: Review all code for consistency, security, and best practices
- **File/Folder**: Review all created files for:
  - Proper error handling
  - Security considerations
  - Code consistency
  - Documentation completeness
- **Dependencies**: All previous tasks completed
- **Acceptance Criteria**: Code is clean, secure, well-documented, and follows best practices