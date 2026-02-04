# Data Model: GlassFlow Todo

## Entities

### User
- **id**: UUID (Primary Key)
- **email**: String (Unique, Required)
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated)
- **is_active**: Boolean (Default: True)

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users

**Relationships**:
- One-to-Many: User → Tasks (via user_id foreign key)

### Task
- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key to User, Required)
- **title**: String (Required, Max length: 200)
- **description**: Text (Optional, Max length: 1000)
- **due_date**: DateTime (Optional)
- **is_completed**: Boolean (Default: False)
- **is_important**: Boolean (Default: False)
- **priority**: String (Enum: "low", "medium", "high" - Default: "medium")
- **created_at**: DateTime (Auto-generated)
- **updated_at**: DateTime (Auto-generated)

**Validation Rules**:
- Title is required and cannot be empty
- User_id must reference an existing user
- Priority must be one of the allowed values
- Due date cannot be in the past (optional business rule)

**State Transitions**:
- Pending → Completed (when task is marked complete)
- Completed → Pending (when task is marked incomplete)

## Relationships

### User → Tasks
- One-to-Many relationship
- Cascade delete: When a user is deleted, all their tasks are deleted
- Foreign key constraint ensures referential integrity

## Indexes

### User
- idx_user_email: Index on email field for fast authentication lookups

### Task
- idx_task_user_id: Index on user_id for efficient filtering by user
- idx_task_due_date: Index on due_date for sorting/filtering by date
- idx_task_completed: Index on is_completed for filtering completed tasks
- idx_task_important: Index on is_important for filtering important tasks