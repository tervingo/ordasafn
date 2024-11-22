import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box, Button, Card, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';

import axios from 'axios';
import theme from './theme';
import './ordasafn.css';
import './i18n';

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
import IcelandicFlagIcon from './IcelandicFlagIcon';
import SearchHistory from './SearchHistory';
import { initGA, logPageView } from './analytics';



// Custom styled ToggleButton
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  '&.MuiToggleButton-root': {
    textTransform: 'none',
    minWidth: '40px',
    padding: '5px 10px',
    backgroundColor: theme.palette.toggle.off,
    border: `1px solid ${theme.palette.primary.main}`,
    '&.Mui-selected': {
      backgroundColor: theme.palette.toggle.on,
      color: theme.palette.primary.contrastText,
    },
  },
}));


function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (event, newLanguage) => {
    if (newLanguage !== null) {
      i18n.changeLanguage(newLanguage);
    }
  };

  // Set default language to English on component mount
  useEffect(() => {
    changeLanguage(null, 'en');
  }, []);

  return (
    <div className='language-switcher'>
      <ToggleButtonGroup
        value={i18n.language}
        exclusive
        onChange={changeLanguage}
        aria-label="language switcher"
      >
        <StyledToggleButton value="en" aria-label="English">
          EN
        </StyledToggleButton>
        <StyledToggleButton value="is" aria-label="Íslenska">
          IS
        </StyledToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}



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
  const [searches, setSearches] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    initGA('G-1HQ324XQ5W');
    logPageView();
  }, []);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearches(history);
  }, []);

  const addToSearchHistory = (word) => {
    const filteredHistory = searches.filter(item => item !== word);
    const newHistory = [word, ...filteredHistory].slice(0, 20);
    
    // Update both localStorage and state
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setSearches(newHistory);
  };

  const clearSearchHistory = () => {
    localStorage.removeItem('searchHistory');
    setSearches([]);
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
    addToSearchHistory(word);
    setSearchedWord(word);
    setError(null);
    setSelectedCategory(null);
    setShowSelector(false);
    setInflectionData(null);
    setIsInflectedForm(false);
    setLemmaForTranslation(''); // Clear previous translation word
  
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
        return <InflectionTableNoun data={inflectionData} translation={translation} isInfl={isInflectedForm} enteredWord={searchedWord}/>;
      case 'lýsingarorð':
        return <InflectionTableAdjective data={inflectionData} translation={translation}  isInfl={isInflectedForm} enteredWord={searchedWord}/>;
      case 'sagnorð':
        return <InflectionTableVerb data={inflectionData} translation={translation} theme={theme} isInfl={isInflectedForm} enteredWord={searchedWord}/>;
      case 'töluorð':
        return <InflectionTableNumeral data={inflectionData} translation={translation} isInfl={isInflectedForm} enteredWord={searchedWord} />;
      case 'önnur fornöfn':
        return <InflectionTableOtherPron data={inflectionData} translation={translation} isInfl={isInflectedForm} enteredWord={searchedWord} />;
      case 'greinir':
          return <InflectionTableArticle data={inflectionData} translation={translation} isInfl={isInflectedForm} enteredWord={searchedWord}/>;
      case 'persónufornöfn':
        return <InflectionTablePronoun data={inflectionData} translation={translation} isInfl={isInflectedForm} enteredWord={searchedWord}/>;
      case 'raðtölur':
        return <InflectionTableOrdinal data={inflectionData} translation={translation} isInfl={isInflectedForm} enteredWord={searchedWord}/>;
      default:
        return <OtherCatTable data={inflectionData} translation={translation} />;
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Top Panel */}
        <Box sx={{ 
          width: '100%',
          padding: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',  
            alignItems: 'center', 
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
            }}>
              <Typography variant="h5" color="labels"> 
                Orðaskógur
              </Typography>
              <Card>
                <CardMedia
                  component="img"
                  width="100"
                  height="70"
                  image="/images/ordaskogur.jpg"
                  alt="Sample image"
                  sx={{ objectFit: 'cover' }}
                />
              </Card>
              <LanguageSwitcher />
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mt: 4
            }}>
              <IcelandicFlagIcon sx={{ fontSize: 40 }} />
              <Typography variant="h3" component="h1">
              {t('title')}
              </Typography>
            </Box>
  
            <Typography variant="subtitle2" sx={{ 
              mt: 2,
              color: theme.palette.labels.subtitle,
              '& a': {
                color: theme.palette.link.default,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}>
              {t('uses1')} <a href="https://bin.arnastofnun.is" target='blank'>Beygingarlýsing íslenks nútímamáls</a> {t('uses2')} <a href="https://is.glosbe.com" target="blank">{t('glosbe-link')}</a>
            </Typography>
          </Box>
        </Box>
  
        {/* Main Content Area - Split into sidebar and main panel */}
        <Box sx={{ 
          display: 'flex',
          flex: 1,
          gap: 3,
          mt: 3,
          overflow: 'hidden' // Prevent content from causing page scroll
        }}>
          {/* Left Sidebar - History Panel */}
          <Box sx={{ 
            width: '250px',
            flexShrink: 0,
            overflowY: 'auto', // Allow scrolling if history is long
            display: { xs: 'none', md: 'block' },
            borderRight: 1,
            borderColor: 'divider',
            pr: 2
          }}>
            <SearchHistory 
              searches={searches}
              onSelectWord={handleSubmit}
              onClearHistory={clearSearchHistory}
            />
          </Box>
  
          {/* Main Panel - Search Forms and Results */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            overflowY: 'auto' // Allow scrolling for results
          }}>
            {/* Search Forms */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              p: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="subtitle2" color="labels" sx={{ flex: 1 }}>
                  {t('trans-info')}
                </Typography>
                <EnglishWordInput 
                  ref={englishInputRef} 
                  onTranslationSelect={handleIcelandicTranslation}
                />
              </Box>
  
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Typography variant="subtitle2" color="labels" sx={{ flex: 1 }}>
                {t('infl-info')}
                </Typography>
                <WordForm 
                  ref={wordFormRef} 
                  onSubmit={handleSubmit} 
                  onClear={handleClear}
                />
              </Box>
  
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  type="button" 
                  variant="outlined" 
                  color="secondary"
                  size="large"
                  onClick={handleClear}
                >
                  {t('clear')}
                </Button>
              </Box>
            </Box>
  
            {/* Results Section */}
            <Box sx={{ p: 1 }}>
              {error && <Typography color="error" align="center">{error}</Typography>}
              {isInflectedForm && (
                <Typography color={theme.palette.primary.lightblue} align="center">
                  "{searchedWord}" is an inflected form of "{lemmaForTranslation}"
                </Typography>
              )}
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
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default App;