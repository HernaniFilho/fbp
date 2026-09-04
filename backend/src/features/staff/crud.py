import logging
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.core.exceptions import AlreadyExistsException, NotFoundException
from src.features.staff.models import Staff
from src.features.staff.schemas import StaffMemberCreate, StaffMemberUpdate

STAFF_ENTITY = "Staff member"

logger = logging.getLogger(__name__)


def create_staff_member(db: Session, member: StaffMemberCreate) -> Staff:
    logger.info(f"Creating staff member: {member.name}")
    existing = db.execute(
        select(Staff).where(Staff.name == member.name)
    ).scalar_one_or_none()
    if existing:
        raise AlreadyExistsException(STAFF_ENTITY, member.name)
    db_member = Staff(**member.model_dump())
    db.add(db_member)
    db.flush()
    db.refresh(db_member)
    logger.info(f"Created staff member: {db_member.name}")
    return db_member


def get_staff_member_by_id(db: Session, member_id: uuid.UUID) -> Staff:
    logger.info(f"Getting staff member: {member_id}")
    db_member = db.execute(
        select(Staff).where(Staff.id == member_id)
    ).scalar_one_or_none()
    if db_member is None:
        raise NotFoundException(f"{STAFF_ENTITY} not found")
    logger.info(f"Found staff member: {db_member.name}")
    return db_member


def get_staff_members(db: Session) -> list[Staff]:
    logger.info("Getting all staff members")
    db_members = list(db.execute(select(Staff)).scalars().all())
    logger.info(f"Found {len(db_members)} staff members")
    return db_members


def get_staff_member_without_paranormal_level(db: Session) -> list[Staff]:
    logger.info("Getting staff members without paranormal level")
    db_members = list(
        db.execute(select(Staff).where(Staff.paranormalLevel.is_(None))).scalars().all()
    )
    logger.info(f"Found {len(db_members)} staff members without paranormal level")
    return db_members


def set_staff_member_paranormal_level(
    db: Session, member_id: uuid.UUID, level: int
) -> Staff:
    logger.info(f"Setting paranormal level for staff member: {member_id}")
    db_member = db.execute(
        select(Staff).where(Staff.id == member_id)
    ).scalar_one_or_none()
    if db_member is None:
        raise NotFoundException(f"{STAFF_ENTITY} not found")
    db_member.paranormalLevel = level
    db.flush()
    db.refresh(db_member)
    logger.info(f"Set paranormal level for staff member: {db_member.name}")
    return db_member


def update_staff_member_by_id(
    db: Session, member_id: uuid.UUID, member: StaffMemberUpdate
) -> Staff:
    logger.info(f"Updating staff member: {member_id}")
    db_member = db.execute(
        select(Staff).where(Staff.id == member_id)
    ).scalar_one_or_none()
    if db_member is None:
        raise NotFoundException(f"{STAFF_ENTITY} not found")
    for key, value in member.model_dump(exclude_unset=True).items():
        setattr(db_member, key, value)
    db.flush()
    db.refresh(db_member)
    logger.info(f"Updated staff member: {db_member.name}")
    return db_member


def delete_staff_member_by_id(db: Session, member_id: uuid.UUID) -> None:
    logger.info(f"Deleting staff member: {member_id}")
    db_member = db.execute(
        select(Staff).where(Staff.id == member_id)
    ).scalar_one_or_none()
    if db_member is None:
        raise NotFoundException(f"{STAFF_ENTITY} not found")
    db.delete(db_member)
    db.flush()
    logger.info(f"Deleted staff member: {db_member.name}")
