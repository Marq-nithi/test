import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, IconButton, Divider 
} from '@mui/material';
import { 
  DeleteOutline, ExpandLess, ExpandMore, FormatBold, 
  FormatItalic, FormatUnderlined, FormatColorText, FormatListBulleted 
} from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext';

export default function DayPlanner() {
  // We now pull clientData and setClientData to keep the days in perfect sync
  const { dayPlannerData, setDayPlannerData, clientData, setClientData } = useItinerary();
  
  const [expandedDays, setExpandedDays] = useState([1]);

  // ==========================================
  // MAGIC SYNC: Watches Client Details for changes
  // ==========================================
  // useEffect(() => {
  //   const targetDays = parseInt(clientData.days) || 1;

  //   setDayPlannerData((prevDays) => {
  //     // If the number of cards matches the client's total days, do nothing
  //     if (prevDays.length === targetDays) return prevDays;

  //     // If the client's days are greater than our cards, automatically add more
  //     if (prevDays.length < targetDays) {
  //       const newDays = [...prevDays];
  //       for (let i = prevDays.length + 1; i <= targetDays; i++) {
  //         newDays.push({ day: i, title: '', description: '' });
  //       }
  //       return newDays;
  //     } 
  //     // If the client's days are less than our cards, slice off the extra cards
  //     else {
  //       return prevDays.slice(0, targetDays);
  //     }
  //   });
  // }, [clientData.days, setDayPlannerData]);


  // ==========================================
  // HANDLERS
  // ==========================================
  const toggleExpand = (dayNumber) => {
    setExpandedDays(expandedDays.includes(dayNumber) 
      ? expandedDays.filter(d => d !== dayNumber) 
      : [...expandedDays, dayNumber]
    );
  };

  // Adding a day here automatically updates the Client Details global count!
  const handleAddDay = () => {
    const newTotalDays = dayPlannerData.length + 1;
    setClientData({ ...clientData, days: newTotalDays });
    setExpandedDays([...expandedDays, newTotalDays]); 
  };

  // Deleting a day re-indexes the numbers and reduces the global count!
  const handleDeleteDay = (dayNumber) => {
    const updatedDays = dayPlannerData.filter(d => d.day !== dayNumber);
    const reindexedDays = updatedDays.map((d, index) => ({ ...d, day: index + 1 }));
    setDayPlannerData(reindexedDays);
    setClientData({ ...clientData, days: reindexedDays.length });
  };

  const handleClearAll = () => {
    // Instead of deleting the cards, we just wipe the text clean
    setDayPlannerData(prev => prev.map(d => ({ ...d, title: '', description: '' })));
  };

  const handleChange = (dayNumber, field, value) => {
    setDayPlannerData(
      dayPlannerData.map(d => d.day === dayNumber ? { ...d, [field]: value } : d)
    );
  };

  // Reusable Rich Text Toolbar Mock
  const RichTextToolbar = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa', px: 1, py: 0.5 }}>
      <IconButton size="small"><FormatBold fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <IconButton size="small"><FormatItalic fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <IconButton size="small"><FormatUnderlined fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
      <IconButton size="small"><FormatColorText fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
      <IconButton size="small"><FormatListBulleted fontSize="small" sx={{ color: '#555' }} /></IconButton>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
            Day Planner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plan each day of the journey with rich descriptions
          </Typography>
        </Box>
        <Button variant="outlined" onClick={handleClearAll} sx={{ color: '#546e7a', borderColor: '#cfd8dc', fontWeight: 600, textTransform: 'none', px: 3 }}>
          Clear All Text
        </Button>
      </Box>

      {dayPlannerData.map((dayData) => {
        const isExpanded = expandedDays.includes(dayData.day);

        return (
          <Paper key={dayData.day} elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#ffffff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: isExpanded ? 3 : 0 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1a1a1a', fontSize: '1.1rem' }}>
                Day {dayData.day}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => handleDeleteDay(dayData.day)} sx={{ color: '#ef5350', border: '1px solid #ffebee', bgcolor: '#fffafb', '&:hover': { bgcolor: '#ffebee' } }}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => toggleExpand(dayData.day)} sx={{ border: '1px solid #e0e0e0', color: '#546e7a' }}>
                  {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </IconButton>
              </Box>
            </Box>

            {isExpanded && (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>Day Title <span style={{ color: '#d32f2f' }}>*</span></Typography>
                <TextField 
                  fullWidth size="small" placeholder="e.g. Arrival in Rome & Colosseum Visit" 
                  value={dayData.title} onChange={(e) => handleChange(dayData.day, 'title', e.target.value)} sx={{ mb: 3 }}
                />

                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>Activities & Experiences</Typography>
                <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                  <RichTextToolbar />
                  <TextField 
                    fullWidth multiline minRows={4} placeholder="Describe the day's activities - Sights, meals, transfers, special experiences..." 
                    value={dayData.description} onChange={(e) => handleChange(dayData.day, 'description', e.target.value)}
                    sx={{ '& fieldset': { border: 'none' }, '& .MuiInputBase-root': { py: 2 } }} 
                  />
                </Box>
              </Box>
            )}
          </Paper>
        );
      })}

      <Button fullWidth onClick={handleAddDay} sx={{ border: '1px dashed #64b5f6', bgcolor: '#f0f8ff', color: '#1976d2', py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#e3f2fd', border: '1px dashed #2196f3' } }}>
        + Add another day to the itinerary
      </Button>
    </Box>
  );
}