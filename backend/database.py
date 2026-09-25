"""SmritiSaathi — SQLite data layer (plain sqlite3, no ORM).

Architecture
------------
    caregivers ──< patients ──< personal_memories
    quizzes ──< questions

Trust model (important for the hackathon demo)
----------------------------------------------
* The caregiver is the single trusted source of personal facts. This layer
  only stores what the caregiver explicitly provides — it never invents
  family relationships, names, places, events or favorite things.
* The future personalized question generator will use deterministic templates
  over the Memory Bank, e.g.:
      - family/Priya/Daughter -> "What is your daughter's name?" (answer: Priya)
      - approved photo        -> "Who is she?"
      - place memory          -> "Which place is familiar to you?"
* Incorrect answers are game/analytics data only. They are NEVER a medical
  diagnosis or proof of dementia progression.

Conventions
-----------
* sqlite3.Row + parameterized SQL everywhere (no string-concatenated SQL)
* PRAGMA foreign_keys = ON on every connection
* CREATE TABLE IF NOT EXISTS + CURRENT_TIMESTAMP (no DROP, no seeding)
* DB path: database/smriti.db, overridable via SMRITI_DB_PATH env var
* The database directory is created automatically
"""

import os
import sqlite3

# Project-root-relative default, so the path works from any working directory.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "database", "smriti.db")

SUPPORTED_LANGUAGES = [
    "Assamese",
    "Manipuri",
    "Bengali",
    "Bodo",
    "Hindi",
]

# Memory Bank concepts: self, family, place, event, favorite
SUPPORTED_MEMORY_TYPES = [
    "self",
    "family",
    "place",
    "event",
    "favorite",
]

# Keep this identical to the live database/smriti.db schema so that an
# existing database keeps working unchanged (CREATE TABLE IF NOT EXISTS).
SCHEMA = """
CREATE TABLE IF NOT EXISTS caregivers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    contact TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caregiver_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    preferred_language TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (caregiver_id) REFERENCES caregivers (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personal_memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    memory_type TEXT NOT NULL,
    name TEXT NOT NULL,
    relationship TEXT,
    description TEXT,
    image_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    language TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT,
    correct_option TEXT NOT NULL,
    image_path TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
);
"""


# ---------------------------------------------------------------------------
# Connection + small query helpers
# ---------------------------------------------------------------------------

def get_db_path():
    """SMRITI_DB_PATH if set, otherwise <project>/database/smriti.db."""
    return os.environ.get("SMRITI_DB_PATH") or DEFAULT_DB_PATH


def get_db_connection():
    """Open a connection with sqlite3.Row and foreign keys enabled."""
    db_path = get_db_path()
    directory = os.path.dirname(os.path.abspath(db_path))
    os.makedirs(directory, exist_ok=True)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def _fetch_one(sql, params=()):
    conn = get_db_connection()
    try:
        row = conn.execute(sql, params).fetchone()
        return dict(row) if row else None
    finally:
        conn.close()


def _fetch_all(sql, params=()):
    conn = get_db_connection()
    try:
        return [dict(row) for row in conn.execute(sql, params).fetchall()]
    finally:
        conn.close()


def _insert(sql, params=()):
    conn = get_db_connection()
    try:
        cursor = conn.execute(sql, params)
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()


def _execute(sql, params=()):
    """Run an UPDATE/DELETE and return the number of affected rows."""
    conn = get_db_connection()
    try:
        cursor = conn.execute(sql, params)
        conn.commit()
        return cursor.rowcount
    finally:
        conn.close()


def _require(condition, message):
    """Raise ValueError when a precondition fails."""
    if not condition:
        raise ValueError(message)
    return condition


def _normalize_language(preferred_language):
    """Case-insensitive match against SUPPORTED_LANGUAGES -> canonical name."""
    language = str(preferred_language or "").strip().lower()
    for supported in SUPPORTED_LANGUAGES:
        if supported.lower() == language:
            return supported
    raise ValueError(
        "Unsupported language '{}'. Supported languages: {}".format(
            preferred_language, ", ".join(SUPPORTED_LANGUAGES)
        )
    )


def _clean(value):
    """Trim whitespace; empty/None becomes None (for nullable text fields)."""
    if value is None:
        return None
    text = str(value).strip()
    return text or None


# ---------------------------------------------------------------------------
# Database setup
# ---------------------------------------------------------------------------

def init_db():
    """Create the database directory and all tables if they do not exist.

    Never drops anything: an existing database/smriti.db with test records
    is left untouched.
    """
    conn = get_db_connection()
    try:
        conn.executescript(SCHEMA)
        conn.commit()
    finally:
        conn.close()
    return get_db_path()


# ---------------------------------------------------------------------------
# 1. Caregiver
# ---------------------------------------------------------------------------

def create_caregiver(name, relationship, contact):
    """Insert a new caregiver and return the created record."""
    name = str(name or "").strip()
    relationship = str(relationship or "").strip()
    contact = str(contact or "").strip()

    _require(name, "Caregiver 'name' is required.")
    _require(relationship, "Caregiver 'relationship' is required.")
    _require(contact, "Caregiver 'contact' is required.")

    caregiver_id = _insert(
        "INSERT INTO caregivers (name, relationship, contact) VALUES (?, ?, ?)",
        (name, relationship, contact),
    )
    return get_caregiver_by_id(caregiver_id)


def get_caregiver_by_id(caregiver_id):
    """Retrieve a caregiver record by ID, or None if it does not exist."""
    return _fetch_one(
        """
        SELECT id, name, relationship, contact, created_at
        FROM caregivers
        WHERE id = ?
        """,
        (caregiver_id,),
    )


# ---------------------------------------------------------------------------
# 2. Patient (always linked to a caregiver)
# ---------------------------------------------------------------------------

def create_patient(caregiver_id, name, preferred_language):
    """Insert a patient linked to an existing caregiver and return the record."""
    _require(
        get_caregiver_by_id(caregiver_id),
        "Caregiver with id {} does not exist".format(caregiver_id),
    )

    name = str(name or "").strip()
    _require(name, "Patient 'name' is required.")
    language = _normalize_language(preferred_language)

    patient_id = _insert(
        "INSERT INTO patients (caregiver_id, name, preferred_language) VALUES (?, ?, ?)",
        (caregiver_id, name, language),
    )
    return get_patient_by_id(patient_id)


def get_patient_by_id(patient_id):
    """
    Retrieve a patient by ID along with the linked caregiver's
    name, relationship and contact. Returns None if not found.

    The returned dict carries the legacy alias keys (patient_id,
    patient_name, created_timestamp) used by the existing frontend/API.
    """
    row = _fetch_one(
        """
        SELECT
            p.id AS id,
            p.name AS name,
            p.preferred_language AS preferred_language,
            p.created_at AS created_at,
            p.caregiver_id AS caregiver_id,
            c.name AS caregiver_name,
            c.relationship AS caregiver_relationship,
            c.contact AS caregiver_contact
        FROM patients p
        LEFT JOIN caregivers c ON p.caregiver_id = c.id
        WHERE p.id = ?
        """,
        (patient_id,),
    )
    return _patient_dict(row)


def get_patients_by_caregiver(caregiver_id):
    """Retrieve all patients linked to a specific caregiver."""
    rows = _fetch_all(
        """
        SELECT id, caregiver_id, name, preferred_language, created_at
        FROM patients
        WHERE caregiver_id = ?
        ORDER BY id ASC
        """,
        (caregiver_id,),
    )
    return [_patient_dict(row) for row in rows]


def delete_patient(patient_id):
    """Delete a patient; their memories go away via ON DELETE CASCADE."""
    return _execute("DELETE FROM patients WHERE id = ?", (patient_id,)) > 0


def _patient_dict(row):
    """Patient payload with the legacy alias keys the frontend already uses."""
    if not row:
        return None
    patient = {
        "id": row["id"],
        "patient_id": row["id"],
        "caregiver_id": row["caregiver_id"],
        "name": row["name"],
        "patient_name": row["name"],
        "preferred_language": row["preferred_language"],
        "created_at": row["created_at"],
        "created_timestamp": row["created_at"],
    }
    # Only present when the query joined caregiver information.
    if "caregiver_name" in row.keys():
        patient["caregiver_name"] = row["caregiver_name"]
        patient["caregiver_relationship"] = row["caregiver_relationship"]
        patient["caregiver_contact"] = row["caregiver_contact"]
    return patient


# ---------------------------------------------------------------------------
# 3. Personal Memory Bank
# ---------------------------------------------------------------------------
# Caregivers can keep adding facts any time — weekly, monthly, or whenever
# something new comes up. Everything stored here is caregiver-provided;
# nothing is generated or guessed by the system.

def _validate_memory(memory_type, name):
    """Validate + normalize the two required Memory Bank fields."""
    memory_type = str(memory_type or "").strip().lower()
    _require(
        memory_type in SUPPORTED_MEMORY_TYPES,
        "Invalid memory type '{}'. Supported types: {}".format(
            memory_type, ", ".join(SUPPORTED_MEMORY_TYPES)
        ),
    )
    name = str(name or "").strip()
    _require(name, "Memory 'name' is required.")
    return memory_type, name


def create_personal_memory(
    patient_id,
    memory_type,
    name,
    relationship=None,
    description=None,
    image_path=None,
):
    """Save one caregiver-provided memory and return the created record."""
    _require(
        get_patient_by_id(patient_id),
        "Patient with id {} does not exist".format(patient_id),
    )
    memory_type, name = _validate_memory(memory_type, name)

    memory_id = _insert(
        """
        INSERT INTO personal_memories
            (patient_id, memory_type, name, relationship, description, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            patient_id,
            memory_type,
            name,
            _clean(relationship),
            _clean(description),
            _clean(image_path),
        ),
    )
    return get_personal_memory_by_id(memory_id)

def generate_personalized_questions(patient_id):
    """Generate personalized questions from the patient's current Memory Bank."""

    memories = get_personal_memories(patient_id)
    questions = []

    for memory in memories:
        memory_type = memory["memory_type"]
        name = memory["name"]
        relationship = memory.get("relationship")

        if memory_type == "family" and relationship:
            question = {
                "question": f"What is your {relationship.lower()}'s name?",
                "correct_answer": name,
                "memory_id": memory["id"],
                "memory_type": memory_type
            }

            questions.append(question)

        elif memory_type == "self":
            questions.append({
                "question": "What is your name?",
                "correct_answer": name,
                "memory_id": memory["id"],
                "memory_type": memory_type
            })

        elif memory_type == "place":
            questions.append({
                "question": "Which place is familiar to you?",
                "correct_answer": name,
                "memory_id": memory["id"],
                "memory_type": memory_type
            })

        elif memory_type == "event":
            questions.append({
                "question": "Which event is part of your memories?",
                "correct_answer": name,
                "memory_id": memory["id"],
                "memory_type": memory_type
            })

        elif memory_type == "favorite":
            questions.append({
                "question": "Which of these is one of your favorite things?",
                "correct_answer": name,
                "memory_id": memory["id"],
                "memory_type": memory_type
            })

    return questions


def get_personal_memories(patient_id):
    """All Memory Bank entries for a patient, newest records first."""
    return _fetch_all(
        """
        SELECT id, patient_id, memory_type, name, relationship,
               description, image_path, created_at
        FROM personal_memories
        WHERE patient_id = ?
        ORDER BY created_at DESC, id DESC
        """,
        (patient_id,),
    )


def get_personal_memory_by_id(memory_id):
    """Return one Memory Bank entry as a dict, or None."""
    return _fetch_one(
        """
        SELECT id, patient_id, memory_type, name, relationship,
               description, image_path, created_at
        FROM personal_memories
        WHERE id = ?
        """,
        (memory_id,),
    )


def update_personal_memory(
    memory_id,
    patient_id,
    memory_type,
    name,
    relationship=None,
    description=None,
    image_path=None,
):
    """Edit a memory. It must belong to the given patient."""
    existing = get_personal_memory_by_id(memory_id)
    _require(existing, "Memory with id {} does not exist".format(memory_id))
    _require(
        existing["patient_id"] == patient_id,
        "Memory with id {} does not belong to patient {}".format(
            memory_id, patient_id
        ),
    )
    memory_type, name = _validate_memory(memory_type, name)

    _execute(
        """
        UPDATE personal_memories
        SET memory_type = ?,
            name = ?,
            relationship = ?,
            description = ?,
            image_path = ?
        WHERE id = ? AND patient_id = ?
        """,
        (
            memory_type,
            name,
            _clean(relationship),
            _clean(description),
            _clean(image_path),
            memory_id,
            patient_id,
        ),
    )
    return get_personal_memory_by_id(memory_id)


def delete_personal_memory(memory_id, patient_id):
    """Delete a memory only if it belongs to the given patient.

    Returns True when deleted, False when it does not exist (or belongs
    to a different patient).
    """
    return (
        _execute(
            "DELETE FROM personal_memories WHERE id = ? AND patient_id = ?",
            (memory_id, patient_id),
        )
        > 0
    )


    


# ---------------------------------------------------------------------------
# 4. Personalized Quiz Foundation
# ---------------------------------------------------------------------------
# Tables + basic CRUD only. The personalized question-generation engine comes
# later: deterministic templates over the caregiver-approved Memory Bank
# (photos of daughters, homes, wedding events, ...).
# Never invent personal answer options, and never treat a wrong answer as a
# medical diagnosis.

def create_quiz(title, category, language):
    """Create a quiz shell (questions are added separately)."""
    quiz_id = _insert(
        "INSERT INTO quizzes (title, category, language) VALUES (?, ?, ?)",
        (
            str(title or "").strip(),
            str(category or "").strip(),
            _normalize_language(language),
        ),
    )
    return _fetch_one("SELECT * FROM quizzes WHERE id = ?", (quiz_id,))


def get_quizzes():
    """List all quizzes."""
    return _fetch_all("SELECT * FROM quizzes ORDER BY id ASC")


def create_question(
    quiz_id,
    question_text,
    option_a,
    option_b,
    correct_option,
    option_c=None,
    image_path=None,
):
    """Add one question to a quiz."""
    _require(
        _fetch_one("SELECT id FROM quizzes WHERE id = ?", (quiz_id,)),
        "Quiz with id {} does not exist".format(quiz_id),
    )
    correct_option = str(correct_option or "").strip().upper()
    _require(correct_option in ("A", "B", "C"), "correct_option must be A, B or C")
    if correct_option == "C":
        _require(option_c, "option_c is required when correct_option is C")

    question_id = _insert(
        """
        INSERT INTO questions
            (quiz_id, question_text, option_a, option_b, option_c,
             correct_option, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            quiz_id,
            str(question_text or "").strip(),
            str(option_a or "").strip(),
            str(option_b or "").strip(),
            _clean(option_c),
            correct_option,
            _clean(image_path),
        ),
    )
    return _fetch_one("SELECT * FROM questions WHERE id = ?", (question_id,))


def get_questions_by_quiz(quiz_id):
    """List every question belonging to a quiz."""
    return _fetch_all(
        "SELECT * FROM questions WHERE quiz_id = ? ORDER BY id ASC",
        (quiz_id,),
    )
