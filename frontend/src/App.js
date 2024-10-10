import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import theme from './theme';

import WordForm from './WordForm';
import InflectionTableNoun from './InflectionTableNoun';
import InflectionTableAdjective from './InflectionTableAdjective';
import InflectionTableVerb from './InflectionTableVerb';
import Translation from './Translation';
import './ordasafn.css';
import IcelandicFlagIcon from './IcelandicFlagIcon';

function App() {
  const [inflectionData, setInflectionData] = useState(null);
  const [searchedWord, setSearchedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (word) => {
    setSearchedWord(word);
    setError(null);
    try {
      const response = await axios.get(`https://bin.arnastofnun.is/api/ord/${word}`);
      console.log('Fetched data:', response.data); // Debug log
      setInflectionData(response.data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error('Error:', err);
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
    setError(null);
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
          <Typography variant="subtitle2" component="h2" gutterBottom sx={{ 
              color: theme.palette.labels.subtitle,
              '& a': {
                color: theme.palette.link.default,
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
        {error && <Typography color="error" align="center">{error}</Typography>}
        {searchedWord && <Translation word={searchedWord} onTranslate={handleTranslation} />}
        {renderInflectionTable()}
      </Container>
    </ThemeProvider>
  );
}

export default App;