# Quickstart Guide: GlassFlow Todo

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL (or Neon Serverless PostgreSQL account)
- Git

## Setup Instructions

### 1. Clone and Initialize
```bash
mkdir todo-fullstack
cd todo-fullstack
git init
```

### 2. Frontend Setup
```bash
# Create frontend directory
mkdir frontend
cd frontend

# Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install dependencies
npm install framer-motion lucide-react clsx tailwind-merge
npm install -D @types/node
npm install better-auth @better-auth/nextjs
```

### 3. Backend Setup
```bash
# From project root
mkdir backend
cd backend

# Initialize Python project
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlmodel pydantic python-multipart python-jose[cryptography] passlib[bcrypt] psycopg2-binary

# Create requirements.txt
pip freeze > requirements.txt
```

### 4. Environment Configuration

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=GlassFlow Todo
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
NEXTAUTH_URL=http://localhost:3000
```

#### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost/dbname
SECRET_KEY=your-super-secret-jwt-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours
```

### 5. Running the Applications

#### Frontend
```bash
cd frontend
npm run dev
```

#### Backend
```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/users/{user_id}/tasks` - Get all user tasks
- `POST /api/users/{user_id}/tasks` - Create new task
- `GET /api/users/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/users/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/users/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/users/{user_id}/tasks/{task_id}/complete` - Toggle task completion

## Development Commands

### Frontend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Run linter
```

### Backend
```bash
# Run with auto-reload
uvicorn src.main:app --reload

# Run tests
pytest

# Run with specific port
uvicorn src.main:app --host 0.0.0.0 --port 8000
```