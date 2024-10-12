import React from 'react';
import { 
  Paper, Typography, Box
} from '@mui/material';
import theme from './theme';

function OtherCatTable({ data, translation }) {
  return (
  <div>
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mb: 10 }}>
        <Paper sx={{ my: 2, bgcolor: theme.palette.labels.bggreen, color: theme.palette.labels.tx, textAlign: 'center', width: "60%"}} elevation={3}>
          <Typography variant="h4">
            "{data[0].ord}" ({getCat(data[0].ofl_heiti)})
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
  </div>
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