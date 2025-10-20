from flask import Flask, request, jsonify, render_template
from configparser import ConfigParser
from chatbot import ChatBot, GenAIException

# Initialize Flask app
app = Flask(__name__)

# Load credentials and initialize ChatBot
config = ConfigParser()
config.read('credentials.ini')
api_key = config['gemini_ai']['API_KEY']

# Create a ChatBot instance
chatbot = ChatBot(api_key=api_key)
chatbot.start_conversation()

# Route to render the homepage
@app.route('/')
def home():
    return render_template('index.html')

# API route to handle chat requests 
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Get the AI's response
        response = chatbot.send_prompt(user_message)
        return jsonify({'response': response})

    # Raising a custom GenAIException for specific errors
    except GenAIException as ge:
        return jsonify({'error': str(ge)}), 400
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Run the Flask app in debug mode
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)


