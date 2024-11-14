import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Button } from '@mui/material';
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
import EnglishWordInput from './EnglishWordInput';
import './ordasafn.css';
import IcelandicFlagIcon from './IcelandicFlagIcon';
import { initGA, logPageView } from './analytics';



function App() {
  const [wordData, setWordData] = useState(null);
  const [inflectionData, setInflectionData] = useState(null);
  const [searchedWord, setSearchedWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [isInflectedForm, setIsInflectedForm] = useState(false);
  const englishInputRef = React.useRef();
  const wordFormRef = React.useRef();
  const [lemmaForTranslation, setLemmaForTranslation] = useState('');

  useEffect(() => {
    initGA('G-1HQ324XQ5W');
    logPageView();
  }, []);


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

  const fetchLemmaData = async (word) => {
    try {
      const response = await axios.get(`https://bin.arnastofnun.is/api/ord/${word}`);
      console.log('Fetched lemma data:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching lemma data:', err);
      return null;
    }
  };

  const fetchInflectedFormData = async (word) => {
    try {
      const response = await axios.get(`https://bin.arnastofnun.is/api/beygingarmynd/${word}`);
      console.log('Fetched inflected form data:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching inflected form data:', err);
      return null;
    }
  };

  const handleSubmit = async (word) => {
    setSearchedWord(word);
    setError(null);
    setSelectedCategory(null);
    setShowSelector(false);
    setInflectionData(null);
    setIsInflectedForm(false);

    try {
      // First try as lemma
      const lemmaData = await fetchLemmaData(word);
      
      if (lemmaData && lemmaData.length > 0 && lemmaData[0] !== "") {
        setLemmaForTranslation(word); // For lemmas, use the word itself
        if (lemmaData.length > 1) {
          setWordData(lemmaData);
          setShowSelector(true);
        } else {
          await fetchInflectionData(lemmaData[0].guid);
        }
      } else {
        // If no lemma found, try as inflected form
        const inflectedData = await fetchInflectedFormData(word);
        
        if (inflectedData && inflectedData.length > 0 && inflectedData[0] !== "") {
          setIsInflectedForm(true);
          // Use the lemma (ord) for translation
          setLemmaForTranslation(inflectedData[0].ord);
          if (inflectedData.length > 1) {
            setWordData(inflectedData);
            setShowSelector(true);
          } else {
            await fetchInflectionData(inflectedData[0].guid);
          }
        } else {
          setError('No data found for the given word.');
        }
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
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
    setIsInflectedForm(false);
    setLemmaForTranslation('');
    englishInputRef.current?.clear();
    wordFormRef.current?.clear();
  };

  const handleCategorySelect = async (category) => {
    setShowSelector(false);
    // Use the lemma (ord) for translation
    setLemmaForTranslation(category.ord);
    await fetchInflectionData(category.guid);
  };

  const handleIcelandicTranslation = (icelandicWord) => {
    handleSubmit(icelandicWord);
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

        <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              flexDirection: 'column',  // Change to column layout
              alignItems: 'center',     // Center items horizontally
              gap: 6,                  // Increase gap between items (theme.spacing(6) = 48px)
              mb: 4 
              }}>
            <EnglishWordInput ref={englishInputRef} onTranslationSelect={handleIcelandicTranslation} />
            <WordForm ref={wordFormRef} onSubmit={handleSubmit} onClear={handleClear} />
            <Button 
                type="button" 
                variant="outlined" 
                color="secondary"
                size="large"
                onClick={handleClear}
              >
              Clear
            </Button>
        </Box>
        {error && <Typography color="error" align="center">{error}</Typography>}
        {lemmaForTranslation && <Translation word={lemmaForTranslation} onTranslate={handleTranslation} />}
        {showSelector && (
          <WordCategorySelector
            word={searchedWord}
            categories={wordData}
            onSelect={handleCategorySelect}
            isInflectedForm={isInflectedForm}
          />
        )}
        {renderInflectionTable()}
      </Container>
    </ThemeProvider>
  );
}

export default App;