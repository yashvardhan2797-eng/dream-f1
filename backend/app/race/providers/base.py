from abc import ABC, abstractmethod
from app.race.state import RaceState


class BaseProvider(ABC):
    @abstractmethod
    async def get_current_state(self) -> RaceState | None:
        pass

    @abstractmethod
    async def get_standings(self, season: str = "current"):
        pass