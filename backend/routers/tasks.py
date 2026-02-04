from fastapi import APIRouter, HTTPException, Depends, status
from sqlmodel import Session, select
from typing import List

from models.task import Task
from models.user import User
from schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskPatchComplete
from dependencies.database import get_session
from dependencies.auth import get_current_user

router = APIRouter(prefix="/api", tags=["tasks"])


@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
def get_tasks(user_id: int, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Retrieve all tasks belonging to the specified user.
    """
    # Verify that the requested user_id matches the authenticated user's ID
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access tasks for this user"
        )

    # Query tasks for the user
    statement = select(Task).where(Task.user_id == user_id)
    tasks = session.exec(statement).all()

    return [TaskResponse.model_validate(task) for task in tasks]


@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(user_id: int, task_create: TaskCreate, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Create a new task for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user's ID
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create tasks for this user"
        )

    # Create new task
    task = Task(
        user_id=user_id,
        title=task_create.title,
        description=task_create.description,
        completed=task_create.completed
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(user_id: int, task_id: int, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Retrieve a specific task by ID for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user's ID
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access tasks for this user"
        )

    # Query the specific task for the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not owned by the user"
        )

    return TaskResponse.model_validate(task)


@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(user_id: int, task_id: int, task_update: TaskUpdate, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Update an entire task for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user's ID
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    # Query the specific task for the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not owned by the user"
        )

    # Update task fields
    task.title = task_update.title
    task.description = task_update.description
    task.completed = task_update.completed

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.patch("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task_partial(user_id: int, task_id: int, task_update: TaskUpdate, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Partially update a task for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user's ID
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    # Query the specific task for the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not owned by the user"
        )

    # Update task fields if provided
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.completed is not None:
        task.completed = task_update.completed

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def update_task_completion(user_id: int, task_id: int, task_patch_complete: TaskPatchComplete, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Toggle the completion status of a task for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user's ID
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update tasks for this user"
        )

    # Query the specific task for the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not owned by the user"
        )

    # Update task completion status
    task.completed = task_patch_complete.completed

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse.model_validate(task)


@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(user_id: int, task_id: int, current_user: dict = Depends(get_current_user), session: Session = Depends(get_session)):
    """
    Delete a specific task for the specified user.
    """
    # Verify that the requested user_id matches the authenticated user's ID
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete tasks for this user"
        )

    # Query the specific task for the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or not owned by the user"
        )

    # Delete the task
    session.delete(task)
    session.commit()

    return