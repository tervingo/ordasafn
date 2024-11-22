import React from 'react';
import { Container } from '@mui/material';
import WordHeader from './WordHeader';
import theme from './theme';
import { useTranslation } from 'react-i18next';

function OtherCatTable({ data, translation }) {
  const { t } = useTranslation();
  const categ = 'cat.' + getCat(data[0].ofl_heiti);
  return (
    <Container maxWidth="md" style={{ paddingBottom: '100px' }}>
      <WordHeader 
        word={data[0].ord}
        wordType={t(categ)}
        translation={translation}
        theme={theme}
      />       
    </Container>
  );
}

function getCat(cat) {
    switch (cat) {
      case 'atviksorð': return 'adv';
      case 'önnur fornöfn': return 'oth-pron';
      case 'forsetning': return 'prep';
      case 'greinir': return 'defart';
      case 'lýsingarorð': return 'adj';
      case 'nafnorð': return 'noun';
      case 'persónufornöfn': return 'pron';
      case 'raðtölur': return 'ord';
      case 'sagnorð': return 'verb';
      case 'samtenging': return 'conj';
      case 'töluorð': return 'num';
      case 'upphrópun': return 'excl';
      default: return cat;
    }
  }

export default OtherCatTable;