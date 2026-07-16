from app.services.jolpica import JolpicaClient
from app.race.state import RaceState
from app.race.providers.base import BaseProvider


class JolpicaProvider(BaseProvider):
    def __init__(self):
        self.client = JolpicaClient()

    async def get_current_state(self) -> RaceState | None:
        try:
            data = self.client.get_driver_standings()
            if data and len(data) > 0:
                leader = f"{data[0]['Driver']['givenName']} {data[0]['Driver']['familyName']}"
                return RaceState(
                    event_name="Current F1 Season",
                    session_name="Championship",
                    leader=leader,
                    source="jolpica"
                )
        except:
            pass
        return None

    async def get_standings(self, season: str = "current"):
        return self.client.get_driver_standings(season)