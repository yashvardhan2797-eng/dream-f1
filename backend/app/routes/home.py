from flask import Blueprint, jsonify
from app.services.jolpica import JolpicaClient
from app.services.openf1 import OpenF1Client
from app.ai.commentary import CommentaryGenerator

home_bp = Blueprint("home", __name__)

jolpica_client = JolpicaClient()
openf1_client = OpenF1Client()
commentary_generator = CommentaryGenerator()


@home_bp.route("/")
def home():
    return jsonify({
        "application": "Formula Fan",
        "status": "Running",
        "version": "0.1.0"
    })

@home_bp.route("/driver-standings")
def driver_standings():
    try:
        standings = jolpica_client.get_driver_standings()
        return jsonify(standings)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@home_bp.route("/constructors")
def constructors():
    try:
        standings = jolpica_client.get_constructor_standings()
        return jsonify(standings)
    except Exception as e:
        return jsonify({"error": str(e)}), 500    


@home_bp.route("/dashboard")
def dashboard():
    try:
        return jsonify(openf1_client.get_dashboard_data())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@home_bp.route("/commentary")
async def ai_commentary():
    # NEW: Use Race Engine
    from app import create_app
    engine = create_app().race_engine
    race_state = await engine.get_current_race()

    race_info = f"""
    Event: {race_state.event_name}
    Session: {race_state.session_name}
    Leader: {race_state.leader or 'Unknown'}
    """

    commentary = commentary_generator.generate(race_info)

    return jsonify({
        "commentary": commentary,
        "source": race_state.source
    })