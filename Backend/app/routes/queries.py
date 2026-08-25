from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.query import QueryCreate, QueryRead
from app.services.query_service import create_query, list_queries_for_user


router = APIRouter(prefix="/queries", tags=["queries"])


@router.post("/", response_model=QueryRead, status_code=status.HTTP_201_CREATED)
def submit_query(
    payload: QueryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> QueryRead:
    try:
        return create_query(db, current_user=current_user, payload=payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/", response_model=list[QueryRead])
def get_my_queries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[QueryRead]:
    return list_queries_for_user(db, current_user=current_user)
