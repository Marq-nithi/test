import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, MenuItem, 
  Button, IconButton, Collapse, InputLabel 
} from '@mui/material';
import { 
  Add, DeleteOutline, ExpandLess, ExpandMore 
} from '@mui/icons-material';
import { useItinerary } from '../context/ItineraryContext';

export default function VisaDetails() {
  const { visaData = [], setVisaData } = useItinerary();
  const [collapsedCards, setCollapsedCards] = useState({});

  // Helper to create a fresh visa object
  const createEmptyVisa = () => ({
    id: Date.now() + Math.random(), // Unique ID
    visaCountry: '',
    visaType: 'Tourist Visa',
    entryType: 'Single Entry',
    duration: '',
    notes: ''
  });

  // 🚨 CRITICAL FIX: If visaData is empty, we force the UI to render one empty form anyway!
  const displayData = visaData.length > 0 ? visaData : [createEmptyVisa()];

  const handleAddVisa = () => {
    if (setVisaData) {
      setVisaData([...displayData, createEmptyVisa()]);
    }
  };

  const handleRemoveVisa = (id) => {
    if (setVisaData) {
      const updatedList = displayData.filter(v => v.id !== id);
      // If they delete the last one, immediately give them a fresh empty form
      setVisaData(updatedList.length > 0 ? updatedList : [createEmptyVisa()]);
    }
  };

  const handleClearAll = () => {
    if (setVisaData) {
      setVisaData([createEmptyVisa()]);
    }
  };

  const handleChange = (id, field, value) => {
    if (setVisaData) {
      const updatedData = displayData.map(v => v.id === id ? { ...v, [field]: value } : v);
      setVisaData(updatedData);
    }
  };

  const toggleCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* --- HEADER SECTION --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="700" color="#1e293b" mb={0.5}>Visa</Typography>
          <Typography variant="body2" color="#64748b">Configure Visa details for your client's trip</Typography>
        </Box>
        <Button 
          variant="outlined" 
          onClick={handleClearAll}
          size="small"
          sx={{ color: '#334155', borderColor: '#e2e8f0', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 2 }}
        >
          Clear All
        </Button>
      </Box>

      {/* --- VISA CARDS LIST --- */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {displayData.map((visa, index) => {
          const isCollapsed = collapsedCards[visa.id];

          return (
            <Paper 
              key={visa.id} 
              elevation={0} 
              sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}
            >
              {/* Card Header Toolbar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isCollapsed ? 0 : 3 }}>
                <Typography variant="subtitle1" fontWeight="700" color="#334155">
                  Visa Details
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<Add fontSize="small"/>}
                    onClick={handleAddVisa}
                    sx={{ color: '#0f172a', borderColor: '#e2e8f0', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 2 }}
                  >
                    Add
                  </Button>
                  <IconButton 
                    size="small" 
                    onClick={() => handleRemoveVisa(visa.id)}
                    sx={{ border: '1px solid #e2e8f0', color: '#ef4444', borderRadius: 2, width: 36, height: 36 }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => toggleCollapse(visa.id)}
                    sx={{ border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 2, width: 36, height: 36 }}
                  >
                    {isCollapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
                  </IconButton>
                </Box>
              </Box>

              {/* Form Content */}
              <Collapse in={!isCollapsed}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 1 }}>
                      Visa Country <span style={{color: '#ef4444'}}>*</span>
                    </InputLabel>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="United States" 
                      value={visa.visaCountry || ''} 
                      onChange={(e) => handleChange(visa.id, 'visaCountry', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 1 }}>
                      Visa Type <span style={{color: '#ef4444'}}>*</span>
                    </InputLabel>
                    <TextField 
                      select 
                      fullWidth 
                      size="small" 
                      value={visa.visaType || 'Tourist Visa'} 
                      onChange={(e) => handleChange(visa.id, 'visaType', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      <MenuItem value="Tourist Visa">Tourist Visa</MenuItem>
                      <MenuItem value="Business Visa">Business Visa</MenuItem>
                      <MenuItem value="Transit Visa">Transit Visa</MenuItem>
                      <MenuItem value="e-Visa">e-Visa</MenuItem>
                      <MenuItem value="Visa on Arrival">Visa on Arrival</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 1 }}>
                      Entry Type <span style={{color: '#ef4444'}}>*</span>
                    </InputLabel>
                    <TextField 
                      select 
                      fullWidth 
                      size="small" 
                      value={visa.entryType || 'Single Entry'} 
                      onChange={(e) => handleChange(visa.id, 'entryType', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      <MenuItem value="Single Entry">Single Entry</MenuItem>
                      <MenuItem value="Double Entry">Double Entry</MenuItem>
                      <MenuItem value="Multiple Entry">Multiple Entry</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 1 }}>
                      Duration <span style={{color: '#ef4444'}}>*</span>
                    </InputLabel>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="30 Days" 
                      value={visa.duration || ''} 
                      onChange={(e) => handleChange(visa.id, 'duration', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <InputLabel sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', mb: 1 }}>
                      Add Notes
                    </InputLabel>
                    <TextField 
                      fullWidth 
                      size="small"
                      placeholder="Type here..." 
                      value={visa.notes || ''} 
                      onChange={(e) => handleChange(visa.id, 'notes', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}