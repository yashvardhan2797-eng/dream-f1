from flask import Flask

from app.routes.home import home_bp
from app.routes.test import test_bp

# Import the new Race Engine
from app.race.engine import RaceEngine


def create_app():
    app = Flask(__name__)

    app.register_blueprint(home_bp)
    app.register_blueprint(test_bp)

    # Make RaceEngine available to all routes
    app.race_engine = RaceEngine()

    return app