import PDFUpload from './components/PDFUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mb-8">
        <h1 className="text-2xl font-bold text-center mb-4">FlashCardAI - PDF Text Extractor</h1>
        <PDFUpload />
      </div>
    </div>
  );
}

export default App;
