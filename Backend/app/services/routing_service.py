import re

from sqlalchemy.orm import Session

from app.models.department import Department


def _normalize_words(value: str | None) -> set[str]:
    if not value:
        return set()

    return {word for word in re.split(r"[^a-zA-Z0-9]+", value.lower()) if word}


def score_department(department: Department, message: str) -> int:
    query_value = message.lower().strip()
    if not query_value:
        return 0

    score = 0
    searchable_fields = [
        department.name,
        department.code,
        department.description or "",
        department.keywords or "",
        department.query or "",
    ]

    for field in searchable_fields:
        field_value = field.lower()
        if query_value in field_value:
            score += 10

    message_words = _normalize_words(query_value)
    department_keywords = _normalize_words(department.keywords)
    department_prompt_words = _normalize_words(department.query)

    score += len(message_words & department_keywords) * 5
    score += len(message_words & department_prompt_words) * 3

    return score


def match_department(db: Session, message: str) -> tuple[Department | None, int]:
    departments = (
        db.query(Department)
        .filter(Department.is_active.is_(True))
        .all()
    )

    best_department = None
    best_score = 0

    for department in departments:
        score = score_department(department, message)
        if score > best_score:
            best_department = department
            best_score = score

    if best_department is not None:
        return best_department, best_score

    fallback_department = next(
        (department for department in departments if department.name.lower() == "admin"),
        None,
    )
    if fallback_department is not None:
        return fallback_department, 0

    return (departments[0], 0) if departments else (None, 0)
