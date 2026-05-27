import React from 'react';
import { 
  Box, Typography, Paper, Grid, Divider, Avatar, Button, Container, Chip
} from '@mui/material';
import { 
  FlightTakeoff, Hotel, LocationOn, CalendarMonth, 
  CheckCircle, DirectionsCar, Star, Phone, Email,
  ShieldOutlined, AssignmentOutlined, Flight,
  AccessTime, Public, Group, Cancel,
  Restaurant, AccountBalance, Description,
  Check, Close, Train, DirectionsBus, 
  Badge, PinDrop, Work, AccountBalanceWallet, Explore,HomeWork,Pin
} from '@mui/icons-material';
import { WhatsApp } from '@mui/icons-material';

import { useItinerary } from '../../../context/ItineraryContext'; 

// --- Placeholder Images for Coastal Theme ---
// Updated to a dark, moody night background to match your design
const HERO_BG = "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&q=80&w=2000"; 
const DAY1_IMG = "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800"; 
const DAY2_IMG = "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&q=80&w=800"; 
const DAY3_IMG = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800"; 
const HOTEL1_IMG = "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=800"; 
const HOTEL2_IMG = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800"; 

// --- Theme Colors ---
const TEAL_MAIN = '#0f766e'; 
const NAVY_DARK = '#1e3a8a';
const TIMELINE_BLUE = '#2563eb';
const TEXT_MUTED = '#64748b';
const BG_LIGHT = '#fafaf9'; 

const formatCamelCase = (text) => text.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

export default function Theme3Coastal() {
  const { 
    clientData = {}, 
    activeDays, 
    dayPlannerData, 
    transportData, 
    stayData,
    inclExclData,
    termsData,
    reviewData,
    visaData,
  } = useItinerary();

  // --- 1. CLIENT & TRIP DATA ---
  const rawDestination = clientData?.destination || clientData?.dist_location || "Destination";
  const shortDestination = rawDestination.split(',')[0];
  const title = (clientData.trip_title && clientData.trip_title.trim() !== "") ? clientData.trip_title : `Best of ${shortDestination}`;
  const clientName = `${clientData.title || ''} ${clientData.name || 'Valued Guest'}`.trim();
  const phone = `${clientData.contactCode || ''} ${clientData.contact || ''}`.trim() || '+1 (234) 567-890';
  const email = clientData.email || 'guest@example.com';
  const agentName = clientData.queryHandledBy && clientData.queryHandledBy !== '0' ? clientData.queryHandledBy : 'Your Travel Expert';
  
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Dates TBD';
  const dates = (clientData.startDate && clientData.endDate) ? `${formatDate(clientData.startDate)} - ${formatDate(clientData.endDate)}` : "Dates TBD";
  
  const adults = parseInt(clientData.adults) || 2;
  const childrenCount = parseInt(clientData.children) || 0;
  const pax = `${adults} Adults${childrenCount > 0 ? `, ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}` : ''}`;
  
  const totalDays = clientData.days || 7;
  const budget = reviewData?.budget !== '$0.00' ? reviewData?.budget : (clientData.budget ? `$${clientData.budget}` : 'TBD');

  // --- 2. TRANSPORT DATA ---
  let allTransports = [];
  if (transportData) {
    if (Array.isArray(transportData.flights)) allTransports.push(...transportData.flights.map(t => ({...t, _type: 'Flight'})));
    if (Array.isArray(transportData.trains)) allTransports.push(...transportData.trains.map(t => ({...t, _type: 'Train'})));
    if (Array.isArray(transportData.buses)) allTransports.push(...transportData.buses.map(t => ({...t, _type: 'Bus'})));
    if (Array.isArray(transportData.grounds)) allTransports.push(...transportData.grounds.map(t => ({...t, _type: 'Ground'})));
    
    if (allTransports.length === 0) {
      if (Array.isArray(transportData)) allTransports = transportData;
      else if (transportData?.airline || transportData?.depFrom || transportData?.trainName) allTransports = [transportData];
    }
  }

  // --- 3. DAY PLANNER DATA ---
  const rawDaysArray = activeDays || dayPlannerData || [];
  const safeDays = rawDaysArray.length > 0 ? rawDaysArray : [{ title: `Arrival in ${shortDestination}`, description: "Welcome to your destination!", meals: ["Breakfast"], transport: "Private Transfer" }];

  // --- 4. STAY DATA ---
  let safeHotels = [];
  if (Array.isArray(stayData?.hotels)) safeHotels = stayData.hotels;
  else if (Array.isArray(stayData)) safeHotels = stayData;
  else if (stayData && typeof stayData === 'object' && Object.keys(stayData).length > 0) safeHotels = [stayData];

  // --- 5. INCLUSIONS & EXCLUSIONS ---
  let displayInclusions = [];
  let displayExclusions = [];
  if (Array.isArray(inclExclData?.inclusions)) displayInclusions = inclExclData.inclusions;
  else displayInclusions = Object.keys(inclExclData?.inclusions || {}).filter(k => inclExclData.inclusions[k]).map(formatCamelCase);
  
  if (Array.isArray(inclExclData?.exclusions)) displayExclusions = inclExclData.exclusions;
  else displayExclusions = Object.keys(inclExclData?.exclusions || {}).filter(k => inclExclData.exclusions[k]).map(formatCamelCase);

  if (displayInclusions.length === 0) displayInclusions = ["Accommodation as per itinerary", "Daily Breakfast", "Airport Transfers"];
  if (displayExclusions.length === 0) displayExclusions = ["International Flights", "Visa Fees", "Personal Expenses"];

  const safeVisas = Array.isArray(visaData) ? visaData : [];

  const renderTerms = () => {
    let sections = [];
    if (typeof termsData === 'string' && termsData.trim().length > 0) {
      sections = [{ title: "General Information", text: termsData, icon: <AssignmentOutlined fontSize="small" /> }];
    } else if (termsData && typeof termsData === 'object') {
      if (termsData.policies?.length > 0) sections.push({ title: "Cancellation Policy", text: termsData.policies.join(' '), icon: <ShieldOutlined fontSize="small" /> });
      if (termsData.protections?.length > 0) sections.push({ title: "Travel Insurance", text: termsData.protections.join(' '), icon: <ShieldOutlined fontSize="small" /> });
      if (termsData.terms?.length > 0) sections.push({ title: "General Terms", text: termsData.terms.join(' '), icon: <AssignmentOutlined fontSize="small" /> });
    }

    if (sections.length === 0) {
      sections = [
        { title: "Cancellation Policy", text: "Standard cancellation policies apply. Please review before booking.", icon: <ShieldOutlined fontSize="small" /> },
        { title: "General Terms", text: "All prices are subject to change until confirmed.", icon: <AssignmentOutlined fontSize="small" /> }
      ];
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sections.map((section, idx) => (
          <Paper key={idx} elevation={0} sx={{ display: 'flex', gap: 2.5, p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{section.icon}</Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#334155', mb: 0.5 }}>{section.title}</Typography>
              <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6 }}>{section.text}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Box id="itinerary-pdf-content" sx={{ bgcolor: BG_LIGHT, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 🚨 1. HERO SECTION (UPDATED TO EXACT DESIGN) 🚨 */}
      <Box sx={{ 
        position: 'relative', height: { xs: 500, md: 700 }, 
        backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        pageBreakInside: 'avoid', breakInside: 'avoid',
        '&::before': { 
          content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          // Left-to-right gradient so the text pops, but the right side shows the beautiful image
          background: 'linear-gradient(to right, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.5) 60%, rgba(2, 6, 23, 0.1) 100%)' 
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, color: '#fff', pt: 6 }}>
          
          {/* Logo Button */}
          <Chip 
            icon={<Explore sx={{ color: '#cbd5e1 !important', fontSize: '18px !important' }} />} 
            label="LOGO" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', mb: 5, 
              backdropFilter: 'blur(8px)', fontWeight: 700, letterSpacing: 1,
              border: '1px solid rgba(255,255,255,0.1)'
            }} 
          />

          {/* Main Title */}
          <Typography variant="h1" mb={3} sx={{ 
            fontFamily: "'Playfair Display', serif", fontWeight: 700, 
            maxWidth: 800, fontSize: { xs: '3.5rem', md: '5.5rem' }, lineHeight: 1.1 
          }}>
            {title}
          </Typography>

          {/* Metadata Row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 3, md: 5 }, mb: 4, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth fontSize="small" sx={{ color: '#d1d5db' }} />
              <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 500 }}>{dates}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime fontSize="small" sx={{ color: '#d1d5db' }} />
              <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 500 }}>
                {totalDays} Days / {totalDays > 1 ? totalDays - 1 : 0} Nights
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Group fontSize="small" sx={{ color: '#d1d5db' }} />
              <Typography variant="body1" sx={{ color: '#f8fafc', fontWeight: 500 }}>{pax}</Typography>
            </Box>
          </Box>

          {/* Prepared For (Gold) */}
          <Typography variant="subtitle2" sx={{ 
            color: '#d97706', fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' 
          }}>
            PREPARED FOR {clientName}
          </Typography>

        </Container>

        {/* Watermark Logo Bottom Right */}
        <Box sx={{ 
          position: 'absolute', bottom: 40, right: 60, textAlign: 'right', zIndex: 1, 
          display: { xs: 'none', md: 'block' } 
        }}>
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#f8fafc', letterSpacing: 2, lineHeight: 1, textTransform: 'uppercase' }}>
            {shortDestination}
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#e2e8f0', mt: 0.5 }}>
            NIGHTS
          </Typography>
          {/* Decorative wave below the watermark */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Typography sx={{ color: '#fff', fontSize: '2rem', lineHeight: 0.5 }}>≈</Typography>
          </Box>
        </Box>
      </Box>

      {/* -------------------- REST OF THE THEME IS UNCHANGED -------------------- */}

      <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
        
        {/* 2. INVESTMENT OVERVIEW */}
        <Box sx={{ textAlign: 'center', mb: 6, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Investment Overview</Typography>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 8, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <Box sx={{ bgcolor: TEAL_MAIN, color: '#fff', textAlign: 'center', py: 4, px: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 1, fontWeight: 600 }}>TOTAL INVESTMENT</Typography>
            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mt: 1 }}>{budget}</Typography>
          </Box>
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><AccessTime fontSize="small"/> Duration</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK}>{totalDays} Days</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><LocationOn fontSize="small"/> Dates</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK} sx={{ fontSize: '0.85rem' }}>{dates}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><Group fontSize="small"/> Guests</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK}>{pax}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><DirectionsCar fontSize="small"/> Transport</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK}>{allTransports.length > 0 ? `${allTransports.length} Included` : 'Not Included'}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><Phone fontSize="small"/> Contact</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK} sx={{ fontSize: '0.85rem' }}>{phone}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><Email fontSize="small"/> Email</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK} sx={{ fontSize: '0.85rem' }}>{email}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* 3. TRANSPORT JOURNEY */}
        {allTransports.length > 0 && (
          <Box sx={{ mb: 10 }}>
            <Box sx={{ textAlign: 'center', mb: 6, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Your Transport</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {allTransports.map((transport, i) => {
                let TransportIcon = FlightTakeoff;
                if (transport._type === 'Train' || transport.trainName) TransportIcon = Train;
                else if (transport._type === 'Bus' || transport.busName) TransportIcon = DirectionsBus;
                else if (transport._type === 'Ground' || transport.provider) TransportIcon = DirectionsCar;

                const tName = transport.airline || transport.trainName || transport.busName || transport.provider || transport.transportType || 'Transport';
                const tNo = transport.flightNo || transport.trainNo || transport.busNo || transport.transportNo || 'TBD';

                return (
                  <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#f1f5f9', color: TEAL_MAIN, width: 36, height: 36 }}><TransportIcon fontSize="small" /></Avatar>
                        <Typography variant="subtitle2" fontWeight="700" color={NAVY_DARK}>{tName}</Typography>
                      </Box>
                      <Chip label={`Details: ${tNo}`} size="small" variant="outlined" sx={{ color: TEAL_MAIN, borderColor: TEAL_MAIN, fontWeight: 600 }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ width: '30%', textAlign: 'left' }}>
                        <Typography variant="h6" fontWeight="800" color={NAVY_DARK}>{transport.depFrom || transport.departure || transport.from || 'Origin'}</Typography>
                        <Typography variant="body2" color={TEXT_MUTED}>{transport.depTime || transport.departureTime || 'TBD'}</Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1, mx: 3, position: 'relative', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: TEAL_MAIN, fontWeight: 600, bgcolor: '#fff', px: 1, position: 'relative', zIndex: 2 }}>{transport.duration || 'Direct'}</Typography>
                        <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '2px dashed #cbd5e1', zIndex: 1 }} />
                      </Box>
                      <Box sx={{ width: '30%', textAlign: 'right' }}>
                        <Typography variant="h6" fontWeight="800" color={NAVY_DARK}>{transport.arrTo || transport.arrAt || transport.arrival || transport.to || 'Destination'}</Typography>
                        <Typography variant="body2" color={TEXT_MUTED}>{transport.arrTime || transport.arrivalTime || 'TBD'}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        )}

        {/* 4. DAY BY DAY TIMELINE */}
        <Box sx={{ textAlign: 'center', mb: 6, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Your Journey, Day by Day</Typography>
        </Box>

        <Box sx={{ position: 'relative', mb: 10, py: 4 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, bgcolor: '#e2e8f0', transform: 'translateX(-50%)' }} />

          {safeDays.map((day, i) => {
            const isEven = i % 2 === 0;
            const safeImages = Array.isArray(day.images) ? day.images.map(v => typeof v === "string" ? v : v?.url).filter(Boolean) : [];
            const img = safeImages.length > 0 ? safeImages[0] : (i === 0 ? DAY1_IMG : i === 1 ? DAY2_IMG : DAY3_IMG);
            const safeMeals = Array.isArray(day.meals) ? day.meals : [];

            return (
              <Box key={i} sx={{ display: 'flex', flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' }, alignItems: 'center', position: 'relative', mb: { xs: 4, md: 6 }, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 24, height: 24, bgcolor: TIMELINE_BLUE, borderRadius: '50%', border: '4px solid #fff', zIndex: 2, boxShadow: '0 0 0 1px #e2e8f0' }} />
                
                <Box sx={{ width: { xs: '100%', md: '45%' }, mb: { xs: 2, md: 0 } }}>
                  <Box sx={{ width: '100%', height: 260, borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <img src={img} alt={day.title || `Day ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Box>
                
                <Box sx={{ display: { xs: 'none', md: 'block' }, width: '10%' }} />
                
                <Box sx={{ width: { xs: '100%', md: '45%' } }}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', textAlign: 'left', position: 'relative' }}>
                    <Typography variant="caption" sx={{ color: TIMELINE_BLUE, fontWeight: 800, letterSpacing: 1, display: 'block', mb: 1 }}>DAY {i + 1}</Typography>
                    <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>{day.title || `Day ${i + 1}`}</Typography>
                    <Typography variant="body2" color={TEXT_MUTED} mb={3} sx={{ lineHeight: 1.6 }}>{day.description || 'No description provided.'}</Typography>
                    
                    {day.activities && (
                      <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 2, mb: 2 }}>
                        <Typography variant="caption" fontWeight="700" color={NAVY_DARK} display="block" mb={0.5}>Activities:</Typography>
                        <Typography variant="body2" color={TEXT_MUTED} sx={{ whiteSpace: 'pre-line' }}>{day.activities}</Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                      {safeMeals.length > 0 && !safeMeals.includes('No Meals') && (
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="flex" alignItems="center" gap={0.5}><Restaurant fontSize="small" sx={{color: TEAL_MAIN}}/> {safeMeals.join(', ')}</Typography>
                      )}
                      {day.transport && day.transport !== 'No Transport' && (
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="flex" alignItems="center" gap={0.5}><DirectionsCar fontSize="small" sx={{color: TEAL_MAIN}}/> {day.transport}</Typography>
                      )}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* 5. ACCOMMODATIONS */}
        {safeHotels.length > 0 && (
          <Box sx={{ mb: 10 }}>
            <Box sx={{ mb: 4, textAlign: 'center', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#3f3f3f', mb: 1 }}>Luxury Accommodations</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {safeHotels.map((hotel, i) => {
                
                const finalHotelName = (hotel?.hotelName && hotel.hotelName.trim() !== '') 
                  ? hotel.hotelName 
                  : (hotel?.name || 'Selected Hotel');

                return (
                  <Paper key={i} elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#fff', overflow: 'hidden', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <Box sx={{ width: { xs: '100%', sm: '35%' }, minHeight: { xs: 200, sm: 260 }, position: 'relative' }}>
                      <img src={hotel.image || (i % 2 === 0 ? HOTEL1_IMG : HOTEL2_IMG)} alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    
                    <Box sx={{ p: 4, width: { xs: '100%', sm: '65%' }, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="700" color="#1e293b" mb={0.5} sx={{ fontFamily: "'Playfair Display', serif" }}>
                            {finalHotelName}
                          </Typography>
                          <Typography variant="caption" color="#64748b" display="block">
                            {hotel.location || hotel.address || rawDestination}
                          </Typography>
                        </Box>
                        <Chip icon={<Star sx={{ color: '#d97706 !important', fontSize: '14px !important' }}/>} label={`${hotel.rating || '4.0'}`} size="small" sx={{ bgcolor: '#fef3c7', color: '#b45309', borderRadius: 1, fontWeight: 700, px: 0.5 }} />
                      </Box>

                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Check-in</Typography>
                          <Typography variant="body2" fontWeight="600" color="#334155">{hotel.checkInDate || hotel.checkIn || 'TBD'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Check-out</Typography>
                          <Typography variant="body2" fontWeight="600" color="#334155">{hotel.checkOutDate || hotel.checkOut || 'TBD'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Guests</Typography>
                          <Typography variant="body2" fontWeight="600" color="#334155">{pax}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Nights</Typography>
                          <Typography variant="body2" fontWeight="600" color="#334155">{hotel.nights || hotel.duration || 'TBD'}</Typography>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Room</Typography>
                          <Typography variant="body2" fontWeight="600" color="#334155">{hotel.roomCat || hotel.roomType || hotel.room || 'Standard Room'}</Typography>
                        </Grid>
                        
                        {hotel.amenities && hotel.amenities.length > 0 && (
                          <Grid item xs={12} sm={8}>
                            <Typography variant="caption" color="#94a3b8" display="block" mb={1}>Amenities</Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {hotel.amenities.map((amenity, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={amenity} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: '#f0fdfa', 
                                    color: TEAL_MAIN, 
                                    border: '1px solid #ccfbf1', 
                                    fontWeight: 600, 
                                    fontSize: '0.7rem' 
                                  }} 
                                />
                              ))}
                            </Box>
                          </Grid>
                        )}
                      </Grid>

                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        )}

        {/* 6. INCLUSIONS & EXCLUSIONS */}
        <Box sx={{ mb: 10, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: '#f0fdf4', height: '100%', border: '1px solid #dcfce7', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check sx={{ color: '#fff' }} /></Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK }}>What's Included</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {displayInclusions.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Check sx={{ fontSize: 18, color: '#22c55e', mt: 0.2 }} />
                      <Typography variant="body2" color={TEXT_MUTED} sx={{ wordBreak: 'break-word' }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff1f2', height: '100%', border: '1px solid #ffe4e6', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Close sx={{ color: '#fff' }} /></Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK }}>Not Included</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {displayExclusions.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Close sx={{ fontSize: 18, color: '#ef4444', mt: 0.2 }} />
                      <Typography variant="body2" color={TEXT_MUTED} sx={{ wordBreak: 'break-word' }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* 7. VISA DETAILS */}
        {safeVisas.length > 0 && (
          <Box sx={{ mb: 10 }}>
            <Box sx={{ mb: 4, textAlign: 'center', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#3f3f3f', mb: 1 }}>Visa Requirements</Typography>
            </Box>
            
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: NAVY_DARK, color: '#fff', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              {safeVisas.map((visa, i) => (
                <Box key={i} sx={{ mb: 3, p: 3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Public sx={{ color: '#e2e8f0', mt: 0.5 }} />
                      <Box>
                        <Typography variant="h6" fontWeight="700" sx={{ fontFamily: "'Playfair Display', serif", mb: 0.5 }}>
                          {visa.visaCountry || visa.country || 'Visa Country Details'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 1 }}>
                          {visa.visaType || 'Type TBD'} • {visa.entryType || 'Entry TBD'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Duration: {visa.duration || visa.visaDuration || 'TBD'}</Typography>
                      </Box>
                    </Box>
                    <Chip label="Information" size="small" sx={{ bgcolor: TEAL_MAIN, color: '#fff', fontWeight: 600 }} />
                  </Box>
                  {(visa.notes || visa.documents) && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                      <Typography variant="caption" color="#cbd5e1" display="block" mb={0.5}>Notes / Documents:</Typography>
                      <Typography variant="body2" color="#e2e8f0">{visa.notes || visa.documents}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Paper>
          </Box>
        )}

        {/* 8. TERMS & CONDITIONS */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ mb: 4, textAlign: 'center', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#3f3f3f' }}>Terms & Conditions</Typography>
          </Box>
          {renderTerms()}
        </Box>

        {/* 🚨 PREMIUM BEAUTIFIED BANK DETAILS PANEL */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden', 
            border: `1px solid #ccfbf1`, 
            bgcolor: '#ffffff', 
            mb: 8, 
            boxShadow: '0 4px 20px -2px rgba(15, 118, 110, 0.06)',
            pageBreakInside: 'avoid', 
            breakInside: 'avoid' 
          }}
        >
          {/* Header Bar */}
          <Box sx={{ bgcolor: TEAL_MAIN, color: '#fff', py: 2.5, px: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountBalance sx={{ fontSize: '1.6rem', opacity: 0.9 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 0.5, lineHeight: 1.2 }}>Bank Details for Payment</Typography>
              <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.75rem' }}>Secure direct wire transfer details</Typography>
            </Box>
          </Box>

          {/* Main Grid Content */}
          <Box sx={{ p: 4, bgcolor: '#fbfdfd' }}>
            <Grid container spacing={3.5}>
              
              {/* Account Name */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: '#f0fdfa', color: TEAL_MAIN, width: 38, height: 38, border: '1px solid #b2f5ea' }}>
                    <Badge sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="block" sx={{ mb: 0.2, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: 0.5 }}>Beneficiary Name</Typography>
                    <Typography variant="body2" fontWeight="700" color="#0f172a" sx={{ fontSize: '0.95rem' }}>{termsData?.bankDetails?.accountName || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Account Number */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: '#f0fdfa', color: TEAL_MAIN, width: 38, height: 38, border: '1px solid #b2f5ea' }}>
                    <AccountBalanceWallet sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="block" sx={{ mb: 0.2, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: 0.5 }}>Account Number</Typography>
                    <Typography variant="body2" fontWeight="700" color="#0f172a" sx={{ fontSize: '0.95rem', letterSpacing: 0.5 }}>{termsData?.bankDetails?.accountNumber || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Bank Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ color: TEAL_MAIN, mt: 0.3 }}><HomeWork sx={{ fontSize: '1.2rem' }} /></Box>
                  <Box>
                    <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="block" sx={{ mb: 0.1, fontSize: '0.7rem' }}>Bank Name</Typography>
                    <Typography variant="body2" fontWeight="700" color="#334155">{termsData?.bankDetails?.bankName || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* IFSC Code */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ color: TEAL_MAIN, mt: 0.3 }}><Pin sx={{ fontSize: '1.2rem' }} /></Box>
                  <Box>
                    <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="block" sx={{ mb: 0.1, fontSize: '0.7rem' }}>IFSC Code</Typography>
                    <Typography variant="body2" fontWeight="700" color="#334155" sx={{ letterSpacing: 0.3 }}>{termsData?.bankDetails?.ifscCode || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Account Type */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ color: TEAL_MAIN, mt: 0.3 }}><Description sx={{ fontSize: '1.2rem' }} /></Box>
                  <Box>
                    <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="block" sx={{ mb: 0.1, fontSize: '0.7rem' }}>Account Type</Typography>
                    <Typography variant="body2" fontWeight="700" color="#334155">{termsData?.bankDetails?.accountType || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Branch Name */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ color: TEAL_MAIN, mt: 0.3 }}><LocationOn sx={{ fontSize: '1.2rem' }} /></Box>
                  <Box>
                    <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="block" sx={{ mb: 0.1, fontSize: '0.7rem' }}>Branch Location</Typography>
                    <Typography variant="body2" fontWeight="700" color="#334155">{termsData?.bankDetails?.branchName || "N/A"}</Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Routing / SWIFT (Conditional) */}
              {termsData?.bankDetails?.routing && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ color: TEAL_MAIN, mt: 0.3 }}><Public sx={{ fontSize: '1.2rem' }} /></Box>
                    <Box>
                      <Typography variant="caption" color={TEXT_MUTED} fontWeight="600" display="block" sx={{ mb: 0.1, fontSize: '0.7rem' }}>SWIFT / Routing</Typography>
                      <Typography variant="body2" fontWeight="700" color="#334155">{termsData.bankDetails.routing}</Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {/* Bank Notes Block */}
              {termsData?.bankDetails?.bankNotes && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 1, p: 2.5, bgcolor: '#f0fdfa', borderRadius: 2, borderLeft: `3px solid ${TEAL_MAIN}` }}>
                    <Typography variant="caption" color={TEAL_MAIN} fontWeight="700" display="block" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem' }}>Important Payment Instructions</Typography>
                    <Typography variant="body2" color="#475569" sx={{ whiteSpace: 'pre-line', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {termsData.bankDetails.bankNotes}
                    </Typography>
                  </Box>
                </Grid>
              )}

            </Grid>
          </Box>
        </Paper>

      </Container>

      {/* 9. FOOTER */}
      <Box sx={{ bgcolor: NAVY_DARK, pt: 8, pageBreakInside: 'avoid', breakInside: 'avoid' }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: '#fff', mb: 6 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1 }}>Your Travel Consultant</Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 5 }}>Dedicated to making your journey extraordinary</Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 3, md: 5 } }}>
              <Avatar sx={{ width: 100, height: 100, border: '4px solid #f59e0b', bgcolor: '#fff', color: '#cbd5e1' }} src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 0.5 }}>{agentName}</Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3 }}>Senior Luxury Travel Specialist</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button variant="outlined" startIcon={<Phone fontSize="small"/>} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>{phone}</Button>
                  <Button variant="outlined" startIcon={<Email fontSize="small"/>} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>{email}</Button>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Box sx={{ bgcolor: '#fff', py: 4, px: 2, textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
            <Typography variant="body2" color="#64748b" mb={2}>
              This itinerary is subject to availability and confirmation.<br/>
              All times are local. Please arrive at airports 3 hours prior to international flights.
            </Typography>
            <Divider sx={{ maxWidth: 200, mx: 'auto', mb: 2, borderColor: '#e2e8f0' }} />
            <Typography variant="caption" color="#475569" fontWeight="600">
              Triumph Holidays - Creating Unforgettable Memories Since 2005
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}