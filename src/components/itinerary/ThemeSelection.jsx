import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { useItinerary } from '../../context/ItineraryContext'; 

export default function ThemeSelection() {
  const { clientData, setClientData } = useItinerary();

  // NOW WITH 3 GORGEOUS THEMES
  const themes = [
    {
      id: 'midnight',
      name: 'Midnight Slate',
      description: 'Deep charcoal and champagne gold for ultimate luxury.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      bgColor: '#0f172a',
      textColor: '#ffffff',
      accentColor: '#fbbf24'
    },
    {
      id: 'luxe',
      name: 'Classic Luxe',
      description: 'Timeless ivory and serif typography with goldenrod accents.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      bgColor: '#ffffff',
      textColor: '#1e293b',
      accentColor: '#d4af37'
    },
    {
      id: 'coastal',
      name: 'Coastal Serenity',
      description: 'Airy ocean blues and clean whites for a refreshing, tropical vibe.',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
      bgColor: '#f0f9ff', // Soft sky blue
      textColor: '#082f49', // Deep ocean navy
      accentColor: '#0ea5e9' // Bright cyan
    }
  ];

  const selectedTheme = clientData?.theme || 'luxe';

  const handleSelectTheme = (themeId) => {
    setClientData({ ...clientData, theme: themeId });
  };

  return (
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: 15, px: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="900" color="#1e293b" mb={1}>
          Select Itinerary Theme
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose the visual presentation for your client's final document.
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          
          return (
            // Changed md={6} to md={4} so all 3 fit beautifully in one row!
            <Grid item xs={12} sm={6} md={4} key={theme.id}>
              <Paper 
                elevation={isSelected ? 8 : 1}
                onClick={() => handleSelectTheme(theme.id)}
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  border: isSelected ? `3px solid ${theme.accentColor}` : '3px solid transparent',
                  transition: 'all 0.2s ease-in-out',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                  bgcolor: theme.bgColor,
                  color: theme.textColor,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ height: 200, overflow: 'hidden' }}>
                  <img src={theme.image} alt={theme.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ p: 3, flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="800" mb={1} sx={{ color: isSelected ? theme.accentColor : theme.textColor }}>
                    {theme.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.6 }}>
                    {theme.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}