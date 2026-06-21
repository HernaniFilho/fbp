import uuid

from pydantic import BaseModel, ConfigDict, Field, field_validator

from src.features.staff.enums import ParanormalEventType
from src.features.staff.models import Handedness, Sex
from src.features.staff.utils import normalize_age


class StaffBase(BaseModel):
    sex: Sex = Field(description="Sex of the staff member")
    age: str = Field(description="Age of the staff member")
    handness: Handedness = Field(description="Handedness of the staff member")
    hasParanormalParent: bool = Field(
        description="Whether the staff member has a paranormal parent"
    )

    numberOfMissions: int = Field(
        ge=0, description="Number of missions the staff member has completed"
    )
    serviceTime: int = Field(
        ge=0, description="Number of years the staff member has been in service"
    )

    hadParanormalEvent: bool = Field(
        description="Whether the staff member had a paranormal event"
    )
    ageOfFirstParanormalEvent: str | None = Field(
        default=None,
        description="Age of the staff member when they first had a paranormal event",
    )
    paranormalEventType: ParanormalEventType | None = Field(
        default=None,
        description="Type of paranormal event the staff member had",
    )

    paranormalLevel: int | None = Field(
        default=None,
        ge=0,
        le=100,
        description="Level of paranormal event the staff member had",
    )

    @field_validator("age")
    def validate_age(cls, value: str) -> str:
        normalized = normalize_age(value)
        if normalized is None:
            raise ValueError("Age was not provided")
        return normalized

    @field_validator("ageOfFirstParanormalEvent")
    def validate_age_of_first_paranormal_event(cls, value: str | None) -> str | None:
        if value is not None:
            normalized = normalize_age(value)
            if normalized is None:
                raise ValueError("Age was not valid")
            return normalized
        return value


class StaffCreate(StaffBase):
    name: str = Field(
        min_length=2, max_length=255, description="Name of the staff member"
    )
    pass


class StaffUpdate(BaseModel):
    sex: Sex | None = Field(default=None, description="Sex of the staff member")
    age: str | None = Field(default=None, description="Age of the staff member")
    handness: Handedness | None = Field(
        default=None, description="Handedness of the staff member"
    )
    hasParanormalParent: bool | None = Field(
        default=None, description="Whether the staff member has a paranormal parent"
    )

    numberOfMissions: int | None = Field(
        ge=0, description="Number of missions the staff member has completed"
    )
    serviceTime: int | None = Field(
        ge=0, description="Number of years the staff member has been in service"
    )

    hadParanormalEvent: bool | None = Field(
        default=None, description="Whether the staff member had a paranormal event"
    )
    ageOfFirstParanormalEvent: str | None = Field(
        default=None,
        description="Age of the staff member when they first had a paranormal event",
    )
    paranormalEventType: ParanormalEventType | None = Field(
        default=None, description="Type of paranormal event the staff member had"
    )

    paranormalLevel: int | None = Field(
        default=None,
        ge=0,
        le=100,
        description="Level of paranormal event the staff member had",
    )

    @field_validator("age")
    def validate_age(cls, value: str | None) -> str | None:
        if value is not None:
            normalized = normalize_age(value)
            if normalized is None:
                raise ValueError("Age was not provided")
            return normalized
        return value

    @field_validator("ageOfFirstParanormalEvent")
    def validate_age_of_first_paranormal_event(cls, value: str | None) -> str | None:
        if value is not None:
            normalized = normalize_age(value)
            if normalized is None:
                raise ValueError("Age was not valid")
            return normalized
        return value


class StaffResponse(StaffBase):
    id: uuid.UUID = Field(description="Unique identifier for the staff member")
    model_config = ConfigDict(from_attributes=True)
