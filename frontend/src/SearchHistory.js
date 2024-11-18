import React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SearchHistory = ({ searches, onSelectWord, onClearHistory }) => {
    const handleClick = (word) => {
      onSelectWord(word);
    };
  
    const handleClear = () => {
      onClearHistory();
    };
  
    if (searches.length === 0) {
      return (
        <Paper 
          elevation={3}
          sx={{ 
            p: 2,
            maxWidth: 300,
            backgroundColor: theme => theme.palette.primary.dark,
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            Recent Searches
            <IconButton 
              size="small" 
              onClick={handleClear}
              sx={{ color: 'grey.500' }}
            >
              <DeleteIcon />
            </IconButton>
          </Typography>
          <Typography variant="body2" sx={{ color: 'grey.500' }}>
            No recent searches
          </Typography>
        </Paper>
      );
    }
  
    return (
      <Paper 
        elevation={3}
        sx={{ 
          p: 2,
          maxWidth: 300,
          backgroundColor: theme => theme.palette.primary.dark,
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Recent Searches
          <IconButton 
            size="small" 
            onClick={handleClear}
            sx={{ color: 'grey.500' }}
          >
            <DeleteIcon />
          </IconButton>
        </Typography>
        <List dense>
          {searches.map((word, index) => (
            <ListItem 
              key={`${word}-${index}`} 
              disablePadding
            >
              <ListItemButton 
                onClick={() => handleClick(word)}
                sx={{
                  '&:hover': {
                    backgroundColor: theme => theme.palette.primary.main,
                  }
                }}
              >
                <ListItemText primary={word} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

export default SearchHistory;