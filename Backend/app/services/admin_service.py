from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.models.department import Department
from app.models.user import User
from app.schemas.admin import AdminDepartmentUpdate, AdminUserUpdate
from app.services.auth_service import get_department_by_name, resolve_signup_target


def _department_exists_with_name_or_code(
    db: Session,
    *,
    name: str | None = None,
    code: str | None = None,
    exclude_id: int | None = None,
) -> bool:
    query = db.query(Department)
    if exclude_id is not None:
        query = query.filter(Department.id != exclude_id)
    if name is not None:
        query = query.filter(func.lower(Department.name) == name.lower())
    if code is not None:
        query = query.filter(func.lower(Department.code) == code.lower())
    return query.first() is not None


def list_departments(db: Session) -> list[Department]:
    return (
        db.query(Department)
        .filter(Department.is_active.is_(True))
        .order_by(Department.name)
        .all()
    )


def create_department(
    db: Session,
    *,
    name: str,
    code: str,
    description: str | None = None,
    keywords: str | None = None,
    user_id: int | None = None,
    query: str | None = None,
) -> Department:
    if _department_exists_with_name_or_code(db, name=name):
        raise ValueError("Department name is already registered")
    if _department_exists_with_name_or_code(db, code=code):
        raise ValueError("Department code is already registered")

    department = Department(
        name=name,
        code=code,
        description=description,
        keywords=keywords,
        user_id=user_id,
        query=query,
    )
    db.add(department)
    db.commit()
    db.refresh(department)
    return department


def update_department(
    db: Session,
    *,
    department_id: int,
    payload: AdminDepartmentUpdate,
) -> Department:
    department = db.get(Department, department_id)
    if department is None:
        raise ValueError("Department not found")

    if payload.name is not None and _department_exists_with_name_or_code(
        db,
        name=payload.name,
        exclude_id=department_id,
    ):
        raise ValueError("Department name is already registered")
    if payload.code is not None and _department_exists_with_name_or_code(
        db,
        code=payload.code,
        exclude_id=department_id,
    ):
        raise ValueError("Department code is already registered")

    if payload.name is not None:
        department.name = payload.name
    if payload.code is not None:
        department.code = payload.code
    if payload.description is not None:
        department.description = payload.description
    if payload.keywords is not None:
        department.keywords = payload.keywords
    if payload.user_id is not None:
        department.user_id = payload.user_id
    if payload.query is not None:
        department.query = payload.query
    if payload.is_active is not None:
        department.is_active = payload.is_active

    db.commit()
    db.refresh(department)
    return department


def deactivate_department(db: Session, *, department_id: int) -> Department:
    return update_department(
        db,
        department_id=department_id,
        payload=AdminDepartmentUpdate(is_active=False),
    )


def get_department(db: Session, *, department_id: int) -> Department | None:
    return db.get(Department, department_id)


def list_users(db: Session) -> list[User]:
    return (
        db.query(User)
        .options(selectinload(User.department))
        .order_by(User.id)
        .all()
    )


def get_user(db: Session, *, user_id: int) -> User | None:
    return (
        db.query(User)
        .options(selectinload(User.department))
        .filter(User.id == user_id)
        .first()
    )


def update_user(
    db: Session,
    *,
    user_id: int,
    payload: AdminUserUpdate,
) -> User:
    user = (
        db.query(User)
        .options(selectinload(User.department))
        .filter(User.id == user_id)
        .first()
    )
    if user is None:
        raise ValueError("User not found")

    if payload.email is not None:
        existing_user = (
            db.query(User)
            .filter(func.lower(User.email) == payload.email.lower(), User.id != user_id)
            .first()
        )
        if existing_user is not None:
            raise ValueError("Email is already registered")
        user.email = payload.email.lower()

    if payload.full_name is not None:
        user.full_name = payload.full_name

    if payload.department_name is not None:
        role, department_id = resolve_signup_target(db, payload.department_name)
        user.role = role
        user.department_id = department_id

    if payload.is_active is not None:
        user.is_active = payload.is_active

    db.commit()
    db.refresh(user)
    return user


def deactivate_user(db: Session, *, user_id: int) -> User:
    return update_user(
        db,
        user_id=user_id,
        payload=AdminUserUpdate(is_active=False),
    )
