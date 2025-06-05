import React from 'react';
import PDFUpload from './components/PDFUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">FlashCardAI - PDF Text Extractor</h1>
        <PDFUpload />
      </div>
    </div>
  );
}

export default App;
