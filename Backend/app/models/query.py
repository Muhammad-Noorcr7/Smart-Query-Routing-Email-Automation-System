from datetime import UTC, datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Query(Base):
    __tablename__ = "queries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    sender_email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    status: Mapped[str] = mapped_column(String(32), default="Open", nullable=False)
    priority: Mapped[str] = mapped_column(String(32), default="Normal", nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(UTC), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False
    )
    responded_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    student = relationship("User", back_populates="queries")
    department = relationship("Department", back_populates="queries")

    @property
    def subject(self) -> str:
        first_line = self.message.strip().splitlines()[0] if self.message.strip() else ""
        if not first_line:
            return "New query"
        if len(first_line) <= 72:
            return first_line
        return f"{first_line[:69].rstrip()}..."

    @property
    def snippet(self) -> str:
        text = " ".join(self.message.split())
        if len(text) <= 140:
            return text
        return f"{text[:137].rstrip()}..."

    @property
    def department_name(self) -> str | None:
        if self.department is None:
            return None
        return self.department.name
