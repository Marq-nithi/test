import React from 'react';
import { 
  Box, Typography, Paper, Grid, Divider, Chip, Avatar, List, ListItem, ListItemIcon, ListItemText 
} from '@mui/material';
import { PeopleAlt } from '@mui/icons-material';
import { 
  FlightTakeoff, Hotel, Map, DirectionsCar, CheckCircle, Cancel, 
  AccessTime, LocationOn, Restaurant, CalendarMonth, LocalActivity,
  VerifiedUser, Payment, Gavel, AssignmentReturn
} from '@mui/icons-material';

const getMealString = (hotel) => {
  if (!hotel?.meals) return 'Room Only';
  if (hotel.meals.allInclusive) return 'All Inclusive';
  const selected = [];
  if (hotel.meals.breakfast) selected.push('Breakfast');
  if (hotel.meals.lunch) selected.push('Lunch');
  if (hotel.meals.dinner) selected.push('Dinner');
  return selected.length > 0 ? selected.join(' & ') : 'Room Only';
};

// Colors for the alternating day timeline
const dayColors = ['#f97316', '#14b8a6', '#a855f7', '#10b981', '#f43f5e'];

export default function Theme3Coastal({ data, math }) {
  // We'll use a soft lavender/white background like the design
  const c = { 
    bg: '#fcfafc', paper: '#ffffff', text: '#1e293b', muted: '#64748b', 
    accent: '#f97316', border: '#e2e8f0', font: '"Inter", sans-serif' 
  };
  
  // High-res hero image placeholder
  const heroImage = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80';

  return (
    <Box sx={{ bgcolor: c.bg, minHeight: '100vh', fontFamily: c.font, pb: 15, '@media print': { pb: 0, minHeight: 'auto' } }}>
      
      {/* 1. HERO SECTION */}
      <Box sx={{ 
        position: 'relative', pt: 12, pb: 18, px: 2, textAlign: 'center',
        backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
        '&::before': { content: '""', position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)' }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1, color: '#fff', maxWidth: 800, mx: 'auto' }}>
          <Chip label="PREMIUM ITINERARY" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(4px)', fontWeight: 800, mb: 3 }} />
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {data.client?.tripTitle || `Best of ${data.client?.destination || 'Your Destination'}`}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
            {data.client?.days || 0} Days • Unforgettable Memories
          </Typography>
        </Box>
      </Box>

      {/* 2. FLOATING TRIP SUMMARY CARD */}
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 0 }, mt: -10, position: 'relative', zIndex: 10 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="900" color={c.text}>Trip Summary</Typography>
            <Chip size="small" label="Traveler Info" sx={{ bgcolor: '#fff7ed', color: '#ea580c', fontWeight: 700 }} />
          </Box>

          {/* Icon Row */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { icon: <Map />, label: 'Destination', val: data.client?.destination || 'Multi-City', color: '#f97316' },
              { icon: <CalendarMonth />, label: 'Dates', val: data.client?.startDate || 'TBD', color: '#0ea5e9' },
              { icon: <PeopleAlt />, label: 'Travelers', val: `${data.client?.adults || 0} Adults`, color: '#a855f7' },
              { icon: <Hotel />, label: 'Hotels', val: `${data.stay?.hotels?.length || 0} Stays`, color: '#10b981' }
            ].map((item, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box display="flex" gap={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: `${item.color}15`, color: item.color, width: 40, height: 40 }}>{item.icon}</Avatar>
                  <Box>
                    <Typography variant="caption" color={c.muted} display="block" fontWeight="600">{item.label}</Typography>
                    <Typography variant="body2" fontWeight="800" color={c.text}>{item.val}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Pricing Row */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Box display="flex" gap={4} mb={1}>
                <Typography variant="body2" color={c.muted}>Package Total</Typography>
                <Typography variant="body2" fontWeight="700">₹{math.subtotal.toLocaleString()}</Typography>
              </Box>
              <Box display="flex" gap={4}>
                <Typography variant="body2" color={c.muted}>Taxes (GST)</Typography>
                <Typography variant="body2" fontWeight="700">₹{math.gst.toLocaleString()}</Typography>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" color={c.accent} fontWeight="800" display="block">TOTAL AMOUNT</Typography>
              <Typography variant="h4" fontWeight="900" color={c.accent}>₹{math.grandTotal.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2, md: 0 }, mt: 8 }}>
        
        {/* 3. FLIGHT JOURNEY TIMELINE */}
        {data.transport?.flights?.length > 0 && (
          <Box sx={{ mb: 10 }}>
            <Typography variant="h5" fontWeight="900" color={c.text} textAlign="center" mb={1}>Your Flight Journey</Typography>
            <Typography variant="body2" color={c.muted} textAlign="center" mb={6}>Premium airline experience booked for you.</Typography>
            
            <Box sx={{ position: 'relative', ml: { xs: 2, md: '50%' } }}>
              {/* Center Line */}
              <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 2, bgcolor: '#fdba74', transform: { md: 'translateX(-50%)' }, '@media print': { display: 'none' } }} />

              {data.transport.flights.map((flight, i) => (
                <Box key={i} sx={{ position: 'relative', mb: 4, width: { md: '50%' }, ml: { md: i % 2 === 0 ? '-50%' : '50%' }, pr: { md: i % 2 === 0 ? 4 : 0 }, pl: { xs: 4, md: i % 2 === 0 ? 0 : 4 } }}>
                  {/* Node */}
                  <Avatar sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: { xs: -20, md: i % 2 === 0 ? 'auto' : -20 }, right: { md: i % 2 === 0 ? -20 : 'auto' }, width: 40, height: 40, bgcolor: c.accent, border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 2 }}>
                    <FlightTakeoff fontSize="small" />
                  </Avatar>

                  <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: `1px solid ${c.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="subtitle2" fontWeight="800" color={c.accent}>{flight.airline}</Typography>
                      <Chip label={flight.flightNo} size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 800 }} />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight="900">{flight.depFrom?.substring(0,3).toUpperCase()}</Typography>
                        <Typography variant="caption" color={c.muted}>{flight.depTime}</Typography>
                      </Box>
                      <Divider sx={{ flexGrow: 1, mx: 2, borderStyle: 'dashed' }} />
                      <Box textAlign="right">
                        <Typography variant="h6" fontWeight="900">{flight.arrAt?.substring(0,3).toUpperCase()}</Typography>
                        <Typography variant="caption" color={c.muted}>Arrival</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* 4. DAY-BY-DAY ITINERARY */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h5" fontWeight="900" color={c.text} textAlign="center" mb={1}>Day-by-Day Itinerary</Typography>
          <Typography variant="body2" color={c.muted} textAlign="center" mb={6}>Your daily schedule of curated experiences.</Typography>

          <Box sx={{ position: 'relative', pl: { xs: 2, md: 8 } }}>
            {/* Left Timeline Line */}
            <Box sx={{ position: 'absolute', top: 20, bottom: 0, left: { xs: 26, md: 24 }, width: 2, bgcolor: c.border }} />

            {data.days.map((day, i) => {
              const color = dayColors[i % dayColors.length];
              const dayImage = day.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
              
              return (
                <Box key={i} sx={{ position: 'relative', mb: 4, display: 'flex', gap: 3 }}>
                  {/* Day Marker */}
                  <Box sx={{ position: 'absolute', left: { xs: -16, md: -60 }, zIndex: 2 }}>
                    <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: color, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${color}40` }}>
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>DAY</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>{day.day || i + 1}</Typography>
                    </Box>
                  </Box>

                  {/* Day Card */}
                  <Paper elevation={0} sx={{ flexGrow: 1, ml: { xs: 6, md: 2 }, borderRadius: 3, border: `1px solid ${c.border}`, overflow: 'hidden', display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box sx={{ width: { xs: '100%', sm: 220 }, height: { xs: 150, sm: 'auto' }, backgroundImage: `url(${dayImage})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <Chip label={`Day ${day.day || i + 1}`} size="small" sx={{ position: 'absolute', top: 12, left: 12, bgcolor: color, color: '#fff', fontWeight: 800 }} />
                    </Box>
                    <Box sx={{ p: 3, flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="900" color={c.text} mb={1}>{day.title || 'Highlight of the Day'}</Typography>
                      <Typography variant="body2" color={c.muted} sx={{ lineHeight: 1.7, mb: 2 }}>{day.description}</Typography>
                      <Box display="flex" gap={3}>
                        <Typography variant="caption" fontWeight="700" color={c.text} display="flex" alignItems="center" gap={0.5}><LocalActivity fontSize="small" sx={{ color }} /> Activity Included</Typography>
                        <Typography variant="caption" fontWeight="700" color={c.text} display="flex" alignItems="center" gap={0.5}><Restaurant fontSize="small" sx={{ color }} /> Meals Arranged</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* 5. HOTEL ACCOMMODATIONS GRID */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h5" fontWeight="900" color={c.text} textAlign="center" mb={1}>Hotel Accommodations</Typography>
          <Typography variant="body2" color={c.muted} textAlign="center" mb={6}>Handpicked premium stays for your comfort.</Typography>

          <Grid container spacing={3}>
            {data.stay.hotels.map((hotel, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${c.border}`, overflow: 'hidden', height: '100%' }}>
                  <Box sx={{ height: 160, bgcolor: '#e2e8f0', backgroundImage: `url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <Chip label="Premium" size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#fff', color: c.text, fontWeight: 800 }} />
                  </Box>
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="subtitle1" fontWeight="900" color={c.text} mb={0.5} noWrap>{hotel.hotelName}</Typography>
                    <Typography variant="caption" color={c.muted} display="flex" alignItems="center" gap={0.5} mb={2}><LocationOn fontSize="inherit" /> {hotel.location}</Typography>
                    
                    <Box display="flex" gap={2} mb={2}>
                      <Box>
                        <Typography variant="caption" color={c.muted} display="block">Check In</Typography>
                        <Typography variant="body2" fontWeight="700">{hotel.checkInDate}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color={c.muted} display="block">Check Out</Typography>
                        <Typography variant="body2" fontWeight="700">{hotel.checkOutDate}</Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="caption" fontWeight="800" color={c.accent} display="block">{hotel.rooms}x {hotel.roomCat} Room</Typography>
                    <Typography variant="caption" color={c.text} display="block">{getMealString(hotel)}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 6. WHAT'S INCLUDED (Two Column Layout) */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h5" fontWeight="900" color={c.text} textAlign="center" mb={1}>What's Included</Typography>
          <Typography variant="body2" color={c.muted} textAlign="center" mb={6}>Transparent breakdown of your package.</Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #bbf7d0', overflow: 'hidden', height: '100%' }}>
                <Box sx={{ bgcolor: '#22c55e', color: '#fff', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle /> <Typography variant="subtitle1" fontWeight="800">Included in price</Typography>
                </Box>
                <List sx={{ p: 2 }}>
                  {data.inclExcl?.inclusions?.length > 0 ? data.inclExcl.inclusions.map((item, i) => (
                    <ListItem key={i} disablePadding sx={{ mb: 1 }}><ListItemIcon sx={{ minWidth: 32 }}><CheckCircle sx={{ color: '#22c55e', fontSize: 18 }} /></ListItemIcon><ListItemText primary={item} primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: c.text }} /></ListItem>
                  )) : <Typography variant="body2" color={c.muted} p={2}>Includes hotels, transfers, and mentioned activities.</Typography>}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #fecdd3', overflow: 'hidden', height: '100%' }}>
                <Box sx={{ bgcolor: '#ef4444', color: '#fff', p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cancel /> <Typography variant="subtitle1" fontWeight="800">Not Included</Typography>
                </Box>
                <List sx={{ p: 2 }}>
                  {data.inclExcl?.exclusions?.length > 0 ? data.inclExcl.exclusions.map((item, i) => (
                    <ListItem key={i} disablePadding sx={{ mb: 1 }}><ListItemIcon sx={{ minWidth: 32 }}><Cancel sx={{ color: '#ef4444', fontSize: 18 }} /></ListItemIcon><ListItemText primary={item} primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: c.text }} /></ListItem>
                  )) : <Typography variant="body2" color={c.muted} p={2}>Personal expenses, tips, and optional tours are excluded.</Typography>}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* 7. POLICIES & PROTECTION (Colored Grid Cards) */}
        <Box sx={{ mb: 10 }}>
          <Typography variant="h5" fontWeight="900" color={c.text} textAlign="center" mb={1}>Policies & Protection</Typography>
          <Typography variant="body2" color={c.muted} textAlign="center" mb={6}>Important terms for your booking.</Typography>

          <Grid container spacing={3}>
            {[
              { icon: <VerifiedUser />, title: 'Travel Protection', color: '#3b82f6', bg: '#eff6ff', desc: 'Standard protection against unexpected cancellations based on airline and hotel policies.' },
              { icon: <Payment />, title: 'Payment Terms', color: '#22c55e', bg: '#f0fdf4', desc: '50% advance required for confirmation. Balance due 15 days prior to departure.' },
              { icon: <AssignmentReturn />, title: 'Cancellation Policy', color: '#f97316', bg: '#fff7ed', desc: 'Free cancellation up to 30 days before travel. Partial charges apply thereafter.' },
              { icon: <Gavel />, title: 'Terms & Conditions', color: '#a855f7', bg: '#faf5ff', desc: 'Subject to standard ATOL/travel agency terms. Passports must be valid for 6 months.' },
            ].map((card, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Paper elevation={0} sx={{ borderRadius: 3, border: `1px solid ${card.color}40`, overflow: 'hidden', height: '100%' }}>
                  <Box sx={{ bgcolor: card.color, color: '#fff', p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {React.cloneElement(card.icon, { fontSize: 'small' })} <Typography variant="subtitle2" fontWeight="800">{card.title}</Typography>
                  </Box>
                  <Box sx={{ p: 3, bgcolor: card.bg, height: '100%' }}>
                    <Typography variant="body2" color={c.text} fontWeight="500">{card.desc}</Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

      </Box>
    </Box>
  );
}