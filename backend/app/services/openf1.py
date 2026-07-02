"""
==========================================================
Formula Fan

File: openf1.py

Purpose:
Provides Formula Fan's interface to the OpenF1 API.

Developer:
Yashvardhan Rathore

==========================================================
"""

from app.services.api_client import APIClient


class OpenF1Client(APIClient):

    def __init__(self):
        super().__init__("https://api.openf1.org/v1")

    def get_drivers(self):
        return self.get("drivers")

    def get_sessions(self, meeting_key=None):

        params = {}

        if meeting_key:
            params["meeting_key"] = meeting_key

        return self.get("sessions", params=params)
    
    def get_latest_session(self):

        meeting = self.get_latest_meeting()

        if not meeting:
            return None

        meeting_key = meeting["meeting_key"]

        sessions = self.get_sessions(meeting_key)

        if not sessions:
           return None

        latest = max(
          sessions,
          key=lambda session: session["date_start"]
    )

        return latest
    
    def get_dashboard_data(self):

       meeting = self.get_latest_meeting()

       session = self.get_latest_session()

       drivers = self.get_current_drivers()

       return {
        "meeting": meeting,
        "session": session,
        "drivers": drivers
    }
    
    def get_meetings(self):
        return self.get("meetings")
    
    def get_latest_meeting(self):

        meetings = self.get_meetings()

        if not meetings:
           return None

        latest = max(
        meetings,
        key=lambda meeting: meeting["date_start"]
    )

        return latest
    
    def get_current_drivers(self):

        session = self.get_latest_session()

        if not session:
           return []

        session_key = session["session_key"]

        return self.get(
        "drivers",
        params={
            "session_key": session_key
        }
    )

        drivers = self.get_drivers()

        unique = {}

        for driver in drivers:

            number = driver.get("driver_number")

            if number is None:
                continue

            year = driver.get("year", 0)

            if (
                number not in unique
                or year > unique[number].get("year", 0)
            ):
                unique[number] = driver

        return sorted(
            unique.values(),
            key=lambda d: d["driver_number"]
        )