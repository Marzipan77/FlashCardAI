import React from 'react';
import PDFUpload from './components/PDFUpload';
import Flashcard from './components/Flashcard';

const sampleFlashcards = [
  {
    question: 'What is the first phase of the internship focused on?',
    answer: 'Learning Salesforce admin and dev tools.'
  },
  {
    question: 'What is Apex in Salesforce?',
    answer: 'Salesforce backend programming language.'
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mb-8">
        <h1 className="text-2xl font-bold text-center mb-4">FlashCardAI - PDF Text Extractor</h1>
        <PDFUpload />
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">Sample Flashcards</h2>
        <div className="space-y-4">
          {sampleFlashcards.map((fc, idx) => (
            <Flashcard key={idx} question={fc.question} answer={fc.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
