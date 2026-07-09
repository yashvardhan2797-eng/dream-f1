"""
==========================================================
Formula Fan

AI Service

Handles all communication with the Groq API.

==========================================================
"""

from groq import Groq

from app.config import Config


class AIService:

    def __init__(self):

        self.client = Groq(
            api_key=Config.GROQ_API_KEY
        )

    def ask(self, prompt):

        response = self.client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]

        )

        return response.choices[0].message.content