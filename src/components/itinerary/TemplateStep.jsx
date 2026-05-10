import React from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  Accordion, AccordionSummary, AccordionDetails, IconButton, InputAdornment 
} from '@mui/material';
import { ExpandMore, DeleteOutline, Search } from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext'; // Adjust path if needed

export default function DayPlanner() {
  const { clientData, setClientData, activeDays, setActiveDays } = useItinerary();

  // 1. Handle Trip Title Change
  const handleTripTitleChange = (e) => {
    setClientData(prev => ({
      ...prev,
      trip_title: e.target.value
    }));
  };

  // 2. Handle Day Add/Remove/Update (Basic Logic)
  const handleAddDay = () => {
    const newDay = { title: '', description: '', highlights: [] };
    setActiveDays(prev => [...(prev || []), newDay]);
  };

  const handleUpdateDay = (index, field, value) => {
    const updatedDays = [...(activeDays || [])];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setActiveDays(updatedDays);
  };

  // Safe fallback if activeDays is empty
  const daysToRender = activeDays?.length > 0 ? activeDays : [{ title: '', description: '' }];

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', pb: 10 }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" color="#0f172a" mb={1}>Day Planner</Typography>
          <Typography variant="body2" color="#64748b">Plan each day of the journey with rich descriptions</Typography>
        </Box>
        <Button variant="outlined" sx={{ borderColor: '#e2e8f0', color: '#475569', fontWeight: 600, textTransform: 'none', borderRadius: 2, bgcolor: '#fff' }}>
          Clear All
        </Button>
      </Box>

      {/* TRIP TITLE INPUT SECTION (From your screenshot) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 6 }}>
        <Typography variant="subtitle2" fontWeight="800" color="#0f172a" sx={{ width: 80 }}>Trip Title</Typography>
        <TextField
          size="small"
          placeholder="Your journey, our expertise"
          value={clientData?.trip_title || ''}
          onChange={handleTripTitleChange}
          sx={{ 
            width: 350, 
            bgcolor: '#fff',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': { borderColor: '#e2e8f0' },
            }
          }}
        />
      </Box>

      {/* DAYS ACCORDION LIST */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {daysToRender.map((day, index) => (
          <Paper key={index} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden', bgcolor: '#fff' }}>
            <Accordion elevation={0} disableGutters defaultExpanded={index === 0} sx={{ '&:before': { display: 'none' } }}>
              
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 3, py: 1, borderBottom: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                  <Typography variant="h6" fontWeight="800" color="#0f172a">Day {index + 1}</Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outlined" 
                      startIcon={<Search fontSize="small"/>}
                      size="small"
                      sx={{ borderColor: '#e2e8f0', color: '#64748b', textTransform: 'none', borderRadius: 1.5, px: 2 }}
                    >
                      Search
                    </Button>
                    <IconButton size="small" sx={{ border: '1px solid #fecaca', color: '#ef4444', borderRadius: 1.5 }} onClick={() => {/* Remove logic here */}}>
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 3, bgcolor: '#f8fafc' }}>
                <Typography variant="caption" fontWeight="700" color="#0f172a" mb={1} display="block">Day Title <span style={{color: '#ef4444'}}>*</span></Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="e.g. Arrival in Paris" 
                  value={day.title || ''}
                  onChange={(e) => handleUpdateDay(index, 'title', e.target.value)}
                  sx={{ bgcolor: '#fff', mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Typography variant="caption" fontWeight="700" color="#0f172a" mb={1} display="block">Description <span style={{color: '#ef4444'}}>*</span></Typography>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={4} 
                  placeholder="Describe the day's activities..." 
                  value={day.description || ''}
                  onChange={(e) => handleUpdateDay(index, 'description', e.target.value)}
                  sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </AccordionDetails>

            </Accordion>
          </Paper>
        ))}
      </Box>

      {/* ADD DAY BUTTON */}
      <Button 
        variant="outlined" 
        onClick={handleAddDay}
        sx={{ mt: 3, borderColor: '#cbd5e1', borderStyle: 'dashed', color: '#64748b', fontWeight: 700, borderRadius: 2, textTransform: 'none', width: '100%', py: 1.5 }}
      >
        + Add Another Day
      </Button>

    </Box>
  );
}