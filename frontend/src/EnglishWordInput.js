import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';


// Helper function to decode HTML entities
const decodeHTMLEntities = (html) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

const EnglishWordInput = forwardRef(({ onTranslationSelect }, ref) => {
  const [englishWord, setEnglishWord] = useState('');
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();


  // Expose clear function to parent
  useImperativeHandle(ref, () => ({
    clear: () => {
      setEnglishWord('');
      setTranslations([]);
      setError('');
      setOpen(false);
    }
  }));

  const fetchTranslations = async () => {
    if (!englishWord.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const corsProxy = 'https://corsproxy.io/?';
      const glosbeUrl = `https://is.glosbe.com/en/is/${encodeURIComponent(englishWord)}`;
      const response = await fetch(corsProxy + encodeURIComponent(glosbeUrl));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      
      // Extract translations using regex
      const regex = /<strong>(.+?)<\/strong> (?:is the translation|are the top translations) of/;
      const match = html.match(regex);
      
      if (!match || !match[1]) {
        setError('No translations found');
        return;
      }

      // Process the translations
      const translationsStr = match[1];
      const translationsList = translationsStr.split(', ')
        .map(t => decodeHTMLEntities(t.trim()))
        .filter(t => t); // Remove empty strings

      if (translationsList.length === 0) {
        setError('No translations found');
      } else if (translationsList.length === 1) {
        // If there's only one translation, select it automatically
        onTranslationSelect(translationsList[0]);
      } else {
        // If there are multiple translations, show the selection dialog
        setTranslations(translationsList);
        setOpen(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching translations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTranslations();
  };

  const handleTranslationSelect = (translation) => {
    setOpen(false);
    onTranslationSelect(translation);
    setEnglishWord('');
  };

  const handleClose = () => {
    setOpen(false);
    setTranslations([]);
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          value={englishWord}
          onChange={(e) => setEnglishWord(e.target.value)}
          label={t('en-word')}
          variant="outlined"
          size="small"
          disabled={loading}
          sx={{ width: '300px' }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          // disabled={loading || !englishWord.trim()}
          color="primary"
          size="small"
          sx={{ width: '150px' }}
        >
          {t('translations')}
        </Button>
    </Box>
      
      {error && (
        <Box sx={{ color: 'error.main', mt: 1 }}>
          {error}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Icelandic Translation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the desired translation for "{englishWord}":
          </DialogContentText>
          {translations.map((translation, index) => (
            <Button
              key={index}
              onClick={() => handleTranslationSelect(translation)}
              fullWidth
              variant="outlined"
              sx={{ mt: 1 }}
            >
              {translation}
            </Button>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default EnglishWordInput;