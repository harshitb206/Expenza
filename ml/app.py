from flask import Flask, request, jsonify
import joblib # Changed from pickle to joblib
import os

app = Flask(__name__)

# --- Load model pipeline (single object) ---
MODEL_PATH = "model.pkl"

try:
    # Load the entire trained pipeline object (vectorizer + classifier)
    # This must match the joblib.dump used in train_model.py
    text_clf = joblib.load(MODEL_PATH) 
    print(f"Successfully loaded ML model pipeline from {MODEL_PATH}")
except FileNotFoundError:
    print(f"Error: {MODEL_PATH} not found. Please run python train_model.py first to create the model.")
    # Exit or use a mock function if the model is critical
    exit()
except Exception as e:
    print(f"Error loading model: {e}")
    exit()

@app.route("/categorize", methods=["POST"])
def categorize():
    data = request.get_json()
    # Ensure text is lowered and stripped, matching training preprocessing
    text = data.get("text", "").lower().strip() 

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # The single pipeline object handles both TF-IDF vectorization and prediction
    # It takes the raw text and outputs the predicted category
    category = text_clf.predict([text])[0]

    return jsonify({"category": category})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=6000, debug=True)
