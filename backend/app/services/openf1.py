"""
=========================================================
Formula Fan

File: openf1.py

Purpose:
Provides Formula Fan's interface to the OpenF1 API.

Developer:
Yashvardhan Rathore

Sprint:
Sprint 1 - FF-1002
=========================================================
"""

from app.services.api_client import APIClient


class OpenF1Client(APIClient):

    def __init__(self):
        super().__init__("https://api.openf1.org/v1")

    def get_drivers(self):
        """
        Fetch all available drivers.
        """
        return self.get("drivers")