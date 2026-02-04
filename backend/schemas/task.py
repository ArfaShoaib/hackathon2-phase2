from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    """
    Schema for creating a task.
    """
    title: str
    description: Optional[str] = None
    completed: bool = False


class TaskUpdate(BaseModel):
    """
    Schema for updating a task completely.
    """
    title: str
    description: Optional[str] = None
    completed: bool


class TaskResponse(BaseModel):
    """
    Schema for task response.
    """
    id: int
    user_id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskPatchComplete(BaseModel):
    """
    Schema for patching task completion status.
    """
    completed: bool