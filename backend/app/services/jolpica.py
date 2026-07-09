from app.services.api_client import APIClient


class JolpicaClient(APIClient):

    def __init__(self):
        super().__init__("https://api.jolpi.ca/ergast/f1")

    # =============================
    # Constructor Standings
    # =============================

    def get_constructor_standings(self, season="current"):

        data = self.get(f"{season}/constructorStandings")

        if "MRData" not in data:
            return data

        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"]


    # =============================
    # Driver Standings
    # =============================

    def get_driver_standings(self, season="current"):

        data = self.get(f"{season}/driverStandings")

        if "MRData" not in data:
            return data

        return data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]