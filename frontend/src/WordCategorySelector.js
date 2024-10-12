import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const WordCategorySelector = ({ word, categories, onSelect }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setOpen(true);
    }
  }, [categories]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (category) => {
    onSelect(category);
    setOpen(false);
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Choose a category for "{word}"</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This word has multiple grammatical categories. Please select one:
        </DialogContentText>
        {categories.map((category, index) => (
          <Button 
            key={index} 
            onClick={() => handleSelect(category)} 
            fullWidth 
            variant="outlined" 
            style={{ margin: '8px 0' }}
          >
            {getCat(category.ofl_heiti)} ({category.ofl})
          </Button>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

function getCat(cat) {
  switch (cat) {
    case 'atviksorð': return 'adverb';
    case 'önnur fornöfn': return 'other pronouns';
    case 'forsetning': return 'preposition';
    case 'greinir': return 'definite article';
    case 'lýsingarorð': return 'adjective';
    case 'nafnorð': return 'noun';
    case 'persónufornöfn': return 'personal pronoun';
    case 'raðtölur': return 'ordinal';
    case 'sagnorð': return 'verb';
    case 'samtening': return 'conjunction';
    case 'töluorð': return 'numeral';
    case 'upphróp': return 'exclamation';
    default: return cat;
  }
}

export default WordCategorySelector;