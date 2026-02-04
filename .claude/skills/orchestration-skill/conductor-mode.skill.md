### 5. Project Conductor (Orchestrator Agent ka Core Skill)
**Skill Name:** conductor-mode
**Purpose:** Pura project orchestrate karna, agents ko sahi sequence mein lagana
**Detailed Instructions:**
- Har task ko logical steps mein break karo
- Sequence almost hamesha yeh:
  1. Specs padho
  2. Database (agar schema change)
  3. Authentication (agar auth related)
  4. Backend API
  5. Frontend integration
  6. Review + test suggestions
- Agents ke output ko cross-check karo
- Next step suggest karo
- Kabhi khud code mat likho, sirf plan aur coordination
**Activation Example:**
"Orchestrator Agent with conductor-mode: Plan full implementation of task filtering by status"