 import React from 'react';
import { 
  Box, Typography, Paper, Grid, Divider, Chip, Avatar, Button, Container,
  Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { 
  FlightTakeoff, Hotel, LocationOn, CalendarMonth, 
  CheckCircle, Cancel, ExpandMore, DirectionsCar,
  Phone, Email, WhatsApp, Description, LocalOffer,
  FileDownload, PersonOutline, AssignmentTurnedInOutlined
} from '@mui/icons-material';

import { useItinerary } from '../../../context/ItineraryContext'; 

// --- Placeholder Images ---
const HERO_BG = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000"; 
const DAY_IMG = "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80&w=800"; 
const HOTEL_IMG = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800";

// --- Theme Colors ---
const MIDNIGHT_BLUE = '#0f172a';
const BRAND_BLUE = '#1e3a8a';
const TEXT_MUTED = '#64748b';

export default function Theme2Midnight() {
  const { clientData = {}, activeDays, transportData, stayData, termsData } = useItinerary();

  // ---------------------------------------------------------
  // 🚨 DYNAMIC DATA MAPPING (Extracting ALL form fields)
  // ---------------------------------------------------------
  
  // 1. Destination & Title Fallback
  const rawDestination = clientData.destination || "Bali";
  const shortDestination = rawDestination.split(',')[0];
  const title = (clientData.trip_title && clientData.trip_title.trim() !== "") 
    ? clientData.trip_title 
    : `Best of ${shortDestination}`;

  // 2. Client Profile
  const fullName = `${clientData.title || ''} ${clientData.name || 'Valued Guest'}`.trim();
  const phone = `${clientData.contactCode || ''} ${clientData.contact || ''}`.trim() || 'N/A';
  const email = clientData.email || 'N/A';
  const budgetStr = clientData.budget ? `$${clientData.budget}` : '$0.00';

  // 3. Lead Management
  const agentName = clientData.queryHandledBy && clientData.queryHandledBy !== '0' ? clientData.queryHandledBy : 'Sarah Mitchell';
  const leadStatus = clientData.status || 'New';
  const leadSource = clientData.source || 'Website';

  // 4. Dates & Duration
  const formatDate = (dateString) => {
    if(!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const datesLabel = (clientData.startDate && clientData.endDate)
    ? `${formatDate(clientData.startDate)} - ${formatDate(clientData.endDate)}`
    : "Dates to be confirmed";
  const durationStr = `${clientData.days || 1} Days, ${clientData.nights || 0} Nights`;

  // 5. Guest Breakdown (Adults, Children + Ages, Infants)
  const adults = parseInt(clientData.adults) || 2;
  const childrenCount = parseInt(clientData.children) || 0;
  const infantsCount = parseInt(clientData.infants) || 0;
  const ages = (clientData.childAges || []).filter(Boolean);
  const agesStr = ages.length > 0 ? ` (Ages: ${ages.join(', ')})` : '';
  
  let paxSummary = `${adults} Adults`;
  if (childrenCount > 0) paxSummary += `, ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}${agesStr}`;
  if (infantsCount > 0) paxSummary += `, ${infantsCount} Infant${infantsCount > 1 ? 's' : ''}`;

  // --- Fallbacks for Itinerary Data ---
  const flights = transportData?.flights?.length > 0 ? transportData.flights : [
    { airline: "Singapore Airlines", flightNo: "SQ 321", depTime: "10:00 AM", depFrom: "JFK", arrTime: "02:30 PM", arrAt: "SIN", duration: "20h" },
  ];

  const days = activeDays?.length > 0 ? activeDays : [
    { title: "Arrival & Welcome", description: "Welcome to your luxury escape. Private transfer to your resort.", highlights: ["Airport Greeting", "Luxury Transfer"] },
  ];

  const hotels = stayData?.hotels?.length > 0 ? stayData.hotels : [
    { hotelName: "Luxury Resort", location: rawDestination, checkIn: "2:00 PM", checkOut: "12:00 PM", room: "Suite", board: "Breakfast", rating: 5 },
  ];

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", pb: 10 }}>
      
      {/* 1. HERO SECTION */}
      <Box sx={{ 
        position: 'relative', height: 450, 
        backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.8) 100%)' }
      }}>
        {/* Meta Chips for Source & Status */}
        <Box sx={{ position: 'absolute', top: 24, left: 24, display: 'flex', gap: 1 }}>
             <Chip label={`Source: ${leadSource}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', fontWeight: 600 }} />
             <Chip label={`Status: ${leadStatus}`} size="small" sx={{ bgcolor: leadStatus === 'Closed' ? '#10b981' : 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', fontWeight: 600 }} />
        </Box>

        <Button 
          variant="contained" 
          startIcon={<FileDownload />}
          sx={{ position: 'absolute', top: 24, right: 24, bgcolor: '#fff', color: MIDNIGHT_BLUE, '&:hover': { bgcolor: '#f1f5f9' }, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
        >
          Export
        </Button>

        <Box sx={{ position: 'relative', zIndex: 1, color: '#fff' }}>
          <Typography variant="overline" sx={{ letterSpacing: 2, color: '#93c5fd', fontWeight: 600 }}>EXCLUSIVELY CURATED FOR</Typography>
          <Typography variant="h3" fontWeight="400" mb={1} sx={{ fontFamily: "'Playfair Display', serif" }}>{title}</Typography>
          <Typography variant="subtitle1" sx={{ fontStyle: 'italic', color: '#cbd5e1', mb: 3 }}>Tailored for {fullName}</Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" display="flex" alignItems="center" gap={1}><CalendarMonth fontSize="small" sx={{ color: '#93c5fd' }}/> {datesLabel}</Typography>
            <Typography variant="body2" display="flex" alignItems="center" gap={1}><LocationOn fontSize="small" sx={{ color: '#93c5fd' }}/> {rawDestination}</Typography>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 10 }}>
        
        {/* 2. TRIP OVERVIEW STRIP */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff', mb: 4, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={6} md={3} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0ea5e9', width: 40, height: 40 }}><CalendarMonth fontSize="small" /></Avatar>
              <Box>
                <Typography variant="caption" color={TEXT_MUTED} fontWeight="600">Duration</Typography>
                <Typography variant="subtitle2" fontWeight="700" color={MIDNIGHT_BLUE}>{durationStr}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#fff7ed', color: '#f97316', width: 40, height: 40 }}><Hotel fontSize="small" /></Avatar>
              <Box>
                <Typography variant="caption" color={TEXT_MUTED} fontWeight="600">Guests</Typography>
                <Typography variant="subtitle2" fontWeight="700" color={MIDNIGHT_BLUE} sx={{ whiteSpace: 'nowrap' }}>{adults + childrenCount + infantsCount} Total Guests</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#ecfdf5', color: '#10b981', width: 40, height: 40 }}><LocationOn fontSize="small" /></Avatar>
              <Box>
                <Typography variant="caption" color={TEXT_MUTED} fontWeight="600">Destinations</Typography>
                <Typography variant="subtitle2" fontWeight="700" color={MIDNIGHT_BLUE}>{rawDestination.split(',').length} Locations</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#f5f3ff', color: '#8b5cf6', width: 40, height: 40 }}><LocalOffer fontSize="small" /></Avatar>
              <Box>
                <Typography variant="caption" color={TEXT_MUTED} fontWeight="600">Total Budget</Typography>
                <Typography variant="subtitle2" fontWeight="700" color={MIDNIGHT_BLUE}>{budgetStr}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 3. INVESTMENT DETAILS */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: '#fff', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
             <Typography variant="h6" fontWeight="700">Investment Details</Typography>
             <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>CLIENT CONTACT</Typography>
                <Typography variant="body2">{phone} • {email}</Typography>
             </Box>
          </Box>
          
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Per Adult</Typography>
                <Typography variant="h4" fontWeight="800">
                  ${(adults > 0 ? (parseInt(clientData.budget || 0) / adults) : 0).toLocaleString()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Total Investment for {paxSummary}</Typography>
                <Typography variant="h4" fontWeight="800" color="#fbbf24">{budgetStr}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 4. FLIGHT DETAILS */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE} mb={3}>Flight Details</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {flights.map((flight, i) => (
              <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar variant="rounded" sx={{ bgcolor: '#e0f2fe', color: '#0ea5e9', mr: 2 }}><FlightTakeoff /></Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="700" color={MIDNIGHT_BLUE}>{flight.airline}</Typography>
                    <Typography variant="caption" color={TEXT_MUTED}>Flight {flight.flightNo || 'TBD'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 0, md: 4 } }}>
                  <Box sx={{ textAlign: 'left', width: '30%' }}>
                    <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE}>{flight.depTime}</Typography>
                    <Typography variant="body2" color={TEXT_MUTED} fontWeight="600" mb={0.5}>{flight.depFrom}</Typography>
                  </Box>
                  
                  <Box sx={{ flexGrow: 1, textAlign: 'center', position: 'relative', px: 2 }}>
                    <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" sx={{ bgcolor: '#fff', px: 1, position: 'relative', zIndex: 2 }}>{flight.duration || 'Direct'}</Typography>
                    <Box sx={{ width: '100%', height: '1px', bgcolor: '#cbd5e1', position: 'absolute', top: '50%', left: 0, zIndex: 1 }} />
                    <FlightTakeoff sx={{ color: '#94a3b8', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, bgcolor: '#fff', px: 0.5 }} />
                  </Box>

                  <Box sx={{ textAlign: 'right', width: '30%' }}>
                    <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE}>{flight.arrTime}</Typography>
                    <Typography variant="body2" color={TEXT_MUTED} fontWeight="600" mb={0.5}>{flight.arrAt}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* 5. DETAILED ITINERARY */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE} mb={1} textAlign="center">Your Journey, Day by Day</Typography>
          <Box sx={{ width: 60, height: 3, bgcolor: '#0ea5e9', mx: 'auto', mb: 4, borderRadius: 2 }} />

          {days.map((day, i) => (
            <Accordion key={i} defaultExpanded={i === 0} elevation={0} sx={{ mb: 2, borderRadius: '12px !important', border: '1px solid #e2e8f0', '&:before': { display: 'none' }, overflow: 'hidden' }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 2, '& .MuiAccordionSummary-content': { m: 0, alignItems: 'center' } }}>
                <Avatar sx={{ bgcolor: BRAND_BLUE, color: '#fff', width: 36, height: 36, fontWeight: 700, mr: 2 }}>{i + 1}</Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="700" color={MIDNIGHT_BLUE}>{day.title}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Box sx={{ width: '100%', height: 200, borderRadius: 3, overflow: 'hidden' }}>
                      <img src={DAY_IMG} alt={day.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <Typography variant="subtitle2" fontWeight="700" color={MIDNIGHT_BLUE} mb={1}>Highlights</Typography>
                    <Typography variant="body2" color={TEXT_MUTED} mb={2} sx={{ lineHeight: 1.6 }}>{day.description}</Typography>
                    <List dense disablePadding>
                      {day.highlights?.map((hl, j) => (
                        <ListItem key={j} disableGutters sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}><CheckCircle sx={{ fontSize: 16, color: '#10b981' }} /></ListItemIcon>
                          <ListItemText primary={hl} primaryTypographyProps={{ variant: 'body2', color: MIDNIGHT_BLUE, fontWeight: 500 }} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* 6. CONSULTANT CARD */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', color: '#fff', mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}><AssignmentTurnedInOutlined /></Avatar>
            <Box>
              <Typography variant="caption" color="#94a3b8" letterSpacing={1}>YOUR TRAVEL CONSULTANT</Typography>
              <Typography variant="h6" fontWeight="700">{agentName}</Typography>
              <Typography variant="body2" color="#cbd5e1">Senior Destination Specialist</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" startIcon={<Phone />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>Call</Button>
            <Button variant="outlined" startIcon={<Email />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>Email</Button>
            <Button variant="contained" startIcon={<WhatsApp />} sx={{ bgcolor: '#25D366', color: '#fff', textTransform: 'none', '&:hover': { bgcolor: '#1ebc59' }, boxShadow: 'none' }}>WhatsApp</Button>
          </Box>
        </Paper>

        {/* 7. FOOTER */}
        <Box sx={{ textAlign: 'center', pb: 6 }}>
          <Typography variant="caption" color="#94a3b8" display="block" mb={1}>
            © 2026 Atlas Luxury Travel. All rights reserved.
          </Typography>
          <Typography variant="caption" color="#cbd5e1">
            Prices are subject to change until final confirmation based on availability.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}