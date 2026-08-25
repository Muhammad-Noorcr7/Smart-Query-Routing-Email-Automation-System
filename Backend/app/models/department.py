from sqlalchemy import Boolean, Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    keywords = Column(Text, nullable=True)
    user_id = Column(Integer, nullable=True)
    query = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    users = relationship("User", back_populates="department")
    queries = relationship("Query", back_populates="department")
