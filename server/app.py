from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

genai.configure(api_key="AIzaSyCPTWbwkQyCjPE0uDMshmLmkfVmFX0JDIw") 

model = genai.GenerativeModel(model_name="gemini-1.5-pro")

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_input = data.get('message', '')

        if not user_input:
            return jsonify({'reply': 'Please enter a message.'})

        response = model.generate_content(user_input)
        reply = response.text.strip()

        return jsonify({'reply': reply})

    except Exception as e:
        return jsonify({'reply': f"Error: {str(e)}"})

if __name__ == '__main__':
    app.run(debug=True)
