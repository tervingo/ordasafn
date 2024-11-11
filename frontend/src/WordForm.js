import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';


function WordForm({ onSubmit, onClear }) {
  const [word, setWord] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) {
      onSubmit(word);
    }
  };

  const handleClear = () => {
    setWord('');
    onClear();
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
  );
}

export default WordForm;