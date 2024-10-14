import React from 'react';
import { Box, Paper, Typography, Link } from '@mui/material';

function WordHeader({ word, wordType, translation, theme }) {
  const glosbeUrl = `https://glosbe.com/is/en/${encodeURIComponent(word)}`;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '100%', 
      mb: 10 
    }}>
      <Paper sx={{ 
        my: 2, 
        bgcolor: theme.palette.labels.bggreen, 
        color: theme.palette.labels.tx, 
        textAlign: 'center', 
        width: "60%"
      }} elevation={3}>
        <Typography variant="h4">
          "{word}" ({wordType})
        </Typography>
      </Paper>
      {translation && (
        <>
          <Paper sx={{ 
            my: 2, 
            bgcolor: theme.palette.labels.bgorange, 
            color: theme.palette.labels.tx, 
            textAlign: 'center', 
            width: "60%"
          }} elevation={3}>
            <Typography variant="h5">
              {translation}
            </Typography>
          </Paper>
          <Link 
            href={glosbeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.primary.main,
              textDecoration: 'none',
              mt: 1,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <Typography variant="subtitle2" component="h2" gutterBottom sx={{ 
              color: theme.palette.labels.subtitle,
              '& a': {
                color: theme.palette.link.default,
                textDecoration: 'none',
                '&:hover': {textDecoration: 'underline',},
              },
            }}>
              See Glosbe translation page for this word
            </Typography>
          </Link>
        </>
      )}
    </Box>
  );
}

export default WordHeader;