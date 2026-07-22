from flask import Flask

from app.race.engine import RaceEngine


def create_app():

    app = Flask(__name__)

    # Create ONE shared RaceEngine instance
    app.race_engine = RaceEngine()

    # Import routes only after the app exists
    from app.routes.home import home_bp
    from app.routes.test import test_bp

    app.register_blueprint(home_bp)
    app.register_blueprint(test_bp)

    return app