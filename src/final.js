import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, 
  TextField, Button, Grid, Paper, Chip, Card, CardMedia, CardContent, 
  Divider, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  Map, Book, Search, ChevronRight, CalendarToday, CheckCircle, 
  LocationOn, CalendarMonth, PeopleAlt, FlightTakeoff, ExpandMore,
  AttachMoney, AssignmentTurnedIn, Gavel
} from '@mui/icons-material';

const drawerWidth = 260;

export default function TravelCRMDashboard() {
  const [step, setStep] = useState(1);
  const [path, setPath] = useState(''); 
  
  // Expanded Client Data State
  const [clientData, setClientData] = useState({
    name: 'Sarah Jenkins', 
    destination: 'Japan', 
    days: 3, 
    adults: 2,
    title: 'The Ultimate Imperial Journey',
    description: 'A cinematic exploration of ancient traditions and ultra-modern cityscapes.',
    price: '$4,500',
    inclusions: '• 5-Star Accommodations\n• Private Airport Transfers\n• Daily Breakfast\n• Bullet Train Passes',
    exclusions: '• International Flights\n• Personal Expenses\n• Travel Insurance',
    terms: 'A 20% deposit is required to secure the booking. Full payment due 30 days prior to departure.'
  });
  
  const [customData, setCustomData] = useState({ description: 'Enter custom daily breakdown here...' });
  const [selectedTheme, setSelectedTheme] = useState('Urban Noir'); 

  const handleClientChange = (e) => setClientData({ ...clientData, [e.target.name]: e.target.value });
  const handleCustomChange = (e) => setCustomData({ ...customData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (step === 1) setStep(2);
    if (step === 2 && path === 'custom') setStep(3);
    if (step === 2 && path === 'default') setStep(4);
    if (step === 3 || step === 4) setStep(5);
  };

  const handlePrev = () => {
    if (step === 2) setStep(1);
    if (step === 3 || step === 4) setStep(2);
    if (step === 5) setStep(path === 'custom' ? 3 : 4);
  };

  // Pre-set 10-day content for Default Path
  const default10DayItinerary = [
    { title: 'Arrival & Immersion', desc: 'Arrive at the destination. A private chauffeur will transfer you to your luxury suite. Spend the afternoon acclimating, followed by an exclusive welcome dinner.' },
    { title: 'Historic City Tour', desc: 'Meet your private guide for a cinematic tour through the oldest districts. Visit landmark temples and hidden alleys.' },
    { title: 'Culinary Masterclass', desc: 'Dive into the local culture with a private cooking class led by a Michelin-starred chef, followed by a tasting menu.' },
    { title: 'Mountain Excursion', desc: 'Leave the city behind for a scenic drive into the mountains. Enjoy a private cable car ride and sweeping panoramic views.' },
    { title: 'Relaxation & Spa', desc: 'A full day dedicated to wellness. Access exclusive thermal baths and enjoy a signature 90-minute massage.' },
    { title: 'Art & Architecture', desc: 'Private after-hours access to the city’s premier contemporary art museum and architectural marvels.' },
    { title: 'Coastal Drive', desc: 'Take a luxury convertible along the dramatic coastline. Stop at secluded beaches and coastal vineyards.' },
    { title: 'Local Village Experience', desc: 'Interact with local artisans in a traditional village setting. Learn ancient crafting techniques.' },
    { title: 'Farewell Gala', desc: 'A spectacular sunset cruise followed by a private farewell dinner overlooking the illuminated city skyline.' },
    { title: 'Departure', desc: 'Enjoy a leisurely breakfast before your private transfer escorts you to the airport for your journey home.' }
  ];

  const Sidebar = () => (
    <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', borderRight: 'none', bgcolor: '#ffffff' } }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Map sx={{ color: '#00c6ff', fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#121212', letterSpacing: 1 }}>TRAVEL CRM</Typography>
      </Box>
      <Box sx={{ px: 2, mb: 3 }}>
        <TextField fullWidth size="small" placeholder="Search..." InputProps={{ startAdornment: <Search sx={{ color: '#888', mr: 1, fontSize: 20 }} /> }} sx={{ bgcolor: '#f4f6f8', borderRadius: 2, '& fieldset': { border: 'none' } }} />
      </Box>
      <List sx={{ px: 2 }}>
        {['Dashboard', 'Leads', 'Itinerary Builder', 'Bookings', 'Settings'].map((text, idx) => (
          <ListItem button key={text} sx={{ borderRadius: 2, mb: 1, ...(idx === 2 && { background: '#121212', color: 'white' }), '&:hover': { bgcolor: idx === 2 ? '#121212' : '#f4f6f8' } }}>
            <ListItemIcon sx={{ color: idx === 2 ? 'white' : '#888', minWidth: 40 }}><Map /></ListItemIcon>
            <ListItemText primary={text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: idx === 2 ? 700 : 500 }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  const TopStepper = () => {
    const steps = [ { label: 'Trip Details', active: step === 1 }, { label: 'Method', active: step === 2 }, { label: 'Builder', active: step === 3 || step === 4 }, { label: 'Template Render', active: step === 5 } ];
    return (
      <Box sx={{ display: 'flex', overflowX: 'auto', py: 2, gap: 1, alignItems: 'center' }}>
        {steps.map((s, idx) => (
          <React.Fragment key={idx}>
            <Chip label={s.label} icon={s.active ? <CheckCircle fontSize="small" /> : <CalendarToday fontSize="small" />} sx={{ bgcolor: s.active ? '#121212' : '#f4f6f8', color: s.active ? 'white' : '#888', borderRadius: 2, px: 2, py: 2.5, fontWeight: 700 }} />
            {idx < steps.length - 1 && <ChevronRight sx={{ color: '#ddd' }} />}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  const renderStep1 = () => (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 900, color: '#121212', letterSpacing: -0.5 }}>Trip Blueprint</Typography>
      <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>Define the core parameters, pricing, and terms for this itinerary.</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #eee', borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Core Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Client Name" name="name" value={clientData.name} onChange={handleClientChange} size="small" /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Destination Country" name="destination" value={clientData.destination} onChange={handleClientChange} size="small" /></Grid>
              <Grid item xs={6}><TextField fullWidth type="number" label="Total Days" name="days" value={clientData.days} onChange={handleClientChange} size="small" /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Itinerary Title" name="title" value={clientData.title} onChange={handleClientChange} size="small" /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Main Description" name="description" value={clientData.description} onChange={handleClientChange} size="small" /></Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid #eee', borderRadius: 3, bgcolor: '#fff', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Pricing & Terms</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}><TextField fullWidth label="Total Price" name="price" value={clientData.price} onChange={handleClientChange} size="small" /></Grid>
              <Grid item xs={6}><TextField fullWidth multiline rows={4} label="Inclusions" name="inclusions" value={clientData.inclusions} onChange={handleClientChange} size="small" /></Grid>
              <Grid item xs={6}><TextField fullWidth multiline rows={4} label="Exclusions" name="exclusions" value={clientData.exclusions} onChange={handleClientChange} size="small" /></Grid>
              <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Terms & Conditions" name="terms" value={clientData.terms} onChange={handleClientChange} size="small" /></Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep2 = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, color: '#121212', letterSpacing: -1 }}>Select Framework</Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={5}>
          <Paper onClick={() => setPath('custom')} sx={{ p: 6, cursor: 'pointer', borderRadius: 4, border: path === 'custom' ? '3px solid #121212' : '3px solid #eee', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' } }}>
            <Typography variant="h5" fontWeight="900" mb={1}>Custom Build</Typography>
            <Typography variant="body2" color="text.secondary">Write your own daily content.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper onClick={() => setPath('default')} sx={{ p: 6, cursor: 'pointer', borderRadius: 4, border: path === 'default' ? '3px solid #121212' : '3px solid #eee', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' } }}>
            <Typography variant="h5" fontWeight="900" mb={1}>Default Auto-Fill</Typography>
            <Typography variant="body2" color="text.secondary">Use our intelligent 10-day template.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep3 = () => (
    <Paper sx={{ p: 5, borderRadius: 3, border: '1px solid #eee' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>Custom Itinerary Notes</Typography>
      <TextField fullWidth multiline rows={6} label="Custom Instructions" name="description" value={customData.description} onChange={handleCustomChange} />
    </Paper>
  );

  const renderStep4 = () => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Framework locked to: Urban Noir Theme</Typography>
      <Typography color="text.secondary">Cinematic styling applied automatically.</Typography>
    </Box>
  );

  // --- Step 5: Final Dynamic Render ---
  const renderStep5 = () => {
    // 1. Dynamic Banner based on Destination (Simulated with a premium urban/nature image)
    const bannerImage = 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    
    // 2. Dynamic Days Logic
    const requestedDays = parseInt(clientData.days) || 1;
    let renderedDays = [];

    if (path === 'default') {
      // Slices the 10-day array down to whatever the user inputted (e.g. 3)
      renderedDays = default10DayItinerary.slice(0, requestedDays);
    } else {
      // Custom: generates empty blocks based on the number of days
      renderedDays = Array.from({ length: requestedDays }, (_, i) => ({
        title: `Custom Day ${i + 1}`,
        desc: customData.description || 'Details to be added by agent...'
      }));
    }

    return (
      <Box sx={{ bgcolor: '#050505', color: '#fff', borderRadius: 4, overflow: 'hidden', minHeight: '80vh', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
        
        {/* Dynamic Hero Banner */}
        <Box sx={{ position: 'relative', height: '55vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, #050505 100%)' }} />
          
          <Box sx={{ position: 'relative', zIndex: 1, px: 3, maxWidth: 800 }}>
            <Typography variant="overline" sx={{ color: '#00c6ff', fontWeight: 900, letterSpacing: 6, fontSize: '0.9rem' }}>
              {clientData.destination} EXCLUSIVE
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, mt: 2, mb: 3, lineHeight: 1.1 }}>
              {clientData.title}
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400, fontStyle: 'italic' }}>
              {clientData.description}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ maxWidth: 1000, margin: '0 auto', px: 4, pb: 10 }}>
          
          {/* Pricing & Summary Cards */}
          <Grid container spacing={3} sx={{ mt: -8, mb: 8, position: 'relative', zIndex: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: '#121212', border: '1px solid #222', p: 4, borderRadius: 3, height: '100%' }}>
                <AttachMoney sx={{ color: '#00c6ff', fontSize: 32, mb: 2 }} />
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 800, letterSpacing: 1 }}>INVESTMENT</Typography>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, mt: 1 }}>{clientData.price}</Typography>
                <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>Based on {clientData.adults} Adults for {clientData.days} Days</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: '#121212', border: '1px solid #222', p: 4, borderRadius: 3, height: '100%' }}>
                <AssignmentTurnedIn sx={{ color: '#00c6ff', fontSize: 32, mb: 2 }} />
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 800, letterSpacing: 1 }}>INCLUSIONS</Typography>
                <Typography variant="body2" sx={{ color: '#ccc', mt: 2, whiteSpace: 'pre-line', lineHeight: 1.8 }}>{clientData.inclusions}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ bgcolor: '#121212', border: '1px solid #222', p: 4, borderRadius: 3, height: '100%' }}>
                <Gavel sx={{ color: '#00c6ff', fontSize: 32, mb: 2 }} />
                <Typography variant="caption" sx={{ color: '#888', fontWeight: 800, letterSpacing: 1 }}>EXCLUSIONS</Typography>
                <Typography variant="body2" sx={{ color: '#ccc', mt: 2, whiteSpace: 'pre-line', lineHeight: 1.8 }}>{clientData.exclusions}</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Dynamic Day-by-Day Generation */}
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 6, textAlign: 'center', letterSpacing: 2 }}>ITINERARY BREAKDOWN</Typography>
          
          {renderedDays.map((day, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 4, position: 'relative' }}>
              {index !== renderedDays.length - 1 && <Box sx={{ position: 'absolute', left: 24, top: 60, bottom: -40, width: 2, bgcolor: '#222' }} />}
              
              <Box sx={{ width: 50, height: 50, borderRadius: '50%', bgcolor: '#050505', border: `2px solid #00c6ff`, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 4, flexShrink: 0, zIndex: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>{index + 1}</Typography>
              </Box>

              <Box sx={{ flexGrow: 1, bgcolor: '#121212', p: 4, borderRadius: 3, border: '1px solid #1a1a1a', transition: 'all 0.3s', '&:hover': { borderColor: '#333', transform: 'translateX(10px)' } }}>
                <Typography variant="overline" sx={{ color: '#00c6ff', fontWeight: 800, letterSpacing: 1 }}>DAY {index + 1} OF {clientData.days}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, mt: 1, mb: 2 }}>{day.title}</Typography>
                <Typography variant="body1" sx={{ color: '#999', lineHeight: 1.8 }}>{day.desc}</Typography>
              </Box>
            </Box>
          ))}

          {/* Terms & Conditions Accordion */}
          <Accordion sx={{ bgcolor: '#121212', color: '#fff', border: '1px solid #222', borderRadius: '12px !important', mt: 8, '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#00c6ff' }} />}>
              <Typography sx={{ fontWeight: 800, letterSpacing: 1 }}>TERMS & CONDITIONS</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#888', whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {clientData.terms}
              </Typography>
            </AccordionDetails>
          </Accordion>

        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#fdfdfd' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Box sx={{ px: 4, py: 2, borderBottom: '1px solid #eee', bgcolor: '#fff' }}><TopStepper /></Box>
        
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: step === 5 ? 0 : 6, pb: 12 }}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </Box>

        <Paper elevation={24} sx={{ position: 'fixed', bottom: 0, right: 0, width: `calc(100% - ${drawerWidth}px)`, p: 2, px: 4, display: 'flex', justifyContent: 'space-between', zIndex: 1000, borderRadius: 0, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
          <Button variant="text" onClick={handlePrev} disabled={step === 1} sx={{ fontWeight: 800, color: '#666' }}>
            {step === 5 ? '← Edit Blueprint' : 'Back'}
          </Button>
          {step !== 5 ? (
            <Button variant="contained" onClick={handleNext} disabled={(step === 2 && !path)} sx={{ bgcolor: '#121212', color: 'white', fontWeight: 800, px: 5, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#000', transform: 'scale(1.02)' }, transition: 'all 0.2s' }}>
              Continue
            </Button>
          ) : (
            <Button variant="contained" sx={{ bgcolor: '#00c6ff', color: '#000', fontWeight: 900, px: 5, py: 1.5, borderRadius: 2, '&:hover': { bgcolor: '#00b4e6', transform: 'scale(1.02)' }, transition: 'all 0.2s' }}>
              Finalize & Export
            </Button>
          )}
        </Paper>
      </Box>
    </Box>
  );
}