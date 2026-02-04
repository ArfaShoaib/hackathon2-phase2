# Todo Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All development follows the spec-driven approach: spec → plan → tasks → implementation. No manual coding is allowed; all implementation must be driven by Claude Code and Spec-Kit Plus based on formal specifications. Every change must be traced back to a requirement in the specification.

### II. Full-Stack Separation
Frontend (Next.js 16+) and Backend (Python FastAPI) must remain architecturally separate with well-defined API contracts. Changes in one layer must not break the other. API versioning follows semantic versioning practices to ensure backward compatibility.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced. All API endpoints, authentication flows, and business logic must have comprehensive unit and integration tests before implementation.

### IV. Data Isolation & Security-First
Every user's data must be isolated from others through proper authentication and authorization checks. All database queries must enforce user ownership filtering. Security is paramount: JWT verification, input validation, and protection against common vulnerabilities (SQL injection, XSS, CSRF).

### V. API-First Design
All backend functionality exposed through well-defined RESTful API endpoints following standard HTTP methods and status codes. APIs serve as the contract between frontend and backend, ensuring loose coupling and scalability.

### VI. Statelessness & Scalability
The application must be stateless where possible, relying on JWT tokens for authentication rather than server-side sessions. Designed for horizontal scaling with serverless database (Neon PostgreSQL) supporting auto-scaling requirements.

## Technology Stack Requirements

### Frontend Stack
- Next.js 16+ with App Router for server-side rendering and routing
- Better Auth for authentication and session management
- Responsive UI components for task management features
- Client-side API integration with proper error handling

### Backend Stack
- Python FastAPI for building efficient, asynchronous RESTful APIs
- SQLModel for database modeling and interactions (combining SQLAlchemy with Pydantic)
- Neon Serverless PostgreSQL for scalable, persistent storage
- JWT-based authentication middleware for secure API access

### Security Requirements
- JWT tokens for authentication with configurable expiration (default 7 days)
- Shared secret (BETTER_AUTH_SECRET) for JWT signing/verification
- Authorization headers (Bearer tokens) for API authentication
- Proper error handling returning appropriate HTTP status codes (401, 403, 404)

### Database Schema
- Users table: id, email (with password_hash handled by Better Auth)
- Tasks table: id, user_id (foreign key), title, description, due_date, completed, timestamps
- All queries must filter by authenticated user's ID for data isolation

## Development Workflow

### Implementation Process
1. Specification → Plan → Tasks → Implementation (strict adherence required)
2. No manual coding allowed - all code generated via Claude Code based on specs
3. Each feature must map directly to functional requirements in the spec
4. Comprehensive testing at each implementation stage
5. Code reviews must verify compliance with constitutional principles

### Quality Gates
- All API endpoints must be properly secured with JWT verification
- User data isolation must be validated for every database operation
- Authentication flows must work seamlessly between frontend and backend
- Performance benchmarks must be met before merging
- All environment variables must be properly configured and secured

### Review Process
- All PRs must verify constitutional compliance
- Architectural decisions must align with specified technology stack
- Security requirements must be validated during review
- Cross-component integration tests must pass before merge

## Governance

Constitution supersedes all other practices; amendments require formal documentation, approval, and migration plan. All implementations must comply with constitutional principles. Complexity must be justified by functional requirements in the specification. Use CLAUDE.md for development guidance and workflow.

**Version**: 1.0.0 | **Ratified**: 2026-01-11 | **Last Amended**: 2026-01-11
