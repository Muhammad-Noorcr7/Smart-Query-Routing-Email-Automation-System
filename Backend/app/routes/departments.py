from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.department import Department
from app.schemas.department import DepartmentCreate, DepartmentResponse

router = APIRouter(prefix="/departments", tags=["departments"])


def _normalize_keywords(value: str | None) -> set[str]:
    if not value:
        return set()

    return {
        keyword.strip().lower()
        for keyword in value.split(",")
        if keyword.strip()
    }


def _score_department(department: Department, query: str) -> int:
    query_value = query.lower().strip()
    if not query_value:
        return 0

    score = 0
    searchable_fields = [
        department.name,
        department.code,
        department.description or "",
        department.keywords or "",
    ]

    for field in searchable_fields:
        field_value = field.lower()
        if query_value in field_value:
            score += 10

    query_words = {word for word in query_value.split() if word}
    department_keywords = _normalize_keywords(department.keywords)

    score += len(query_words & department_keywords) * 5

    return score


@router.get("/", response_model=list[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    return (
        db.query(Department)
        .filter(Department.is_active.is_(True))
        .order_by(Department.name)
        .all()
    )


@router.post("/", response_model=DepartmentResponse)
def create_department(
    department_data: DepartmentCreate,
    db: Session = Depends(get_db),
):
    department = Department(**department_data.model_dump())
    db.add(department)
    db.commit()
    db.refresh(department)
    return department


@router.get("/search", response_model=list[DepartmentResponse])
def search_departments(
    q: str = Query(..., min_length=1, description="Text to match against departments"),
    db: Session = Depends(get_db),
):
    departments = (
        db.query(Department)
        .filter(Department.is_active.is_(True))
        .all()
    )

    ranked_departments = [
        (department, _score_department(department, q))
        for department in departments
    ]

    ranked_departments = [
        item for item in ranked_departments if item[1] > 0
    ]
    ranked_departments.sort(key=lambda item: (-item[1], item[0].name))

    return [department for department, _ in ranked_departments]


@router.get("/match", response_model=DepartmentResponse | None)
def match_department(
    q: str = Query(..., min_length=1, description="Text to classify into a department"),
    db: Session = Depends(get_db),
):
    departments = (
        db.query(Department)
        .filter(Department.is_active.is_(True))
        .all()
    )

    best_department = None
    best_score = 0

    for department in departments:
        score = _score_department(department, q)
        if score > best_score:
            best_department = department
            best_score = score

    return best_department
