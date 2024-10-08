import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';
import theme from './theme';

import WordForm from './WordForm';
import InflectionTable from './InflectionTable';
import Translation from './Translation';
import './ordasafn.css';

function App() {
  const [inflectionData, setInflectionData] = useState(null);
  const [searchedWord, setSearchedWord] = useState('');
  const [translation, setTranslation] = useState('');

  const handleSubmit = async (word) => {
    setSearchedWord(word);
    try {
      const response = await fetch(`http://localhost:5000/api/word-info?word=${word}`);
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      setInflectionData(data.inflection);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log('inflectionData updated:', inflectionData); // Debug log
  }, [inflectionData]);

  const handleTranslation = (translatedText) => {
    setTranslation(translatedText);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Icelandic Morphological Information
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <WordForm onSubmit={handleSubmit} />
        </Box>
        {searchedWord && <Translation word={searchedWord} onTranslate={handleTranslation} />}
        {inflectionData && <InflectionTable data={inflectionData} translation={translation} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;