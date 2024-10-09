import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';
import theme from './theme';

import WordForm from './WordForm';
import InflectionTableNoun from './InflectionTableNoun';
import InflectionTableAdjective from './InflectionTableAdjective';
import InflectionTableVerb from './InflectionTableVerb';
import Translation from './Translation';
import './ordasafn.css';
import IcelandicFlagIcon from './IcelandicFlagIcon';
import { alignProperty } from '@mui/material/styles/cssUtils';

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

  const handleClear = () => {
    setInflectionData(null);
    setSearchedWord('');
    setTranslation('');
  };
  
  const renderInflectionTable = () => {
    if (!inflectionData || !inflectionData[0]) return null;

    const category = inflectionData[0].ofl_heiti;
    switch (category) {
      case 'nafnorð':
        return <InflectionTableNoun data={inflectionData} translation={translation} />;
      case 'lýsingarorð':
        return <InflectionTableAdjective data={inflectionData} translation={translation} />;
      case 'sagnorð':
        return <InflectionTableVerb data={inflectionData} translation={translation} />;
      default:
        console.log(`No specific table for category: ${category}`);
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        mt: 4, 
        mb: 2 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '100%'
        }}>
          <IcelandicFlagIcon sx={{ fontSize: 40, marginRight: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Icelandic Morphological Information
          </Typography>
        </Box>
      </Box>      
        <Box sx={{ textAlign: 'center', mt: 2, mb: 6 }}>
          <Typography variant="subtitle2" component="h1" gutterBottom sx={{ 
              color: theme.palette.labels.subtitle, // Change this to your desired color
              '& a': {
                color: theme.palette.link.default, // Change link color if needed
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }} >
            This tool uses the API provided by <a href="https://bin.arnastofnun.is" target='blank'>Beygingarlýsing íslenks nútímamáls</a> and the output from the <a href="https://is.glosbe.com" target="blank">Glosbe online dictionary</a>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <WordForm onSubmit={handleSubmit} onClear={handleClear} />
        </Box>
        {searchedWord && <Translation word={searchedWord} onTranslate={handleTranslation} />}
        {renderInflectionTable()}
      </Container>
    </ThemeProvider>
  );
}

export default App;