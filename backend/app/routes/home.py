"""
Formula Fan
Home Routes
"""

from flask import Blueprint, jsonify
import requests

home_bp = Blueprint("home", __name__)


@home_bp.route("/")
def home():
    return jsonify({
        "application": "Formula Fan",
        "status": "Running",
        "version": "0.1.0"
    })


@home_bp.route("/drivers")
def drivers():

    url = "https://api.openf1.org/v1/drivers"

    response = requests.get(url, timeout=5)

    return jsonify(response.json())