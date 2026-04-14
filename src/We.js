 import React, { useState } from 'react';
 import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
 import { 
   createTheme, ThemeProvider, CssBaseline, Box, Stack, Typography, 
   Button, TextField, Grid, Paper, Slider, Avatar, Chip, Fade
 } from '@mui/material';
 import { 
   Home, Users, Map as MapIcon, CalendarDays, Receipt, Settings, LayoutDashboard,
   User, Calendar, DollarSign, Image as ImageIcon, ChevronRight, Sparkles, Eye
 } from 'lucide-react';
 
 const theme = createTheme({
   palette: {
     primary: { main: '#0066FF' },   
     secondary: { main: '#14B8A6' }, 
     background: { default: '#F9FAFB', paper: '#FFFFFF' },
     text: { primary: '#111827', secondary: '#6B7280' },
   },
   typography: {
     fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
     button: { textTransform: 'none', fontWeight: 600 },
   },
   shape: { borderRadius: 8 }
 });
 
 // --- UPDATED CUSTOM INPUT (Controlled for Preview) ---
 const CustomField = ({ label, required, placeholder, type = "text", value, onChange }) => (
   <Box>
     <Typography variant="caption" fontWeight={600} color="text.primary" display="block" mb={0.8}>
       {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
     </Typography>
     <TextField
       fullWidth 
       placeholder={placeholder} 
       type={type} 
       value={value}
       onChange={(e) => onChange(e.target.value)}
       variant="outlined" 
       size="small"
       sx={{
         '& .MuiOutlinedInput-root': {
           bgcolor: '#F3F4F6', borderRadius: '6px',
           '& fieldset': { border: 'none' }, 
         },
         '& .MuiInputBase-input': { fontSize: '0.85rem', py: 1.2, color: '#374151' }
       }}
     />
   </Box>
 );
 
 // --- SIDEBAR ---
 const Sidebar = () => {
   const location = useLocation();
   const menuItems = [
     { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={18}/> },
     { label: 'Leads', path: '/leads', icon: <Users size={18}/> },
     { label: 'Itinerary Builder', path: '/itinerary', icon: <MapIcon size={18}/> },
     { label: 'Booking Management', path: '/bookings', icon: <CalendarDays size={18}/> },
     { label: 'Settings', path: '/settings', icon: <Settings size={18}/> },
   ];
 
   return (
     <Box sx={{ width: 260, bgcolor: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 1200 }}>
       <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
         <Avatar sx={{ width: 28, height: 28, bgcolor: '#0066FF', fontSize: '0.8rem' }}>D</Avatar>
         <Typography variant="subtitle1" fontWeight={800} color="#111827">Dynamavic</Typography>
       </Box>
       <Stack spacing={0.5} sx={{ px: 2, flexGrow: 1, mt: 2 }}>
         {menuItems.map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <Button 
               key={item.path} component={Link} to={item.path} startIcon={item.icon}
               sx={{ 
                 justifyContent: 'flex-start', py: 1.2, px: 2, borderRadius: 2, fontSize: '0.85rem',
                 color: isActive ? 'white' : '#4B5563',
                 bgcolor: isActive ? '#14B8A6' : 'transparent', 
                 '&:hover': { bgcolor: isActive ? '#14B8A6' : '#F3F4F6' }
               }}
             >
               {item.label}
             </Button>
           );
         })}
       </Stack>
     </Box>
   );
 };
 
 // --- MAIN CONTROLLER ---
 const ItineraryBuilder = () => {
   const [activeStep, setActiveStep] = useState(0);
   
   // --- FORM STATE (Now with clear defaults) ---
   const [formData, setFormData] = useState({
     clientName: '',
     email: '',
     phone: '',
     travelers: '',
     startDate: '',
     endDate: '',
     budget: 5000,
     cost: 0
   });
 
   const updateField = (field, value) => {
     setFormData(prev => ({ ...prev, [field]: value }));
   };
 
   const handlePreview = () => {
     alert(`Previewing Itinerary for: ${formData.clientName || 'Unnamed Client'}\nBudget: $${formData.budget}`);
   };
 
   return (
     <Box sx={{ pb: 12 }}> 
       
       {/* HEADER */}
       <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={4}>
         <Box>
           <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
             <Sparkles size={22} color="#0066FF" />
             <Typography variant="h5" fontWeight={800} color="#111827">Itinerary Builder</Typography>
           </Stack>
           <Typography variant="body2" color="text.secondary">Create stunning travel experiences for your clients</Typography>
         </Box>
         <Stack direction="row" spacing={1.5}>
            <Button onClick={handlePreview} variant="outlined" startIcon={<Eye size={16}/>} sx={{ borderColor: '#D1D5DB', color: '#374151', bgcolor: 'white' }}>
              Preview
            </Button>
            <Button variant="contained" color="primary" sx={{ px: 3 }}>Save Itinerary</Button>
         </Stack>
       </Stack>
 
       {/* TOP STEPPER */}
       <Stack direction="row" spacing={2} alignItems="center" mb={5}>
         {[
           { label: 'Client Details', icon: User },
           { label: 'Destinations', icon: MapIcon },
           { label: 'Day-by-Day Plan', icon: Calendar }
         ].map((step, index) => (
           <React.Fragment key={index}>
             <Button 
               onClick={() => setActiveStep(index)}
               variant={activeStep === index ? "contained" : "text"} 
               startIcon={<step.icon size={16}/>} 
               sx={{ 
                 borderRadius: 6, px: activeStep === index ? 3 : 1,
                 color: activeStep === index ? 'white' : '#6B7280'
               }}
             >
               {step.label}
             </Button>
             {index < 2 && <ChevronRight size={16} color="#9CA3AF" />}
           </React.Fragment>
         ))}
       </Stack>
 
       {/* DYNAMIC CONTENT */}
       {activeStep === 0 && (
         <Fade in timeout={400}>
           <Box>
             <Box mb={3}>
               <Typography variant="subtitle1" fontWeight={800} color="#111827">Client Information</Typography>
               <Typography variant="caption" color="text.secondary">Enter your client's details to start building their perfect itinerary</Typography>
             </Box>
 
             <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #E5E7EB', borderRadius: 3 }}>
               <Stack direction="row" spacing={1} alignItems="center" mb={3}><User size={18} color="#6B7280"/><Typography variant="subtitle2" fontWeight={700}>Basic Details</Typography></Stack>
               <Grid container spacing={3}>
                 <Grid item xs={12} md={6}><CustomField label="Client Name" required placeholder="John Smith" value={formData.clientName} onChange={(v) => updateField('clientName', v)} /></Grid>
                 <Grid item xs={12} md={6}><CustomField label="Email Address" required placeholder="john@example.com" value={formData.email} onChange={(v) => updateField('email', v)} /></Grid>
                 <Grid item xs={12} md={6}><CustomField label="Phone Number" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={(v) => updateField('phone', v)} /></Grid>
                 <Grid item xs={12} md={6}><CustomField label="Number of Travelers" placeholder="2" value={formData.travelers} onChange={(v) => updateField('travelers', v)} /></Grid>
               </Grid>
             </Paper>
 
             <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #E5E7EB', borderRadius: 3 }}>
               <Stack direction="row" spacing={1} alignItems="center" mb={3}><Calendar size={18} color="#6B7280"/><Typography variant="subtitle2" fontWeight={700}>Travel Dates</Typography></Stack>
               <Grid container spacing={3}>
                 <Grid item xs={12} md={6}><CustomField label="Start Date" required placeholder="dd-mm-yyyy" value={formData.startDate} onChange={(v) => updateField('startDate', v)} /></Grid>
                 <Grid item xs={12} md={6}><CustomField label="End Date" required placeholder="dd-mm-yyyy" value={formData.endDate} onChange={(v) => updateField('endDate', v)} /></Grid>
               </Grid>
             </Paper>
 
             <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid #E5E7EB', borderRadius: 3 }}>
               <Stack direction="row" spacing={1} alignItems="center" mb={3}><DollarSign size={18} color="#6B7280"/><Typography variant="subtitle2" fontWeight={700}>Budget</Typography></Stack>
               <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="caption" fontWeight={700}>Total Budget</Typography><Typography variant="subtitle2" fontWeight={800}>${formData.budget.toLocaleString()}</Typography></Stack>
               <Slider value={formData.budget} onChange={(e, val) => updateField('budget', val)} min={1000} max={10000} step={500} sx={{ color: '#111827' }} />
             </Paper>
           </Box>
         </Fade>
       )}
 
       {activeStep === 1 && <Fade in timeout={400}><Box sx={{ py: 10, textAlign: 'center' }}><Typography color="text.secondary">Destinations Section</Typography></Box></Fade>}
       {activeStep === 2 && <Fade in timeout={400}><Box sx={{ py: 10, textAlign: 'center' }}><Typography color="text.secondary">Day-by-Day Plan Section</Typography></Box></Fade>}
 
       {/* STICKY FOOTER */}
       <Paper elevation={4} sx={{ position: 'fixed', bottom: 0, left: 260, right: 0, p: 2, px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, borderRadius: 0, borderTop: '1px solid #E5E7EB' }}>
         <Stack direction="row" spacing={6} alignItems="center">
           <Box><Typography variant="caption" color="text.secondary" display="block">Total Package Cost</Typography><Typography variant="h6" fontWeight={800}>$0</Typography></Box>
           <Box><Typography variant="caption" color="text.secondary" display="block">Budget</Typography><Typography variant="h6" fontWeight={800}>${formData.budget.toLocaleString()}</Typography></Box>
           <Chip label="Within Budget" size="small" sx={{ bgcolor: '#111827', color: 'white', fontWeight: 700, borderRadius: 1.5 }} />
         </Stack>
         <Button 
           onClick={() => activeStep < 2 && setActiveStep(activeStep + 1)}
           variant="contained" color="primary" 
           endIcon={activeStep < 2 && <ChevronRight size={16}/>} 
           sx={{ px: 4 }}
         >
           {activeStep === 2 ? "Finish" : "Next"}
         </Button>
       </Paper>
 
     </Box>
   );
 };
 
 export default function App() {
   return (
     <ThemeProvider theme={theme}>
       <CssBaseline />
       <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
         <Sidebar />
         <Box sx={{ flexGrow: 1, ml: '260px', p: 5 }}>
           <Routes>
             <Route path="/itinerary" element={<ItineraryBuilder />} />
             <Route path="*" element={<Navigate to="/itinerary" replace />} />
           </Routes>
         </Box>
       </Box>
     </ThemeProvider>
   );
 }v la dgg