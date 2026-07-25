# src/features/staff/scripts/seed_staff.py

import random  # <-- adiciona isso
import uuid

import numpy as np

from src.core.database import SessionLocal
from src.features.staff.enums import Handedness, ParanormalEventType, Sex
from src.features.staff.models import Staff

np.random.seed(42)

# --- Options for categorical variables ---
SEX_OPTIONS = list(Sex)
SEX_WEIGHTS = [0.45, 0.45, 0.05, 0.05]

HAND_OPTIONS = list(Handedness)
HAND_WEIGHTS = [0.80, 0.10, 0.05, 0.05]

EVENT_TYPES = list(ParanormalEventType)
EVENT_WEIGHTS = [0.35, 0.20, 0.15, 0.15, 0.15]


def apply_paranormal_multipliers(
    base_level: float,
    handedness: Handedness,
    sex: Sex,
    event_type: ParanormalEventType | None,
) -> int:
    """Apply paranormal multipliers to the base level based on the member's characteristics."""
    multiplier = 1.0

    # ─── Handedness ────────────────────────────────────────────────
    if handedness is Handedness.left:
        multiplier *= 1.20
    elif handedness is Handedness.ambidextrous:
        multiplier *= 1.35
    elif handedness is Handedness.not_specified:
        multiplier *= 1.50

    # ─── Sex ───────────────────────────────────────────────────────
    if sex is Sex.not_specified:
        multiplier *= 1.40

    # ─── ParanormalEventType (Only if had it) ───────────────────
    if event_type is ParanormalEventType.not_specified:
        multiplier *= 1.60
    elif event_type in (ParanormalEventType.artefact, ParanormalEventType.spontaneous):
        multiplier *= 1.20
    elif event_type in (ParanormalEventType.place, ParanormalEventType.entity):
        multiplier *= 1.80

    adjusted = base_level * multiplier
    return int(np.clip(round(adjusted), 0, 100))


def generate_staff_member() -> Staff:
    # ─── Numéricos (numpy é ótimo aqui) ──────────────────────────
    age = int(np.clip(np.random.normal(loc=35, scale=8), 18, 65))
    service_time = int(np.clip(np.random.normal(loc=age - 25, scale=4), 0, age - 18))
    missions = max(0, int(np.random.poisson(lam=3)))

    # ─── Booleanos (numpy binomial) ──────────────────────────────
    has_paranormal_parent = bool(np.random.binomial(1, 0.20))
    had_paranormal_event = bool(np.random.binomial(1, 0.60))

    # ─── Categóricos (random.choices preserva objetos enum) ──────
    sex = random.choices(SEX_OPTIONS, weights=SEX_WEIGHTS, k=1)[0]
    handedness = random.choices(HAND_OPTIONS, weights=HAND_WEIGHTS, k=1)[0]

    # ─── Condicionais ────────────────────────────────────────────
    age_first_event = None
    event_type = None

    if had_paranormal_event:
        age_first_event = int(np.clip(np.random.normal(loc=12, scale=5), 0, age))
        event_type = random.choices(EVENT_TYPES, weights=EVENT_WEIGHTS, k=1)[0]

    # ─── Paranormal Level (30% já avaliados) ─────────────────────
    paranormal_level = None
    if np.random.binomial(1, 0.30):
        base = np.random.normal(loc=50, scale=20)
        base = np.clip(base, 0, 100)
        paranormal_level = apply_paranormal_multipliers(
            base, handedness, sex, event_type
        )

    return Staff(
        id=uuid.uuid4(),
        name=f"Agent-{uuid.uuid4().hex[:6].upper()}",
        sex=sex,
        age=age,
        handedness=handedness,
        hasParanormalParent=has_paranormal_parent,
        numberOfMissions=missions,
        serviceTime=service_time,
        hadParanormalEvent=had_paranormal_event,
        ageOfFirstParanormalEvent=age_first_event,
        typeOfFirstParanormalEvent=event_type,
        paranormalLevel=paranormal_level,
    )


def seed(count: int = 60):
    with SessionLocal() as db:
        for _ in range(count):
            member = generate_staff_member()
            db.add(member)
        db.commit()
        print(f"Seeded {count} staff members.")


if __name__ == "__main__":
    seed(60)
