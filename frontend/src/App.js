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
import InflectionTableNumeral from './InflectionTableNumeral';
import InflectionTableOrdinal from './InflectionTableOrdinal';
import InflectionTablePronoun from './InflectionTablePronoun';
import InflectionTableOtherPron from './InflecttionTableOtherPron';
import InflectionTableArticle from './InflectionTableArticle';
import OtherCatTable from './OtherCatTable'; 
import Translation from './Translation';
import WordCategorySelector from './WordCategorySelector';
import './ordasafn.css';
import IcelandicFlagIcon from './IcelandicFlagIcon';

function App() {
  const [wordData, setWordData] = useState(null);
  const [inflectionData, setInflectionData] = useState(null);
  const [searchedWord, setSearchedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

  const handleSubmit = async (word) => {
    setSearchedWord(word);
    setError(null);
    setSelectedCategory(null);
    setShowSelector(false);
    setInflectionData(null);
    try {
      const response = await axios.get(`https://bin.arnastofnun.is/api/ord/${word}`);
      console.log('Fetched word data:', response.data);
      
      if (response.data.length > 1) {
        setWordData(response.data);
        setShowSelector(true);
      } else if (response.data.length === 1) {
        await fetchInflectionData(response.data[0].guid);
      } else {
        setError('No data found for the given word.');
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error('Error:', err);
    }
  };

  const fetchInflectionData = async (guid) => {
    try {
      const response = await axios.get(`https://bin.arnastofnun.is/api/ord/${guid}`);
      console.log('Fetched inflection data:', response.data);
      setInflectionData(response.data);
      setSelectedCategory(response.data[0]);
    } catch (err) {
      setError('Error fetching inflection data. Please try again.');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    console.log('inflectionData updated:', inflectionData);
  }, [inflectionData]);

  const handleTranslation = (translatedText) => {
    setTranslation(translatedText);
  };

  const handleClear = () => {
    setWordData(null);
    setInflectionData(null);
    setSearchedWord('');
    setTranslation('');
    setError(null);
    setSelectedCategory(null);
    setShowSelector(false);
  };

  const handleCategorySelect = async (category) => {
    setShowSelector(false);
    await fetchInflectionData(category.guid);
  };
  
  const renderInflectionTable = () => {
    if (!selectedCategory || !inflectionData) return null;
  
    const category = selectedCategory.ofl_heiti;
    switch (category) {
      case 'nafnorð':
        return <InflectionTableNoun data={inflectionData} translation={translation} />;
      case 'lýsingarorð':
        return <InflectionTableAdjective data={inflectionData} translation={translation} />;
      case 'sagnorð':
        return <InflectionTableVerb data={inflectionData} translation={translation} theme={theme} />;
      case 'töluorð':
        return <InflectionTableNumeral data={inflectionData} translation={translation} />;
      case 'önnur fornöfn':
        return <InflectionTableOtherPron data={inflectionData} translation={translation} />;
      case 'greinir':
          return <InflectionTableArticle data={inflectionData} translation={translation} />;
      case 'persónufornöfn':
        return <InflectionTablePronoun data={inflectionData} translation={translation} />;
      case 'raðtölur':
        return <InflectionTableOrdinal data={inflectionData} translation={translation} />;
      default:
        return <OtherCatTable data={inflectionData} translation={translation} />;
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
            flexDirection: 'column',  
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
        {showSelector && (
          <WordCategorySelector
            word={searchedWord}
            categories={wordData}
            onSelect={handleCategorySelect}
          />
        )}
        {renderInflectionTable()}
      </Container>
    </ThemeProvider>
  );
}

export default App;