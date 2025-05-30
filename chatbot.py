import google.generativeai as genai
from google.generativeai.types import GenerationConfig

# Custom Exception to handle Gemini-related errors
class GenAIException(Exception):
    """Custom Exception for Gemini AI errors."""

# ChatBot class to interact with Gemini AI
class ChatBot:
    """A chatbot powered by Gemini AI."""
    CHATBOT_NAME = 'Gemini AI Assistant'

    # Constructor to initialize the API, model, and history
    def __init__(self, api_key):
        self.genai = genai
        self.genai.configure(api_key=api_key)
        self.model = self.genai.GenerativeModel("gemini-1.5-flash")
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
            response = self.conversation.send_message(
                content=prompt,
                generation_config=GenerationConfig(temperature=temperature)
            )
            return response.text
        
        except Exception as e:
            raise GenAIException(f"Error in AI response: {e}")

    # Clears the current chat history and starts a new conversation
    def clear_conversation(self):
        """Clear the conversation history."""
        self.conversation = self.model.start_chat(history=[])
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
