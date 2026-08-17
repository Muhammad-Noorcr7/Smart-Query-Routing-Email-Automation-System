from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.department import Department
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.lower()).first()


def get_department_by_name(db: Session, department_name: str) -> Department | None:
    normalized_name = department_name.strip().lower()
    return (
        db.query(Department)
        .filter(func.lower(Department.name) == normalized_name)
        .first()
    )


def resolve_signup_target(
    db: Session,
    department_name: str,
) -> tuple[str, int | None]:
    normalized_name = department_name.strip()
    if normalized_name.lower() == "student":
        return "STUDENT", None

    department = get_department_by_name(db, normalized_name)
    if department is None:
        raise ValueError("Selected department was not found")

    return department.name, department.id


def create_user(db: Session, payload: SignupRequest) -> User:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user is not None:
        raise ValueError("Email is already registered")

    role, department_id = resolve_signup_target(db, payload.department_name)

    user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role=role,
        is_admin=False,
        department_id=department_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, payload: LoginRequest) -> User:
    user = get_user_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise ValueError("Incorrect email or password")
    return user


def build_token_response(user: User) -> TokenResponse:
    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(
        access_token=access_token,
        user=user,
    )
