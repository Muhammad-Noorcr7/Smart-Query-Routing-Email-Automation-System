from pydantic import BaseModel, ConfigDict


class DepartmentCreate(BaseModel):
    name: str
    code: str
    description: str | None = None
    keywords: str | None = None
    user_id: int | None = None
    query: str | None = None


class DepartmentResponse(DepartmentCreate):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True) 
