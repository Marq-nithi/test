import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Checkbox, FormControlLabel, 
  Button, TextField, Chip, IconButton, Divider 
} from '@mui/material';
import { 
  FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, 
  FormatAlignCenter, FormatAlignRight, FormatColorText 
} from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext';

export default function InclExcl() {
  const { inclExclData, setInclExclData } = useItinerary();

  // 1. DEFAULT DATA
  const defaultInc = [
    "Break down each planning task (research, booking, packing) into smaller, manageable steps with specific deadlines",
    "Use a calendar or planner to schedule these tasks.",
    "Visualizing the positive outcome can motivate you to push through the planning phase.",
    "I confirm that I have read and accept the terms and conditions and privacy policy."
  ];

  const defaultExc = [
    "Airfare and baggage charges",
    "Personal expenses (laundry, telephone, etc.)",
    "Meals not mentioned in the itinerary",
    "Tips and porterage"
  ];

  // 🛡️ INDESTRUCTIBLE SAFETY NET
  // Extracts the arrays safely BEFORE passing them to the state so React never crashes
  const savedInc = Array.isArray(inclExclData?.inclusions) ? inclExclData.inclusions : [];
  const savedExc = Array.isArray(inclExclData?.exclusions) ? inclExclData.exclusions : [];

  // 2. STATE MANAGEMENT
  const [availableInc, setAvailableInc] = useState(Array.from(new Set([...defaultInc, ...savedInc])));
  const [checkedInc, setCheckedInc] = useState(savedInc.length > 0 ? savedInc : defaultInc);
  const [customIncText, setCustomIncText] = useState('');

  const [availableExc, setAvailableExc] = useState(Array.from(new Set([...defaultExc, ...savedExc])));
  const [checkedExc, setCheckedExc] = useState(savedExc.length > 0 ? savedExc : defaultExc);
  const [customExcText, setCustomExcText] = useState('');

  // 🚀 3. AUTO-SAVE HOOK
  useEffect(() => {
    setInclExclData({ inclusions: checkedInc, exclusions: checkedExc });
  }, [checkedInc, checkedExc, setInclExclData]);

  // 4. ACTION HANDLERS
  const handleToggleInc = (text) => setCheckedInc(prev => prev.includes(text) ? prev.filter(i => i !== text) : [...prev, text]);
  const handleToggleExc = (text) => setCheckedExc(prev => prev.includes(text) ? prev.filter(i => i !== text) : [...prev, text]);

  const handleSelectAllInc = (e) => setCheckedInc(e.target.checked ? [...availableInc] : []);
  const handleSelectAllExc = (e) => setCheckedExc(e.target.checked ? [...availableExc] : []);

  const handleClearAll = () => { setCheckedInc([]); setCheckedExc([]); };

  const handleManualAddInc = () => {
    if (!customIncText.trim()) return;
    const text = customIncText.trim();
    if (!availableInc.includes(text)) setAvailableInc(prev => [...prev, text]);
    if (!checkedInc.includes(text)) setCheckedInc(prev => [...prev, text]);
    setCustomIncText('');
  };

  const handleManualAddExc = () => {
    if (!customExcText.trim()) return;
    const text = customExcText.trim();
    if (!availableExc.includes(text)) setAvailableExc(prev => [...prev, text]);
    if (!checkedExc.includes(text)) setCheckedExc(prev => [...prev, text]);
    setCustomExcText('');
  };

  const handleQuickAddInc = (text) => {
    const cleanText = text.replace('+ ', '');
    if (!availableInc.includes(cleanText)) setAvailableInc(prev => [...prev, cleanText]);
    if (!checkedInc.includes(cleanText)) setCheckedInc(prev => [...prev, cleanText]);
  };

  const handleQuickAddExc = (text) => {
    const cleanText = text.replace('+ ', '');
    if (!availableExc.includes(cleanText)) setAvailableExc(prev => [...prev, cleanText]);
    if (!checkedExc.includes(cleanText)) setCheckedExc(prev => [...prev, cleanText]);
  };

  // Mock Text Formatting Toolbar
  const FormattingToolbar = () => (
    <Box sx={{ border: '1px solid #e2e8f0', borderBottom: 'none', borderRadius: '8px 8px 0 0', p: 0.5, display: 'flex', gap: 0.5, bgcolor: '#f8fafc', alignItems: 'center' }}>
      <IconButton size="small"><FormatBold fontSize="small" /></IconButton>
      <IconButton size="small"><FormatItalic fontSize="small" /></IconButton>
      <IconButton size="small"><FormatUnderlined fontSize="small" /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
      <IconButton size="small"><FormatAlignLeft fontSize="small" /></IconButton>
      <IconButton size="small"><FormatAlignCenter fontSize="small" /></IconButton>
      <IconButton size="small"><FormatAlignRight fontSize="small" /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />
      <IconButton size="small"><FormatColorText fontSize="small" /></IconButton>
    </Box>
  );

  return (
    <Box sx={{ pt: { xs: 4, md: 6 }, pb: 15, px: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
      
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#1e293b" mb={0.5}>Inclusions & Exclusions</Typography>
          <Typography variant="body2" color="text.secondary">Define what is included and excluded in your client's trip.</Typography>
        </Box>
        <Button variant="outlined" color="inherit" size="small" onClick={handleClearAll} sx={{ borderRadius: 2 }}>
          Clear All
        </Button>
      </Box>

      {/* ===================== INCLUSIONS SECTION ===================== */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="h6" fontWeight="800" mb={2}>Include</Typography>
        
        {/* Checkbox List */}
        <Box sx={{ mb: 4 }}>
          <FormControlLabel 
            control={<Checkbox checked={checkedInc.length === availableInc.length && availableInc.length > 0} onChange={handleSelectAllInc} sx={{ color: '#22c55e', '&.Mui-checked': { color: '#22c55e' } }} />} 
            label={<Typography variant="body2" fontWeight="700">Select All</Typography>} 
            sx={{ mb: 2, display: 'block' }}
          />
          {availableInc.map((item, index) => (
            <FormControlLabel 
              key={`inc-${index}`}
              control={<Checkbox checked={checkedInc.includes(item)} onChange={() => handleToggleInc(item)} sx={{ color: '#22c55e', '&.Mui-checked': { color: '#22c55e' } }} />} 
              label={<Typography variant="body2" color="text.secondary">{item}</Typography>} 
              sx={{ display: 'flex', mb: 1, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 1.2 } }}
            />
          ))}
        </Box>

        {/* Custom Input Editor */}
        <Box sx={{ mb: 2 }}>
          <FormattingToolbar />
          <TextField 
            fullWidth multiline minRows={3} placeholder="Type here..." 
            value={customIncText} onChange={(e) => setCustomIncText(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 8px 8px' } }}
          />
        </Box>
        
        <Button variant="contained" onClick={handleManualAddInc} sx={{ bgcolor: '#22c55e', color: '#fff', '&:hover': { bgcolor: '#16a34a' }, mb: 4, textTransform: 'none', px: 3 }}>
          Add Inclusion
        </Button>

        {/* Quick Add Suggestions */}
        <Box>
          <Typography variant="caption" fontWeight="700" color="text.secondary" display="block" mb={1.5}>Quick Add Suggestions</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['+ Accommodation', '+ Meals', '+ Transfers', '+ Sightseeing', '+ Guide', '+ Taxes'].map(sug => (
              <Chip key={sug} label={sug} onClick={() => handleQuickAddInc(sug)} sx={{ bgcolor: '#dcfce7', color: '#16a34a', fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: '#bbf7d0' } }} />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ===================== EXCLUSIONS SECTION ===================== */}
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="h6" fontWeight="800" mb={2}>Exclude</Typography>
        
        {/* Checkbox List */}
        <Box sx={{ mb: 4 }}>
          <FormControlLabel 
            control={<Checkbox checked={checkedExc.length === availableExc.length && availableExc.length > 0} onChange={handleSelectAllExc} sx={{ color: '#ef4444', '&.Mui-checked': { color: '#ef4444' } }} />} 
            label={<Typography variant="body2" fontWeight="700">Select All</Typography>} 
            sx={{ mb: 2, display: 'block' }}
          />
          {availableExc.map((item, index) => (
            <FormControlLabel 
              key={`exc-${index}`}
              control={<Checkbox checked={checkedExc.includes(item)} onChange={() => handleToggleExc(item)} sx={{ color: '#ef4444', '&.Mui-checked': { color: '#ef4444' } }} />} 
              label={<Typography variant="body2" color="text.secondary">{item}</Typography>} 
              sx={{ display: 'flex', mb: 1, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 1.2 } }}
            />
          ))}
        </Box>

        {/* Custom Input Editor */}
        <Box sx={{ mb: 2 }}>
          <FormattingToolbar />
          <TextField 
            fullWidth multiline minRows={3} placeholder="Type here..." 
            value={customExcText} onChange={(e) => setCustomExcText(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '0 0 8px 8px' } }}
          />
        </Box>
        
        <Button variant="contained" onClick={handleManualAddExc} sx={{ bgcolor: '#ef4444', color: '#fff', '&:hover': { bgcolor: '#dc2626' }, mb: 4, textTransform: 'none', px: 3 }}>
          Add Exclusion
        </Button>

        {/* Quick Add Suggestions */}
        <Box>
          <Typography variant="caption" fontWeight="700" color="text.secondary" display="block" mb={1.5}>Quick Add Suggestions</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {['+ Flights', '+ Visa', '+ Insurance', '+ Camera Fees', '+ Early Check-in'].map(sug => (
              <Chip key={sug} label={sug} onClick={() => handleQuickAddExc(sug)} sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 600, cursor: 'pointer', '&:hover': { bgcolor: '#fecaca' } }} />
            ))}
          </Box>
        </Box>
      </Paper>

    </Box>
  );
}