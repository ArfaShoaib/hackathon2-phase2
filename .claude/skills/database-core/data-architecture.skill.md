### 4. Data Architect (Database Agent ka Core Skill)
**Skill Name:** data-architecture
**Purpose:** Solid, scalable aur secure database schema design
**Detailed Instructions:**
- users table: Better Auth manage karega (string id)
- tasks table: user_id → users.id foreign key (NOT NULL)
- Indexes: user_id, user_id + completed, user_id + created_at DESC
- Timestamps: created_at, updated_at with timestamptz
- Constraints: title NOT NULL, description TEXT nullable
- Future-ready: soft-delete flag ya priority field add karne ki flexibility
**Activation Example:**
"Database Agent with data-architecture: Add due_date column with index"