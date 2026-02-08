from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from dependencies.database import create_db_and_tables
from routers.auth import router as auth_router
from routers.tasks import router as tasks_router
import uvicorn
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the FastAPI app
app = FastAPI(title="Todo Backend API", version="1.0.0")

# Configure CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://127.0.0.1:3000", 
        "http://127.0.0.1:3001",
        "https://hackathon2-phase2-three.vercel.app"  # Production frontend URL
    ],  # Allow frontend origins including alternative localhost addresses
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization"],  # Ensure Authorization header is allowed
    # Additional CORS options for better compatibility
    allow_origin_regex=None,
    expose_headers=[],
)

# Include the auth and tasks routers
app.include_router(auth_router)
app.include_router(tasks_router)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """
    Handle validation errors globally.
    """
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )

@app.on_event("startup")
def on_startup():
    """
    Create database tables on startup.
    """
    logger.info("Initializing database tables...")
    create_db_and_tables()
    logger.info("Database tables initialized successfully")

@app.get("/")
def read_root():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "message": "Todo Backend API is running"}

@app.get("/health")
def health_check():
    """
    Health check endpoint.
    """
    logger.info("Health check endpoint accessed")
    return {"status": "healthy"}

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)