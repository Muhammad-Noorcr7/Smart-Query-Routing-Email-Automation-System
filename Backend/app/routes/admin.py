from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_admin_user, get_db
from app.models.user import User
from app.schemas.admin import AdminDepartmentUpdate, AdminUserUpdate
from app.schemas.department import DepartmentCreate, DepartmentResponse
from app.schemas.query import QueryRead
from app.schemas.user import UserRead
from app.services.admin_service import (
    create_department,
    deactivate_department,
    deactivate_user,
    get_department,
    get_user,
    list_departments,
    list_users,
    update_department,
    update_user,
)
from app.services.query_service import list_all_queries


router = APIRouter(prefix="/admin", tags=["admin"])


def _raise_not_found(entity: str) -> None:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"{entity} not found",
    )


@router.get("/departments", response_model=list[DepartmentResponse])
def admin_list_departments(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    return list_departments(db)


@router.post("/departments", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
def admin_create_department(
    payload: DepartmentCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    try:
        return create_department(db, **payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.put("/departments/{department_id}", response_model=DepartmentResponse)
def admin_update_department(
    department_id: int,
    payload: AdminDepartmentUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    try:
        department = update_department(db, department_id=department_id, payload=payload)
    except ValueError as exc:
        message = str(exc)
        status_code = status.HTTP_404_NOT_FOUND if message == "Department not found" else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=status_code, detail=message) from exc
    return department


@router.delete("/departments/{department_id}", response_model=DepartmentResponse)
def admin_deactivate_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    try:
        department = deactivate_department(db, department_id=department_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return department


@router.get("/users", response_model=list[UserRead])
def admin_list_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    return list_users(db)


@router.get("/queries", response_model=list[QueryRead])
def admin_list_queries(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    return list_all_queries(db)


@router.get("/users/{user_id}", response_model=UserRead)
def admin_get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    user = get_user(db, user_id=user_id)
    if user is None:
        _raise_not_found("User")
    return user


@router.put("/users/{user_id}", response_model=UserRead)
def admin_update_user(
    user_id: int,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    try:
        user = update_user(db, user_id=user_id, payload=payload)
    except ValueError as exc:
        message = str(exc)
        status_code = status.HTTP_404_NOT_FOUND if message == "User not found" else status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=status_code, detail=message) from exc
    return user


@router.delete("/users/{user_id}", response_model=UserRead)
def admin_deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    _ = current_admin
    try:
        user = deactivate_user(db, user_id=user_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return user
