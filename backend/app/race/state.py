from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict


@dataclass
class RaceState:
    series: str = "f1"
    event_name: str = ""
    session_name: str = ""
    lap: Optional[int] = None
    leader: Optional[str] = None
    gap_to_leader: Optional[float] = None
    weather: Dict = None
    flag: str = "GREEN"
    timestamp: datetime = None
    source: str = "unknown"

    def __post_init__(self):
        if self.weather is None:
            self.weather = {}
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()

    def is_valid(self) -> bool:
        return bool(self.event_name and self.session_name)