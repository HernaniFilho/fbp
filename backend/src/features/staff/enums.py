import enum


class Sex(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"
    not_specified = "not_specified"


class Handedness(str, enum.Enum):
    left = "left"
    right = "right"
    ambidextrous = "ambidextrous"
    not_specified = "not_specified"


class ParanormalEventType(str, enum.Enum):
    not_specified = "not_specified"
    artefact = "artefact"
    place = "place"
    entity = "entity"
    spontaneous = "spontaneous"
