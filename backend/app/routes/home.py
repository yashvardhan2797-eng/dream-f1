from flask import Blueprint, jsonify

from app.services.openf1 import OpenF1Client

home_bp = Blueprint("home", __name__)

client = OpenF1Client()


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