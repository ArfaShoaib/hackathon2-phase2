---
id: 2
title: "Fix layout.tsx useSession hook error"
stage: "misc"
date: "2026-01-12"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "001-glass-todo-app"
user: "user"
command: "Fix layout.tsx error on line 14"
labels: ["auth", "hook", "typescript", "layout"]
spec: null
ticket: null
pr: null
adr: null
files:
  - "D:\\hackathone2_phase2\\frontend\\src\\app\\(protected)\\layout.tsx"
tests: []
---

# Fix layout.tsx useSession hook error

## User Prompt
User reported an error on line 14 of D:\hackathone2_phase2\frontend\src\app\(protected)\layout.tsx where .useSession() was causing an issue.

## Solution
Replaced the problematic useSession hook with a working implementation using getUserSession function:
- Replaced the useSession hook with useState and useEffect
- Used the working getUserSession function from auth.ts to fetch session data
- Maintained the same functionality for protecting routes and showing loading states

## Technical Details
The useSession hook from better-auth client was causing issues, so I implemented a custom solution using the working getUserSession async function with React state management.

## Files Modified
- D:\hackathone2_phase2\frontend\src\app\(protected)\layout.tsx