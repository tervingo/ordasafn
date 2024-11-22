import React from 'react';
import { Box, Paper, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

function WordHeader({ word, wordType, translation, theme }) {
  const glosbeUrl = `https://glosbe.com/is/en/${encodeURIComponent(word)}`;
  const { t } = useTranslation();

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
        <Paper sx={{ 
          my: 2, 
          bgcolor: theme.palette.labels.bgorange, 
          color: theme.palette.labels.tx, 
          width: "60%",
          p: 2, // Add some padding
        }} elevation={3}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="h5">
              {translation}
            </Typography>
            <Link 
              href={glosbeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{
                color: theme.palette.labels.watchout,
                textDecoration: 'none',
                fontSize: '1.2rem', // Smaller font size
                ml: 2, // Add some margin to the left
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {t('more')}
            </Link>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default WordHeader;