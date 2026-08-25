from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base
from app.models.department import Department
from app.schemas.auth import SignupRequest
from app.schemas.query import QueryCreate
from app.services.auth_service import create_user
from app.services import query_service
from app.services.query_service import create_query, list_queries_for_user


def _make_session():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return engine, TestingSessionLocal()


def _create_student(db, email: str = "student@example.com"):
    return create_user(
        db,
        SignupRequest(
            email=email,
            password="password123",
            full_name="Student User",
            department_name="Student",
        ),
    )


def test_create_query_routes_to_best_matching_department():
    engine, db = _make_session()
    try:
        finance = Department(
            name="Finance Department",
            code="FIN",
            description="Handles fees, refunds, and payment plans",
            keywords="fee, payment, tuition, refund",
            query="Fee payment and tuition questions",
        )
        admin = Department(
            name="Admin",
            code="ADMIN",
            description="Fallback team",
            keywords="general, other",
            query="Fallback for anything else",
        )
        db.add_all([finance, admin])
        db.commit()
        db.refresh(finance)
        db.refresh(admin)

        student = _create_student(db)

        query = create_query(
            db,
            current_user=student,
            payload=QueryCreate(message="I need help with my fee payment"),
        )

        assert query.student_id == student.id
        assert query.sender_email == student.email
        assert query.department_id == finance.id
        assert query.status == "Routed"
        assert query.subject == "I need help with my fee payment"
        assert query.snippet == "I need help with my fee payment"
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_create_query_falls_back_to_admin_when_no_match_is_found():
    engine, db = _make_session()
    try:
        admin = Department(
            name="Admin",
            code="ADMIN",
            description="Fallback team",
            keywords="general, other",
            query="Fallback for anything else",
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        student = _create_student(db, email="fallback@example.com")

        query = create_query(
            db,
            current_user=student,
            payload=QueryCreate(message="Please route this unusual request"),
        )

        assert query.department_id == admin.id
        assert query.status == "Routed"
        assert query.confidence == 0.5
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_create_query_rejects_empty_message():
    engine, db = _make_session()
    try:
        student = _create_student(db)

        try:
            create_query(
                db,
                current_user=student,
                payload=QueryCreate(message="   "),
            )
            raise AssertionError("Expected empty query message to fail")
        except ValueError as exc:
            assert "cannot be empty" in str(exc)
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_list_queries_for_user_only_returns_that_users_queries():
    engine, db = _make_session()
    try:
        finance = Department(
            name="Finance Department",
            code="FIN",
            description="Handles fees, refunds, and payment plans",
            keywords="fee, payment, tuition, refund",
        )
        db.add(finance)
        db.commit()
        db.refresh(finance)

        student_one = _create_student(db, email="student1@example.com")
        student_two = _create_student(db, email="student2@example.com")

        first_query = create_query(
            db,
            current_user=student_one,
            payload=QueryCreate(message="Question about tuition payment"),
        )
        create_query(
            db,
            current_user=student_two,
            payload=QueryCreate(message="Different student's message"),
        )

        queries = list_queries_for_user(db, current_user=student_one)

        assert len(queries) == 1
        assert queries[0].id == first_query.id
        assert queries[0].student_id == student_one.id
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_list_all_queries_returns_every_saved_query_for_admin():
    engine, db = _make_session()
    try:
        finance = Department(
            name="Finance Department",
            code="FIN",
            description="Handles fees, refunds, and payment plans",
            keywords="fee, payment, tuition, refund",
        )
        admin = Department(
            name="Admin",
            code="ADMIN",
            description="Fallback team",
            keywords="general, other",
        )
        db.add_all([finance, admin])
        db.commit()
        db.refresh(finance)
        db.refresh(admin)

        student_one = _create_student(db, email="student1@example.com")
        student_two = _create_student(db, email="student2@example.com")

        first_query = create_query(
            db,
            current_user=student_one,
            payload=QueryCreate(message="Question about tuition payment"),
        )
        second_query = create_query(
            db,
            current_user=student_two,
            payload=QueryCreate(message="Different student's message"),
        )

        queries = query_service.list_all_queries(db)

        assert [query.id for query in queries] == [second_query.id, first_query.id]
        assert queries[0].department_id in {finance.id, admin.id}
        assert queries[1].department_id in {finance.id, admin.id}
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)
