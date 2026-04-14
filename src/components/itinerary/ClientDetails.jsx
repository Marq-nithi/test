import React, { useEffect } from 'react';
import { 
  Box, Typography, Grid, TextField, Select, MenuItem, 
  InputAdornment, Divider 
} from '@mui/material';
import { useItinerary } from '../../context/ItineraryContext';

export default function ClientDetails() {
  const { clientData, setClientData } = useItinerary();

  // INSTANT AUTO-SAVE HANDLER
  const handleChange = (field, value) => {
    setClientData(prev => ({ ...prev, [field]: value }));
  };

  // Reusable label component to match Figma exactly
  const FieldLabel = ({ text, required }) => (
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 1 }}>
      {text} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </Typography>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', bgcolor: '#ffffff', borderRadius: 3, p: { xs: 3, md: 5 }, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      
      {/* 1. PERSONAL INFORMATION */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Personal Information
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {/* Name with built-in Title Select */}
        <Grid item xs={12} md={4}>
          <FieldLabel text="Customer Name" required />
          <TextField 
            fullWidth size="small" placeholder="John Smith"
            value={clientData?.clientName || ''} 
            onChange={(e) => handleChange('clientName', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Select
                    value={clientData?.title || 'Mr'}
                    onChange={(e) => handleChange('title', e.target.value)}
                    variant="standard" disableUnderline
                    sx={{ mr: 1, '& .MuiSelect-select': { py: 0, fontWeight: 500 } }}
                  >
                    <MenuItem value="Mr">Mr</MenuItem>
                    <MenuItem value="Mrs">Mrs</MenuItem>
                    <MenuItem value="Ms">Ms</MenuItem>
                    <MenuItem value="Dr">Dr</MenuItem>
                  </Select>
                  <Divider orientation="vertical" flexItem sx={{ mr: 1, my: 0.5 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FieldLabel text="Contact Number" required />
          <TextField fullWidth size="small" placeholder="+1 (555) 123-4567"
            value={clientData?.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
        </Grid>

        <Grid item xs={12} md={4}>
          <FieldLabel text="Email Address" />
          <TextField fullWidth size="small" placeholder="john@example.com" type="email"
            value={clientData?.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
        </Grid>

        {/* PAX Counts */}
        <Grid item xs={12} md={4}>
          <FieldLabel text="Number of Adults" required />
          <Select fullWidth size="small" value={clientData?.adults || 0} onChange={(e) => handleChange('adults', e.target.value)}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(n => <MenuItem key={`a-${n}`} value={n}>{n}</MenuItem>)}
          </Select>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FieldLabel text="Number of Children (2-12 Years)" />
          <Select fullWidth size="small" value={clientData?.children || 0} onChange={(e) => handleChange('children', e.target.value)}>
             {[0,1,2,3,4,5,6].map(n => <MenuItem key={`c-${n}`} value={n}>{n}</MenuItem>)}
          </Select>
        </Grid>

        <Grid item xs={12} md={4}>
          <FieldLabel text="Number of Infant (0-2 Years)" />
          <Select fullWidth size="small" value={clientData?.infants || 0} onChange={(e) => handleChange('infants', e.target.value)}>
             {[0,1,2,3,4].map(n => <MenuItem key={`i-${n}`} value={n}>{n}</MenuItem>)}
          </Select>
        </Grid>

        {/* 🚨 DYNAMIC CHILD AGE FIELDS */}
        {/* This will magically loop and create a field for exactly how many children are selected! */}
        {clientData?.children > 0 && Array.from({ length: clientData.children }).map((_, index) => (
          <Grid item xs={12} md={4} key={`child-age-${index}`}>
            <FieldLabel text={`Age of Child ${index + 1}`} required />
            <Select 
              fullWidth size="small" 
              value={clientData?.[`childAge${index + 1}`] !== undefined ? clientData[`childAge${index + 1}`] : ''} 
              displayEmpty
              onChange={(e) => handleChange(`childAge${index + 1}`, e.target.value)}
            >
               <MenuItem value="" disabled>Select Age</MenuItem>
               {/* Generates ages 2 through 12 */}
               {[2,3,4,5,6,7,8,9,10,11,12].map(n => (
                 <MenuItem key={`age-${n}`} value={n}>{n} Years</MenuItem>
               ))}
            </Select>
          </Grid>
        ))}
      </Grid>


      {/* 2. TRAVEL DETAILS */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Travel Details
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={4}>
          <FieldLabel text="Destination" required />
          <TextField fullWidth size="small" placeholder="Destination"
            value={clientData?.destination || ''} onChange={(e) => handleChange('destination', e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FieldLabel text="Start Date" required />
          <TextField fullWidth size="small" type="date" InputLabelProps={{ shrink: true }}
            value={clientData?.startDate || ''} onChange={(e) => handleChange('startDate', e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <FieldLabel text="End Date" required />
          <TextField fullWidth size="small" type="date" InputLabelProps={{ shrink: true }}
            value={clientData?.endDate || ''} onChange={(e) => handleChange('endDate', e.target.value)} />
        </Grid>

        <Grid item xs={12} md={8}>
          <FieldLabel text="Duration" />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Select size="small" value={clientData?.nights || 4} onChange={(e) => handleChange('nights', e.target.value)} sx={{ minWidth: 80 }}>
               {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <MenuItem key={`n-${n}`} value={n}>{n}</MenuItem>)}
            </Select>
            <Typography variant="body2" sx={{ color: '#64748b' }}>Nights</Typography>
            
            <Select size="small" value={clientData?.days || 5} onChange={(e) => handleChange('days', e.target.value)} sx={{ minWidth: 80 }}>
               {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <MenuItem key={`d-${n}`} value={n}>{n}</MenuItem>)}
            </Select>
            <Typography variant="body2" sx={{ color: '#64748b' }}>Days</Typography>
          </Box>
        </Grid>
      </Grid>


      {/* 3. LEAD MANAGEMENT */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Lead Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FieldLabel text="Query Handled by" required />
          <Select fullWidth size="small" value={clientData?.handledBy || ''} displayEmpty onChange={(e) => handleChange('handledBy', e.target.value)}>
             <MenuItem value="" disabled>Select Agent</MenuItem>
             <MenuItem value="Agent 1">Agent 1</MenuItem>
             <MenuItem value="Agent 2">Agent 2</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <FieldLabel text="Status" required />
          <Select fullWidth size="small" value={clientData?.status || 'New'} onChange={(e) => handleChange('status', e.target.value)}>
             <MenuItem value="New">New</MenuItem>
             <MenuItem value="In Progress">In Progress</MenuItem>
             <MenuItem value="Converted">Converted</MenuItem>
             <MenuItem value="Lost">Lost</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <FieldLabel text="Source" required />
          <Select fullWidth size="small" value={clientData?.source || 'Website'} onChange={(e) => handleChange('source', e.target.value)}>
             <MenuItem value="Website">Website</MenuItem>
             <MenuItem value="Referral">Referral</MenuItem>
             <MenuItem value="Social Media">Social Media</MenuItem>
             <MenuItem value="Walk-in">Walk-in</MenuItem>
          </Select>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FieldLabel text="Trip Title" />
          <TextField fullWidth size="small" placeholder="Dive into Maldives"
            value={clientData?.tripTitle || ''} onChange={(e) => handleChange('tripTitle', e.target.value)} />
        </Grid>
      </Grid>

    </Box>
  );
}