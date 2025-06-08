from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clean_text(text):
    return text.replace('\n', ' ').replace('•', '-').strip()


def split_into_chunks(text):
    sentences = re.split(r'(?<=[.!?]) +', text)
    return [s.strip() for s in sentences if len(s.strip()) > 40]


def extract_flashcards(chunks):
    flashcards = []
    for sentence in chunks:
        if " is " in sentence and len(sentence) < 200:
            parts = sentence.split(" is ", 1)
            question = f"What is {parts[0].strip().rstrip('?')}?"
            answer = parts[1].strip().rstrip('. ')
            flashcards.append({"question": question, "answer": answer})
    return flashcards


@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    doc = fitz.open(stream=contents, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    cleaned = clean_text(text)
    chunks = split_into_chunks(cleaned)
    flashcards = extract_flashcards(chunks)

    return {
        "text": cleaned[:2000],  # show preview
        "flashcards": flashcards[:10]  # limit to 10 for now
    }
