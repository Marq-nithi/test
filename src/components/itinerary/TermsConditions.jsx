import React from 'react';
import { 
  Box, Typography, Paper, TextField, Button, Divider, IconButton 
} from '@mui/material';
import { 
  FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, 
  FormatColorText, Description 
} from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext';

export default function TermsConditions() {
  const { termsData, setTermsData } = useItinerary();

  const handleClearAll = () => {
    setTermsData('');
  };

  const insertStandardTerms = () => {
    const standardText = `1. Booking & Payment:\n- A non-refundable deposit of 50% is required to secure the booking.\n- Full payment must be completed 30 days prior to the departure date.\n\n2. Cancellation Policy:\n- Cancellations made 45+ days before departure: Loss of deposit.\n- Cancellations made 15-44 days before departure: 75% of total cost charged.\n- Cancellations made under 15 days: 100% of total cost charged.\n\n3. Travel Insurance:\n- We highly recommend purchasing comprehensive travel insurance covering trip cancellation, medical emergencies, and baggage loss.`;
    setTermsData(standardText);
  };

  // Reusable Rich Text Toolbar Mock
  const RichTextToolbar = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #e0e0e0', bgcolor: '#fafafa', px: 1, py: 0.5 }}>
      <IconButton size="small"><FormatBold fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <IconButton size="small"><FormatItalic fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <IconButton size="small"><FormatUnderlined fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
      <IconButton size="small"><FormatAlignLeft fontSize="small" sx={{ color: '#555' }} /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
      <IconButton size="small"><FormatColorText fontSize="small" sx={{ color: '#555' }} /></IconButton>
    </Box>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
            Terms & Conditions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define the legal agreements, payment schedules, and cancellation policies for this itinerary.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={insertStandardTerms}
            startIcon={<Description />}
            sx={{ color: '#00c6ff', borderColor: '#00c6ff', fontWeight: 600, textTransform: 'none' }}
          >
            Insert Standard Terms
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleClearAll}
            sx={{ color: '#1a1a1a', borderColor: '#e0e0e0', fontWeight: 600, textTransform: 'none' }}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e0e0e0', borderRadius: 3, bgcolor: '#fff' }}>
        <Typography variant="subtitle1" fontWeight="800" mb={3} color="#1a1a1a">
          Agreement Details
        </Typography>

        {/* Rich Text Editor Mock */}
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
          <RichTextToolbar />
          <TextField 
            fullWidth 
            multiline 
            minRows={12} 
            placeholder="Type your terms and conditions here..." 
            value={termsData}
            onChange={(e) => setTermsData(e.target.value)}
            sx={{ 
              '& fieldset': { border: 'none' }, 
              '& .MuiInputBase-root': { py: 2, lineHeight: 1.6 } 
            }} 
          />
        </Box>
        
        <Box sx={{ mt: 3, p: 2, bgcolor: '#f4f6f8', borderRadius: 2, borderLeft: '4px solid #00c6ff' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            <strong>Note:</strong> These terms will be automatically appended to the final PDF document generated for the client. Ensure all payment dates and cancellation penalties align with your suppliers.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}