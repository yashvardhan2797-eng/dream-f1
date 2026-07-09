import os


class Config:

    # ===========================
    # AI
    # ===========================
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    # ===========================
    # Weather
    # ===========================
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

    # ===========================
    # News
    # ===========================
    NEWS_API_KEY = os.getenv("NEWS_API_KEY")

    # ===========================
    # Authentication
    # ===========================
    JWT_SECRET = os.getenv("JWT_SECRET")

    # ===========================
    # Database
    # ===========================
    DATABASE_URL = os.getenv("DATABASE_URL")