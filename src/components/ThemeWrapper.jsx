import React, { useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useItinerary } from '../context/ItineraryContext';

export default function ThemeWrapper({ children }) {
  const { settings } = useItinerary();

  const theme = useMemo(() => createTheme({
    palette: {
      mode: settings.mode,
      primary: { main: settings.primaryColor },
      background: {
        default: settings.mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: settings.mode === 'dark' ? '#1e293b' : '#ffffff',
      }
    },
    typography: { 
      fontFamily: settings.font,
      button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: { borderRadius: 12 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none', border: settings.mode === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0' }
        }
      }
    }
  }), [settings]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}