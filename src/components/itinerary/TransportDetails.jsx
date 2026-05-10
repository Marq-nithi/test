import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, IconButton, 
  Checkbox, FormControlLabel, Collapse, InputAdornment, Divider
} from '@mui/material';
import { 
  Flight, Train, DirectionsBus, LocalTaxi, DeleteOutline, 
  KeyboardArrowUp, KeyboardArrowDown, Add 
} from '@mui/icons-material';

import { useItinerary } from '../../context/ItineraryContext'; 

// Exact Figma Field Label
const FieldLabel = ({ text, required }) => (
  <Typography variant="caption" sx={{ fontWeight: 600, color: '#334155', mb: 1, display: 'block', fontSize: '0.85rem' }}>
    {text} {required && <span style={{ color: '#ef4444' }}>*</span>}
  </Typography>
);

// Custom Styled Input matching your Figma aesthetic
const StyledTextField = (props) => (
  <TextField
    {...props}
    size="small"
    sx={{
      '& .MuiOutlinedInput-root': {
        bgcolor: '#fff',
        borderRadius: '8px',
        '& fieldset': { borderColor: '#e2e8f0', transition: 'all 0.2s ease-in-out' },
        '&:hover fieldset': { borderColor: '#cbd5e1' },
        '&.Mui-focused fieldset': { borderColor: '#0ea5e9', borderWidth: '1px' },
      },
      '& .MuiInputBase-input': { color: '#475569', fontSize: '0.875rem', fontWeight: 400 },
      '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#334155', bgcolor: '#f8fafc', borderRadius: '8px' },
      ...props.sx
    }}
  />
);

export default function TransportDetails() {
  const { transportData, setTransportData } = useItinerary();

  const [types, setTypes] = useState(
    transportData?.types !== undefined 
      ? transportData.types 
      : { flight: true, train: false, bus: false, private: false }
  );
  
  // Updated Flight state to match the exact pricing breakdown in Figma
  const emptyFlight = { 
    id: Date.now(), isOpen: true,
    depFrom: 'Mumbai', arrAt: 'Goa', airline: 'Air India', flightType: 'Connecting Flight',
    layovers: [{ location: 'Goa', duration: '2 Hours' }], 
    cabin: 'Economy', adults: 8, children: 1, infants: 1,
    depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00',
    duration: '3 hrs 2 min', priceAdult: 1000, priceChild: 1000, priceInfant: 1000,
    visaCountry: 'Mumbai', visaType: 'Goa', entryType: 'Air India', validity: 'Connecting Flight', visaDuration: 'Mumbai', notes: ''
  };

  const emptyTrain = { id: Date.now(), isOpen: true, depFrom: 'Mumbai', arrAt: 'Goa', passengers: 2, depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00', trainName: 'Indian Express', trainNo: 'AI 632', coach: 'First Class', notes: '' };
  const emptyBus = { id: Date.now(), isOpen: true, pickup: 'Mumbai', dropoff: 'Goa', passengers: 2, depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00', busName: 'Indian Express', classType: 'Sleeper', notes: '' };
  const emptyGround = { id: Date.now(), isOpen: true, pickup: 'Mumbai', dropoff: 'Goa', passengers: 2, depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00', vehicleType: 'Sedan', notes: '' };

  const normalizeFlights = (flights) => flights.map(f => ({
    ...f, layovers: f.layovers || [{ location: f.stopLocation || '', duration: f.layover || '' }]
  }));

  const [flights, setFlights] = useState(transportData?.flights?.length ? normalizeFlights(transportData.flights) : [emptyFlight]);
  const [trains, setTrains] = useState(transportData?.trains?.length ? transportData.trains : [emptyTrain]);
  const [buses, setBuses] = useState(transportData?.buses?.length ? transportData.buses : [emptyBus]);
  const [grounds, setGrounds] = useState(transportData?.grounds?.length ? transportData.grounds : [emptyGround]);

  useEffect(() => {
    if (setTransportData) setTransportData({ types, flights, trains, buses, grounds });
  }, [types, flights, trains, buses, grounds, setTransportData]);

  // Handlers
  const handleTypeToggle = (type) => setTypes(prev => ({ ...prev, [type]: !prev[type] }));
  const handleFlightChange = (id, field, value) => setFlights(flights.map(f => f.id === id ? { ...f, [field]: value } : f));
  const toggleFlightOpen = (id) => setFlights(flights.map(f => f.id === id ? { ...f, isOpen: !f.isOpen } : f));
  const handleAddLayover = (flightId) => setFlights(flights.map(f => f.id === flightId ? { ...f, layovers: [...f.layovers, { location: '', duration: '' }] } : f));
  const handleRemoveLayover = (flightId, index) => setFlights(flights.map(f => f.id === flightId ? { ...f, layovers: f.layovers.filter((_, i) => i !== index) } : f));
  const handleLayoverChange = (flightId, index, field, value) => setFlights(flights.map(f => f.id === flightId ? { ...f, layovers: f.layovers.map((l, i) => i === index ? { ...l, [field]: value } : l) } : f));

  // Handlers for others
  const handleTrainChange = (id, field, value) => setTrains(trains.map(t => t.id === id ? { ...t, [field]: value } : t));
  const toggleTrainOpen = (id) => setTrains(trains.map(t => t.id === id ? { ...t, isOpen: !t.isOpen } : t));
  const handleBusChange = (id, field, value) => setBuses(buses.map(b => b.id === id ? { ...b, [field]: value } : b));
  const toggleBusOpen = (id) => setBuses(buses.map(b => b.id === id ? { ...b, isOpen: !b.isOpen } : b));
  const handleGroundChange = (id, field, value) => setGrounds(grounds.map(g => g.id === id ? { ...g, [field]: value } : g));
  const toggleGroundOpen = (id) => setGrounds(grounds.map(g => g.id === id ? { ...g, isOpen: !g.isOpen } : g));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', bgcolor: '#f8fafc', minHeight: '100vh', pb: 12 }}>
      
      {/* TRANSPORT SELECTOR */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '12px', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={2}>Transport Type</Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <FormControlLabel control={<Checkbox checked={types.flight} onChange={() => handleTypeToggle('flight')} size="small" sx={{ '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><Flight fontSize="small" sx={{ color: '#0ea5e9' }} /> Flight</Box>} />
          <FormControlLabel control={<Checkbox checked={types.train} onChange={() => handleTypeToggle('train')} size="small" sx={{ '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><Train fontSize="small" sx={{ color: '#0ea5e9' }} /> Train</Box>} />
          <FormControlLabel control={<Checkbox checked={types.bus} onChange={() => handleTypeToggle('bus')} size="small" sx={{ '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><DirectionsBus fontSize="small" sx={{ color: '#0ea5e9' }} /> Bus</Box>} />
          <FormControlLabel control={<Checkbox checked={types.private} onChange={() => handleTypeToggle('private')} size="small" sx={{ '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><LocalTaxi fontSize="small" sx={{ color: '#0ea5e9' }} /> Ground Transport</Box>} />
        </Box>
      </Paper>

      {/* ==========================================
          FLIGHT DETAILS 
          ========================================== */}
      {types.flight && flights.map((flight) => {
        // Auto-calculate the total dynamically
        const totalPrice = (Number(flight.adults) * Number(flight.priceAdult)) + 
                           (Number(flight.children) * Number(flight.priceChild)) + 
                           (Number(flight.infants) * Number(flight.priceInfant));

        return (
          <Paper key={flight.id} elevation={0} sx={{ borderRadius: '12px', mb: 4, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
            
            {/* Card Header (Matches Figma completely) */}
            <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: flight.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleFlightOpen(flight.id)}>
              <Typography variant="h6" fontWeight="700" color="#0f172a" fontSize="1.1rem">
                 Flight Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                <Button variant="outlined" size="small" startIcon={<Add sx={{ fontSize: 18 }}/>} onClick={() => setFlights([...flights, { ...emptyFlight, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#334155', textTransform: 'none', borderRadius: '8px', px: 2, bgcolor: '#fff', fontWeight: 600 }}>Add</Button>
                <IconButton size="small" onClick={() => setFlights(flights.filter(f => f.id !== flight.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}><DeleteOutline fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => toggleFlightOpen(flight.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}>
                  {flight.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={flight.isOpen}>
              <Box sx={{ p: 4, pt: 2 }}>
                
                {/* Row 1 */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}><FieldLabel text="Departure From" required /><StyledTextField fullWidth value={flight.depFrom} onChange={(e) => handleFlightChange(flight.id, 'depFrom', e.target.value)}/></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Arrival At" required /><StyledTextField fullWidth value={flight.arrAt} onChange={(e) => handleFlightChange(flight.id, 'arrAt', e.target.value)}/></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Airline" required /><StyledTextField fullWidth value={flight.airline} onChange={(e) => handleFlightChange(flight.id, 'airline', e.target.value)}/></Grid>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Flight Type" required />
                    <StyledTextField fullWidth select SelectProps={{ native: true }} value={flight.flightType} onChange={(e) => handleFlightChange(flight.id, 'flightType', e.target.value)}>
                      <option value="Connecting Flight">Connecting Flight</option>
                      <option value="Direct Flight">Direct Flight</option>
                    </StyledTextField>
                  </Grid>
                </Grid>

                {/* Row 2: Dynamic Layovers */}
                {flight.flightType === 'Connecting Flight' && flight.layovers.map((layover, layoverIndex) => (
                  <Grid container spacing={3} mb={3} alignItems="flex-end" key={`layover-${layoverIndex}`}>
                    <Grid item xs={12} md={3}><FieldLabel text="Stop Location" required /><StyledTextField fullWidth value={layover.location} onChange={(e) => handleLayoverChange(flight.id, layoverIndex, 'location', e.target.value)}/></Grid>
                    <Grid item xs={12} md={3}><FieldLabel text="Layover Duration" required /><StyledTextField fullWidth value={layover.duration} onChange={(e) => handleLayoverChange(flight.id, layoverIndex, 'duration', e.target.value)}/></Grid>
                    <Grid item xs={12} md={2} sx={{ display: 'flex', gap: 1, pb: 0.2 }}>
                      <IconButton size="small" onClick={() => handleAddLayover(flight.id)} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', bgcolor: '#fff', width: 36, height: 36 }}><Add fontSize="small" sx={{ color: '#475569' }} /></IconButton>
                      <IconButton size="small" onClick={() => handleRemoveLayover(flight.id, layoverIndex)} sx={{ border: '1px solid #fecaca', bgcolor: '#fff', borderRadius: '8px', width: 36, height: 36 }}><DeleteOutline fontSize="small" sx={{ color: '#ef4444' }} /></IconButton>
                    </Grid>
                  </Grid>
                ))}

                {/* Row 3 */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Cabin Class" required />
                    <StyledTextField fullWidth select SelectProps={{ native: true }} value={flight.cabin} onChange={(e) => handleFlightChange(flight.id, 'cabin', e.target.value)}>
                      <option value="Economy">Economy</option>
                      <option value="Business">Premium economy</option>
                                            <option value="Business">Business class</option>
                      <option value="Business">1st class


</option>

                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Number of Adult" required /><StyledTextField fullWidth type="number" value={flight.adults} onChange={(e) => handleFlightChange(flight.id, 'adults', e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Number of Child" /><StyledTextField fullWidth type="number" value={flight.children} onChange={(e) => handleFlightChange(flight.id, 'children', e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Number of Infant" /><StyledTextField fullWidth type="number" value={flight.infants} onChange={(e) => handleFlightChange(flight.id, 'infants', e.target.value)} /></Grid>
                </Grid>

                {/* Row 4 */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}><FieldLabel text="Departure Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={flight.depDate} onChange={(e) => handleFlightChange(flight.id, 'depDate', e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Departure Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={flight.depTime} onChange={(e) => handleFlightChange(flight.id, 'depTime', e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Arrival Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={flight.arrDate} onChange={(e) => handleFlightChange(flight.id, 'arrDate', e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Arrival Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={flight.arrTime} onChange={(e) => handleFlightChange(flight.id, 'arrTime', e.target.value)} /></Grid>
                </Grid>

                {/* Row 5: Price breakdown mapping exact screenshot */}
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}><FieldLabel text="Duration (Auto-calculated)" /><StyledTextField fullWidth disabled value={flight.duration} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Ticket Price per Adult" /><StyledTextField fullWidth type="number" InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: '#64748b' }}>₹</InputAdornment> }} value={flight.priceAdult} onChange={(e) => handleFlightChange(flight.id, 'priceAdult', e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Ticket Price per Child" /><StyledTextField fullWidth type="number" InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: '#64748b' }}>₹</InputAdornment> }} value={flight.priceChild} onChange={(e) => handleFlightChange(flight.id, 'priceChild', e.target.value)} /></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Ticket Price per Infant" /><StyledTextField fullWidth type="number" InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: '#64748b' }}>₹</InputAdornment> }} value={flight.priceInfant} onChange={(e) => handleFlightChange(flight.id, 'priceInfant', e.target.value)} /></Grid>
                </Grid>

                {/* Row 6: Total Price */}
                <Grid container spacing={3} mb={5}>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Total Price" />
                    <StyledTextField fullWidth disabled value={totalPrice} InputProps={{ startAdornment: <InputAdornment position="start" sx={{ color: '#64748b' }}>₹</InputAdornment> }} />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* VISA DETAILS BOX */}
                <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Visa Details</Typography>
                
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Visa Country" required />
                    <StyledTextField fullWidth select SelectProps={{ native: true }} value={flight.visaCountry} onChange={(e) => handleFlightChange(flight.id, 'visaCountry', e.target.value)}>
                      <option value="Mumbai">Mumbai</option><option value="UAE">UAE</option>
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Visa Type" required />
                    <StyledTextField fullWidth select SelectProps={{ native: true }} value={flight.visaType} onChange={(e) => handleFlightChange(flight.id, 'visaType', e.target.value)}>
                      <option value="Goa">Goa</option><option value="Tourist">Tourist</option>
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Entry Type" required />
                    <StyledTextField fullWidth select SelectProps={{ native: true }} value={flight.entryType} onChange={(e) => handleFlightChange(flight.id, 'entryType', e.target.value)}>
                      <option value="Air India">Air India</option><option value="Single">Single</option>
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Validity" required />
                    <StyledTextField fullWidth select SelectProps={{ native: true }} value={flight.validity} onChange={(e) => handleFlightChange(flight.id, 'validity', e.target.value)}>
                      <option value="Connecting Flight">Connecting Flight</option><option value="30 Days">30 Days</option>
                    </StyledTextField>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}><FieldLabel text="Duration" required /><StyledTextField fullWidth value={flight.visaDuration} onChange={(e) => handleFlightChange(flight.id, 'visaDuration', e.target.value)} /></Grid>
                  <Grid item xs={12} md={9}><FieldLabel text="Add Notes" /><StyledTextField fullWidth placeholder="Type here..." value={flight.notes} onChange={(e) => handleFlightChange(flight.id, 'notes', e.target.value)} /></Grid>
                </Grid>

              </Box>
            </Collapse>
          </Paper>
        );
      })}

      {/* ==========================================
          TRAIN DETAILS 
          ========================================== */}
      {types.train && trains.map((train) => (
        <Paper key={train.id} elevation={0} sx={{ borderRadius: '12px', mb: 4, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
           <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: train.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleTrainOpen(train.id)}>
            <Typography variant="h6" fontWeight="700" color="#0f172a" fontSize="1.1rem">Train Details</Typography>
            <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
              <Button variant="outlined" size="small" startIcon={<Add sx={{ fontSize: 18 }}/>} onClick={() => setTrains([...trains, { ...emptyTrain, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#334155', textTransform: 'none', borderRadius: '8px', px: 2, bgcolor: '#fff', fontWeight: 600 }}>Add</Button>
              <IconButton size="small" onClick={() => setTrains(trains.filter(t => t.id !== train.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}><DeleteOutline fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => toggleTrainOpen(train.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}>
                {train.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={train.isOpen}>
            <Box sx={{ p: 4, pt: 2 }}>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure From" required /><StyledTextField fullWidth value={train.depFrom} onChange={(e) => handleTrainChange(train.id, 'depFrom', e.target.value)}/></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival At" required /><StyledTextField fullWidth value={train.arrAt} onChange={(e) => handleTrainChange(train.id, 'arrAt', e.target.value)}/></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Number of Passengers" required /><StyledTextField fullWidth type="number" value={train.passengers} onChange={(e) => handleTrainChange(train.id, 'passengers', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={train.depDate} onChange={(e) => handleTrainChange(train.id, 'depDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={train.depTime} onChange={(e) => handleTrainChange(train.id, 'depTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={train.arrDate} onChange={(e) => handleTrainChange(train.id, 'arrDate', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={train.arrTime} onChange={(e) => handleTrainChange(train.id, 'arrTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}>
                  <FieldLabel text="Train Name" required />
                  <StyledTextField fullWidth select SelectProps={{ native: true }} value={train.trainName} onChange={(e) => handleTrainChange(train.id, 'trainName', e.target.value)}>
                    <option value="Indian Express">Indian Express</option><option value="Rajdhani">Rajdhani</option>
                  </StyledTextField>
                </Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Train Number" required /><StyledTextField fullWidth value={train.trainNo} onChange={(e) => handleTrainChange(train.id, 'trainNo', e.target.value)}/></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                  <FieldLabel text="Coach Class" />
                  <StyledTextField fullWidth select SelectProps={{ native: true }} value={train.coach} onChange={(e) => handleTrainChange(train.id, 'coach', e.target.value)}>
                    <option value="First Class">1A – First AC (Luxury, Private Cabins)</option><option value="2A">2A – Second AC (Comfortable, 2-Tier)</option><option value="3A">3A – Third AC (Budget AC)</option><option value="Sleeper">SL – Sleeper (Non-AC)</option>
                  </StyledTextField>
                </Grid>
              </Grid>
              <Box>
                <FieldLabel text="Add Notes" />
                <StyledTextField fullWidth placeholder="Type here..." value={train.notes} onChange={(e) => handleTrainChange(train.id, 'notes', e.target.value)} />
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

      {/* ==========================================
          BUS DETAILS 
          ========================================== */}
      {types.bus && buses.map((bus) => (
        <Paper key={bus.id} elevation={0} sx={{ borderRadius: '12px', mb: 4, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
           <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: bus.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleBusOpen(bus.id)}>
            <Typography variant="h6" fontWeight="700" color="#0f172a" fontSize="1.1rem">Bus Details</Typography>
            <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
              <Button variant="outlined" size="small" startIcon={<Add sx={{ fontSize: 18 }}/>} onClick={() => setBuses([...buses, { ...emptyBus, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#334155', textTransform: 'none', borderRadius: '8px', px: 2, bgcolor: '#fff', fontWeight: 600 }}>Add</Button>
              <IconButton size="small" onClick={() => setBuses(buses.filter(b => b.id !== bus.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}><DeleteOutline fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => toggleBusOpen(bus.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}>
                {bus.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={bus.isOpen}>
            <Box sx={{ p: 4, pt: 2 }}>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Pickup Location" required /><StyledTextField fullWidth value={bus.pickup} onChange={(e) => handleBusChange(bus.id, 'pickup', e.target.value)}/></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Drop-off Location" required /><StyledTextField fullWidth value={bus.dropoff} onChange={(e) => handleBusChange(bus.id, 'dropoff', e.target.value)}/></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Number of Passengers" required /><StyledTextField fullWidth type="number" value={bus.passengers} onChange={(e) => handleBusChange(bus.id, 'passengers', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={bus.depDate} onChange={(e) => handleBusChange(bus.id, 'depDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={bus.depTime} onChange={(e) => handleBusChange(bus.id, 'depTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={bus.arrDate} onChange={(e) => handleBusChange(bus.id, 'arrDate', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={bus.arrTime} onChange={(e) => handleBusChange(bus.id, 'arrTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Bus Name" required /><StyledTextField fullWidth value={bus.busName} onChange={(e) => handleBusChange(bus.id, 'busName', e.target.value)}/></Grid>
                <Grid item xs={12} md={4}>
                  <FieldLabel text="Class Type" />
                  <StyledTextField fullWidth select SelectProps={{ native: true }} value={bus.classType} onChange={(e) => handleBusChange(bus.id, 'classType', e.target.value)}>
                    <option value="Sleeper">Sleeper</option><option value="Semi-Sleeper">1A – First AC (Luxury, Private Cabins)</option><option value="Seater">2A – Second AC (Comfortable, 2-Tier)
</option>
                    <option value="Sleeper">Sleeper</option><option value="Semi-Sleeper">1A – First AC (Luxury, Private Cabins)</option><option value="Seater">SL – Sleeper (Non-AC)</option>
                    <option value="Sleeper">Sleeper</option><option value="Semi-Sleeper">1A – First AC (Luxury, Private Cabins)</option><option value="Seater">CC – Chair Car (Seating)</option>
                  </StyledTextField>
                </Grid>
              </Grid>
              <Box>
                <FieldLabel text="Add Notes" />
                <StyledTextField fullWidth placeholder="Type here..." value={bus.notes} onChange={(e) => handleBusChange(bus.id, 'notes', e.target.value)} />
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

      {/* ==========================================
          GROUND TRANSPORTATION 
          ========================================== */}
      {types.private && grounds.map((ground) => (
        <Paper key={ground.id} elevation={0} sx={{ borderRadius: '12px', mb: 4, border: '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
           <Box sx={{ px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: ground.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleGroundOpen(ground.id)}>
            <Typography variant="h6" fontWeight="700" color="#0f172a" fontSize="1.1rem">Ground Transportation</Typography>
            <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
              <Button variant="outlined" size="small" startIcon={<Add sx={{ fontSize: 18 }}/>} onClick={() => setGrounds([...grounds, { ...emptyGround, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#334155', textTransform: 'none', borderRadius: '8px', px: 2, bgcolor: '#fff', fontWeight: 600 }}>Add</Button>
              <IconButton size="small" onClick={() => setGrounds(grounds.filter(g => g.id !== ground.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}><DeleteOutline fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => toggleGroundOpen(ground.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: '8px', width: 32, height: 32 }}>
                {ground.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={ground.isOpen}>
            <Box sx={{ p: 4, pt: 2 }}>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Pickup Location" required /><StyledTextField fullWidth value={ground.pickup} onChange={(e) => handleGroundChange(ground.id, 'pickup', e.target.value)}/></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Drop-off Location" required /><StyledTextField fullWidth value={ground.dropoff} onChange={(e) => handleGroundChange(ground.id, 'dropoff', e.target.value)}/></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Number of Passengers" required /><StyledTextField fullWidth type="number" value={ground.passengers} onChange={(e) => handleGroundChange(ground.id, 'passengers', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={ground.depDate} onChange={(e) => handleGroundChange(ground.id, 'depDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={ground.depTime} onChange={(e) => handleGroundChange(ground.id, 'depTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Date" required /><StyledTextField fullWidth type="date" InputLabelProps={{ shrink: true }} value={ground.arrDate} onChange={(e) => handleGroundChange(ground.id, 'arrDate', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Time" required /><StyledTextField fullWidth type="time" InputLabelProps={{ shrink: true }} value={ground.arrTime} onChange={(e) => handleGroundChange(ground.id, 'arrTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}>
                  <FieldLabel text="Vehicle Type" required />
                  <StyledTextField fullWidth select SelectProps={{ native: true }} value={ground.vehicleType} onChange={(e) => handleGroundChange(ground.id, 'vehicleType', e.target.value)}>
                    <option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Van">Van</option>
                  </StyledTextField>
                </Grid>
              </Grid>
              <Box>
                <FieldLabel text="Add Notes" />
                <StyledTextField fullWidth placeholder="Type here..." value={ground.notes} onChange={(e) => handleGroundChange(ground.id, 'notes', e.target.value)} />
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

    </Box>
  );
}