import sqlite3
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib # Ensure joblib is imported for saving the model
import os

DB_PATH = '../backend/data.db'
MODEL_PATH = 'model.pkl'
CSV_PATH = 'data.csv'  # Path to your static training data file

def load_training_data():
    """Loads and combines data from the dynamic DB and the static CSV."""
    df_db = pd.DataFrame({'text': [], 'category': []})
    
    # --- 1. Load Data from SQLite Database (Dynamic Feedback Loop) ---
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        try:
            # Fetch data from the new dynamic table
            df_db = pd.read_sql_query("SELECT text, category FROM ml_training_data", conn)
            print(f"Loaded {len(df_db)} samples from dynamic DB.")
        except pd.io.sql.DatabaseError as e:
            print(f"Error reading ml_training_data: {e}. Skipping DB load.")
        finally:
            conn.close()

    # --- 2. Load Data from Static CSV File ---
    df_csv = pd.DataFrame({'text': [], 'category': []})
    if os.path.exists(CSV_PATH):
        try:
            # Assuming the CSV has 'text' and 'category' columns
            df_csv = pd.read_csv(CSV_PATH, usecols=['text', 'category'])
            print(f"Loaded {len(df_csv)} samples from static CSV ({CSV_PATH}).")
        except Exception as e:
            print(f"Warning: Could not load {CSV_PATH}. Error: {e}")
    
    # --- 3. Handle Fallback (If both DB and CSV fail) ---
    if df_db.empty and df_csv.empty:
        print(f"Warning: No valid training data found. Using tiny fallback data.")
        return pd.DataFrame({
            'text': ['pizza hut', 'uber ride', 'gym fee', 'netflix subscription'],
            'category': ['Food', 'Travel', 'Fitness', 'Entertainment']
        })

    # --- 4. Combine and Preprocess Data ---
    df = pd.concat([df_db, df_csv], ignore_index=True)
    
    # Clean and standardize text data
    df['text'] = df['text'].str.lower().str.strip()
    
    # Remove duplicates based on the 'text' (e.g., if it exists in both CSV and DB)
    df.drop_duplicates(subset=['text'], inplace=True)
    
    return df

def train_and_save_model():
    """Trains the Multinomial Naive Bayes model using dynamic and static data."""
    df = load_training_data()
    
    if df.empty:
        print("No training data available. Exiting.")
        return

    print(f"Training model with {len(df)} unique, combined samples...")
    
    # Define the pipeline: TF-IDF vectorizer + Multinomial Naive Bayes classifier
    text_clf = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_df=0.8)),
        ('clf', MultinomialNB()),
    ])

    # Train the classifier
    text_clf.fit(df['text'], df['category'])

    # Save the trained model pipeline (a single object) using joblib
    joblib.dump(text_clf, MODEL_PATH)
    print(f"Model successfully trained and saved to {MODEL_PATH}.")

if __name__ == '__main__':
    train_and_save_model()
