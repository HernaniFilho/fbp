import os

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from src.core.database import SessionLocal
from src.features.staff.models import Staff

MODEL_PATH = os.getenv("MODEL_PATH", "models/paranormal_regressor.pkl")


def fetch_training_data():
    """Search the database for members with known paranormalLevel."""
    with SessionLocal() as db:
        members = db.query(Staff).filter(Staff.paranormalLevel.isnot(None)).all()
        return members


def build_dataset(members: list[Staff]) -> pd.DataFrame:
    records = []
    for m in members:
        records.append(
            {
                "age": m.age,
                "sex": m.sex.value if m.sex else None,
                "handedness": m.handedness.value if m.handedness else None,
                "hasParanormalParent": m.hasParanormalParent,
                "numberOfMissions": m.numberOfMissions,
                "serviceTime": m.serviceTime,
                "hadParanormalEvent": m.hadParanormalEvent,
                "ageOfFirstParanormalEvent": m.ageOfFirstParanormalEvent,
                "typeOfFirstParanormalEvent": (
                    m.typeOfFirstParanormalEvent.value
                    if m.typeOfFirstParanormalEvent
                    else None
                ),
                "paranormalLevel": m.paranormalLevel,
            }
        )
    return pd.DataFrame(records)


def train():
    members = fetch_training_data()
    if len(members) < 5:
        raise RuntimeError("Need at least 5 labeled members to train.")

    df = build_dataset(members)
    df = df.dropna(subset=["paranormalLevel"])

    X = df.drop(columns=["paranormalLevel"])
    y = df["paranormalLevel"]

    # Features categóricas e numéricas
    categorical = ["sex", "handedness", "typeOfFirstParanormalEvent"]
    numeric = [
        "age",
        "hasParanormalParent",
        "numberOfMissions",
        "serviceTime",
        "hadParanormalEvent",
        "ageOfFirstParanormalEvent",
    ]

    # ─── Pipeline com Imputers ─────────────────────────────────────
    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", categorical_pipeline, categorical),
            ("num", numeric_pipeline, numeric),
        ],
        remainder="drop",
    )

    pipeline = Pipeline(
        [
            ("preprocess", preprocessor),
            ("regressor", LinearRegression()),
        ]
    )

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    pipeline.fit(X_train, y_train)
    score = pipeline.score(X_test, y_test)

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(
        {
            "pipeline": pipeline,
            "features": list(X.columns),
            "categorical_features": categorical,
            "numeric_features": numeric,
            "score": score,
            "samples": len(df),
        },
        MODEL_PATH,
    )

    print(f"[@] Model trained — R²={score:.3f} on {len(df)} samples")
    print(f"[@] Saved to {MODEL_PATH}")


if __name__ == "__main__":
    train()
