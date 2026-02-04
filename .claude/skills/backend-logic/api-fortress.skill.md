### 2. API Fortress (Backend Agent ka Core Skill)
**Skill Name:** api-fortress
**Purpose:** Secure, clean aur ownership-protected REST API banana
**Detailed Instructions:**
- Har route pe Depends(get_current_user) mandatory
- Har query mein filter: .where(Task.user_id == current_user.id)
- Pydantic models strict validation ke saath (Create, Update, Response alag)
- JWT verification fail → 401, ownership fail → 403
- Proper status codes + meaningful error detail
- Stateless, async, fast (Neon ke liye optimized)
**Activation Example:**
"Backend Agent with api-fortress: Implement PATCH /tasks/{id}/complete"