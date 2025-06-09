import fitz
import re
import os
import openai
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables and API key 
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper functions ---
def clean_text(text):
    return text.replace('\n', ' ').replace('•', '-').strip()

def split_into_chunks(text):
    sentences = re.split(r'(?<=[.!?]) +', text)
    return [s.strip() for s in sentences if len(s.strip()) > 40]

def generate_flashcards_with_gpt(text):
    from openai import OpenAI
    client = OpenAI()  # will use your .env key

    prompt = (
        "Generate 5 study flashcards (question and answer) from the following text:\n\n"
        f"{text}\n\n"
        "Format as JSON like:\n"
        '[{"question": "...", "answer": "..."}]'
    )

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=600,
        )
        content = response.choices[0].message.content
        flashcards = eval(content) if content.strip().startswith("[") else []
        print("✅ GPT RESPONSE:", flashcards)

    except Exception as e:
        print("❌ GPT Error:", e)
        flashcards = []

    return flashcards

# Optional fallback (can remove if not needed)
def extract_basic_flashcards(chunks):
    flashcards = []
    for sentence in chunks:
        s = sentence.strip()

        # Match colon-based definitions (e.g., Term: Definition)
        if ':' in s and len(s) < 250:
            parts = s.split(':', 1)
            question = f"What is {parts[0].strip()}?"
            answer = parts[1].strip().rstrip('. ')
            flashcards.append({"question": question, "answer": answer})

        # Match common explainers (e.g., Term refers to Definition)
        elif " refers to " in s or " indicates " in s or " means " in s:
            parts = re.split(r" refers to | indicates | means ", s, maxsplit=1)
            if len(parts) == 2:
                question = f"What is {parts[0].strip()}?"
                answer = parts[1].strip().rstrip('. ')
                flashcards.append({"question": question, "answer": answer})

    return flashcards

# --- Route: PDF upload and flashcard generation ---
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    doc = fitz.open(stream=contents, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    cleaned = clean_text(text)
    chunks = split_into_chunks(cleaned)
    gpt_input = " ".join(chunks[:8])  # Send ~first 8 sentences to GPT

    flashcards = generate_flashcards_with_gpt(gpt_input)

    # Optional fallback if GPT failed
    if not flashcards:
        flashcards = extract_basic_flashcards(chunks)

    print("EXTRACTED SENTENCES:", chunks)
    print("GENERATED FLASHCARDS:", flashcards)

    return {
    "text": cleaned[:2000],
    "flashcards": flashcards[:10]
}
