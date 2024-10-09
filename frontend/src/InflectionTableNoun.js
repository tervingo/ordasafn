import React from 'react';
import { 
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell, 
  Paper, Typography, Checkbox, IconButton, Box
} from '@mui/material';
import theme from './theme';

function InflectionTableNoun({ data, translation }) {
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

  return (
  <div>
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', my: 1 }}>
        <Paper sx={{ my: 2, bgcolor: theme.palette.labels.bggreen, color: theme.palette.labels.tx, textAlign: 'center', width: "60%"}} elevation={3}>
          <Typography variant="h4">
            "{data[0].ord}" ({getCat(data[0].ofl_heiti)} - {getGender(data[0].kyn)})
          </Typography>
        </Paper>
        {translation && (
          <Paper sx={{ my: 2, bgcolor: theme.palette.labels.bgorange, color: theme.palette.labels.tx, textAlign: 'center', width: "60%"}} elevation={3}>
            <Typography variant="h5">
              {translation}
            </Typography>
          </Paper>
        )}
      </Box>
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
            minWidth: '100%', // Ensure table takes full width
            width: 'max-content',
            '& .MuiTableCell-root': {
              padding: '6px', // Reduce cell padding
              fontSize: '1.2rem', // Decrease font size
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
            <TableCell>Case</TableCell>
            <TableCell>Sing Indef</TableCell>
            <TableCell>Sing Def</TableCell>
            <TableCell>Plur Indef</TableCell>
            <TableCell>Plur Def</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cases.map(casePrefix => (
            <TableRow key={casePrefix}>
              <TableCell>{getCaseName(casePrefix)}</TableCell>
              {numbers.map(number => (
                <React.Fragment key={number}>
                  <TableCell>{getForm(casePrefix, number, false)}</TableCell>
                  <TableCell>{getForm(casePrefix, number, true)}</TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  </div>
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

function getGender(kyn) {
  switch (kyn) {
    case 'kk': return 'm.';
    case 'kvk': return 'f.';
    case 'hk': return 'n.';
    default: return kyn;
  }
}

function getCat(cat) {
  switch (cat) {
    case 'nafnorð': return 'noun';
    case 'sagnorð': return 'verb';
    default: return cat;
  }
}

export default InflectionTableNoun;