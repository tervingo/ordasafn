import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const WordForm = forwardRef(({ onSubmit, onClear }, ref) => {
  const [word, setWord] = useState('');
  const { t } = useTranslation();

  // Expose clear function to parent
  useImperativeHandle(ref, () => ({
    clear: () => {
      setWord('');
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) {
      onSubmit(word);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
      <TextField
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter Icelandic word"
        label={t('is-word')}
        variant="outlined"
        size="small"
        sx={{ width: '300px' }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        size="small"
        sx={{ width: '150px' }}
        >
        {t('inflections')}
      </Button>
    </Box>
  );
});

export default WordForm;