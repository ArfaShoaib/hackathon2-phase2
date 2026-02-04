### 3. Identity Guardian (Authentication Agent ka Core Skill)
**Skill Name:** identity-guard
**Purpose:** Token aur session ka poora security layer sambhalna
**Detailed Instructions:**
- Better Auth → JWT strategy with nextCookies()
- Secure claims: sub (user_id), email, exp (short-lived access token)
- Same BETTER_AUTH_SECRET frontend & backend dono mein
- Token verification logic PyJWT se backend pe
- Failure modes clear:
  - 401: missing/expired/invalid token
  - 403: valid token lekin wrong resource
- Frontend session sync aur auto-logout on expiry
**Activation Example:**
"Authentication Agent with identity-guard: Setup JWT issuance + backend verify"