import React from 'react';
import { Container } from '@mui/material';
import WordHeader from './WordHeader';
import theme from './theme';

function OtherCatTable({ data, translation }) {

  const categ = getCat(data[0].ofl_heiti);
  return (

  <Container maxWidth="md" style={{ paddingBottom: '100px' }}>
    <WordHeader 
      word={data[0].ord}
      wordType={categ}
      translation={translation}
      theme={theme}
    />       
  </Container>
  );
}

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
      case 'upphrópun': return 'exclamation';
      default: return cat;
    }
  }

export default OtherCatTable;