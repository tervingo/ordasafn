import React from 'react';
import { Container } from '@mui/material';
import WordHeader from './WordHeader';
import { 
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell, 
  Paper, Typography
} from '@mui/material';


function InflectionTableVerb({ data, translation, theme }) {
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
            <TableCell align="center" colSpan={3}>SINGULAR</TableCell>
            <TableCell align="center" colSpan={3}>PLURAL</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Mood</TableCell>
            <TableCell>Tense</TableCell>
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
                <TableCell>{getMoodName(mood)}</TableCell>
                <TableCell>{getTenseName(tense)}</TableCell>
                {numbers.map(number => (
                  persons.map(person => (
                    <TableCell key={`${number}-${person}`}>
                      {getForm(voice, mood, tense, person, number)}
                    </TableCell>
                  ))
                ))}
              </TableRow>
            ))
          ))}
          <TableRow>
            <TableCell colSpan={2} sx={{ borderTop: 1 }}>Participle</TableCell>
            <TableCell colSpan={2} sx={{ borderTop: 1, borderRight: 1 }}>{(voice === 'GM') ? activeParticiple : middleParticiple}</TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Container maxWidth="md" style={{ paddingBottom: '100px' }}>
      <WordHeader 
        word={data[0].ord}
        wordType="verb"
        translation={translation}
        theme={theme}
      />

      
      <Typography variant="h5" gutterBottom>Active Voice</Typography>
      {renderTable('GM')}
      
      {bmyndir.some(b => b.g.startsWith('MM')) && (
        <>
          <Typography variant="h5" gutterBottom>Middle Voice</Typography>
          {renderTable('MM')}
        </>
      )}
    </Container>
  );
}


function getMoodName(mood) {
  switch (mood) {
    case 'FH': return 'Indicative';
    case 'VH': return 'Subjunctive';
    default: return mood;
  }
}

function getTenseName(tense) {
  switch (tense) {
    case 'NT': return 'Present';
    case 'ÞT': return 'Past';
    default: return tense;
  }
}

export default InflectionTableVerb;