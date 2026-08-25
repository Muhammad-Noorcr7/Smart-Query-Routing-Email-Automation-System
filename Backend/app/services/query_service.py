from sqlalchemy.orm import Session, selectinload

from app.models.query import Query
from app.models.user import User
from app.schemas.query import QueryCreate
from app.services.routing_service import match_department


def _confidence_from_score(score: int) -> float:
    if score <= 0:
        return 0.5
    return round(min(0.99, 0.55 + score / 20), 2)


def create_query(db: Session, *, current_user: User, payload: QueryCreate) -> Query:
    message = payload.message.strip()
    if not message:
        raise ValueError("Query message cannot be empty")

    department, score = match_department(db, message)
    query = Query(
        student_id=current_user.id,
        sender_email=current_user.email,
        message=message,
        department_id=department.id if department is not None else None,
        status="Routed" if department is not None else "Open",
        priority="Normal",
        confidence=_confidence_from_score(score),
    )
    db.add(query)
    db.commit()
    db.refresh(query)
    return query


def list_queries_for_user(db: Session, *, current_user: User) -> list[Query]:
    return (
        db.query(Query)
        .options(selectinload(Query.department))
        .filter(Query.student_id == current_user.id)
        .order_by(Query.created_at.desc(), Query.id.desc())
        .all()
    )


def list_all_queries(db: Session) -> list[Query]:
    return (
        db.query(Query)
        .options(selectinload(Query.department))
        .order_by(Query.created_at.desc(), Query.id.desc())
        .all()
    )
