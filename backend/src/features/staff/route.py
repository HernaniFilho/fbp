import uuid

from fastapi import APIRouter, status

from src.core.database import DbSession
from src.core.exceptions import ErrorResponse
from src.features.staff import crud as staff_crud
from src.features.staff.schemas import (
    StaffMemberCreate,
    StaffMemberResponse,
    StaffMemberUpdate,
)

router = APIRouter(prefix="/staff", tags=["staff"])


@router.post(
    "/",
    response_model=StaffMemberResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new staff member",
    responses={
        status.HTTP_201_CREATED: {
            "model": StaffMemberResponse,
            "description": "Staff member created successfully",
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": ErrorResponse,
            "description": "Internal server error",
        },
    },
)
def create_staff_member(db: DbSession, member: StaffMemberCreate):
    return staff_crud.create_staff_member(db, member)


@router.get(
    "/",
    response_model=list[StaffMemberResponse],
    status_code=status.HTTP_200_OK,
    summary="Get all staff members",
    responses={
        status.HTTP_200_OK: {
            "model": list[StaffMemberResponse],
            "description": "Staff members retrieved successfully",
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": ErrorResponse,
            "description": "Internal server error",
        },
    },
)
def get_staff_members(db: DbSession):
    return staff_crud.get_staff_members(db)


@router.get(
    "/{member_id}",
    response_model=StaffMemberResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a staff member by ID",
    responses={
        status.HTTP_200_OK: {
            "model": StaffMemberResponse,
            "description": "Staff member retrieved successfully",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Staff member not found",
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": ErrorResponse,
            "description": "Internal server error",
        },
    },
)
def get_staff_member_by_id(db: DbSession, member_id: uuid.UUID):
    return staff_crud.get_staff_member_by_id(db, member_id)


@router.put(
    "/{member_id}",
    response_model=StaffMemberResponse,
    status_code=status.HTTP_200_OK,
    summary="Update a staff member by ID",
    responses={
        status.HTTP_200_OK: {
            "model": StaffMemberResponse,
            "description": "Staff member updated successfully",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Staff member not found",
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": ErrorResponse,
            "description": "Internal server error",
        },
    },
)
def update_staff_member_by_id(
    db: DbSession, member_id: uuid.UUID, member: StaffMemberUpdate
):
    return staff_crud.update_staff_member_by_id(db, member_id, member)


@router.delete(
    "/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a staff member by ID",
    responses={
        status.HTTP_204_NO_CONTENT: {
            "description": "Staff member deleted successfully",
        },
        status.HTTP_404_NOT_FOUND: {
            "model": ErrorResponse,
            "description": "Staff member not found",
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "model": ErrorResponse,
            "description": "Internal server error",
        },
    },
)
def delete_staff_member_by_id(db: DbSession, member_id: uuid.UUID):
    return staff_crud.delete_staff_member_by_id(db, member_id)
