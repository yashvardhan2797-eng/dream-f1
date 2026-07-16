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

from datetime import datetime, timezone

from app.services.api_client import APIClient


class OpenF1Client(APIClient):

    def __init__(self):
        super().__init__("https://api.openf1.org/v1")

    # ----------------------------------------------------
    # Basic API Calls
    # ----------------------------------------------------

    def get_drivers(self):
        return self.get("drivers")

    def get_meetings(self):
        return self.get("meetings")

    def get_sessions(self, meeting_key=None):

        params = {}

        if meeting_key:
            params["meeting_key"] = meeting_key

        return self.get("sessions", params=params)

    # ----------------------------------------------------
    # Current / Latest Meeting
    # ----------------------------------------------------

    def get_latest_meeting(self):

        meetings = self.get_meetings()

        if not meetings:
            return None

        if isinstance(meetings, dict):
            return None

        valid_meetings = []

        for meeting in meetings:

            if not isinstance(meeting, dict):
                continue

            if "date_start" not in meeting:
                continue

            valid_meetings.append(meeting)

        if not valid_meetings:
            return None

        now = datetime.now(timezone.utc)

        current = []

        future = []

        past = []

        for meeting in valid_meetings:

            try:

                start = datetime.fromisoformat(
                    meeting["date_start"].replace("Z", "+00:00")
                )

                end = datetime.fromisoformat(
                    meeting["date_end"].replace("Z", "+00:00")
                )

            except Exception:
                continue

            if start <= now <= end:
                current.append(meeting)

            elif start > now:
                future.append(meeting)

            else:
                past.append(meeting)

        # Current race weekend
        if current:

            return sorted(
                current,
                key=lambda x: x["date_start"]
            )[0]

        # Next race weekend
        if future:

            return sorted(
                future,
                key=lambda x: x["date_start"]
            )[0]

        # Most recent completed weekend
        if past:

            return sorted(
                past,
                key=lambda x: x["date_start"],
                reverse=True
            )[0]

        return None
    # ----------------------------------------------------
    # Latest Session
    # ----------------------------------------------------

    def get_latest_session(self):

        meeting = self.get_latest_meeting()

        if not meeting:
            return None

        meeting_key = meeting["meeting_key"]

        sessions = self.get_sessions(meeting_key)

        if not sessions:
            return None

        if isinstance(sessions, dict):
            return None

        sessions = [
            session
            for session in sessions
            if isinstance(session, dict)
            and "date_start" in session
        ]

        if not sessions:
            return None

        latest = max(
            sessions,
            key=lambda session: session["date_start"]
        )

        return latest

    # ----------------------------------------------------
    # Current Drivers
    # ----------------------------------------------------

    def get_current_drivers(self):

        session = self.get_latest_session()

        if not session:
            return []

        session_key = session["session_key"]

        drivers = self.get(
            "drivers",
            params={
                "session_key": session_key
            }
        )

        if not drivers:
            return []

        if isinstance(drivers, dict):
            return []

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
            key=lambda driver: driver["driver_number"]
        )

    # ----------------------------------------------------
    # Dashboard
    # ----------------------------------------------------

    def get_dashboard_data(self):

        meeting = self.get_latest_meeting()

        session = self.get_latest_session()

        drivers = self.get_current_drivers()

        return {
            "meeting": meeting,
            "session": session,
            "drivers": drivers
        }