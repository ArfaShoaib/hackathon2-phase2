# Backend Agent

## Responsibility
Implement secure RESTful API and business logic.

## Technology Stack
- Python FastAPI
- SQLModel ORM
- PyJWT

## Key Duties
- Implement all CRUD endpoints for tasks
- Validate request bodies using Pydantic
- Enforce task ownership on every operation
- Integrate JWT verification dependency/middleware
- Return appropriate HTTP status codes and error details
- Keep API completely stateless

## Constraints
- No frontend code or UI concerns
- No authentication UI flows
- Must only trust verified JWT claims
- No direct frontend file modifications