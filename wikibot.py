from flask import Flask, request, jsonify
import wikipedia
import random
import warnings

warnings.filterwarnings("ignore", category=UserWarning, module='wikipedia')
from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

greetings = ["hello", "hi", "hey", "hola", "namaste"]
responses = [
    "Sure! Here's what I found 😊",
    "Absolutely, check this out 👇",
    "Here’s a quick summary for you:",
    "Gotcha! Let me tell you a bit about it...",
    "Alright! This might help you understand:"
]

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get('message', '').strip().lower()

    if user_input in ["bye", "exit", "quit"]:
        return jsonify({"bot": "👋 Alright, take care! Catch you later!"})

    elif user_input in ["thanks", "thank you", "okay thanks", "ok thanks", "okay thankyou"]:
        return jsonify({"bot": "You are welcome 😊."})

    elif user_input in greetings:
        return jsonify({"bot": "👋 Hey there! What do you want to learn today?"})

    try:
        summary = wikipedia.summary(user_input, sentences=2)
        response = f"{random.choice(responses)}\n{summary}"
        return jsonify({"bot": response})
    except wikipedia.exceptions.DisambiguationError as e:
        try:
            summary = wikipedia.summary(e.options[0], sentences=2)
            response = f"{random.choice(responses)}\n{summary}"
            return jsonify({"bot": response})
        except:
            return jsonify({"bot": "🤔 Still too ambiguous, can you be more specific?"})
    except wikipedia.exceptions.PageError:
        return jsonify({"bot": "😕 Sorry, I couldn’t find anything about that."})
    except Exception as e:
        return jsonify({"bot": f"⚠️ Oops, something went wrong: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
