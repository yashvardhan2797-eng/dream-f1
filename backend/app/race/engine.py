from app.race.state import RaceState

# Correct imports
from app.race.providers.openf1 import OpenF1Provider
from app.race.providers.jolpica import JolpicaProvider


class RaceEngine:
    def __init__(self):
        self.providers = [
            OpenF1Provider(),   # Try first
            JolpicaProvider()   # Backup
        ]
        self.last_valid_state = None

    async def get_current_race(self) -> RaceState:
        for provider in self.providers:
            try:
                state = await provider.get_current_state()
                if state and state.is_valid():
                    self.last_valid_state = state
                    return state
            except Exception as e:
                print(f"[RaceEngine] Error with {type(provider).__name__}: {e}")

        # Use cached data if available
        if self.last_valid_state:
            return self.last_valid_state

        return RaceState(
            event_name="Formula 1",
            session_name="Live Session",
            source="fallback"
        )

    async def get_standings(self):
        return await self.providers[1].get_standings()