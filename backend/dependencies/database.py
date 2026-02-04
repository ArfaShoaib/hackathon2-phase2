from sqlmodel import create_engine, Session
from typing import Generator
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todo_app.db")

# Create the database engine
engine = create_engine(DATABASE_URL, echo=False)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency function to get a database session.
    """
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    """
    Create database tables.
    """
    from models.user import User
    from models.task import Task
    from sqlmodel import SQLModel

    SQLModel.metadata.create_all(engine)