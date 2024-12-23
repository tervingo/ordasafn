import React from 'react';
import { Container } from '@mui/material';
import WordHeader from './WordHeader';
import { 
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell, 
  Paper
} from '@mui/material';
import theme from './theme';
import { useTranslation } from 'react-i18next';

function InflectionTableNoun({ data, translation, isInfl, enteredWord }) {  // Add enteredWord prop
  const { t } = useTranslation();

  if (!data || !data[0] || !data[0].bmyndir) {
    return <p>No hay datos de inflexión disponibles.</p>;
  }

  const bmyndir = data[0].bmyndir;
  const cases = ['NF', 'ÞF', 'ÞGF', 'EF'];
  const numbers = ['ET', 'FT'];

  const getForm = (casePrefix, number, definite) => {
    const suffix = definite ? 'gr' : '';
    const form = bmyndir.find(b => b.g === `${casePrefix}${number}${suffix}`);
    return form ? form.b : '-';
  };

  // Function to determine if a cell should be highlighted
  const shouldHighlight = (form) => {
    return isInfl && form === enteredWord;
  };

  function getCaseName(casePrefix) {
    switch (casePrefix) {
      case 'NF': return t('case.nom');
      case 'ÞF': return t('case.acc');
      case 'ÞGF': return t('case.dat');
      case 'EF': return t('case.gen');
      default: return casePrefix;
    }
  }
  
  function getGender(kyn) {
    switch (kyn) {
      case 'kk': return t('gender.m');
      case 'kvk': return t('gender.f');
      case 'hk': return t('gender.n');
      default: return kyn;
    }
  }
  
  const nounDef = t('cat.noun') + " - " + getGender(data[0].kyn);
  return (
    <Container maxWidth="md" style={{ paddingBottom: '100px' }}>
      <WordHeader 
        word={data[0].ord}
        wordType={nounDef}
        translation={translation}
        theme={theme}
      />        
      <div className="inflection-table">
        <TableContainer 
          component={Paper} 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            maxHeight: 'calc(100vh - 100px)', 
            maxWidth: '100%',
            backgroundColor: theme.palette.primary.dark
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
                fontSize: '1.2rem',
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
                <TableCell>{t('case.label')}</TableCell>
                <TableCell>{t('number.singindef')}</TableCell>
                <TableCell>{t('number.singdef')}</TableCell>
                <TableCell>{t('number.plurindef')}</TableCell>
                <TableCell>{t('number.plurdef')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map(casePrefix => (
                <TableRow key={casePrefix}>
                  <TableCell sx={{ color: theme.palette.labels.main}}>{getCaseName(casePrefix)}</TableCell>
                  {numbers.map(number => (
                    <React.Fragment key={number}>
                      {/* Indefinite form */}
                      <TableCell 
                        sx={{color: shouldHighlight(getForm(casePrefix, number, false)) ? 'yellow' : 'inherit'}}
                      >
                        {getForm(casePrefix, number, false)}
                      </TableCell>
                      {/* Definite form */}
                      <TableCell 
                        sx={{color: shouldHighlight(getForm(casePrefix, number, true)) ? 'yellow' : 'inherit'}}
                      >
                        {getForm(casePrefix, number, true)}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}

export default InflectionTableNoun;