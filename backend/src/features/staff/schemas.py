import uuid

from pydantic import BaseModel, ConfigDict, Field

from src.features.staff.enums import ParanormalEventType
from src.features.staff.models import Handedness, Sex


class StaffMemberBase(BaseModel):
    name: str = Field(
        min_length=2, max_length=255, description="Name of the staff member"
    )
    sex: Sex = Field(description="Sex of the staff member")
    age: int = Field(description="Age of the staff member")
    handedness: Handedness = Field(description="Handedness of the staff member")
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
    ageOfFirstParanormalEvent: int | None = Field(
        default=None,
        description="Age of the staff member when they first had a paranormal event",
    )
    typeOfFirstParanormalEvent: ParanormalEventType | None = Field(
        default=None,
        description="Type of paranormal event the staff member had",
    )

    paranormalLevel: int | None = Field(
        default=None,
        ge=0,
        le=100,
        description="Level of paranormal event the staff member had",
    )


class StaffMemberCreate(StaffMemberBase):
    pass


class StaffMemberUpdate(BaseModel):
    sex: Sex | None = Field(default=None, description="Sex of the staff member")
    age: int | None = Field(default=None, description="Age of the staff member")
    handedness: Handedness | None = Field(
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
    ageOfFirstParanormalEvent: int | None = Field(
        default=None,
        description="Age of the staff member when they first had a paranormal event",
    )
    typeOfFirstParanormalEvent: ParanormalEventType | None = Field(
        default=None, description="Type of paranormal event the staff member had"
    )

    paranormalLevel: int | None = Field(
        default=None,
        ge=0,
        le=100,
        description="Level of paranormal event the staff member had",
    )


class StaffMemberResponse(StaffMemberBase):
    id: uuid.UUID = Field(description="Unique identifier for the staff member")
    model_config = ConfigDict(from_attributes=True)
