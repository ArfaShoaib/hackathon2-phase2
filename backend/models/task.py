from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional


class Task(SQLModel, table=True):
    """
    Task model representing individual todo items with ownership relationships.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    description: Optional[str] = None
    completed: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationship to User
    user: Optional["User"] = Relationship(back_populates="tasks")