import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { TextField, Button, Box } from '@mui/material';

const WordForm = forwardRef(({ onSubmit, onClear }, ref) => {
  const [word, setWord] = useState('');

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
        label="Enter Icelandic word"
        variant="outlined"
        size="medium"
        sx={{ width: '300px' }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        size="large"
      >
        Show Inflections
      </Button>
    </Box>
  );
});

export default WordForm;