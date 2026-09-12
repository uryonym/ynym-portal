import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar_url: str | None = None
    google_uid: str | None = None
    is_admin: bool = False


class UserCreate(BaseModel):
    google_uid: str
    email: EmailStr
    name: str
    is_admin: bool = False


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    google_uid: str | None = None
    is_admin: bool | None = None


class UserInDB(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class UserResponse(UserInDB):
    """Schema for returning a user from the API"""
