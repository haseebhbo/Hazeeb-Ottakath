from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import requests
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

# Routes
@app.post("/api/gemini/chat")
async def gemini_chat(request: Request):
    data = await request.json()
    message = data.get("message")

    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    try:
        response = model.generate_content(message)
        return {"reply": response.text}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})



