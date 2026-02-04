from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import Any, Dict
from pydantic import BaseModel
from utils.security import verify_password, hash_password, validate_email, validate_password_strength
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
import os
from dependencies.database import get_session
from dotenv import load_dotenv
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from models.user import User
from schemas.auth import UserCreate, UserResponse

# Load environment variables
load_dotenv()

# Get JWT configuration from environment
SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class UserLogin(BaseModel):
    """
    Schema for user login.
    """
    email: str
    password: str


class TokenResponse(BaseModel):
    """
    Schema for token response.
    """
    access_token: str
    token_type: str
    user: UserResponse


def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Create a new access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def create_user_and_login(user_create: UserCreate, session: Session = Depends(get_session)):
    """
    Create a new user with secure password hashing and return authentication token.
    """
    # Validate email format
    if not validate_email(user_create.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )

    # Validate password strength
    if not validate_password_strength(user_create.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password does not meet strength requirements"
        )

    # Check if user with email already exists
    existing_user_statement = select(User).where(User.email == user_create.email)
    existing_user = session.exec(existing_user_statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = hash_password(user_create.password)

    # Create new user
    user = User(
        email=user_create.email,
        password_hash=hashed_password
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Create access token for the new user
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    # Return user response with token
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        created_at=user.created_at.isoformat()
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/login", response_model=TokenResponse)
def login_user(user_login: UserLogin, session: Session = Depends(get_session)):
    """
    Authenticate user and return authentication token.
    """
    # Find user by email
    user_statement = select(User).where(User.email == user_login.email)
    user = session.exec(user_statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Verify password
    if not verify_password(user_login.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create access token for the authenticated user
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    # Return user response with token
    user_response = UserResponse(
        id=user.id,
        email=user.email,
        created_at=user.created_at.isoformat()
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


# Security scheme for bearer token
security = HTTPBearer()


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify the JWT token and return the payload.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get current user from JWT token.
    """
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"user_id": int(user_id)}


@router.get("/get-session", response_model=UserResponse)
def get_current_session(
    current_user: dict = Depends(get_current_user_from_token),
    session: Session = Depends(get_session)
):
    """
    Get current user session data.
    """
    # Find user by ID from token
    user_statement = select(User).where(User.id == current_user["user_id"])
    user = session.exec(user_statement).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=user.id,
        email=user.email,
        created_at=user.created_at.isoformat()
    )