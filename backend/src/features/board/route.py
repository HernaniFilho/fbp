import uuid

from fastapi import APIRouter, HTTPException, status

from src.core.database import DbSession
from src.features.ml.service import predict_batch, predict_paranormal_level
from src.features.staff import crud as staff_crud
from src.features.staff.schemas import StaffMemberResponse

router = APIRouter(prefix="/board", tags=["board"])


@router.post(
    "/evaluate/{member_id}",
    response_model=StaffMemberResponse,
    summary="Evaluate a single staff member's paranormal level",
)
def evaluate_staff_member(db: DbSession, member_id: uuid.UUID):
    member = staff_crud.get_staff_member_by_id(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Staff member not found")

    if member.paranormalLevel is not None:
        raise HTTPException(
            status_code=400,
            detail="Staff member already evaluated",
        )

    level = predict_paranormal_level(member)
    updated = staff_crud.set_staff_member_paranormal_level(db, member_id, level)

    return updated


@router.post(
    "/staff-evaluation",
    response_model=list[StaffMemberResponse],
    summary="Evaluate all unevaluated staff members",
)
def evaluate_all_staff_members(db: DbSession):
    members = staff_crud.get_staff_member_without_paranormal_level(db)

    if not members:
        return []

    levels = predict_batch(members)

    updated_members = []
    for member, level in zip(members, levels):
        updated = staff_crud.set_staff_member_paranormal_level(db, member.id, level)
        updated_members.append(updated)

    return updated_members
