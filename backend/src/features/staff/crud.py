import uuid

from sqlalchemy.orm import Session

from src.core.exceptions import AlreadyExistsException, NotFoundException, info_logger
from src.features.staff.models import Staff
from src.features.staff.schemas import StaffMemberCreate, StaffMemberUpdate

STAFF_ENTITY = "Staff member"


def create_staff_member(db: Session, member: StaffMemberCreate):
    info_logger.info(f"Creating staff member: {member.name}")
    existing = db.query(Staff).filter(Staff.name == member.name).first()
    if existing:
        raise AlreadyExistsException(STAFF_ENTITY, member.name)

    db_member = Staff(**member.model_dump())
    db.add(db_member)
    db.flush()
    db.refresh(db_member)
    info_logger.info(f"Created staff member: {db_member.name}")
    return db_member


def get_staff_member_by_id(db: Session, member_id: uuid.UUID) -> Staff:
    info_logger.info(f"Getting staff member: {member_id}")
    db_member = db.query(Staff).filter(Staff.id == member_id).first()
    if db_member is None:
        raise NotFoundException(f"{STAFF_ENTITY} not found")
    info_logger.info(f"Found staff member: {db_member.name}")
    return db_member


def get_staff_members(db: Session) -> list[Staff]:
    info_logger.info("Getting all staff members")
    db_members = db.query(Staff).all()
    info_logger.info(f"Found {len(db_members)} staff members")
    return db_members


def update_staff_member_by_id(
    db: Session, member_id: uuid.UUID, member: StaffMemberUpdate
) -> Staff:
    info_logger.info(f"Updating staff member: {member_id}")
    db_member = db.query(Staff).filter(Staff.id == member_id).first()
    if db_member is None:
        raise NotFoundException(f"{STAFF_ENTITY} not found")
    for key, value in member.model_dump(exclude_unset=True).items():
        setattr(db_member, key, value)
    db.flush()
    db.refresh(db_member)
    info_logger.info(f"Updated staff member: {db_member.name}")
    return db_member


def delete_staff_member_by_id(db: Session, member_id: uuid.UUID) -> None:
    info_logger.info(f"Deleting staff member: {member_id}")
    db_member = db.query(Staff).filter(Staff.id == member_id).first()
    if db_member is None:
        raise NotFoundException(f"{STAFF_ENTITY} not found")
    db.delete(db_member)
    db.flush()
    info_logger.info(f"Deleted staff member: {db_member.name}")
