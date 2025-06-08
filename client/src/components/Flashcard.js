import React, { useState } from 'react';
import './Flashcard.css'; // Import the styles

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flashcard-wrapper" onClick={() => setFlipped(!flipped)}>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
        <div className="front">
          <p>{question}</p>
        </div>
        <div className="back">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
