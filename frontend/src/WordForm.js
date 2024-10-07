import React, { useState } from 'react';


function WordForm({ onSubmit }) {
  const [word, setWord] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) {
      onSubmit(word);
      setWord('');  // Limpiar el campo después de enviar
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Ingresa una palabra en islandés"
        aria-label="Palabra en islandés"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}


export default WordForm;