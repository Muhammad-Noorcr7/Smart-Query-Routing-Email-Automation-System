from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from fastapi import HTTPException

from app import dependencies
from app.core.database import Base
from app.core.security import decode_access_token, verify_password
from app.models.department import Department
from app.models.user import User
from app.schemas.auth import LoginRequest, SignupRequest
from app.services.auth_service import (
    authenticate_user,
    build_token_response,
    create_user,
)


def _make_session():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return engine, TestingSessionLocal()


def test_signup_creates_user_with_hashed_password():
    engine, db = _make_session()
    try:
        user = create_user(
            db,
            SignupRequest(
                email="student@example.com",
                password="password123",
                full_name="Student User",
                department_name="Student",
            ),
        )

        assert user.id is not None
        assert user.email == "student@example.com"
        assert user.full_name == "Student User"
        assert user.role == "STUDENT"
        assert user.department_id is None
        assert user.hashed_password != "password123"
        assert verify_password("password123", user.hashed_password)
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_signup_student_sets_student_role_without_department():
    engine, db = _make_session()
    try:
        user = create_user(
            db,
            SignupRequest(
                email="student2@example.com",
                password="password123",
                full_name="Student User",
                department_name="Student",
            ),
        )

        assert user.role == "STUDENT"
        assert user.department_id is None
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_login_returns_access_token():
    engine, db = _make_session()
    try:
        created_user = create_user(
            db,
            SignupRequest(
                email="teacher@example.com",
                password="password123",
                full_name="Teacher User",
                department_name="Student",
            ),
        )

        user = authenticate_user(
            db,
            LoginRequest(email="teacher@example.com", password="password123"),
        )
        token_response = build_token_response(user)
        claims = decode_access_token(token_response.access_token)

        assert user.id == created_user.id
        assert token_response.token_type == "bearer"
        assert claims["sub"] == str(created_user.id)
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_signup_rejects_duplicate_email():
    engine, db = _make_session()
    try:
        create_user(
            db,
            SignupRequest(
                email="duplicate@example.com",
                password="password123",
                department_name="Student",
            ),
        )

        try:
            create_user(
                db,
                SignupRequest(
                    email="duplicate@example.com",
                    password="password123",
                    department_name="Student",
                ),
            )
            raise AssertionError("Expected duplicate email to fail")
        except ValueError as exc:
            assert "already registered" in str(exc)
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_signup_staff_sets_staff_role_and_department_id():
    engine, db = _make_session()
    try:
        department = Department(
            name="Examination Department",
            code="EXAM",
            description="Handles examinations",
            keywords="exam, timetable, seating",
        )
        db.add(department)
        db.commit()
        db.refresh(department)

        user = create_user(
            db,
            SignupRequest(
                email="staff@example.com",
                password="password123",
                full_name="Exam Staff",
                department_name="Examination Department",
            ),
        )

        assert user.role == "Examination Department"
        assert user.department_id == department.id
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_signup_response_includes_department_name_for_staff():
    engine, db = _make_session()
    try:
        department = Department(
            name="Finance Department",
            code="FIN",
            description="Handles finance",
            keywords="finance, budget, fees",
        )
        db.add(department)
        db.commit()
        db.refresh(department)

        user = create_user(
            db,
            SignupRequest(
                email="finance.staff@example.com",
                password="password123",
                full_name="Finance Staff",
                department_name="Finance Department",
            ),
        )

        token_response = build_token_response(user)

        assert token_response.user.department_name == "Finance Department"
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_signup_defaults_new_users_to_non_admin():
    engine, db = _make_session()
    try:
        user = create_user(
            db,
            SignupRequest(
                email="normal.user@example.com",
                password="password123",
                full_name="Normal User",
                department_name="Student",
            ),
        )

        assert user.is_admin is False
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_get_current_admin_user_returns_admin_user():
    engine, db = _make_session()
    try:
        admin_user = User(
            email="admin@example.com",
            full_name="Admin User",
            hashed_password="hashed",
            role="ADMIN",
            is_admin=True,
            department_id=None,
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)

        current_admin = dependencies.get_current_admin_user(current_user=admin_user)

        assert current_admin.id == admin_user.id
        assert current_admin.is_admin is True
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_get_current_admin_user_rejects_non_admin_user():
    engine, db = _make_session()
    try:
        normal_user = User(
            email="user@example.com",
            full_name="Normal User",
            hashed_password="hashed",
            role="STUDENT",
            is_admin=False,
            department_id=None,
        )
        db.add(normal_user)
        db.commit()
        db.refresh(normal_user)

        try:
            dependencies.get_current_admin_user(current_user=normal_user)
            raise AssertionError("Expected admin check to fail")
        except HTTPException as exc:
            assert exc.status_code == 403
            assert "Admin access required" in str(exc.detail)
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
