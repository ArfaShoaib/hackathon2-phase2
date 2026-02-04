from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    """
    Schema for user creation (signup).
    """
    email: str
    password: str


class UserResponse(BaseModel):
    """
    Schema for user response.
    """
    id: int
    email: str
    created_at: str

    class Config:
        from_attributes = True