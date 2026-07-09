from app.ai.ai_service import AIService
from app.ai.prompts import COMMENTARY_PROMPT


class CommentaryGenerator:

    def __init__(self):
        self.ai = AIService()

    def generate(self, race_information):

        prompt = f"""
{COMMENTARY_PROMPT}

Race Information:

{race_information}
"""

        return self.ai.ask(prompt)