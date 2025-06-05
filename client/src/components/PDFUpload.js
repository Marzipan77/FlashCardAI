import React, { useState } from 'react';

function PDFUpload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:8000/upload-pdf/', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setText(data.text);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Upload
      </button>

      {text && (
        <div className="mt-4 whitespace-pre-wrap p-2 border rounded bg-gray-100">
          <h3 className="font-semibold mb-1">Extracted Text:</h3>
          <pre>{text}</pre>
        </div>
      )}
    </div>
  );
}

export default PDFUpload;
