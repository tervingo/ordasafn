import React from 'react';
import { Container } from '@mui/material';
import WordHeader from './WordHeader';
import { 
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell, 
  Paper
} from '@mui/material';
import theme from './theme';

function InflectionTablePronoun({ data, translation, isInfl, enteredWord }) {
  if (!data || !data[0] || !data[0].bmyndir) {
    return <p>No inflection data available for this adjective.</p>;
  }

const bmyndir = data[0].bmyndir;
const cases = ['NF', 'ÞF', 'ÞGF', 'EF'];
const numbers = ['ET', 'FT'];


const getForm = (casePrefix, number) => {
    const form = bmyndir.find(b => b.g === `${casePrefix}${number}`);
    return form ? form.b : '-';
};

// Function to determine if a cell should be highlighted
const shouldHighlight = (form) => {
  return isInfl && form === enteredWord;
};

const renderTable = () => (
    <TableContainer 
    component={Paper} 
    sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        maxHeight: 'calc(100vh - 100px)', 
        maxWidth: '100%',
        backgroundColor: theme.palette.primary.dark,
        mb: 4
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
                <TableCell rowSpan={2}>CASE</TableCell>
                <TableCell align="center">SINGULAR</TableCell>
                <TableCell align="center">PLURAL</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
        {cases.map(casePrefix => (
            <TableRow key={casePrefix}>
            <TableCell>{getCaseName(casePrefix)}</TableCell>
            {numbers.map(number => (
                <TableCell align="center" key={`${number}`} sx={{color: shouldHighlight(getForm(casePrefix, number)) ? 'yellow' : 'inherit'}}>
                    {getForm(casePrefix, number)}
                </TableCell>
            ))}
            </TableRow>
        ))}
        </TableBody>
    </Table>
    </TableContainer>
);

return (
    <Container maxWidth="md" style={{ paddingBottom: '100px' }}>
      <WordHeader 
        word={data[0].ord}
        wordType="pronoun"
        translation={translation}
        theme={theme}
      /> 
        {renderTable('FSB')}
    </Container>
    );
  }
  

function getCaseName(casePrefix) {
  switch (casePrefix) {
    case 'NF': return 'Nominative';
    case 'ÞF': return 'Accusative';
    case 'ÞGF': return 'Dative';
    case 'EF': return 'Genitive';
    default: return casePrefix;
  }
}

export default InflectionTablePronoun;