import React, { useState } from 'react';

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-full max-w-md h-48 cursor-pointer bg-white border shadow-md rounded-lg flex items-center justify-center text-center p-4 transition-transform duration-500"
      style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
    >
      <div className="text-lg font-medium">
        {flipped ? answer : question}
      </div>
    </div>
  );
}

export default Flashcard;
