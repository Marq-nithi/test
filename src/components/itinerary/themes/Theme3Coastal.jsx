import React from 'react';
import { 
  Box, Typography, Paper, Grid, Divider, Avatar, Button, Container, Chip
} from '@mui/material';
import { 
  FlightTakeoff, Hotel, LocationOn, CalendarMonth, 
  CheckCircle, DirectionsCar, Star, Phone, Email,
  ShieldOutlined, AssignmentOutlined, Flight,
  AccessTime, Public, Group, Explore, Cancel,
  Restaurant, AccountBalance, Description,
  Check, Close 
} from '@mui/icons-material';
import { WhatsApp } from '@mui/icons-material';

import { useItinerary } from '../../../context/ItineraryContext'; 

// --- Placeholder Images for Coastal Theme ---
const HERO_BG = "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=2000"; 
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
    reviewData 
  } = useItinerary();

  // --- 1. CLIENT & TRIP DATA ---
  const rawDestination = clientData?.destination || clientData?.dist_location || "Destination";
  const shortDestination = rawDestination.split(',')[0];
  const title = (clientData.trip_title && clientData.trip_title.trim() !== "") ? clientData.trip_title : `Best of ${shortDestination}`;
  const clientName = `${clientData.title || ''} ${clientData.name || 'Valued Guest'}`.trim();
  const phone = `${clientData.contactCode || ''} ${clientData.contact || ''}`.trim() || '+1 (234) 567-890';
  const email = clientData.email || 'sarah@paradise.com';
  const agentName = clientData.queryHandledBy && clientData.queryHandledBy !== '0' ? clientData.queryHandledBy : 'Sarah Martinez';
  
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const dates = (clientData.startDate && clientData.endDate) ? `${formatDate(clientData.startDate)} - ${formatDate(clientData.endDate)}` : "Dates TBD";
  
  const adults = parseInt(clientData.adults) || 2;
  const childrenCount = parseInt(clientData.children) || 0;
  const pax = `${adults} Adults${childrenCount > 0 ? `, ${childrenCount} Children` : ''}`;
  
  const totalDays = clientData.days || 7;
  const budget = reviewData?.budget !== '$0.00' ? reviewData?.budget : (clientData.budget ? `$${clientData.budget}` : 'TBD');

  // --- 2. TRANSPORT DATA ---
  let flights = [];
  if (transportData?.flights?.length > 0) flights = transportData.flights;
  else if (transportData?.airline || transportData?.depFrom) flights = [transportData];

  // --- 3. DAY PLANNER DATA ---
  const rawDaysArray = activeDays || dayPlannerData || [];
  const isFormEmpty = rawDaysArray.length === 0 || (rawDaysArray.length === 1 && !rawDaysArray[0].title);
  const days = !isFormEmpty ? rawDaysArray : [{ title: `Arrival in ${shortDestination}`, description: "Welcome to your dream vacation!", meals: ["Breakfast"], transport: "Private Transfer" }];

  // --- 4. STAY DATA ---
  const hotels = stayData?.hotels?.length > 0 ? stayData.hotels : [];

  // --- 5. INCLUSIONS & EXCLUSIONS ---
  let displayInclusions = [];
  let displayExclusions = [];
  if (Array.isArray(inclExclData?.inclusions)) displayInclusions = inclExclData.inclusions;
  else displayInclusions = Object.keys(inclExclData?.inclusions || {}).filter(k => inclExclData.inclusions[k]).map(formatCamelCase);
  if (Array.isArray(inclExclData?.exclusions)) displayExclusions = inclExclData.exclusions;
  else displayExclusions = Object.keys(inclExclData?.exclusions || {}).filter(k => inclExclData.exclusions[k]).map(formatCamelCase);

  if (displayInclusions.length === 0) displayInclusions = ["Accommodation as per itinerary", "Daily Breakfast", "Airport Transfers"];
  if (displayExclusions.length === 0) displayExclusions = ["International Flights", "Visa Fees", "Personal Expenses"];

  // --- 6. SMART TERMS & CONDITIONS ---
  const renderTerms = () => {
    let sections = [];
    
    if (typeof termsData === 'string' && termsData.trim().length > 0) {
      sections = [{ title: "General Information", text: termsData, icon: <AssignmentOutlined fontSize="small" /> }];
    } 
    else if (termsData && typeof termsData === 'object') {
      if (termsData.policies?.length > 0) {
        sections.push({ title: "Cancellation Policy", text: termsData.policies.join(' '), icon: <ShieldOutlined fontSize="small" /> });
      }
      if (termsData.protections?.length > 0) {
        sections.push({ title: "Travel Insurance", text: termsData.protections.join(' '), icon: <ShieldOutlined fontSize="small" /> });
      }
      if (termsData.terms?.length > 0) {
        sections.push({ title: "General Terms", text: termsData.terms.join(' '), icon: <AssignmentOutlined fontSize="small" /> });
      }
      if (termsData.payments?.length > 0) {
        sections.push({ title: "Payment Details", text: termsData.payments.join(' '), icon: <AccountBalance fontSize="small" /> });
      }
    }

    if (sections.length === 0) {
      sections = [
        { 
          title: "Cancellation Policy", 
          text: "Free cancellation up to 30 days before departure. 50% refund up to 14 days. Full payment non-refundable within 14 days of travel.", 
          icon: <ShieldOutlined fontSize="small" /> 
        },
        { 
          title: "Travel Insurance", 
          text: "Comprehensive travel insurance included covering medical emergencies, trip cancellation, delays, and lost baggage.", 
          icon: <ShieldOutlined fontSize="small" /> 
        },
        { 
          title: "Flexible Rebooking", 
          text: "Change your travel dates up to 45 days before departure with no fees. Subject to availability and rate differences.", 
          icon: <ShieldOutlined fontSize="small" /> 
        }
      ];
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sections.map((section, idx) => (
          <Paper key={idx} elevation={0} sx={{ display: 'flex', gap: 2.5, p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {section.icon}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#334155', mb: 0.5 }}>
                {section.title}
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6 }}>
                {section.text}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ bgcolor: BG_LIGHT, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* 1. HERO SECTION */}
      <Box sx={{ 
        position: 'relative', height: 600, 
        backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(15,23,42,0.9) 100%)' }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, color: '#fff', pt: 10 }}>
          <Chip label="LUXURY ESCAPE" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', mb: 3, letterSpacing: 2, fontWeight: 600, backdropFilter: 'blur(4px)' }} size="small" />
          
          <Typography variant="h2" mb={1} sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, maxWidth: 600 }}>{title}</Typography>
          <Typography variant="subtitle1" sx={{ color: '#cbd5e1', mb: 4, fontStyle: 'italic', maxWidth: 600 }}>
            Curated exclusively for {clientName}
          </Typography>

          <Typography variant="h1" sx={{ position: 'absolute', bottom: -40, right: 20, fontWeight: 900, color: 'rgba(255,255,255,0.05)', fontSize: { xs: '4rem', md: '8rem' }, letterSpacing: 10, textTransform: 'uppercase' }}>
            {shortDestination}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ mt: 6, mb: 10 }}>
        
        {/* 2. INVESTMENT OVERVIEW */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Investment Overview</Typography>
          <Typography variant="body2" color={TEXT_MUTED}>Pricing and trip details at a glance</Typography>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 8, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <Box sx={{ bgcolor: TEAL_MAIN, color: '#fff', textAlign: 'center', py: 4, px: 2 }}>
            <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 1, fontWeight: 600 }}>TOTAL INVESTMENT</Typography>
            <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mt: 1 }}>{budget}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>Pricing is guaranteed until booking.</Typography>
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
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><Flight fontSize="small"/> Flights</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK}>{flights.length > 0 ? `${flights.length} Included` : 'Not Included'}</Typography>
              </Grid>
              <Grid item xs={6} md={4}>
                <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={1} mb={0.5}><Group fontSize="small"/> Guests</Typography>
                <Typography variant="subtitle1" fontWeight="700" color={NAVY_DARK}>{pax}</Typography>
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

        {/* 3. FLIGHT JOURNEY */}
        {flights.length > 0 && (
          <>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Your Flight Journey</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 10 }}>
              {flights.map((flight, i) => (
                <Paper key={i} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: '#f1f5f9', color: TEAL_MAIN, width: 36, height: 36 }}><FlightTakeoff fontSize="small" /></Avatar>
                      <Typography variant="subtitle2" fontWeight="700" color={NAVY_DARK}>{flight.airline || 'Flight'}</Typography>
                    </Box>
                    <Chip label={`Flight ${flight.flightNo || 'TBD'}`} size="small" variant="outlined" sx={{ color: TEAL_MAIN, borderColor: TEAL_MAIN, fontWeight: 600 }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ width: '30%', textAlign: 'left' }}>
                      <Typography variant="h6" fontWeight="800" color={NAVY_DARK}>{flight.depFrom || 'Origin'}</Typography>
                      <Typography variant="body2" color={TEXT_MUTED}>{flight.depTime || 'TBD'}</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, mx: 3, position: 'relative', textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: TEAL_MAIN, fontWeight: 600, bgcolor: '#fff', px: 1, position: 'relative', zIndex: 2 }}>{flight.duration || 'Direct'}</Typography>
                      <Box sx={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, borderTop: '2px dashed #cbd5e1', zIndex: 1 }} />
                      <FlightTakeoff sx={{ color: '#cbd5e1', position: 'absolute', top: '50%', right: -10, transform: 'translateY(-50%)', zIndex: 2, bgcolor: '#fff' }} />
                    </Box>

                    <Box sx={{ width: '30%', textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight="800" color={NAVY_DARK}>{flight.arrTo || flight.arrAt || 'Destination'}</Typography>
                      <Typography variant="body2" color={TEXT_MUTED}>{flight.arrTime || 'TBD'}</Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </>
        )}

        {/* 4. DAY BY DAY TIMELINE */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Your Journey, Day by Day</Typography>
        </Box>

        <Box sx={{ position: 'relative', mb: 10, py: 4 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, bgcolor: '#e2e8f0', transform: 'translateX(-50%)' }} />

          {days.map((day, i) => {
            const isEven = i % 2 === 0;
            const safeImages = Array.isArray(day.images)
              ? day.images
                  .map((v) => (typeof v === "string" ? v : v?.url))
                  .filter(Boolean)
              : [];
            const img = safeImages.length > 0 ? safeImages[0] : (i === 0 ? DAY1_IMG : i === 1 ? DAY2_IMG : DAY3_IMG);
            const safeMeals = Array.isArray(day.meals) ? day.meals : [];

            return (
              <Box key={i} sx={{ display: 'flex', flexDirection: { xs: 'column', md: isEven ? 'row' : 'row-reverse' }, alignItems: 'center', position: 'relative', mb: { xs: 4, md: 6 } }}>
                
                <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 24, height: 24, bgcolor: TIMELINE_BLUE, borderRadius: '50%', border: '4px solid #fff', zIndex: 2, boxShadow: '0 0 0 1px #e2e8f0' }} />

                <Box sx={{ width: { xs: '100%', md: '45%' }, mb: { xs: 2, md: 0 } }}>
                  <Box sx={{ width: '100%', height: 260, borderRadius: 3, overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                    <img src={img} alt={day.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                </Box>

                <Box sx={{ display: { xs: 'none', md: 'block' }, width: '10%' }} />

                <Box sx={{ width: { xs: '100%', md: '45%' } }}>
                  <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', textAlign: 'left', position: 'relative' }}>
                    <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: '50%', [isEven ? 'left' : 'right']: -30, width: 30, height: 1, bgcolor: '#e2e8f0' }} />

                    <Typography variant="caption" sx={{ color: TIMELINE_BLUE, fontWeight: 800, letterSpacing: 1, display: 'block', mb: 1 }}>DAY {i + 1}</Typography>
                    <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>{day.title || `Day ${i + 1}`}</Typography>
                    <Typography variant="body2" color={TEXT_MUTED} mb={3} sx={{ lineHeight: 1.6 }}>{day.description}</Typography>
                    
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

        {/* 5. LUXURY ACCOMMODATIONS */}
        {hotels.length > 0 && (
          <Box sx={{ mb: 10 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#3f3f3f', mb: 1 }}>
                Luxury Accommodations
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {hotels.map((hotel, i) => (
                <Paper key={i} elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 1, border: '1px solid #e2e8f0', bgcolor: '#fff', overflow: 'hidden' }}>
                  
                  <Box sx={{ width: { xs: '100%', sm: '35%' }, minHeight: { xs: 200, sm: 260 }, position: 'relative' }}>
                    <img src={hotel.image || (i % 2 === 0 ? HOTEL1_IMG : HOTEL2_IMG)} alt={hotel.hotelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  
                  <Box sx={{ p: 4, width: { xs: '100%', sm: '65%' }, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                      <Box>
                        <Typography variant="h6" fontWeight="700" color="#1e293b" mb={0.5}>
                          {hotel.hotelName || 'Unnamed Resort'}
                        </Typography>
                        <Typography variant="caption" color="#64748b" display="block">
                          {hotel.location || rawDestination}
                        </Typography>
                      </Box>
                      <Chip 
                        icon={<Star sx={{ color: '#d97706 !important', fontSize: '14px !important' }}/>} 
                        label={`${hotel.rating || '4.7'}`} 
                        size="small" 
                        sx={{ bgcolor: '#fef3c7', color: '#b45309', borderRadius: 1, fontWeight: 700, px: 0.5 }} 
                      />
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Check-in</Typography>
                        <Typography variant="body2" fontWeight="600" color="#334155">{hotel.checkInDate ? formatDate(hotel.checkInDate) : 'Apr 21, 2026'}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Check-out</Typography>
                        <Typography variant="body2" fontWeight="600" color="#334155">{hotel.checkOutDate ? formatDate(hotel.checkOutDate) : 'Apr 24, 2026'}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Guests</Typography>
                        <Typography variant="body2" fontWeight="600" color="#334155">{pax}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Duration</Typography>
                        <Typography variant="body2" fontWeight="600" color="#334155">{hotel.nights || '3'} nights</Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />

                    <Box>
                      <Typography variant="caption" color="#94a3b8" display="block" mb={0.5}>Room Type</Typography>
                      <Typography variant="body2" fontWeight="600" color="#334155">{hotel.roomCat || 'Panoramic Double Room'}</Typography>
                    </Box>

                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* 6. INCLUSIONS & EXCLUSIONS */}
        <Box sx={{ mb: 10 }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: '#f0fdf4', height: '100%', border: '1px solid #dcfce7', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check sx={{ color: '#fff' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK }}>
                    What's Included
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                  {displayInclusions.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Check sx={{ fontSize: 18, color: '#22c55e', mt: 0.2, flexShrink: 0 }} />
                      <Typography variant="body2" color={TEXT_MUTED} sx={{ wordBreak: 'break-word' }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff1f2', height: '100%', border: '1px solid #ffe4e6', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Close sx={{ color: '#fff' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK }}>
                    Not Included
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
                  {displayExclusions.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Close sx={{ fontSize: 18, color: '#ef4444', mt: 0.2, flexShrink: 0 }} />
                      <Typography variant="body2" color={TEXT_MUTED} sx={{ wordBreak: 'break-word' }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* 7. TERMS, CONDITIONS & BANK DETAILS */}
        <Box sx={{ mb: 10 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#3f3f3f' }}>
              Terms & Conditions
            </Typography>
          </Box>
          {renderTerms()}
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `2px dashed ${TEAL_MAIN}`, bgcolor: '#f0fdfa', mb: 8 }}>
          <Typography variant="h6" fontWeight="800" color={NAVY_DARK} mb={2} display="flex" alignItems="center" gap={1}><AccountBalance sx={{ color: TEAL_MAIN }}/> Bank Details for Payment</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Bank Name</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.bankName || "Global Bank Inc."}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Account Name</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.accountName || "Coastal Luxury Travel"}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Account Number</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.accountNumber || "1234 5678 9012"}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Routing / SWIFT</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.routing || "GBXX1234"}</Typography></Grid>
          </Grid>
        </Paper>

      </Container>

      {/* 🚨 8. EXACT FOOTER UPDATE (Dark Blue Card with Disclaimer) */}
      <Box sx={{ bgcolor: NAVY_DARK, pt: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: '#fff', mb: 6 }}>
            
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1 }}>Your Travel Consultant</Typography>
            <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 5 }}>Dedicated to making your journey extraordinary</Typography>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 3, md: 5 } }}>
              
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: { xs: 2, md: 0 } }}>
                <Avatar sx={{ width: 100, height: 100, border: '4px solid #f59e0b', bgcolor: '#fff', color: '#cbd5e1' }} src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" />
                <Chip label="Available 24/7" size="small" sx={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', bgcolor: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: '0.65rem', height: 22 }} />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 0.5 }}>{agentName}</Typography>
                <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 3 }}>Senior Luxury Travel Specialist</Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button variant="outlined" startIcon={<Phone fontSize="small"/>} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.05)', textTransform: 'none', borderRadius: 2, px: 2 }}>{phone}</Button>
                  <Button variant="outlined" startIcon={<Email fontSize="small"/>} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.05)', textTransform: 'none', borderRadius: 2, px: 2 }}>{email}</Button>
                  <Button variant="outlined" startIcon={<WhatsApp fontSize="small"/>} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.05)', textTransform: 'none', borderRadius: 2, px: 2 }}>WhatsApp</Button>
                </Box>
              </Box>

            </Box>
          </Paper>
        </Container>

        {/* White Disclaimer Section */}
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
      </Box>

    </Box>
  );
}