import { createTheme } from '@mui/material/styles';
import { blue, orange, indigo, lightGreen, green, red, grey } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
          default: 'dimgrey',
        },
        primary: {
          main: grey[600], // This is the default MUI blue
          dark: grey[800], // You can change this to any color you want
          blue: blue[700],
          orange: orange[500],
        },
        toggle: {
          on: blue[700],
          off: grey[700],
          over: grey[100],
        },
        labels: {
          bgblue: blue[900],
          bggreen: green[900],
          bgorange: orange[900],
          tx: grey[100]
        }
      },
  typography: {
    fontSize: 16, // This increases the base font size
      h3: {
        fontSize: '2.5rem', // Adjust this value as needed
      },
      body1: {
        fontSize: '1.5rem', // Adjust this value as needed
      },
    },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          padding: '10px 20px',
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: '1px solid #1976d2',
          backgroundColor: green[700],
          padding: '4px 8px',
          fontSize: '0.75rem',
          '&.Mui-selected': {
            backgroundColor: blue[700],
            color: grey[100],
          },
          '&:hover': {
            backgroundColor: green[600],
          }
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          '& .MuiToggleButton-root': {
            margin: 0.5,
            border: 0,
            '&:first-of-type': {
              borderRadius: '4px 0 0 4px',
            },
            '&:last-of-type': {
              borderRadius: '0 4px 4px 0',
            },
            '&.Mui-disabled': {
              border: 0,
            },
          },
        },
      },
    },
  },
});

export default theme;