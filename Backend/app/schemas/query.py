from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class QueryCreate(BaseModel):
    message: str = Field(min_length=1, max_length=5000)


class QueryRead(BaseModel):
    id: int
    student_id: int
    sender_email: str
    message: str
    subject: str
    snippet: str
    department_id: int | None
    department_name: str | None
    status: str
    priority: str
    confidence: float
    created_at: datetime
    updated_at: datetime
    responded_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
