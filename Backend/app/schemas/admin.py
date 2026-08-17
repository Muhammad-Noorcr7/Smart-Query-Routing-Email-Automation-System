from pydantic import BaseModel, Field


class AdminDepartmentUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    code: str | None = Field(default=None, max_length=20)
    description: str | None = None
    keywords: str | None = None
    is_active: bool | None = None


class AdminUserUpdate(BaseModel):
    email: str | None = Field(default=None, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    department_name: str | None = Field(default=None, max_length=255)
    is_active: bool | None = None
