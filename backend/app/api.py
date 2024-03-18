from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import firebase_admin
from firebase_admin import credentials, firestore
import plotly.graph_objs as go
# change this to your private key's path
PRIVATE_KEY_PATH = "private.json"
app = FastAPI()

# Initialize Firebase Admin SDK with private key
cred = credentials.Certificate(PRIVATE_KEY_PATH)
firebase_admin.initialize_app(cred)

# Access Firestore
db = firestore.client()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

@app.get("/", tags=["root"])
async def read_root(
    collection: str,
) -> dict:
    noiselevels = []
    users_ref = db.collection(collection)
    docs = users_ref.get()
    for doc in docs:
        noiselevels.append(float(doc.to_dict()['loudnessmeasure']))

    return {"plot": noiselevels}