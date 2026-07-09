from flask import Blueprint, jsonify

from app.config import Config

test_bp = Blueprint("test", __name__)


@test_bp.route("/test-config")
def test_config():

    return jsonify({
        "groq_key_loaded": Config.GROQ_API_KEY is not None
    })
