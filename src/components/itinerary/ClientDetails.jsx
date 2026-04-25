import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, InputAdornment, MenuItem 
} from '@mui/material';

// 🚨 Correct import path
import { useItinerary } from '../../context/ItineraryContext'; 

const FieldLabel = ({ text, required }) => (
  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block', fontSize: '0.75rem' }}>
    {text} {required && <span style={{ color: '#ef4444' }}>*</span>}
  </Typography>
);

export default function ClientDetails() {
  // 🚨 MATCHING YOUR CONTEXT EXACTLY: clientData & setClientData
  const { clientData, setClientData } = useItinerary();

  const emptyState = {
    title: '', name: '', contact: '', email: '', budget: '', adults: '', infants: '',
    children: '0', childAges: [], destination: '', startDate: '', endDate: '',
    nights: '', days: '', queryHandledBy: '', status: '', source: ''
  };

  // 🚨 Load from clientData
  const [formData, setFormData] = useState(clientData || emptyState);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 🚨 Sync to setClientData
  useEffect(() => {
    if (setClientData) setClientData(formData);
  }, [formData, setClientData]);

  // AUTO-CALCULATION: Dates to Nights/Days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setFormData(prev => ({ ...prev, nights: diffDays.toString(), days: (diffDays + 1).toString() }));
      } else {
        setFormData(prev => ({ ...prev, nights: '', days: '' }));
      }
    } else {
       setFormData(prev => ({ ...prev, nights: '', days: '' }));
    }
  }, [formData.startDate, formData.endDate]);

  const handleContactChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) handleChange('contact', value);
  };

  const isEmailValid = formData.email === '' || formData.email.toLowerCase().endsWith('@gmail.com');

  const handleChildAgeChange = (index, value) => {
    const newAges = [...formData.childAges];
    newAges[index] = value;
    handleChange('childAges', newAges);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', pb: 12 }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#2563eb" mb={0.5}>Client Information</Typography>
          <Typography variant="body2" color="#64748b">Enter your client's details to start building their perfect itinerary</Typography>
        </Box>
        <Button 
          variant="outlined" size="small" onClick={() => setFormData(emptyState)}
          sx={{ borderColor: '#cbd5e1', color: '#475569', fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 3, bgcolor: '#fff' }}
        >
          Clear All
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        
        {/* PERSONAL INFORMATION */}
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Personal Information</Typography>
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Customer Name" required />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField select size="small" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} sx={{ width: '80px' }}>
                <MenuItem value="" disabled>Title</MenuItem>
                <MenuItem value="Mr">Mr</MenuItem>
                <MenuItem value="Mrs">Mrs</MenuItem>
                <MenuItem value="Ms">Ms</MenuItem>
              </TextField>
              <TextField fullWidth size="small" placeholder="Enter Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Contact Number" required />
            <TextField fullWidth size="small" placeholder="Enter 10-digit number" type="tel" value={formData.contact} onChange={handleContactChange} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Email Address" />
            <TextField 
              fullWidth size="small" placeholder="example@gmail.com" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
              error={!isEmailValid} helperText={!isEmailValid ? "Only @gmail.com addresses are allowed" : ""}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Budget" />
            <TextField fullWidth size="small" type="number" placeholder="0" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} value={formData.budget} onChange={(e) => handleChange('budget', e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Adults" required />
            <TextField select fullWidth size="small" value={formData.adults} onChange={(e) => handleChange('adults', e.target.value)}>
              <MenuItem value="" disabled>Select</MenuItem>
              <MenuItem value="1">1</MenuItem><MenuItem value="2">2</MenuItem><MenuItem value="3">3</MenuItem><MenuItem value="4+">4+</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Infant (0-2 Years)" />
            <TextField select fullWidth size="small" value={formData.infants} onChange={(e) => handleChange('infants', e.target.value)}>
              <MenuItem value="" disabled>Select</MenuItem>
              <MenuItem value="0">0</MenuItem><MenuItem value="1">1</MenuItem><MenuItem value="2">2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Children" />
            <TextField select fullWidth size="small" value={formData.children} onChange={(e) => { handleChange('children', e.target.value); handleChange('childAges', []); }}>
              <MenuItem value="0">0</MenuItem><MenuItem value="1">1</MenuItem><MenuItem value="2">2</MenuItem><MenuItem value="3">3</MenuItem><MenuItem value="4">4</MenuItem>
            </TextField>
          </Grid>
          {Array.from({ length: Number(formData.children) || 0 }).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FieldLabel text={`Age of Child ${index + 1}`} required />
              <TextField select fullWidth size="small" value={formData.childAges[index] || ''} onChange={(e) => handleChildAgeChange(index, e.target.value)}>
                <MenuItem value="" disabled>Select Age</MenuItem>
                {[...Array(11).keys()].map(age => <MenuItem key={age + 2} value={(age + 2).toString()}>{age + 2}</MenuItem>)}
              </TextField>
            </Grid>
          ))}
        </Grid>

        {/* TRAVEL DETAILS */}
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3} mt={formData.children > 2 ? 4 : 0}>Travel Details</Typography>
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Destination" required />
            <TextField select fullWidth size="small" value={formData.destination} onChange={(e) => handleChange('destination', e.target.value)}>
              <MenuItem value="" disabled>Select Destination</MenuItem>
              <MenuItem value="Maldives">Maldives</MenuItem><MenuItem value="Switzerland">Switzerland</MenuItem><MenuItem value="Japan">Japan</MenuItem><MenuItem value="Dubai">Dubai</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Start Date" required />
            <TextField type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="End Date" required />
            <TextField type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={formData.endDate} onChange={(e) => handleChange('endDate', e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Duration" />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField size="small" value={formData.nights} placeholder="0" InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end">Nights</InputAdornment> }} sx={{ width: '50%', bgcolor: '#f8fafc' }} />
              <TextField size="small" value={formData.days} placeholder="0" InputProps={{ readOnly: true, endAdornment: <InputAdornment position="end">Days</InputAdornment> }} sx={{ width: '50%', bgcolor: '#f8fafc' }} />
            </Box>
          </Grid>
        </Grid>

        {/* LEAD MANAGEMENT */}
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Lead Management</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Query Handled by" required />
            <TextField select fullWidth size="small" value={formData.queryHandledBy} onChange={(e) => handleChange('queryHandledBy', e.target.value)}>
              <MenuItem value="" disabled>Select Agent</MenuItem>
              <MenuItem value="Alex">Alex</MenuItem><MenuItem value="Sarah">Sarah</MenuItem><MenuItem value="Mike">Mike</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Status" required />
            <TextField select fullWidth size="small" value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
              <MenuItem value="" disabled>Select Status</MenuItem>
              <MenuItem value="New">New</MenuItem><MenuItem value="In Progress">In Progress</MenuItem><MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Source" required />
            <TextField select fullWidth size="small" value={formData.source} onChange={(e) => handleChange('source', e.target.value)}>
              <MenuItem value="" disabled>Select Source</MenuItem>
              <MenuItem value="Website">Website</MenuItem><MenuItem value="Referral">Referral</MenuItem><MenuItem value="Social Media">Social Media</MenuItem>
            </TextField>
          </Grid>
        </Grid>

      </Paper>
    </Box>
  );
}