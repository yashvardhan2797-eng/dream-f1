import requests


class APIClient:
    """
    Generic HTTP client for external APIs.
    """

    def __init__(self, base_url):
        self.base_url = base_url.rstrip("/")

    def get(self, endpoint="", params=None):
        """
        Sends a GET request.
        """

        url = f"{self.base_url}/{endpoint}".rstrip("/")

        try:
            response = requests.get(
                url,
                params=params,
                timeout=5
            )

            response.raise_for_status()

            return response.json()

        except requests.exceptions.RequestException as e:

            return {
                "success": False,
                "error": str(e)
            }