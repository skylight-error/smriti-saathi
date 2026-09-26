import os
import sys
from flask import Flask, jsonify, request

# Add paths to sys.path so modules can be imported consistently
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from database import (
    init_db,
    create_caregiver,
    set_caregiver_password,
    get_caregiver_by_id,
    create_patient,
    get_patient_by_id,
    authenticate_caregiver,
    get_patients_by_caregiver,
    create_personal_memory,
    get_personal_memories,
    update_personal_memory,
    delete_personal_memory,
    generate_personalized_questions,
    create_game_result,
    get_game_results_by_patient,
    SUPPORTED_LANGUAGES,

)

app = Flask(__name__)

# Initialize database tables on app startup
init_db()


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


@app.route('/api/health', methods=['GET'], strict_slashes=False)
def health_check():
    return jsonify({
        "status": "ok",
        "message": "SmritiSaathi backend is running"
    }), 200

@app.route('/api/caregiver/login', methods=['POST'], strict_slashes=False)
def caregiver_login():
    """Authenticate a caregiver using contact and password."""
    
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request body must be valid JSON"
        }), 400

    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Request body must be a valid JSON object"
        }), 400

    contact = str(data.get("contact") or "").strip()
    password = str(data.get("password") or "")

    if not contact or not password:
        return jsonify({
            "status": "error",
            "message": "Contact and password are required"
        }), 400

    caregiver = authenticate_caregiver(contact, password)

    if not caregiver:
        return jsonify({
            "status": "error",
            "message": "Invalid contact or password"
        }), 401

    return jsonify({
        "status": "success",
        "message": "Login successful",
        "caregiver": caregiver
    }), 200 

    
@app.route('/api/caregivers', methods=['POST'], strict_slashes=False)
def add_caregiver():
    """API 1 — Create Caregiver"""
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request body must be valid JSON"
        }), 400

    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Request body must be a valid JSON object"
        }), 400

    name = data.get("name")
    relationship = data.get("relationship")
    contact = data.get("contact")
    password = data.get("password")

    # Validate required fields
    if not password or not isinstance(password, str) or len(password) < 6:
        return jsonify({
            "status": "error",
            "message": "Password must contain at least 6 characters"
        }), 400

    
    if not name or not isinstance(name, str) or not name.strip():
        return jsonify({
            "status": "error",
            "message": "Field 'name' is required and cannot be empty"
        }), 400

    if not relationship or not isinstance(relationship, str) or not relationship.strip():
        return jsonify({
            "status": "error",
            "message": "Field 'relationship' is required and cannot be empty"
        }), 400

    if contact is None or str(contact).strip() == "":
        return jsonify({
            "status": "error",
            "message": "Field 'contact' is required and cannot be empty"
        }), 400

    
        
       
    caregiver = create_caregiver(
        name=name.strip(),
        relationship=relationship.strip(),
        contact=str(contact).strip()
    )

    set_caregiver_password(caregiver["id"], password)

    return jsonify({
        "status": "success",
        "data": caregiver
    }), 201

@app.route('/api/patients', methods=['POST'], strict_slashes=False)
def add_patient():
    """API 2 — Create Patient"""
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request body must be valid JSON"
        }), 400

    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Request body must be a valid JSON object"
        }), 400

    caregiver_id_raw = data.get("caregiver_id")
    name = data.get("name")
    preferred_language = data.get("preferred_language")

    # Validate caregiver_id format
    if caregiver_id_raw is None:
        return jsonify({
            "status": "error",
            "message": "Field 'caregiver_id' is required"
        }), 400

    try:
        caregiver_id = int(caregiver_id_raw)
    except (ValueError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Field 'caregiver_id' must be a valid integer"
        }), 400

    # Validate caregiver_id exists in database
    caregiver = get_caregiver_by_id(caregiver_id)
    if not caregiver:
        return jsonify({
            "status": "error",
            "message": f"Caregiver with id {caregiver_id} does not exist"
        }), 400

    # Validate name is not empty
    if not name or not isinstance(name, str) or not name.strip():
        return jsonify({
            "status": "error",
            "message": "Field 'name' is required and cannot be empty"
        }), 400

    # Validate preferred_language is supported
    if not preferred_language or not isinstance(preferred_language, str) or not preferred_language.strip():
        return jsonify({
            "status": "error",
            "message": "Field 'preferred_language' is required"
        }), 400

    lang_cleaned = preferred_language.strip()
    matched_lang = None
    for lang in SUPPORTED_LANGUAGES:
        if lang.lower() == lang_cleaned.lower():
            matched_lang = lang
            break

    if not matched_lang:
        return jsonify({
            "status": "error",
            "message": f"Unsupported language '{preferred_language}'. Supported languages: {', '.join(SUPPORTED_LANGUAGES)}"
        }), 400

    patient = create_patient(
        caregiver_id=caregiver_id,
        name=name.strip(),
        preferred_language=matched_lang
    )

    return jsonify({
        "status": "success",
        "data": patient
    }), 201


@app.route('/api/patients/<patient_id>', methods=['GET'], strict_slashes=False)
def get_patient(patient_id):
    """API 3 — Get Patient with linked caregiver information."""
    try:
        p_id = int(patient_id)
    except (ValueError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Patient not found"
        }), 404

    patient = get_patient_by_id(p_id)
    if not patient:
        return jsonify({
            "status": "error",
            "message": f"Patient with id {patient_id} does not exist"
        }), 404

    return jsonify({
        "status": "success",
        "data": patient
    }), 200


@app.route('/api/caregivers/<caregiver_id>/patients', methods=['GET'], strict_slashes=False)
def get_caregiver_patients(caregiver_id):
    """API 4 — Get Caregiver's Patient list."""
    try:
        c_id = int(caregiver_id)
    except (ValueError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Caregiver not found"
        }), 404

    caregiver = get_caregiver_by_id(c_id)
    if not caregiver:
        return jsonify({
            "status": "error",
            "message": f"Caregiver with id {caregiver_id} does not exist"
        }), 404

    patients = get_patients_by_caregiver(c_id)
    return jsonify({
        "status": "success",
        "data": patients
    }), 200


@app.route('/api/game-results', methods=['POST'], strict_slashes=False)
def receive_game_results():
    """
    Receives cognitive game performance data from the frontend,
    validates the incoming JSON payload, and returns a response.
    """
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Request body must be valid JSON"
        }), 400

    data = request.get_json(silent=True)
    if data is None or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Request body must be a valid JSON object"
        }), 400

    required_fields = ['patient_id', 'game', 'accuracy', 'mistakes', 'completion_time', 'difficulty']
    for field in required_fields:
        if field not in data:
            return jsonify({
                "status": "error",
                "message": f"Missing required field: '{field}'"
            }), 400

    patient_id = data.get('patient_id')
    game = data.get('game')
    accuracy = data.get('accuracy')
    mistakes = data.get('mistakes')
    completion_time = data.get('completion_time')
    difficulty = data.get('difficulty')

    hints = data.get('hints', 0)
    if hints is None:
        hints = 0

    if not isinstance(patient_id, int) or isinstance(patient_id, bool) or patient_id <= 0:
        return jsonify({
            "status": "error",
            "message": "Field 'patient_id' must be a valid positive integer"
        }), 400

    if not isinstance(game, str) or not game.strip():
        return jsonify({
            "status": "error",
            "message": "Field 'game' must be a non-empty string"
        }), 400

    if not isinstance(accuracy, (int, float)) or isinstance(accuracy, bool) or not (0 <= accuracy <= 100):
        return jsonify({
            "status": "error",
            "message": "Field 'accuracy' must be a numeric value between 0 and 100"
        }), 400

    if not isinstance(mistakes, int) or isinstance(mistakes, bool) or mistakes < 0:
        return jsonify({
            "status": "error",
            "message": "Field 'mistakes' must be a non-negative integer"
        }), 400

    if not isinstance(completion_time, (int, float)) or isinstance(completion_time, bool) or completion_time <= 0:
        return jsonify({
            "status": "error",
            "message": "Field 'completion_time' must be a numeric value greater than 0"
        }), 400

    if not isinstance(hints, int) or isinstance(hints, bool) or hints < 0:
        return jsonify({
            "status": "error",
            "message": "Field 'hints' must be a non-negative integer"
        }), 400

    valid_difficulties = ['easy', 'medium', 'hard']
    if not isinstance(difficulty, str) or difficulty not in valid_difficulties:
        return jsonify({
            "status": "error",
            "message": "Field 'difficulty' must be one of: easy, medium, hard"
        }), 400
    result = create_game_result(
        patient_id=patient_id,
        game=game.strip(),
        accuracy=accuracy,
        mistakes=mistakes,
        completion_time=completion_time,
        difficulty=difficulty,
        hints=hints
    )
    return jsonify({
            "status": "success",
            "message": "Game result received successfully",
            "data": {
                "patient_id": patient_id,
                "game": game,
                "accuracy": accuracy,
                "mistakes": mistakes,
                "completion_time": completion_time,
                "hints": hints,
                "difficulty": difficulty
            }
        }), 200


@app.route('/api/patients/<int:patient_id>/game-results', methods=['GET'], strict_slashes=False)
def get_patient_game_results(patient_id):
    """Return all cognitive game results for a patient."""

    patient = get_patient_by_id(patient_id)

    if not patient:
        return jsonify({
            "status": "error",
            "message": "Patient not found"
        }), 404

    results = get_game_results_by_patient(patient_id)

    return jsonify({
        "status": "success",
        "message": "Game results retrieved successfully",
        "data": results
    }), 200
@app.route('/api/patients/<int:patient_id>/memories', methods=['POST'], strict_slashes=False)
def add_personal_memory(patient_id):
    """Add a new personal memory for a patient."""

    # Check if patient exists
    patient = get_patient_by_id(patient_id)

    if not patient:
        return jsonify({
            "status": "error",
            "message": "Patient not found"
        }), 404

    # Get caregiver-provided memory information
    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Memory information is required"
        }), 400

    memory_type = str(data.get("memory_type", "")).strip()
    name = str(data.get("name", "")).strip()

    relationship = data.get("relationship")
    description = data.get("description")
    image_path = data.get("image_path")

    if not memory_type:
        return jsonify({
            "status": "error",
            "message": "memory_type is required"
        }), 400

    if not name:
        return jsonify({
            "status": "error",
            "message": "name is required"
        }), 400

    allowed_types = [
        "self",
        "family",
        "place",
        "event",
        "favorite"
    ]

    if memory_type.lower() not in allowed_types:
        return jsonify({
            "status": "error",
            "message": "Invalid memory type"
        }), 400

    memory = create_personal_memory(
        patient_id=patient_id,
        memory_type=memory_type.lower(),
        name=name,
        relationship=relationship,
        description=description,
        image_path=image_path
    )

    return jsonify({
        "status": "success",
        "message": "Personal memory added successfully",
        "data": memory
    }), 201

@app.route(
    '/api/patients/<int:patient_id>/memories',
    methods=['GET'],
    strict_slashes=False
)
def view_personal_memories(patient_id):
    """Return all personal memories for a patient."""


    patient = get_patient_by_id(patient_id)

    if not patient:
        return jsonify({
            "status": "error",
            "message": "Patient not found"
        }), 404



    memories = get_personal_memories(patient_id)

    return jsonify({
        "status": "success",
        "message": "Personal memories retrieved successfully",
        "data": memories
    }), 200



@app.route(
    '/api/patients/<int:patient_id>/memories/<int:memory_id>',
    methods=['PUT'],
    strict_slashes=False
)
def edit_personal_memory(patient_id, memory_id):
    """Update an existing personal memory.""" 

    patient = get_patient_by_id(patient_id)

    if not patient:
        return jsonify({
            "status": "error",
            "message": "Patient not found"
        }), 404

    data = request.get_json(silent=True)

    if not data or not isinstance(data, dict):
        return jsonify({
            "status": "error",
            "message": "Memory information is required"
        }), 400

    memory_type = data.get("memory_type")
    name = data.get("name")
    relationship = data.get("relationship")
    description = data.get("description")
    image_path = data.get("image_path")

    try:
        memory = update_personal_memory(
            memory_id=memory_id,
            patient_id=patient_id,
            memory_type=memory_type,
            name=name,
            relationship=relationship,
            description=description,
            image_path=image_path
        )
    except ValueError as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

    if not memory:
        return jsonify({
            "status": "error",
            "message": "Memory not found"
        }), 404

    return jsonify({
        "status": "success",
        "message": "Personal memory updated successfully",
        "data": memory
    }), 200


@app.route(
    '/api/patients/<int:patient_id>/memories/<int:memory_id>',
    methods=['DELETE'],
    strict_slashes=False
)
def remove_personal_memory(patient_id, memory_id):
    """Delete a personal memory."""

    patient = get_patient_by_id(patient_id)

    if not patient:
        return jsonify({
            "status": "error",
            "message": "Patient not found"
        }), 404

    deleted = delete_personal_memory(
        memory_id=memory_id,
        patient_id=patient_id
    )

    if not deleted:
        return jsonify({
            "status": "error",
            "message": "Memory not found"
        }), 404

    return jsonify({
        "status": "success",
        "message": "Personal memory deleted successfully"
    }), 200


@app.route(
    '/api/patients/<int:patient_id>/personalized-questions',
    methods=['GET'],
    strict_slashes=False
)
def get_personalized_questions(patient_id):
    """Return personalized questions generated from the current Memory Bank."""

    patient = get_patient_by_id(patient_id)

    if not patient:
        return jsonify({
            "status": "error",
            "message": "Patient not found"
        }), 404

    questions = generate_personalized_questions(patient_id)

    return jsonify({
        "status": "success",
        "message": "Personalized questions generated successfully",
        "data": questions
    }), 200


if __name__ == '__main__':
    app.run(debug=True)


    




