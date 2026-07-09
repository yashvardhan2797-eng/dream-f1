from flask import Blueprint, jsonify

from app.services.openf1 import OpenF1Client

from app.services.jolpica import JolpicaClient

from app.ai.commentary import CommentaryGenerator

home_bp = Blueprint("home", __name__)

client = OpenF1Client()
commentary_generator = CommentaryGenerator()

jolpica_client = JolpicaClient()


@home_bp.route("/")
def home():

    return jsonify({
        "application": "Formula Fan",
        "status": "Running",
        "version": "0.1.0"
    })


@home_bp.route("/drivers")
def drivers():

    return jsonify(client.get_drivers())


@home_bp.route("/session")
def session():
    return jsonify(client.get_latest_session())

@home_bp.route("/meetings")
def meetings():

    return jsonify(client.get_meetings())

@home_bp.route("/latest-meeting")
def latest_meeting():

    return jsonify(client.get_latest_meeting())

@home_bp.route("/latest-session")
def latest_session():

    return jsonify(client.get_latest_session())

@home_bp.route("/dashboard")
def dashboard():

    return jsonify(client.get_dashboard_data())

@home_bp.route("/constructors")
def constructors():

    return jsonify(
        jolpica_client.get_constructor_standings()
    )

@home_bp.route("/driver-standings")
def driver_standings():

    return jsonify(
        jolpica_client.get_driver_standings()
    )

@home_bp.route("/commentary")
def ai_commentary():

    race_data = """
    Abu Dhabi Grand Prix

    Leader:
    Max Verstappen

    Lap:
    35

    Weather:
    Clear

    Gap:
    2.1 seconds
    """

    return jsonify({
        "commentary": commentary_generator.generate(race_data)
    })