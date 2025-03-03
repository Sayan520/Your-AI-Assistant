from flask import Flask, request, jsonify, render_template
from configparser import ConfigParser
from chatbot import ChatBot

app = Flask(__name__)

# Load credentials and initialize ChatBot
config = ConfigParser()
config.read('credentials.ini')
api_key = config['gemini_ai']['API_KEY']

# Create a ChatBot instance
chatbot = ChatBot(api_key=api_key)
chatbot.start_conversation()

# Serve the main UI
@app.route('/')
def home():
    return render_template('index.html')

# Chat API endpoint
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        # Get ChatBot's response
        response = chatbot.send_prompt(user_message)
        return jsonify({'response': response})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
    # app.run(host='0.0.0.0',port=3007,debug=True)

