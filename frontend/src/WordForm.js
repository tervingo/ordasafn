import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function WordForm({ onSubmit }) {
  const [word, setWord] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.trim()) {
      onSubmit(word);
      setWord('');  // Clear the field after submitting
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2 }}>
      <TextField
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter Icelandic word"
        label="Icelandic word"
        variant="outlined"
        size="medium"
        sx={{ width: '300px' }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        size="medium"
      >
        Search
      </Button>
    </Box>
  );
}

export default WordForm;