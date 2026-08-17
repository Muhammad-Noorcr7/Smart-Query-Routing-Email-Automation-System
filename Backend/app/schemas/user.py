from datetime import datetime
import re

from pydantic import BaseModel, ConfigDict, Field, field_validator


EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class UserBase(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    full_name: str | None = None        

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized = value.strip().lower()
        if not EMAIL_PATTERN.match(normalized):
            raise ValueError("Invalid email address")
        return normalized


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    role: str
    is_admin: bool
    department_id: int | None
    department_name: str | None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
