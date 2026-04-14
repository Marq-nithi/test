import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  createTheme, ThemeProvider, CssBaseline, Box, IconButton, Stack, Typography, 
  Button, Select, MenuItem, FormControl, InputLabel, TextField, TextFieldProps, OutlinedInputProps, Grid
} from '@mui/material';
import { 
  Home, Briefcase, Map as MapIcon, Bell, Settings, 
  LogOut, Star, User, Calendar, DollarSign, Image
} from 'lucide-react';

// --- THEME ---
const theme = createTheme({
  palette: {
    primary: { main: '#2C2B80' }, // Dark Blue from Figma sidebar
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#1E293B' },
  },
  typography: { fontFamily: '"Inter", sans-serif', h5: { fontWeight: 700 } },
  shape: { borderRadius: 10 }
});

// --- COMPONENTS ---

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <Home size={22}/> },
    { label: 'Leads', path: '/leads', icon: <Briefcase size={22}/> },
    { label: 'Itinerary Builder', path: '/itinerary', icon: <MapIcon size={22}/> },
    { label: 'Settings', path: '/settings', icon: <Settings size={22}/> }
  ];

  return (
    <Box sx={{ 
      width: 260, bgcolor: 'primary.main', color: 'white', display: 'flex', 
      flexDirection: 'column', p: 3, position: 'fixed', height: '100vh', zIndex: 1200 
    }}>
      <Typography variant="h6" fontWeight={900} mb={6}>Dynamavic</Typography>
      <Stack spacing={1}>
        {menuItems.map((item) => (
          <Button 
            key={item.path} component={Link} to={item.path} startIcon={item.icon}
            sx={{ 
              justifyContent: 'flex-start', textTransform: 'none', py: 1.2, px: 2, 
              color: 'white', opacity: location.pathname === item.path ? 1 : 0.6,
              bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};

// --- ITINERARY BUILDER PAGE ---

const FormHeader = ({ title, icon: Icon }) => (
  <Stack direction="row" spacing={1.5} alignItems="center" mb={3} mt={4} sx={{ borderBottom: '1px solid #E2E8F0', pb: 1.5 }}>
    <Box sx={{ color: 'primary.main' }}><Icon size={22}/></Box>
    <Typography variant="h6" fontWeight={700}>{title}</Typography>
  </Stack>
);

const ItineraryBuilder = () => {
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    clientName: 'John Smith',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    travelers: 2,
    startDate: '',
    endDate: ''
  });

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h5" color="text.primary" fontWeight={800} mb={1}>Itinerary Builder</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>Create stunning travel experiences for your clients</Typography>

      {/* --- FORM NAVIGATION STEPPER --- */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', p: 1.5, mb: 4, borderRadius: 3 }}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button variant="contained" size="small" startIcon={<User size={16}/>} sx={{ px: 3, borderRadius: 2 }}>Client Details</Button>
          <Button variant="outlined" size="small" color="inherit" startIcon={<MapIcon size={16}/>} sx={{ px: 3, borderRadius: 2 }}>Destinations</Button>
          <Button variant="outlined" size="small" color="inherit" startIcon={<Calendar size={16}/>} sx={{ px: 3, borderRadius: 2 }}>Day-by-Day Plan</Button>
        </Stack>
      </Paper>

      {/* --- CLIENT INFORMATION FORM (CLONE OF FIGMA) --- */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', p: 4, borderRadius: 3, bgcolor: 'white' }}>
        <Typography variant="h6" fontWeight={800}>Client Information</Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>Enter your client's details to start building their perfect itinerary</Typography>
        
        <FormHeader title="Basic Details" icon={User} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Client Name" variant="outlined" value={formData.clientName} onChange={handleChange('clientName')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Email Address" variant="outlined" value={formData.email} onChange={handleChange('email')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Phone Number" variant="outlined" value={formData.phone} onChange={handleChange('phone')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Number of Travelers" type="number" variant="outlined" value={formData.travelers} onChange={handleChange('travelers')} />
          </Grid>
        </Grid>

        <FormHeader title="Travel Dates" icon={Calendar} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={handleChange('startDate')} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="End Date" type="date" InputLabelProps={{ shrink: true }} value={formData.endDate} onChange={handleChange('endDate')} />
          </Grid>
        </Grid>

        <FormHeader title="Budget" icon={DollarSign} />
        <Typography>Budget Slider Component Placeholder (not implemented)</Typography>

        <FormHeader title="Trip Theme" icon={Image} />
        <Typography>Trip Theme Cards Component Placeholder (not implemented)</Typography>

        {/* --- FORM NAVIGATION FOOTER --- */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6, pt: 3, borderTop: '1px solid #E2E8F0' }}>
            <Button variant="contained" size="large" sx={{ px: 5, borderRadius: 2 }}>Next</Button>
        </Box>
      </Paper>
    </Box>
  );
};

// --- MAIN APP ---
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, ml: '260px', p: 6, minHeight: '100vh', bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<Typography variant="h4">Dashboard Overview</Typography>} />
            <Route path="/leads" element={<Typography variant="h4">Leads Management</Typography>} />
            <Route path="/itinerary" element={<ItineraryBuilder />} />
            <Route path="/settings" element={<Typography variant="h4">Settings</Typography>} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}