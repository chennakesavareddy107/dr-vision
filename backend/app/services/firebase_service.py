import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

class FirebaseService:
    def __init__(self):
        self.db = None
        self.initialize()

    def initialize(self):
        # We look for a service account key path in environment variables
        cred_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_KEY")
        if cred_path and os.path.exists(cred_path):
            try:
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
                self.db = firestore.client()
                print("Firebase Admin initialized successfully.")
            except Exception as e:
                print(f"Failed to initialize Firebase Admin: {e}")
        else:
            print("FIREBASE_SERVICE_ACCOUNT_KEY not set or file not found. Firebase Admin is disabled.")

    def verify_token(self, id_token: str):
        if not self.db:
            # Mock verification for development if firebase isn't set up
            return {"uid": "mock-user-id", "email": "test@example.com"}
            
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except Exception as e:
            raise Exception(f"Invalid authentication credentials: {str(e)}")

    def save_prediction(self, user_id: str, data: dict):
        if not self.db:
            print("Mock: Saved prediction to Firebase")
            return "mock-doc-id"
            
        try:
            doc_ref = self.db.collection('users').document(user_id).collection('predictions').document()
            doc_ref.set(data)
            return doc_ref.id
        except Exception as e:
            raise Exception(f"Failed to save prediction: {str(e)}")

firebase_service = FirebaseService()
