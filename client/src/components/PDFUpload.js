import React, { useState } from 'react';
import Flashcard from './Flashcard';

function PDFUpload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch("http://localhost:8000/upload-pdf/", {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setText(data.text);
    setFlashcards(data.flashcards);
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      {text && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Extracted Text:</h3>
          <p>{text}</p>
        </div>
      )}

      {flashcards.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Flashcards from PDF</h3>
          <div className="space-y-4">
            {flashcards.map((fc, idx) => (
              <Flashcard key={idx} question={fc.question} answer={fc.answer} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PDFUpload;
