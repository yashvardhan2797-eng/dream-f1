"""
==========================================================
Formula Fan

FastF1 Provider

Purpose:
Provides telemetry, lap data, weather and historical
session analysis using FastF1.

Developer:
Yashvardhan Rathore
==========================================================
"""

from pathlib import Path
 
import fastf1

from app.race.providers.base import BaseProvider


class FastF1Provider(BaseProvider):

    def __init__(self):

        cache_path = Path(__file__).resolve().parents[3] / "cache"

        cache_path.mkdir(exist_ok=True)

        fastf1.Cache.enable_cache(str(cache_path))

    async def get_session(self, year, gp, session_type):

        session = fastf1.get_session(
            year,
            gp,
            session_type
        )

        session.load()

        return session

    async def get_current_state(self):
        return None

    async def get_standings(self):
        return None