import re
import google.generativeai as genai
from google.generativeai.types import GenerationConfig

# Custom Exception to handle Gemini-related errors
class GenAIException(Exception):
    """Custom Exception for Gemini AI errors."""

# ChatBot class to interact with Gemini AI
class ChatBot:
    CHATBOT_NAME = 'Gemini AI Assistant'

    # Constructor to initialize the API, model, and history
    def __init__(self, api_key):
        self.genai = genai
        self.genai.configure(api_key=api_key)
        self.model = self.genai.GenerativeModel("gemini-2.5-flash")
        self.conversation = None
        self.history = []

    # Sends the user prompt to Gemini and returns the AI's response
    def send_prompt(self, prompt, temperature=0.5):
        """Send a prompt to the chatbot and return a response."""
        
        if not self.conversation:
            self.start_conversation()

        if not prompt:
            raise GenAIException("Prompt cannot be empty.")
        
        if not 0 <= temperature <= 1:
            raise GenAIException("Temperature must be between 0 and 1.")

        try:
            # Gemini formatting instruction for clean, readable output
            format_instruction = (
                "You are a intelligent AI assistant, ready to help. When replying, output plain readable text only.\n"
                "Do NOT include raw Markdown symbols like **, *, `, #, or -.\n"
                "Instead, format your response as follows:\n"
                "- Bold text → UPPERCASE\n"
                "- Italic text → wrap with underscores (_like this_)\n"
                "- Bullet points → use • for each item\n"
                "- Numbered lists → use 1), 2), etc.\n"
                "- Keep spacing and readability natural\n\n"
                f"Now answer the user query below in this format:\n {prompt}"
            )

            response = self.conversation.send_message(
                content=format_instruction,
                generation_config=GenerationConfig(temperature=temperature)
            )

            # Return the cleaned, readable text
            return response.text.strip()

        except Exception as e:
            raise GenAIException(f"Error in AI response: {e}")

    # Clears the current chat history and starts a new conversation
    def clear_conversation(self):
        """Clear the conversation history."""
        self.conversation = self.model.start_chat(history=[])
        self.history = []
        print("Conversation history cleared.")

    # Starts a new conversation with optional preloaded messages
    def start_conversation(self, preload_history=None):
        """Start a new conversation with optional preloaded history."""
        if preload_history is None:
            preload_history = [
                {"role": "user", "parts": ["Hello! Please assist me."]},
                {"role": "model", "parts": ["Of course! I'm here to help."]},
            ]
        self.history = preload_history
        self.conversation = self.model.start_chat(history=preload_history)
