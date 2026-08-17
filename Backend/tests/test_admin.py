from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base
from app.models.department import Department
from app.models.user import User
from app.schemas.admin import AdminDepartmentUpdate, AdminUserUpdate
from app.schemas.auth import SignupRequest
from app.services.admin_service import (
    create_department,
    deactivate_department,
    deactivate_user,
    list_departments,
    list_users,
    update_department,
    update_user,
)
from app.services.auth_service import create_user


def _make_session():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return engine, TestingSessionLocal()


def test_admin_can_create_update_and_deactivate_department():
    engine, db = _make_session()
    try:
        created = create_department(
            db,
            name="Library",
            code="LIB",
            description="Library department",
            keywords="books,study",
        )

        assert created.name == "Library"
        assert created.is_active is True

        updated = update_department(
            db,
            department_id=created.id,
            payload=AdminDepartmentUpdate(
                name="Library Services",
                code="LIB-S",
                description="Updated library department",
                keywords="books, study, catalog",
                is_active=True,
            ),
        )

        assert updated.name == "Library Services"
        assert updated.code == "LIB-S"
        assert updated.keywords == "books, study, catalog"

        deactivated = deactivate_department(db, department_id=created.id)
        assert deactivated.is_active is False

        departments = list_departments(db)
        assert departments == []
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_admin_can_list_and_update_user_department():
    engine, db = _make_session()
    try:
        finance = Department(
            name="Finance Department",
            code="FIN",
            description="Finance work",
            keywords="finance, budget",
        )
        exam = Department(
            name="Examination Department",
            code="EXAM",
            description="Exam work",
            keywords="exam, timetable",
        )
        db.add_all([finance, exam])
        db.commit()
        db.refresh(finance)
        db.refresh(exam)

        user = create_user(
            db,
            SignupRequest(
                email="staff@example.com",
                password="password123",
                full_name="Finance Staff",
                department_name="Finance Department",
            ),
        )

        users = list_users(db)
        assert len(users) == 1
        assert users[0].department_name == "Finance Department"

        updated = update_user(
            db,
            user_id=user.id,
            payload=AdminUserUpdate(
                full_name="Exam Staff",
                department_name="Examination Department",
                is_active=False,
            ),
        )

        assert updated.full_name == "Exam Staff"
        assert updated.role == "Examination Department"
        assert updated.department_id == exam.id
        assert updated.is_active is False

        deactivated = deactivate_user(db, user_id=user.id)
        assert deactivated.is_active is False
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
