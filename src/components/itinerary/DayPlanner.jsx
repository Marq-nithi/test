import React, { useState, useRef } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, 
  IconButton, Checkbox, FormControlLabel, Radio, RadioGroup, FormGroup,
  Divider, Autocomplete, Collapse
} from '@mui/material';
import { 
  DeleteOutline, Search, KeyboardArrowUp, KeyboardArrowDown,
  FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted,
  ImageOutlined, AddOutlined, Cancel
} from '@mui/icons-material';

import { useItinerary } from '../../context/ItineraryContext'; 

const dayTitleOptions = [
  "Arrival & Hotel Check-in",
  "Guided City Tour",
  "Leisure & Shopping",
  "Full Day Excursion",
  "Departure"
];

export default function DayPlanner() {
  const { clientData, setClientData, activeDays, setActiveDays, dayPlannerData, setDayPlannerData } = useItinerary();
  const [expandedDays, setExpandedDays] = useState({ 0: true });

  // 🚨 REFERENCES FOR IMAGE UPLOAD
  const fileInputRef = useRef(null);
  const [activeUploadIndex, setActiveUploadIndex] = useState(null);

  const toggleDay = (index) => {
    setExpandedDays(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const daysArray = activeDays || dayPlannerData || [{ title: '', description: '', activities: '', meals: ['Breakfast', 'Dinner'], transport: 'Seat in Coach', images: [] }];
  const setDaysArray = setActiveDays || setDayPlannerData || (() => {});

  const handleTripTitleChange = (e) => {
    if (setClientData) setClientData(prev => ({ ...prev, trip_title: e.target.value }));
  };

  const handleAddDay = () => {
    const newDay = { title: '', description: '', activities: '', meals: [], transport: 'Seat in Coach', images: [] };
    const newIndex = daysArray.length;
    setDaysArray([...daysArray, newDay]);
    setExpandedDays(prev => ({ ...prev, [newIndex]: true }));
  };

  const handleRemoveDay = (indexToRemove) => {
    setDaysArray(daysArray.filter((_, index) => index !== indexToRemove));
  };

  const handleUpdateDay = (index, field, value) => {
    const updatedDays = [...daysArray];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setDaysArray(updatedDays);
  };

  // SAFE MEAL UPDATE LOGIC
  const handleMealChange = (index, meal) => {
    const day = daysArray[index];
    // Force currentMeals to be an array safely
    const currentMeals = Array.isArray(day.meals) ? day.meals : [];
    let newMeals;
    
    if (meal === 'No Meals') {
      newMeals = currentMeals.includes('No Meals') ? [] : ['No Meals'];
    } else {
      newMeals = currentMeals.includes(meal) 
        ? currentMeals.filter(m => m !== meal)
        : [...currentMeals.filter(m => m !== 'No Meals'), meal];
    }
    handleUpdateDay(index, 'meals', newMeals);
  };

  // 🚨 IMAGE UPLOAD HANDLERS
  const handleImageClick = (index) => {
    setActiveUploadIndex(index);
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && activeUploadIndex !== null) {
      const imageUrl = URL.createObjectURL(file); // Create local URL for preview
      const day = daysArray[activeUploadIndex];
      const currentImages = Array.isArray(day.images) ? day.images : [];
      handleUpdateDay(activeUploadIndex, 'images', [...currentImages, imageUrl]);
    }
    event.target.value = ''; // Reset input so you can upload the same file again
  };

  const handleRemoveImage = (dayIndex, imgIndex) => {
    const updatedImages = daysArray[dayIndex].images.filter((_, i) => i !== imgIndex);
    handleUpdateDay(dayIndex, 'images', updatedImages);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', pb: 10 }}>
      
      {/* 🚨 HIDDEN FILE INPUT */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="800" color="#0f172a" mb={0.5}>Day Planner</Typography>
          <Typography variant="body2" color="#64748b">Plan each day of the journey with rich descriptions</Typography>
        </Box>
        <Button 
          variant="outlined" 
          sx={{ borderColor: '#e2e8f0', color: '#0f172a', fontWeight: 600, textTransform: 'none', borderRadius: 2, bgcolor: '#fff', px: 3 }}
        >
          Clear All
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Typography variant="subtitle2" fontWeight="800" color="#334155" sx={{ width: 80 }}>Trip Title</Typography>
        <TextField
          size="small"
          placeholder="Your journey, our expertise"
          value={clientData?.trip_title || ''}
          onChange={handleTripTitleChange}
          sx={{ 
            width: 350, bgcolor: '#fff',
            '& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#e2e8f0' } }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {daysArray.map((day, index) => {
          const isExpanded = expandedDays[index];
          // SAFE ARRAYS FOR RENDERING
          const safeMeals = Array.isArray(day.meals) ? day.meals : [];
          const safeImages = Array.isArray(day.images) ? day.images : [];

          return (
            <Paper key={index} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden', bgcolor: '#fff' }}>
              
              <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isExpanded ? '1px solid #f1f5f9' : 'none' }}>
                <Typography variant="h6" fontWeight="800" color="#0f172a">Day {index + 1}</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button variant="outlined" startIcon={<Search fontSize="small"/>} size="small" sx={{ borderColor: '#e2e8f0', color: '#64748b', textTransform: 'none', borderRadius: 1.5, px: 2, py: 0.5, fontWeight: 600 }}>
                    Search
                  </Button>
                  <IconButton size="small" onClick={() => handleRemoveDay(index)} sx={{ border: '1px solid #fecaca', color: '#ef4444', borderRadius: 1.5, p: 0.5, '&:hover': { bgcolor: '#fef2f2' } }} >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => toggleDay(index)} sx={{ border: '1px solid #e2e8f0', color: '#64748b', borderRadius: 1.5, p: 0.5 }} >
                    {isExpanded ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={isExpanded}>
                <Box sx={{ p: 3, bgcolor: '#fff' }}>
                  
                  <Typography variant="caption" fontWeight="700" color="#334155" mb={1} display="block">Day Title <span style={{color: '#ef4444'}}>*</span></Typography>
                  <Autocomplete
                    freeSolo
                    options={dayTitleOptions}
                    value={day.title || ''}
                    onInputChange={(e, newValue) => handleUpdateDay(index, 'title', newValue)}
                    renderInput={(params) => (
                      <TextField {...params} size="small" placeholder="e.g. Arrival in Rome & Colosseum Visit" sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    )}
                  />

                  <Typography variant="caption" fontWeight="700" color="#334155" mb={1} display="block">Description</Typography>
                  <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, p: 0.5, px: 1, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', color: '#475569' }}>
                      <IconButton size="small" sx={{ color: 'inherit', p: 0.5 }}><FormatBold fontSize="small" sx={{ color: '#0f172a' }} /></IconButton>
                      <IconButton size="small" sx={{ color: 'inherit', p: 0.5 }}><FormatItalic fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: 'inherit', p: 0.5 }}><FormatUnderlined fontSize="small" /></IconButton>
                      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: '#e2e8f0' } }}>
                        <Box sx={{ width: 16, height: 16, bgcolor: '#0f172a', borderRadius: 0.5, mr: 0.5 }} />
                        <KeyboardArrowDown sx={{ fontSize: 16 }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: '#e2e8f0' } }}>
                        <FormatListBulleted fontSize="small" />
                        <KeyboardArrowDown sx={{ fontSize: 16 }} />
                      </Box>
                    </Box>
                    <TextField 
                      fullWidth multiline rows={4} 
                      placeholder="Describe the day's activities – Sights, meals, transfers, special experiences..." 
                      value={day.description || ''}
                      onChange={(e) => handleUpdateDay(index, 'description', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 0, '& fieldset': { border: 'none' } } }}
                    />
                  </Box>

                  <Typography variant="caption" fontWeight="700" color="#334155" mb={1} display="block">Activities & Experiences</Typography>
                  <TextField 
                    fullWidth size="small" 
                    placeholder="• List out the day's activities" 
                    value={day.activities || ''}
                    onChange={(e) => handleUpdateDay(index, 'activities', e.target.value)}
                    sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />

                  <Typography variant="caption" fontWeight="700" color="#334155" mb={1} display="block">Meal Plan</Typography>
                  <FormGroup row sx={{ mb: 3, gap: 2 }}>
                    {['Breakfast', 'Lunch', 'Dinner', 'No Meals'].map((meal) => (
                      <FormControlLabel 
                        key={meal}
                        control={
                          <Checkbox 
                            size="small" 
                            checked={safeMeals.includes(meal)}
                            onChange={() => handleMealChange(index, meal)}
                            sx={{ '&.Mui-checked': { color: '#0ea5e9' } }}
                          />
                        } 
                        label={<Typography variant="body2" color="#334155" fontWeight="600">{meal}</Typography>} 
                      />
                    ))}
                  </FormGroup>

                  <Typography variant="caption" fontWeight="700" color="#334155" mb={1} display="block">Transport</Typography>
                  <RadioGroup 
                    row 
                    value={day.transport || 'Seat in Coach'} 
                    onChange={(e) => handleUpdateDay(index, 'transport', e.target.value)}
                    sx={{ mb: 3, gap: 2 }}
                  >
                    {['Seat in Coach', 'Private Transfer', 'No Transport'].map((option) => (
                      <FormControlLabel 
                        key={option}
                        value={option} 
                        control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#0ea5e9' } }} />} 
                        label={<Typography variant="body2" color="#334155" fontWeight="600">{option}</Typography>} 
                      />
                    ))}
                  </RadioGroup>

                  {/* 🚨 IMAGE UPLOAD UI PREVIEWS */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {safeImages.length === 0 && (
                      <Box sx={{ width: 64, height: 64, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', color: '#475569' }}>
                        <ImageOutlined />
                      </Box>
                    )}
                    
                    {/* Render uploaded image thumbnails */}
                    {safeImages.map((imgUrl, imgIndex) => (
                      <Box key={imgIndex} sx={{ width: 64, height: 64, borderRadius: 2, overflow: 'hidden', position: 'relative', border: '1px solid #e2e8f0' }}>
                        <img src={imgUrl} alt={`Day ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveImage(index, imgIndex)} 
                          sx={{ position: 'absolute', top: -5, right: -5, color: '#ef4444', bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
                        >
                          <Cancel sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    ))}

                    <Box 
                      onClick={() => handleImageClick(index)} 
                      sx={{ width: 64, height: 64, bgcolor: '#f8fafc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #cbd5e1', color: '#475569', cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9' } }}
                    >
                      <AddOutlined />
                    </Box>
                  </Box>

                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Box>

      <Button 
        variant="outlined" 
        onClick={handleAddDay}
        sx={{ 
          mt: 3, borderColor: '#cbd5e1', borderStyle: 'dashed', color: '#64748b', 
          fontWeight: 700, borderRadius: 2, textTransform: 'none', width: '100%', py: 1.5, 
          '&:hover': { borderColor: '#94a3b8', bgcolor: '#f8fafc' } 
        }}
      >
        + Add Another Day
      </Button>

    </Box>
  );
}