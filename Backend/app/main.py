from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text


from app.config import settings
from app.core.database import engine
from app.models import User  # noqa: F401
from app.core.database import Base
from app.routes.auth import router as auth_router
from app.routes.admin import router as admin_router
from app.routes.departments import router as departments_router
from app.routes.queries import router as queries_router


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(departments_router)
app.include_router(queries_router)


@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "app": settings.app_name}


@app.get("/health/db")
def health_db() -> dict[str, str]:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}
