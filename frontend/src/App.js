import React, { useState } from 'react';
import WordForm from './WordForm';
import InflectionTable from './InflectionTable';
// import Translation from './Translation';

function App() {
  const [inflectionData, setInflectionData] = useState(null);
  const [translation, setTranslation] = useState('');

  const handleSubmit = async (word) => {
    try {
      console.log('word in handleSubmit is: %s', word);
      const response = await fetch(`http://localhost:5000/api/word-info?word=${word}`);
      console.log('response is: %s', response);
      const data = await response.json();
      setInflectionData(data.inflection);
      console.log('data.inflection is: %s', data.inflection);
//      setTranslation(data.translation);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Icelandic Word Information</h1>
      <WordForm onSubmit={handleSubmit} />
      {inflectionData && <InflectionTable data={inflectionData} />}
      {/* {translation && <Translation text={translation} />} */}
    </div>
  );
}

export default App;