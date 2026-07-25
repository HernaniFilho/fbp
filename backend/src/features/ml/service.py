import os

import joblib
import numpy as np
import pandas as pd
from fastapi import HTTPException

from src.features.staff.models import Staff

MODEL_PATH = os.getenv("MODEL_PATH", "models/paranormal_regressor.pkl")

_model_data = None


def get_model():
    global _model_data
    if _model_data is None:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(
                status_code=503,
                detail="ML model not trained yet. Run train.py first.",
            )
        _model_data = joblib.load(MODEL_PATH)
    return _model_data


def staff_to_features(member: Staff) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "age": member.age,
                "sex": member.sex.value if member.sex else None,
                "handedness": member.handedness.value if member.handedness else None,
                "hasParanormalParent": member.hasParanormalParent,
                "numberOfMissions": member.numberOfMissions,
                "serviceTime": member.serviceTime,
                "hadParanormalEvent": member.hadParanormalEvent,
                "ageOfFirstParanormalEvent": member.ageOfFirstParanormalEvent,
                "typeOfFirstParanormalEvent": (
                    member.typeOfFirstParanormalEvent.value
                    if member.typeOfFirstParanormalEvent
                    else None
                ),
            }
        ]
    )


def predict_paranormal_level(member: Staff) -> int:
    model_data = get_model()
    pipeline = model_data["pipeline"]

    X = staff_to_features(member)
    prediction = pipeline.predict(X)[0]

    return int(np.clip(round(prediction), 0, 100))


def predict_batch(members: list[Staff]) -> list[int]:
    model_data = get_model()
    pipeline = model_data["pipeline"]

    if not members:
        return []

    X = pd.concat([staff_to_features(m) for m in members], ignore_index=True)
    predictions = pipeline.predict(X)

    return [int(np.clip(round(p), 0, 100)) for p in predictions]
