import re
from typing import Any

from src.features.staff.enums import AgeCategory

_AGE_PATTERN = re.compile(r"^\d+$")


def normalize_age(value: Any) -> str | None:
    """
    Normalize an age value for canonical representation as a string.

    Acepts:
      - members of AgeCategory (or their strings: "not_specified", "infinite")
      - non-negative integers, as int or numeric string ("5", "007")

    Returns None if value is None. Raises ValueError for any other
    invalid value (negative, decimal, non-numeric text).
    """
    if value is None:
        return None

    if isinstance(value, AgeCategory):
        return value.value

    text = str(value)

    if text in (AgeCategory.not_specified.value, AgeCategory.infinite.value):
        return text

    if not _AGE_PATTERN.fullmatch(text):
        raise ValueError(
            f"age must be a non-negative integer string or one of "
            f"{[c.value for c in AgeCategory]}, got {value!r}"
        )

    return text
