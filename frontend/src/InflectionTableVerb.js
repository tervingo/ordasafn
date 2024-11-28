import React from 'react';
import { Container } from '@mui/material';
import WordHeader from './WordHeader';
import { 
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell, 
  Paper, Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function InflectionTableVerb({ data, translation, theme, isInfl, enteredWord }) {
  const { t } = useTranslation();
  if (!data || !data[0] || !data[0].bmyndir) {
    return <p>No inflection data available for this verb.</p>;
  }

  const bmyndir = data[0].bmyndir;
  const moods = ['FH', 'VH'];
  const tenses = ['NT', 'ÞT'];
  const persons = ['1P', '2P', '3P'];
  const numbers = ['ET', 'FT'];

  
  
  const getForm = (voice, mood, tense, person, number) => {
    const form = bmyndir.find(b => b.g === `${voice}-${mood}-${tense}-${person}-${number}`);
    return form ? form.b : '-';
  };

  const getParticiple = (voice) => {
    const form = bmyndir.find(b => b.g === `${voice}-SAGNB`);
    return form ? form.b : '-';
  };

  function getMoodName(mood) {
    switch (mood) {
      case 'FH': return t('mood.ind');
      case 'VH': return t('mood.sub');
      default: return mood;
    }
  }
  
  function getTenseName(tense) {
    switch (tense) {
      case 'NT': return t('tense.pres');
      case 'ÞT': return t('tense.past');
      default: return tense;
    }
  }
  
  // Function to determine if a cell should be highlighted
  const shouldHighlight = (form) => {
    return isInfl && form === enteredWord;
  };


  const hasActiveParticiple = bmyndir.some(b => b.g === 'GM-SAGNB');
  const hasMiddleParticiple = bmyndir.some(b => b.g === 'MM-SAGNB');

  const activeParticiple = getParticiple('GM');
  const middleParticiple = getParticiple('MM');

  console.log('hasActiveParticiple:', hasActiveParticiple);
  console.log('hasMiddleParticiple:', hasMiddleParticiple);
  console.log('activeParticiple:', activeParticiple);
  console.log('middleParticiple:', middleParticiple);

  const renderTable = (voice) => (
    <TableContainer 
      component={Paper} 
      sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        maxHeight: 'calc(100vh - 100px)', 
        maxWidth: '100%',
        backgroundColor: theme.palette.primary.dark,
        mb: 8
      }}
    >
      <Table 
        stickyHeader 
        sx={{ 
          border: 1, 
          borderColor: 'divider',
          minWidth: '100%',
          width: 'max-content',
          '& .MuiTableCell-root': {
            padding: '6px',
            fontSize: '1rem',
          },
          '& .MuiTableCell-head': {
            backgroundColor: theme.palette.primary.blue,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}></TableCell>
            <TableCell align="center" colSpan={3}>{t('number.sing').toUpperCase()}</TableCell>
            <TableCell align="center" colSpan={3}>{t('number.plur').toUpperCase()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('mood.label')}</TableCell>
            <TableCell>{t('tense.label')}</TableCell>
            {numbers.map(number => (
              persons.map(person => (
                <TableCell key={`${number}-${person}`}>{`${person}`}</TableCell>
              ))
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {moods.map(mood => (
            tenses.map(tense => (
              <TableRow key={`${mood}-${tense}`}>
                <TableCell sx={{ color: theme.palette.labels.main}}>{getMoodName(mood)}</TableCell>
                <TableCell sx={{ color: theme.palette.labels.main}}>{getTenseName(tense)}</TableCell>
                {numbers.map(number => (
                  persons.map(person => (
                    <TableCell 
                      key={`${number}-${person}`}  
                      sx={{ color: shouldHighlight(getForm(voice, mood, tense, person, number)) ? 'yellow' : 'inherit'}}>
                      {getForm(voice, mood, tense, person, number)}
                    </TableCell>
                  ))
                ))}
              </TableRow>
            ))
          ))}
          <TableRow>
            <TableCell colSpan={2} sx={{ borderTop: 1, color: theme.palette.labels.main }}>{t('papl')}</TableCell>
            <TableCell colSpan={2} sx={{ borderTop: 1, borderRight: 1, color: shouldHighlight((voice === 'GM') ? activeParticiple : middleParticiple) ? 'yellow' : 'inherit'  }}>{(voice === 'GM') ? activeParticiple : middleParticiple}</TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="md" style={{ paddingBottom: '100px' }}>
      <WordHeader 
        word={data[0].ord}
        wordType={t('cat.verb')}
        translation={translation}
        theme={theme}
      />

      
      <Typography variant="h5" gutterBottom>{t('voice.act')}</Typography>
      {renderTable('GM')}
      
      {bmyndir.some(b => b.g.startsWith('MM')) && (
        <>
          <Typography variant="h5" gutterBottom>{t('voice.med')}</Typography>
          {renderTable('MM')}
        </>
      )}
    </Container>
  );
}


export default InflectionTableVerb;