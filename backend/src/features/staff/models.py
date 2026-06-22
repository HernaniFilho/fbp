import uuid

from sqlalchemy import Boolean, CheckConstraint, Integer, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, validates

from src.features.staff.enums import AgeCategory, Handedness, ParanormalEventType, Sex
from src.features.staff.utils import normalize_age


class Base(DeclarativeBase):
    pass


class Staff(Base):
    __tablename__ = "staff"
    __table_args__ = (
        CheckConstraint("length(name) BETWEEN 2 AND 255", name="ck_name_length"),
        CheckConstraint("number_of_missions >= 0", name="ck_number_of_missions"),
        CheckConstraint("service_time >= 0", name="ck_service_time"),
        CheckConstraint(
            "CAST(age_of_first_paranormal_event AS INTEGER) >= 0",
            name="ck_age_of_first_paranormal_event",
        ),
        CheckConstraint(
            "paranormal_level BETWEEN 0 AND 100", name="ck_paranormal_level_range"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, index=True
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    sex: Mapped[Sex] = mapped_column(SAEnum(Sex))
    age: Mapped[str] = mapped_column()
    handedness: Mapped[Handedness] = mapped_column(SAEnum(Handedness))
    hasParanormalParent: Mapped[bool] = mapped_column("has_paranormal_parent", Boolean)

    numberOfMissions: Mapped[int] = mapped_column(
        "number_of_missions",
        Integer,
    )
    serviceTime: Mapped[int] = mapped_column(
        "service_time",
        Integer,
    )

    hadParanormalEvent: Mapped[bool] = mapped_column("had_paranormal_event", Boolean)
    ageOfFirstParanormalEvent: Mapped[str | None] = mapped_column(
        "age_of_first_paranormal_event",
        String,
        nullable=True,
    )
    typeOfFirstParanormalEvent: Mapped[ParanormalEventType | None] = mapped_column(
        "type_of_first_paranormal_event", SAEnum(ParanormalEventType), nullable=True
    )

    paranormalLevel: Mapped[int | None] = mapped_column(
        "paranormal_level",
        Integer,
        nullable=True,
    )

    @property
    def parsed_age(self) -> int | str:
        """Age of the staff member as an integer, or its special category string."""
        if self.age in (AgeCategory.not_specified, AgeCategory.infinite):
            return self.age
        return int(self.age)

    @validates("age")
    def validate_age(self, key: str, value: str) -> str:
        normalized = normalize_age(value)
        if normalized is None:
            raise ValueError("Age is required")
        return normalized

    @validates("numberOfMissions")
    def validate_number_of_missions(self, key: str, value: int) -> int:
        if value < 0:
            raise ValueError("numberOfMissions must be non-negative")
        return value

    @validates("serviceTime")
    def validate_service_time(self, key: str, value: int) -> int:
        if value < 0:
            raise ValueError("serviceTime must be non-negative")
        return value

    @validates("ageOfFirstParanormalEvent")
    def validate_age_of_first_paranormal_event(
        self, key: str, value: str | None
    ) -> str | None:
        if value is not None:
            normalized = normalize_age(value)
            if normalized is None:
                raise ValueError("Age was not valid")
            return normalized
        return value

    @validates("paranormalLevel")
    def validate_paranormal_level(self, key: str, value: int | None) -> int | None:
        if value is not None and (value < 0 or value > 100):
            raise ValueError("paranormalLevel must be between 0 and 100")
        return value
