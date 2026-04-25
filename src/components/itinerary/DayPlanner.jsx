import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, IconButton, 
  Paper, Collapse, Divider
} from '@mui/material';
import { 
  DeleteOutline, KeyboardArrowUp, KeyboardArrowDown, 
  ImageOutlined, Add, FormatBold, FormatItalic, 
  FormatUnderlined, FormatListBulleted,
  ExpandMore, Close
} from '@mui/icons-material';

import { useItinerary } from '../../context/ItineraryContext'; 

const FieldLabel = ({ text, required }) => (
  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block', fontSize: '0.75rem' }}>
    {text} {required && <span style={{ color: '#ef4444' }}>*</span>}
  </Typography>
);

export default function DayPlanner() {
  const { dayPlannerData, setDayPlannerData, clientData } = useItinerary();

  const emptyDay = { title: '', description: '', images: [], isOpen: false };

  const getInitialDays = () => {
    if (dayPlannerData && dayPlannerData.length > 0) return dayPlannerData;

    const targetDays = parseInt(clientData?.days) || 1; 

    return Array.from({ length: targetDays }).map((_, index) => ({
      ...emptyDay,
      id: Date.now() + index,
      dayNumber: index + 1,
      isOpen: index === 0 
    }));
  };

  const [days, setDays] = useState(getInitialDays());

  useEffect(() => {
    if (setDayPlannerData) setDayPlannerData(days);
  }, [days, setDayPlannerData]);

  useEffect(() => {
    const targetDays = parseInt(clientData?.days) || 1;
    
    if (days.length < targetDays) {
      const newDays = [...days];
      for (let i = days.length; i < targetDays; i++) {
        newDays.push({ ...emptyDay, id: Date.now() + i, dayNumber: i + 1, isOpen: false });
      }
      setDays(newDays);
    } else if (days.length > targetDays) {
      setDays(prev => prev.slice(0, targetDays));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientData?.days]);

  const handleToggleOpen = (id) => setDays(days.map(day => day.id === id ? { ...day, isOpen: !day.isOpen } : day));
  const handleAddDay = () => setDays([...days, { ...emptyDay, id: Date.now(), dayNumber: days.length + 1, isOpen: true }]);
  const handleDeleteDay = (id) => {
    if (days.length > 1) {
      setDays(days.filter(day => day.id !== id).map((day, index) => ({ ...day, dayNumber: index + 1 })));
    }
  };
  const handleChange = (id, field, value) => setDays(days.map(day => day.id === id ? { ...day, [field]: value } : day));

  const handleImageUpload = (dayId, event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(base64Images => {
       setDays(prevDays => prevDays.map(day => {
         if (day.id === dayId) {
           return { ...day, images: [...(day.images || []), ...base64Images] };
         }
         return day;
       }));
    });
  };

  const handleRemoveImage = (dayId, indexToRemove) => {
     setDays(prevDays => prevDays.map(day => {
         if (day.id === dayId) {
           return { ...day, images: day.images.filter((_, idx) => idx !== indexToRemove) };
         }
         return day;
     }));
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', pb: 12 }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={0.5}>Day Planner</Typography>
          <Typography variant="body2" color="text.secondary">
            Plan each day of the journey with rich descriptions
          </Typography>
        </Box>
        <Button 
          variant="outlined" size="small" 
          sx={{ borderColor: '#cbd5e1', color: '#475569', fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 3 }}
          onClick={() => setDays([{ ...emptyDay, id: Date.now(), dayNumber: 1, isOpen: true }])}
        >
          Clear All
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {days.map((day) => (
          <Paper 
            key={day.id} elevation={0} 
            sx={{ borderRadius: 2, border: day.isOpen ? '2px solid #0ea5e9' : '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff', transition: 'all 0.2s ease-in-out' }}
          >
            <Box 
              sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: day.isOpen ? '1px solid #f1f5f9' : 'none' }}
              onClick={() => handleToggleOpen(day.id)}
            >
              <Typography variant="h6" fontWeight="800" color="#0f172a" fontSize="1.1rem">Day {day.dayNumber}</Typography>
              <Box sx={{ display: 'flex', gap: 1.5 }} onClick={(e) => e.stopPropagation()}>
                <IconButton size="small" onClick={() => handleDeleteDay(day.id)} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fef2f2', borderRadius: 1.5, width: 34, height: 34 }}>
                  <DeleteOutline fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleToggleOpen(day.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: 1.5, width: 34, height: 34 }}>
                  {day.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={day.isOpen}>
              <Box sx={{ p: 4, pt: 3 }}>
                <Box mb={3}>
                  <FieldLabel text="Day Title" required />
                  <TextField fullWidth size="small" placeholder="e.g. Arrival in Rome & Colosseum Visit" value={day.title} onChange={(e) => handleChange(day.id, 'title', e.target.value)} InputProps={{ endAdornment: <ExpandMore sx={{ color: '#94a3b8' }} /> }} />
                </Box>
                <Box mb={3}>
                  <Typography variant="caption" fontWeight="700" color="#334155" mb={0.8} display="block" fontSize="0.75rem">Activities & Experiences</Typography>
                  <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff' }}>
                    <Box sx={{ display: 'flex', gap: 1, p: 1, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', alignItems: 'center' }}>
                      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatBold fontSize="small" sx={{ color: '#475569' }} /></IconButton>
                      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatItalic fontSize="small" sx={{ color: '#475569' }} /></IconButton>
                      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatUnderlined fontSize="small" sx={{ color: '#475569' }} /></IconButton>
                      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', px: 0.5 }}>
                        <Box sx={{ width: 14, height: 14, bgcolor: '#0f172a', borderRadius: 0.5, mr: 0.5 }} />
                        <ExpandMore fontSize="small" sx={{ color: '#94a3b8' }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', px: 0.5 }}>
                        <FormatListBulleted fontSize="small" sx={{ color: '#475569' }} />
                        <ExpandMore fontSize="small" sx={{ color: '#94a3b8' }} />
                      </Box>
                    </Box>
                    <TextField fullWidth multiline rows={5} placeholder="Describe the day's activities – Sights, meals, transfers, special experiences..." value={day.description} onChange={(e) => handleChange(day.id, 'description', e.target.value)} sx={{ '& fieldset': { border: 'none' }, p: 1 }} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {day.images && day.images.map((imgSrc, imgIndex) => (
                    <Box key={imgIndex} sx={{ position: 'relative', width: 64, height: 64, borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img src={imgSrc} alt={`upload-${imgIndex}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton size="small" onClick={() => handleRemoveImage(day.id, imgIndex)} sx={{ position: 'absolute', top: 2, right: 2, width: 20, height: 20, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fee2e2' } }}>
                        <Close sx={{ fontSize: 14, color: '#ef4444' }} />
                      </IconButton>
                    </Box>
                  ))}
                  {(!day.images || day.images.length === 0) && (
                    <Box component="label" sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', '&:hover': { bgcolor: '#e2e8f0' } }}>
                      <input type="file" hidden accept="image/*" multiple onChange={(e) => handleImageUpload(day.id, e)} />
                      <ImageOutlined sx={{ color: '#64748b' }} />
                    </Box>
                  )}
                  <Box component="label" sx={{ width: 64, height: 64, borderRadius: 2, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', cursor: 'pointer', '&:hover': { bgcolor: '#e2e8f0' } }}>
                    <input type="file" hidden accept="image/*" multiple onChange={(e) => handleImageUpload(day.id, e)} />
                    <Add sx={{ color: '#64748b' }} />
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        ))}
      </Box>

      <Button fullWidth onClick={handleAddDay} sx={{ mt: 3, py: 2, border: '1px dashed #93c5fd', color: '#3b82f6', fontWeight: 600, textTransform: 'none', borderRadius: 2, bgcolor: 'transparent', '&:hover': { border: '1px dashed #3b82f6', bgcolor: '#eff6ff' } }}>
        + Add another day to the itinerary
      </Button>

    </Box>
  );
}