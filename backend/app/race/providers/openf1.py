from app.services.openf1 import OpenF1Client
from app.race.state import RaceState
from app.race.providers.base import BaseProvider


class OpenF1Provider(BaseProvider):
    def __init__(self):
        self.client = OpenF1Client()

    async def get_current_state(self) -> RaceState | None:
        try:
            data = self.client.get_dashboard_data()

            if not data or not isinstance(data, dict):
                return None

            meeting = data.get("meeting")
            session = data.get("session")

            if not meeting or not session:
                return None

            return RaceState(
                event_name=meeting.get("meeting_name", "Unknown GP"),
                session_name=session.get("session_name", "Unknown Session"),
                lap=None,
                leader=None,
                source="openf1"
            )
        except Exception as e:
            print(f"OpenF1Provider error: {e}")
            return None

    async def get_standings(self, season: str = "current"):
        return None