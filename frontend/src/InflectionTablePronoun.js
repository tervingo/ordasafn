import React from 'react';
import { 
  Table, TableContainer, TableHead, TableBody, TableRow, TableCell, 
  Paper, Typography, Box
} from '@mui/material';
import theme from './theme';

function InflectionTablePronoun({ data, translation }) {
  if (!data || !data[0] || !data[0].bmyndir) {
    return <p>No inflection data available for this adjective.</p>;
  }

const bmyndir = data[0].bmyndir;
const cases = ['NF', 'ÞF', 'ÞGF', 'EF'];
const genders = ['KK', 'KVK', 'HK'];
const numbers = ['ET', 'FT'];


const getForm = (casePrefix, number) => {
    const form = bmyndir.find(b => b.g === `${casePrefix}${number}`);
    return form ? form.b : '-';
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
                <TableCell align="center" key={`${number}`}>
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
    <div>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: 10 }}>
            <Paper sx={{ my: 2, bgcolor: theme.palette.labels.bggreen, color: theme.palette.labels.tx, textAlign: 'center', width: "60%"}} elevation={3}>
            <Typography variant="h4">
                "{data[0].ord}" (pronoun)
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
        {renderTable('FSB')}
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

function getGenderName(gender) {
  switch (gender) {
    case 'KK': return 'Masc.';
    case 'KVK': return 'Fem.';
    case 'HK': return 'Neut.';
    default: return gender;
  }
}

export default InflectionTablePronoun;