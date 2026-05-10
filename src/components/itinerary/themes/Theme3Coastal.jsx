import React from 'react';
import { 
  Box, Typography, Paper, Grid, Divider, Avatar, Button, Container, Chip
} from '@mui/material';
import { 
  FlightTakeoff, Hotel, LocationOn, CalendarMonth, 
  CheckCircle, DirectionsCar, Star, Phone, Email,
  ShieldOutlined, AssignmentOutlined, Flight,
  AccessTime, Public, Group, Explore, Cancel,
  Restaurant, AccountBalance, Description
} from '@mui/icons-material';

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
  const phone = `${clientData.contactCode || ''} ${clientData.contact || ''}`.trim() || 'N/A';
  const email = clientData.email || 'N/A';
  
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
    if (!termsData) return <Typography variant="body2" color={TEXT_MUTED}>Standard travel terms and conditions apply.</Typography>;
    if (typeof termsData === 'string') return <Typography variant="body2" color={TEXT_MUTED} sx={{ whiteSpace: 'pre-line' }}>{termsData}</Typography>;

    const allSections = [];
    if (termsData.terms?.length > 0) allSections.push({ title: "General Terms", items: termsData.terms, icon: <AssignmentOutlined /> });
    if (termsData.policies?.length > 0) allSections.push({ title: "Cancellation Policy", items: termsData.policies, icon: <Cancel /> });
    if (termsData.payments?.length > 0) allSections.push({ title: "Payment Schedule", items: termsData.payments, icon: <AccountBalance /> });
    if (termsData.protections?.length > 0) allSections.push({ title: "Travel Protection", items: termsData.protections, icon: <ShieldOutlined /> });

    if (allSections.length === 0) return <Typography variant="body2" color={TEXT_MUTED}>Standard travel terms apply.</Typography>;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {allSections.map((section, idx) => (
          <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: '#f0fdfa', color: TEAL_MAIN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {section.icon}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="800" color={NAVY_DARK} mb={0.5}>{section.title}</Typography>
              <Box component="ul" sx={{ m: 0, pl: 2, color: TEXT_MUTED, fontSize: '0.875rem' }}>
                {section.items.map((item, i) => <li key={i} style={{ marginBottom: '4px' }}>{item}</li>)}
              </Box>
            </Box>
          </Box>
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

        {/* 4. DAY BY DAY TIMELINE (With Uploaded Images) */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Your Journey, Day by Day</Typography>
        </Box>

        <Box sx={{ position: 'relative', mb: 10, py: 4 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, bgcolor: '#e2e8f0', transform: 'translateX(-50%)' }} />

          {days.map((day, i) => {
            const isEven = i % 2 === 0;
            const safeImages = Array.isArray(day.images) ? day.images : [];
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
          <>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Luxury Accommodations</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 10 }}>
              {hotels.map((hotel, i) => {
                const mealsList = Object.keys(hotel.meals || {}).filter(k => hotel.meals[k]).map(formatCamelCase);
                return (
                  <Paper key={i} elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', overflow: 'hidden' }}>
                    <Box sx={{ width: { xs: '100%', md: '35%' }, height: { xs: 200, md: 'auto' }, position: 'relative' }}>
                      <img src={i % 2 === 0 ? HOTEL1_IMG : HOTEL2_IMG} alt={hotel.hotelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ p: 4, width: { xs: '100%', md: '65%' }, position: 'relative' }}>
                      <Chip icon={<Star sx={{ color: '#fbbf24 !important' }}/>} label={hotel.hotelPref || '5 Star'} size="small" sx={{ position: 'absolute', top: 24, right: 24, bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700 }} />
                      
                      <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 0.5 }}>{hotel.hotelName || 'Unnamed Resort'}</Typography>
                      <Typography variant="body2" color={TEXT_MUTED} mb={3} display="flex" alignItems="center" gap={0.5}>
                        <LocationOn fontSize="small" /> {hotel.location || rawDestination}
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">Check-in</Typography>
                          <Typography variant="body2" fontWeight="600" color={NAVY_DARK}>{hotel.checkInDate ? formatDate(hotel.checkInDate) : 'TBD'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">Check-out</Typography>
                          <Typography variant="body2" fontWeight="600" color={NAVY_DARK}>{hotel.checkOutDate ? formatDate(hotel.checkOutDate) : 'TBD'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">Room</Typography>
                          <Typography variant="body2" fontWeight="600" color={NAVY_DARK}>{hotel.roomCat || 'Standard'}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">Board</Typography>
                          <Typography variant="body2" fontWeight="600" color={NAVY_DARK}>{mealsList.join(', ') || 'Room Only'}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </>
        )}

        {/* 6. INCLUSIONS & EXCLUSIONS */}
        <Box sx={{ mb: 10 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, borderTop: `4px solid ${TEAL_MAIN}`, bgcolor: '#fff', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="h6" fontWeight="800" color={NAVY_DARK} mb={3} display="flex" alignItems="center" gap={1}><CheckCircle sx={{ color: TEAL_MAIN }}/> Inclusions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {displayInclusions.map((item, i) => (
                    <Typography key={i} variant="body2" color={TEXT_MUTED} display="flex" alignItems="flex-start" gap={1}>
                      <CheckCircle sx={{ fontSize: 16, color: TEAL_MAIN, mt: 0.3 }} /> {item}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3, borderTop: `4px solid #ef4444`, bgcolor: '#fff', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', height: '100%' }}>
                <Typography variant="h6" fontWeight="800" color={NAVY_DARK} mb={3} display="flex" alignItems="center" gap={1}><Cancel sx={{ color: '#ef4444' }}/> Exclusions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {displayExclusions.map((item, i) => (
                    <Typography key={i} variant="body2" color={TEXT_MUTED} display="flex" alignItems="flex-start" gap={1}>
                      <Cancel sx={{ fontSize: 16, color: '#ef4444', mt: 0.3 }} /> {item}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* 7. TERMS, CONDITIONS & BANK DETAILS */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: NAVY_DARK, mb: 1 }}>Policies & Details</Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', mb: 4 }}>
          {renderTerms()}
        </Paper>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: `2px dashed ${TEAL_MAIN}`, bgcolor: '#f0fdfa' }}>
          <Typography variant="h6" fontWeight="800" color={NAVY_DARK} mb={2} display="flex" alignItems="center" gap={1}><AccountBalance sx={{ color: TEAL_MAIN }}/> Bank Details for Payment</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Bank Name</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.bankName || "Global Bank Inc."}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Account Name</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.accountName || "Coastal Luxury Travel"}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Account Number</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.accountNumber || "1234 5678 9012"}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color={TEAL_MAIN}>Routing / SWIFT</Typography><Typography variant="body2" fontWeight="700" color={NAVY_DARK}>{termsData?.bankDetails?.routing || "GBXX1234"}</Typography></Grid>
          </Grid>
        </Paper>

      </Container>

      {/* 8. FOOTER */}
      <Box sx={{ bgcolor: NAVY_DARK, py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: '#fff' }}>
            <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1 }}>Your Luxury Consultant</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4 }}>Available 24/7 for any questions</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: '#fff', border: '2px solid #e2e8f0' }} src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" fontWeight="700">Sarah Mitchell</Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>Senior Travel Designer</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Phone />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', px: 3 }}>Call Advisor</Button>
              <Button variant="outlined" startIcon={<Email />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', textTransform: 'none', px: 3 }}>Send Message</Button>
            </Box>
          </Paper>

          <Typography variant="caption" display="block" textAlign="center" sx={{ color: '#64748b', mt: 4 }}>
            © 2026 Coastal Luxury Travel. All rights reserved.<br/>
            Pricing and availability are subject to change until final confirmation.
          </Typography>
        </Container>
      </Box>

    </Box>
  );
}
