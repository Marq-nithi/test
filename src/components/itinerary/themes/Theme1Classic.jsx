import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Chip } from '@mui/material';
import { 
  FlightTakeoff, Hotel, LocationOn, CalendarToday, PeopleAlt, 
  CheckCircle, Cancel, DirectionsCar, Train, DirectionsBus
} from '@mui/icons-material';

const DetailItem = ({ label, value }) => (
  <Box mb={2}>
    <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body1" fontWeight="600" color="#0f172a">
      {value || '—'}
    </Typography>
  </Box>
);

export default function Theme1Classic({ data, math }) {
  const { client, days, stay, transport, price, inclExcl, terms } = data;

  // 🚨 BULLETPROOF HELPER: Handles Arrays OR Objects seamlessly for Inclusions/Exclusions
  const getActiveItems = (inputData) => {
    if (!inputData) return [];
    // If it's already an array of strings, just return it
    if (Array.isArray(inputData)) return inputData;
    // If it's a boolean object { accommodation: true, guide: false }
    if (typeof inputData === 'object') {
      return Object.entries(inputData)
        .filter(([_, isActive]) => isActive === true)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())); // Formats "travelInsurance" to "Travel Insurance"
    }
    return [];
  };
  
  const activeInclusions = getActiveItems(inclExcl?.inclusions);
  const activeExclusions = getActiveItems(inclExcl?.exclusions);

  // 🚨 BULLETPROOF TERMS FORMATTER
  // Checks if terms is our new detailed Object, or just a legacy Array/String
  const renderTerms = () => {
    // If it's missing
    if (!terms) return <Typography variant="body2" color="#64748b">No terms provided.</Typography>;

    // If it's a simple string (from older context)
    if (typeof terms === 'string' && terms.trim() !== '') {
      return (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="#475569" sx={{ whiteSpace: 'pre-line' }}>{terms}</Typography>
        </Box>
      );
    }

    // If it's a simple array
    if (Array.isArray(terms) && terms.length > 0) {
      return (
        <Box sx={{ mb: 3 }}>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '0.875rem' }}>
            {terms.map((text, i) => <li key={i} style={{ marginBottom: '4px' }}>{text}</li>)}
          </ul>
        </Box>
      );
    }

    // If it's our new structured Object from the new TermsAndConditions component
    const structuredSections = [
      { title: 'General Terms', data: [...(terms.terms || []), ...(terms.customTerms || [])] },
      { title: 'Cancellation Policy', data: [...(terms.policies || []), ...(terms.customPolicies || [])] },
      { title: 'Payment Terms', data: [...(terms.payments || []), ...(terms.customPayments || [])] },
      { title: 'Travel Protection', data: [...(terms.protections || []), ...(terms.customProtections || [])] }
    ];

    // Check if ALL sections are empty
    const hasAnyTerms = structuredSections.some(section => section.data.length > 0);
    if (!hasAnyTerms) {
      return <Typography variant="body2" color="#64748b">No terms selected.</Typography>;
    }

    return structuredSections.map((section, idx) => (
      section.data.length > 0 && (
        <Box key={idx} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="800" color="#334155" mb={1}>{section.title}</Typography>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#475569', fontSize: '0.875rem' }}>
            {section.data.map((text, i) => <li key={i} style={{ marginBottom: '4px' }}>{text}</li>)}
          </ul>
        </Box>
      )
    ));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: '#fff', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)', borderRadius: 2 }}>
      
      {/* 1. HERO & CLIENT DETAILS */}
      <Box sx={{ bgcolor: '#0f172a', color: '#fff', p: 5, borderRadius: 3, mb: 4, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', right: -50, top: -50, width: 200, height: 200, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        
        <Typography variant="caption" sx={{ color: '#0ea5e9', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
          Prepared For {client.title || ''} {client.name || 'Valued Client'}
        </Typography>
        <Typography variant="h3" fontWeight="900" mt={1} mb={2}>
          {client.destination || 'Your Dream Destination'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<CalendarToday sx={{ fontSize: 16, color: '#0f172a' }} />} label={`${client.nights || 0}N / ${client.days || 0}D`} sx={{ bgcolor: '#fff', fontWeight: 700 }} />
          <Chip icon={<PeopleAlt sx={{ fontSize: 16, color: '#0f172a' }} />} label={`${client.adults || 0} Adults, ${client.children || 0} Children`} sx={{ bgcolor: '#fff', fontWeight: 700 }} />
        </Box>
      </Box>

      {/* 2. DAY PLANNER */}
      {days.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={3} display="flex" alignItems="center" gap={1}>
            <LocationOn sx={{ color: '#0ea5e9' }} /> Itinerary Overview
          </Typography>
          
          <Box sx={{ ml: 2, pl: 4, borderLeft: '2px solid #e2e8f0', position: 'relative' }}>
            {days.map((day, index) => (
              <Box key={day.id || index} sx={{ mb: index === days.length - 1 ? 0 : 5, position: 'relative' }}>
                <Box sx={{ position: 'absolute', left: -41, top: 0, width: 14, height: 14, borderRadius: '50%', bgcolor: '#0ea5e9', border: '3px solid #fff', boxShadow: '0 0 0 1px #0ea5e9' }} />
                
                <Typography variant="caption" fontWeight="800" color="#0ea5e9" textTransform="uppercase" letterSpacing={1}>Day {day.dayNumber}</Typography>
                <Typography variant="h6" fontWeight="800" color="#0f172a" mb={1}>{day.title || 'Untitled Day'}</Typography>
                <Typography variant="body2" color="#475569" sx={{ whiteSpace: 'pre-line', mb: 2 }}>{day.description}</Typography>
                
                {day.images && day.images.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                    {day.images.map((img, i) => (
                      <Box key={i} sx={{ width: 120, height: 80, borderRadius: 2, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={img} alt={`Day ${day.dayNumber}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* 3. STAY DETAILS */}
      {stay.hotels && stay.hotels.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={3} display="flex" alignItems="center" gap={1}>
            <Hotel sx={{ color: '#0ea5e9' }} /> Accommodation
          </Typography>
          <Grid container spacing={3}>
            {stay.hotels.map((hotel, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="h6" fontWeight="800" color="#0f172a" mb={0.5}>{hotel.hotelName || 'Hotel Name'}</Typography>
                  <Typography variant="body2" color="#64748b" mb={2}>{hotel.location || 'Location'}</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><DetailItem label="Check-In" value={hotel.checkInDate} /></Grid>
                    <Grid item xs={6}><DetailItem label="Check-Out" value={hotel.checkOutDate} /></Grid>
                    <Grid item xs={6}><DetailItem label="Room Type" value={hotel.roomCat} /></Grid>
                    <Grid item xs={6}><DetailItem label="Rooms / Nights" value={`${hotel.rooms || 1} Room(s) / ${hotel.nights || 1} Night(s)`} /></Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* 4. TRANSPORT DETAILS */}
      {transport.types && Object.values(transport.types).some(Boolean) && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={3} display="flex" alignItems="center" gap={1}>
            <FlightTakeoff sx={{ color: '#0ea5e9' }} /> Transportation
          </Typography>

          {transport.types.flight && transport.flights?.map((flight, index) => (
            <Paper key={index} elevation={0} sx={{ p: 3, mb: 2, border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ bgcolor: '#e0f2fe', p: 1.5, borderRadius: 2 }}><FlightTakeoff sx={{ color: '#0ea5e9' }} /></Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="800">{flight.airline} • {flight.cabin}</Typography>
                <Typography variant="body2" color="#64748b">{flight.depFrom} ({flight.depTime}) ➔ {flight.arrAt} ({flight.arrTime})</Typography>
                <Typography variant="caption" color="#94a3b8">{flight.depDate}</Typography>
              </Box>
            </Paper>
          ))}

          {transport.types.train && transport.trains?.map((train, index) => (
            <Paper key={index} elevation={0} sx={{ p: 3, mb: 2, border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ bgcolor: '#f1f5f9', p: 1.5, borderRadius: 2 }}><Train sx={{ color: '#475569' }} /></Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="800">{train.trainName} ({train.trainNo}) • {train.coach}</Typography>
                <Typography variant="body2" color="#64748b">{train.depFrom} ({train.depTime}) ➔ {train.arrAt} ({train.arrTime})</Typography>
              </Box>
            </Paper>
          ))}

          {transport.types.private && transport.grounds?.map((ground, index) => (
            <Paper key={index} elevation={0} sx={{ p: 3, mb: 2, border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ bgcolor: '#f1f5f9', p: 1.5, borderRadius: 2 }}><DirectionsCar sx={{ color: '#475569' }} /></Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" fontWeight="800">{ground.vehicleType} Transfer</Typography>
                <Typography variant="body2" color="#64748b">Pickup: {ground.pickup} ({ground.depTime}) ➔ Dropoff: {ground.dropoff}</Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* 5. INCLUSIONS & EXCLUSIONS */}
      <Box sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="800" color="#0f172a" mb={2}>Inclusions</Typography>
            <Box sx={{ bgcolor: '#f0fdf4', p: 3, borderRadius: 2, border: '1px solid #bbf7d0' }}>
              {activeInclusions.length > 0 ? activeInclusions.map((inc, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle sx={{ color: '#16a34a', fontSize: 18 }} />
                  <Typography variant="body2" fontWeight="600" color="#166534">{inc}</Typography>
                </Box>
              )) : <Typography variant="body2" color="#166534">No specific inclusions selected.</Typography>}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="800" color="#0f172a" mb={2}>Exclusions</Typography>
            <Box sx={{ bgcolor: '#fef2f2', p: 3, borderRadius: 2, border: '1px solid #fecaca' }}>
              {activeExclusions.length > 0 ? activeExclusions.map((exc, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Cancel sx={{ color: '#dc2626', fontSize: 18 }} />
                  <Typography variant="body2" fontWeight="600" color="#991b1b">{exc}</Typography>
                </Box>
              )) : <Typography variant="body2" color="#991b1b">No specific exclusions selected.</Typography>}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 6. PRICE DETAILS */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" fontWeight="900" color="#0f172a" mb={3}>Pricing Summary</Typography>
        <Paper elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
          {price.items && price.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #f1f5f9' }}>
              <Box>
                <Typography variant="subtitle2" fontWeight="700">{item.category}</Typography>
                <Typography variant="caption" color="#64748b">{item.description}</Typography>
              </Box>
              <Typography variant="body2" fontWeight="600">
                {item.quantity} x ${item.unitPrice}
              </Typography>
            </Box>
          ))}
          
          <Box sx={{ bgcolor: '#f8fafc', p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="#64748b">Subtotal</Typography>
              <Typography variant="body2" fontWeight="600">${math.subtotal?.toFixed(2) || '0.00'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="#64748b">Taxes (GST & Service)</Typography>
              <Typography variant="body2" fontWeight="600">${((math.gst || 0) + (math.serviceTax || 0)).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="#ef4444">Discount</Typography>
              <Typography variant="body2" fontWeight="600" color="#ef4444">-${math.discount?.toFixed(2) || '0.00'}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="800">Grand Total</Typography>
              <Typography variant="h5" fontWeight="900" color="#10b981">${math.grandTotal?.toFixed(2) || '0.00'}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* 7. TERMS & CONDITIONS */}
      <Box>
        <Typography variant="h5" fontWeight="900" color="#0f172a" mb={3}>Terms & Conditions</Typography>
        {renderTerms()}
      </Box>

    </Box>
  );
}