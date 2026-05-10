import React from 'react';
import { 
  Box, Typography, Paper, Grid, Divider, Chip, Avatar, Button, Container
} from '@mui/material';
import { 
  FlightTakeoff, Hotel, LocationOn, CalendarMonth, 
  CheckCircle, Cancel, Public, AccessTime,
  Phone, Email, PersonOutline, AssignmentTurnedInOutlined,
  PictureAsPdf, DirectionsCar, Restaurant, Description, AccountBalance, FlightLand
} from '@mui/icons-material';

import { useItinerary } from '../../../context/ItineraryContext'; 

const HERO_BG = "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000"; 
const DAY1_IMG = "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800"; 
const DAY2_IMG = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800"; 
const HOTEL_IMG = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800";

const DAY_COLORS = ['#f97316', '#0ea5e9', '#8b5cf6', '#10b981', '#f43f5e', '#3b82f6', '#a855f7'];

const formatCamelCase = (text) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function Theme1Classic() {
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

  // 1. CLIENT & TRIP DATA
  const rawDestination = clientData.destination || "Destination";
  const shortDestination = rawDestination.split(',')[0];
  const title = (clientData.trip_title && clientData.trip_title.trim() !== "") ? clientData.trip_title : `Best of ${shortDestination}`;
  const fullName = `${clientData.title || ''} ${clientData.name || 'Valued Guest'}`.trim();
  const phone = `${clientData.contactCode || ''} ${clientData.contact || ''}`.trim() || 'N/A';
  const email = clientData.email || 'N/A';
  
  const budget = reviewData?.budget !== '$0.00' ? reviewData?.budget : (clientData.budget ? `$${clientData.budget}` : 'TBD');
  
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;
  const dates = (clientData.startDate && clientData.endDate) ? `${formatDate(clientData.startDate)} - ${formatDate(clientData.endDate)}` : "Dates TBD";
  
  const adults = parseInt(clientData.adults) || 2;
  const childrenCount = parseInt(clientData.children) || 0;
  let pax = `${adults} Adults`;
  if (childrenCount > 0) pax += `, ${childrenCount} Children`;

  // 2. DAY PLANNER DATA
  const rawDaysArray = activeDays || dayPlannerData || [];
  const isFormEmpty = rawDaysArray.length === 0 || (rawDaysArray.length === 1 && !rawDaysArray[0].title);
  const days = !isFormEmpty ? rawDaysArray : [{ title: `Arrival in ${shortDestination}`, description: "Welcome to your dream vacation!", meals: ["Breakfast"], transport: "Private Transfer" }];

  // 3. STAY DATA
  const hotels = stayData?.hotels?.length > 0 ? stayData.hotels : [];

  // 🚨 4. TRANSPORT DATA (RESOLVED)
  let flights = [];
  if (transportData?.flights?.length > 0) {
    flights = transportData.flights;
  } else if (transportData?.airline || transportData?.depFrom) {
    flights = [transportData];
  }

  // 5. INCLUSIONS & EXCLUSIONS DATA
  let displayInclusions = [];
  let displayExclusions = [];

  if (Array.isArray(inclExclData?.inclusions)) {
    displayInclusions = inclExclData.inclusions;
  } else {
    const rawInc = inclExclData?.inclusions || {};
    displayInclusions = Object.keys(rawInc).filter(k => rawInc[k]).map(formatCamelCase);
  }

  if (Array.isArray(inclExclData?.exclusions)) {
    displayExclusions = inclExclData.exclusions;
  } else {
    const rawExc = inclExclData?.exclusions || {};
    displayExclusions = Object.keys(rawExc).filter(k => rawExc[k]).map(formatCamelCase);
  }

  if (displayInclusions.length === 0) displayInclusions = ["Accommodation as per itinerary", "Daily Breakfast", "Airport Transfers", "All Local Taxes"];
  if (displayExclusions.length === 0) displayExclusions = ["International Flights", "Visa Fees", "Personal Expenses", "Travel Insurance"];

  // 6. SMART TERMS & CONDITIONS RENDERER
  const renderTerms = () => {
    if (!termsData) return <Typography variant="body2" color="#475569">Standard travel terms and conditions apply. A 30% deposit is required to confirm your booking.</Typography>;

    if (typeof termsData === 'string') {
      return <Typography variant="body2" color="#475569" sx={{ whiteSpace: 'pre-line' }}>{termsData}</Typography>;
    }

    const allSections = [];
    if (termsData.terms?.length > 0) allSections.push({ title: "General Terms", items: termsData.terms });
    if (termsData.policies?.length > 0) allSections.push({ title: "Cancellation Policy", items: termsData.policies });
    if (termsData.payments?.length > 0) allSections.push({ title: "Payment Schedule", items: termsData.payments });
    if (termsData.protections?.length > 0) allSections.push({ title: "Travel Protection", items: termsData.protections });

    if (allSections.length === 0) return <Typography variant="body2" color="#475569">Standard travel terms apply.</Typography>;

    return (
      <Grid container spacing={4}>
        {allSections.map((section, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Typography variant="subtitle2" fontWeight="800" color="#0f172a" mb={1}>{section.title}</Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, color: '#475569', fontSize: '0.875rem' }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* --- HERO SECTION --- */}
      <Box sx={{ 
        position: 'relative', height: 450, backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', flexDirection: 'column',
        '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)' }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box sx={{ color: '#fff', mt: 4 }}>
            <Typography variant="h2" fontWeight="900" mb={1}>{title}</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip label={dates} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', fontWeight: 600 }} icon={<CalendarMonth sx={{ color: '#fff !important' }}/>} />
              <Chip label={rawDestination} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', fontWeight: 600 }} icon={<LocationOn sx={{ color: '#fff !important' }}/>} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* --- OVERLAPPING SUMMARY --- */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10, mt: -8, mb: 8 }}>
        <Paper elevation={10} sx={{ borderRadius: 4, bgcolor: '#fff', overflow: 'hidden' }}>
          
          <Box sx={{ bgcolor: '#f8fafc', px: 4, py: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0ea5e9' }}><PersonOutline /></Avatar>
              <Box>
                <Typography variant="caption" color="#64748b" fontWeight="600" display="block">PREPARED FOR</Typography>
                <Typography variant="subtitle2" fontWeight="800" color="#0f172a">{fullName}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
               <Typography variant="caption" color="#475569" display="flex" alignItems="center" gap={0.5}><Phone fontSize="small" sx={{color: '#94a3b8'}}/> {phone}</Typography>
               <Typography variant="caption" color="#475569" display="flex" alignItems="center" gap={0.5}><Email fontSize="small" sx={{color: '#94a3b8'}}/> {email}</Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Box sx={{ p: 1.5, bgcolor: '#fff7ed', color: '#f97316', borderRadius: 2 }}><AccessTime /></Box>
                  <Box>
                    <Typography variant="caption" color="#64748b" fontWeight="600" display="block">Duration</Typography>
                    <Typography variant="subtitle2" fontWeight="800" color="#0f172a">{clientData.days || 4} Days</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Box sx={{ p: 1.5, bgcolor: '#ecfdf5', color: '#10b981', borderRadius: 2 }}><Hotel /></Box>
                  <Box>
                    <Typography variant="caption" color="#64748b" fontWeight="600" display="block">Guests</Typography>
                    <Typography variant="subtitle2" fontWeight="800" color="#0f172a">{pax}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="caption" fontWeight="700" color="#64748b">Total Estimated Cost</Typography>
                <Typography variant="h5" fontWeight="900" color="#f97316">{budget}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* 🚨 TRANSPORT DETAILS --- (NEWLY ADDED) */}
      {flights.length > 0 && (
        <Container maxWidth="md" sx={{ mb: 8 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1} textAlign="center">Transport Itinerary</Typography>
          <Typography variant="body2" color="#64748b" mb={4} textAlign="center">Your flight and travel arrangements</Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {flights.map((flight, i) => (
              <Paper key={i} elevation={0} sx={{ p: 0, borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Box sx={{ bgcolor: '#f8fafc', px: 3, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" fontWeight="800" color="#0f172a" display="flex" alignItems="center" gap={1}>
                    <FlightTakeoff color="primary" fontSize="small" /> 
                    {flight.airline || 'Flight Details'} {flight.flightNo ? `| ${flight.flightNo}` : ''}
                  </Typography>
                  <Chip label={flight.classType || 'Economy'} size="small" sx={{ bgcolor: '#e0f2fe', color: '#0ea5e9', fontWeight: 700 }} />
                </Box>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={4} alignItems="center">
                    {/* Departure */}
                    <Grid item xs={5} textAlign="right">
                      <Typography variant="h4" fontWeight="900" color="#0f172a">{flight.depTime || 'TBD'}</Typography>
                      <Typography variant="subtitle1" fontWeight="700" color="#334155">{flight.depFrom || 'Origin'}</Typography>
                      {flight.depDate && <Typography variant="caption" color="#64748b">{formatDate(flight.depDate)}</Typography>}
                    </Grid>
                    
                    {/* Graphic Center */}
                    <Grid item xs={2} textAlign="center" sx={{ position: 'relative' }}>
                      <Divider sx={{ position: 'absolute', top: '50%', left: 0, right: 0, zIndex: 0 }} />
                      <Box sx={{ position: 'relative', zIndex: 1, display: 'inline-block', bgcolor: '#fff', px: 1 }}>
                        <FlightTakeoff sx={{ color: '#94a3b8', transform: 'rotate(90deg)' }} />
                      </Box>
                    </Grid>
                    
                    {/* Arrival */}
                    <Grid item xs={5} textAlign="left">
                      <Typography variant="h4" fontWeight="900" color="#0f172a">{flight.arrTime || 'TBD'}</Typography>
                      <Typography variant="subtitle1" fontWeight="700" color="#334155">{flight.arrTo || 'Destination'}</Typography>
                      {flight.arrDate && <Typography variant="caption" color="#64748b">{formatDate(flight.arrDate)}</Typography>}
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      )}

      {/* --- HOTELS FROM STAY DETAILS --- */}
      {hotels.length > 0 && (
        <Container maxWidth="md" sx={{ mb: 8 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1} textAlign="center">Luxury Accommodations</Typography>
          <Typography variant="body2" color="#64748b" mb={4} textAlign="center">Where you will be staying</Typography>
          
          <Grid container spacing={3}>
            {hotels.map((hotel, i) => {
              const safeAmenities = hotel.amenities || [];
              const mealsList = Object.keys(hotel.meals || {}).filter(k => hotel.meals[k]).map(formatCamelCase);

              return (
                <Grid item xs={12} sm={6} key={i}>
                  <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <Box sx={{ height: 160, position: 'relative' }}>
                      <img src={HOTEL_IMG} alt={hotel.hotelName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <Chip label={hotel.hotelPref || 'Hotel'} size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#fff', fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" mb={0.5}>{hotel.hotelName || 'Unnamed Hotel'}</Typography>
                      <Typography variant="caption" color="#64748b" display="flex" alignItems="center" gap={0.5} mb={2}><LocationOn fontSize="small"/> {hotel.location || rawDestination}</Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2, bgcolor: '#f8fafc', p: 1.5, borderRadius: 2 }}>
                         <Box>
                           <Typography variant="caption" color="#94a3b8" display="block">Check-in</Typography>
                           <Typography variant="body2" fontWeight="700">{hotel.checkInDate ? formatDate(hotel.checkInDate) : 'TBD'} • {hotel.checkInTime || '3:00 PM'}</Typography>
                         </Box>
                      </Box>

                      {safeAmenities.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {safeAmenities.map(am => <Chip key={am} label={am} size="small" sx={{ bgcolor: '#f0f9ff', color: '#0ea5e9', fontSize: '0.7rem', fontWeight: 600 }} />)}
                        </Box>
                      )}

                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="caption" color="#64748b" display="flex" alignItems="center" gap={0.5}><Restaurant fontSize="small"/> Meals: {mealsList.join(', ') || 'Room Only'}</Typography>
                      <Typography variant="caption" color="#64748b" display="flex" alignItems="center" gap={0.5} mt={0.5}><Hotel fontSize="small"/> Room: {hotel.roomCat || 'Standard'} ({hotel.rooms || 1} Room)</Typography>
                    </Box>
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      )}

      {/* --- DAY PLANNER (WITH IMAGES) --- */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1} textAlign="center">Detailed Itinerary</Typography>
        <Typography variant="body2" color="#64748b" mb={5} textAlign="center">Your day-by-day adventure</Typography>

        <Box sx={{ position: 'relative', pl: { xs: 6, md: 8 } }}>
          <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: { xs: 24, md: 32 }, width: 2, bgcolor: '#e2e8f0' }} />

          {days.map((day, i) => {
            const color = DAY_COLORS[i % DAY_COLORS.length];
            const safeMeals = Array.isArray(day.meals) ? day.meals : [];
            const mealString = (safeMeals.length > 0 && !safeMeals.includes('No Meals')) ? `Meals: ${safeMeals.join(', ')}` : 'Meals: Not Included';
            
            const safeImages = Array.isArray(day.images) ? day.images : [];
            const displayImg = safeImages.length > 0 ? safeImages[0] : (i % 2 === 0 ? DAY1_IMG : DAY2_IMG);

            return (
              <Box key={i} sx={{ position: 'relative', mb: 4 }}>
                <Box sx={{ position: 'absolute', left: { xs: -48, md: -64 }, top: 0, width: 48, height: 48, bgcolor: color, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 2 }}>
                  <Typography variant="caption" fontWeight="700" sx={{ lineHeight: 1 }}>Day</Typography>
                  <Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1 }}>{i + 1}</Typography>
                </Box>

                <Paper elevation={0} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', borderLeft: `6px solid ${color}` }}>
                  <Box sx={{ width: { xs: '100%', sm: 220 }, height: 160, borderRadius: 2, overflow: 'hidden', flexShrink: 0, mb: { xs: 2, sm: 0 }, mr: { sm: 3 } }}>
                    <img src={displayImg} alt={day.title || `Day ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="800" color="#0f172a" mb={1}>{day.title || `Day ${i + 1}`}</Typography>
                    {day.description && <Typography variant="body2" color="#475569" mb={2}>{day.description}</Typography>}
                    
                    {day.activities && (
                      <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Typography variant="caption" fontWeight="700" color="#0f172a" display="block" mb={0.5}>Activities:</Typography>
                        <Typography variant="body2" color="#334155" sx={{ whiteSpace: 'pre-line' }}>{day.activities}</Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                      {day.transport && day.transport !== 'No Transport' && (
                        <Typography variant="caption" color="#64748b" fontWeight="600" display="flex" alignItems="center" gap={0.5}><DirectionsCar fontSize="small" sx={{ color }}/> {day.transport}</Typography>
                      )}
                      <Typography variant="caption" color="#64748b" fontWeight="600" display="flex" alignItems="center" gap={0.5}><Restaurant fontSize="small" sx={{ color }}/> {mealString}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Container>

      {/* --- INCLUSIONS & EXCLUSIONS --- */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #bbf7d0', bgcolor: '#f0fdf4', height: '100%' }}>
              <Typography variant="h6" fontWeight="800" color="#166534" mb={3} display="flex" alignItems="center" gap={1}><CheckCircle /> Inclusions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {displayInclusions.map((item, i) => (
                  <Typography key={i} variant="body2" color="#166534" display="flex" alignItems="center" gap={1}>
                    <CheckCircle sx={{ fontSize: 16, color: '#22c55e' }} /> {item}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #fecaca', bgcolor: '#fef2f2', height: '100%' }}>
              <Typography variant="h6" fontWeight="800" color="#991b1b" mb={3} display="flex" alignItems="center" gap={1}><Cancel /> Exclusions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {displayExclusions.map((item, i) => (
                  <Typography key={i} variant="body2" color="#991b1b" display="flex" alignItems="center" gap={1}>
                    <Cancel sx={{ fontSize: 16, color: '#ef4444' }} /> {item}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* --- TERMS & CONDITIONS & BANK DETAILS --- */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
          <Typography variant="h6" fontWeight="800" color="#0f172a" mb={3} display="flex" alignItems="center" gap={1}><Description color="primary"/> Terms & Conditions</Typography>
          {renderTerms()}
        </Paper>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px dashed #94a3b8', bgcolor: '#fff', mt: 4 }}>
          <Typography variant="h6" fontWeight="800" color="#0f172a" mb={2} display="flex" alignItems="center" gap={1}><AccountBalance color="primary"/> Bank Details for Payment</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}><Typography variant="caption" color="#64748b">Bank Name</Typography><Typography variant="body2" fontWeight="700">{termsData?.bankDetails?.bankName || "Global Bank Inc."}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color="#64748b">Account Name</Typography><Typography variant="body2" fontWeight="700">{termsData?.bankDetails?.accountName || "Atlas Travel CRM"}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color="#64748b">Account Number</Typography><Typography variant="body2" fontWeight="700">{termsData?.bankDetails?.accountNumber || "1234 5678 9012"}</Typography></Grid>
            <Grid item xs={6}><Typography variant="caption" color="#64748b">Routing / SWIFT</Typography><Typography variant="body2" fontWeight="700">{termsData?.bankDetails?.routing || "GBXX1234"}</Typography></Grid>
          </Grid>
        </Paper>
      </Container>

    </Box>
  );
}
