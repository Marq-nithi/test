import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, IconButton, 
  Checkbox, FormControlLabel, MenuItem, Collapse, InputAdornment, Divider
} from '@mui/material';
import { 
  Flight, Train, DirectionsBus, LocalTaxi, DeleteOutline, 
  KeyboardArrowUp, KeyboardArrowDown, Add 
} from '@mui/icons-material';

import { useItinerary } from '../../context/ItineraryContext'; 

// Clean, Figma-style Field Label
const FieldLabel = ({ text, required }) => (
  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block', fontSize: '0.75rem' }}>
    {text} {required && <span style={{ color: '#ef4444' }}>*</span>}
  </Typography>
);

export default function TransportDetails() {
  const { transportData, setTransportData } = useItinerary();

  const [types, setTypes] = useState(
    transportData?.types !== undefined 
      ? transportData.types 
      : { flight: true, train: false, bus: false, private: false }
  );
  
  // Empty states matching the Figma placeholders
  const emptyFlight = { 
    id: Date.now(), isOpen: true,
    depFrom: 'Mumbai', arrAt: 'Goa', airline: 'Air India', flightType: 'Connecting Flight',
    layovers: [{ location: 'Goa', duration: '' }], 
    cabin: 'Economy', adults: 8, children: 1, infants: 1,
    depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00',
    duration: '3 hrs 2 min', pricePerPerson: 1000,
    visaCountry: 'Mumbai', visaType: 'Goa', entryType: 'Air India', validity: 'Connecting Flight', visaDuration: 'Mumbai', notes: ''
  };

  const emptyTrain = { 
    id: Date.now(), isOpen: true, 
    depFrom: 'Mumbai', arrAt: 'Goa', passengers: 2, 
    depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00', 
    trainName: 'Indian Express', trainNo: 'AI 632', coach: 'First Class', notes: '' 
  };

  const emptyBus = { 
    id: Date.now(), isOpen: true, 
    pickup: 'Mumbai', dropoff: 'Goa', passengers: 2, 
    depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00', 
    busName: 'Indian Express', classType: 'Sleeper', notes: '' 
  };

  const emptyGround = { 
    id: Date.now(), isOpen: true, 
    pickup: 'Mumbai', dropoff: 'Goa', passengers: 2, 
    depDate: '', depTime: '15:00', arrDate: '', arrTime: '15:00', 
    vehicleType: 'Sedan', notes: '' 
  };

  const normalizeFlights = (flights) => flights.map(f => ({
    ...f, layovers: f.layovers || [{ location: f.stopLocation || '', duration: f.layover || '' }]
  }));

  // State initialization
  const [flights, setFlights] = useState(transportData?.flights?.length ? normalizeFlights(transportData.flights) : [emptyFlight]);
  const [trains, setTrains] = useState(transportData?.trains?.length ? transportData.trains : [emptyTrain]);
  const [buses, setBuses] = useState(transportData?.buses?.length ? transportData.buses : [emptyBus]);
  const [grounds, setGrounds] = useState(transportData?.grounds?.length ? transportData.grounds : [emptyGround]);

  // Sync to context
  useEffect(() => {
    if (setTransportData) {
      setTransportData({ types, flights, trains, buses, grounds });
    }
  }, [types, flights, trains, buses, grounds, setTransportData]);

  // Type Toggle Handler
  const handleTypeToggle = (type) => setTypes(prev => ({ ...prev, [type]: !prev[type] }));

  // Flight Handlers
  const handleFlightChange = (id, field, value) => setFlights(flights.map(f => f.id === id ? { ...f, [field]: value } : f));
  const toggleFlightOpen = (id) => setFlights(flights.map(f => f.id === id ? { ...f, isOpen: !f.isOpen } : f));
  const handleAddLayover = (flightId) => setFlights(flights.map(f => f.id === flightId ? { ...f, layovers: [...f.layovers, { location: '', duration: '' }] } : f));
  const handleRemoveLayover = (flightId, index) => setFlights(flights.map(f => f.id === flightId ? { ...f, layovers: f.layovers.filter((_, i) => i !== index) } : f));
  const handleLayoverChange = (flightId, index, field, value) => setFlights(flights.map(f => f.id === flightId ? { ...f, layovers: f.layovers.map((l, i) => i === index ? { ...l, [field]: value } : l) } : f));

  // Train Handlers
  const handleTrainChange = (id, field, value) => setTrains(trains.map(t => t.id === id ? { ...t, [field]: value } : t));
  const toggleTrainOpen = (id) => setTrains(trains.map(t => t.id === id ? { ...t, isOpen: !t.isOpen } : t));

  // Bus Handlers
  const handleBusChange = (id, field, value) => setBuses(buses.map(b => b.id === id ? { ...b, [field]: value } : b));
  const toggleBusOpen = (id) => setBuses(buses.map(b => b.id === id ? { ...b, isOpen: !b.isOpen } : b));

  // Ground Transport Handlers
  const handleGroundChange = (id, field, value) => setGrounds(grounds.map(g => g.id === id ? { ...g, [field]: value } : g));
  const toggleGroundOpen = (id) => setGrounds(grounds.map(g => g.id === id ? { ...g, isOpen: !g.isOpen } : g));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', bgcolor: '#f8fafc', minHeight: '100vh', pb: 12 }}>
      
      {/* TRANSPORT SELECTOR */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={2}>Transport Type</Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <FormControlLabel control={<Checkbox checked={types.flight} onChange={() => handleTypeToggle('flight')} size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><Flight fontSize="small" sx={{ color: '#0ea5e9' }} /> Flight</Box>} />
          <FormControlLabel control={<Checkbox checked={types.train} onChange={() => handleTypeToggle('train')} size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><Train fontSize="small" sx={{ color: '#0ea5e9' }} /> Train</Box>} />
          <FormControlLabel control={<Checkbox checked={types.bus} onChange={() => handleTypeToggle('bus')} size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><DirectionsBus fontSize="small" sx={{ color: '#0ea5e9' }} /> Bus</Box>} />
          <FormControlLabel control={<Checkbox checked={types.private} onChange={() => handleTypeToggle('private')} size="small" />} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}><LocalTaxi fontSize="small" sx={{ color: '#0ea5e9' }} /> Ground Transport</Box>} />
        </Box>
      </Paper>

      {/* ==========================================
          FLIGHT DETAILS 
          ========================================== */}
      {types.flight && flights.map((flight) => (
        <Paper key={flight.id} elevation={0} sx={{ borderRadius: 2, mb: 4, border: flight.isOpen ? '2px solid #0ea5e9' : '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
          
          <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: flight.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleFlightOpen(flight.id)}>
            <Typography variant="h6" fontWeight="800" color="#0f172a" fontSize="1.1rem">Flight Details</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }} onClick={(e) => e.stopPropagation()}>
              <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => setFlights([...flights, { ...emptyFlight, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#475569', bgcolor: '#fff', textTransform: 'none', fontWeight: 600 }}>Add</Button>
              <IconButton size="small" onClick={() => setFlights(flights.filter(f => f.id !== flight.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fef2f2', borderRadius: 1.5 }}><DeleteOutline fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => toggleFlightOpen(flight.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: 1.5 }}>
                {flight.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={flight.isOpen}>
            <Box sx={{ p: 4, pt: 3 }}>
              {/* Flight Rows (Kept exact same as previous) */}
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={3}><FieldLabel text="Departure From" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.depFrom} onChange={(e) => handleFlightChange(flight.id, 'depFrom', e.target.value)}><option>Mumbai</option><option>Delhi</option></TextField></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Arrival At" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.arrAt} onChange={(e) => handleFlightChange(flight.id, 'arrAt', e.target.value)}><option>Goa</option><option>Chennai</option></TextField></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Airline" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.airline} onChange={(e) => handleFlightChange(flight.id, 'airline', e.target.value)}><option>Air India</option><option>IndiGo</option></TextField></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Flight Type" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.flightType} onChange={(e) => handleFlightChange(flight.id, 'flightType', e.target.value)}><option>Connecting Flight</option><option>Direct Flight</option></TextField></Grid>
              </Grid>

              {flight.flightType === 'Connecting Flight' && flight.layovers.map((layover, layoverIndex) => (
                <Grid container spacing={3} mb={3} alignItems="flex-end" key={`layover-${layoverIndex}`}>
                  <Grid item xs={12} md={3}><FieldLabel text="Stop Location" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={layover.location} onChange={(e) => handleLayoverChange(flight.id, layoverIndex, 'location', e.target.value)}><option>Goa</option><option>Dubai</option></TextField></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Layover Duration" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={layover.duration} onChange={(e) => handleLayoverChange(flight.id, layoverIndex, 'duration', e.target.value)}><option>Goa</option><option>2 hrs</option></TextField></Grid>
                  <Grid item xs={12} md={2} sx={{ display: 'flex', gap: 1, pb: 0.2 }}>
                    <IconButton size="small" onClick={() => handleAddLayover(flight.id)} sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5, bgcolor: '#fff' }}><Add fontSize="small" sx={{ color: '#475569' }} /></IconButton>
                    <IconButton size="small" onClick={() => handleRemoveLayover(flight.id, layoverIndex)} sx={{ border: '1px solid #fecaca', bgcolor: '#fef2f2', borderRadius: 1.5 }}><DeleteOutline fontSize="small" sx={{ color: '#ef4444' }} /></IconButton>
                  </Grid>
                </Grid>
              ))}

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={3}><FieldLabel text="Cabin Class" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.cabin} onChange={(e) => handleFlightChange(flight.id, 'cabin', e.target.value)}><option>Economy</option><option>Business</option></TextField></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Number of Adult" required /><TextField fullWidth type="number" size="small" value={flight.adults} onChange={(e) => handleFlightChange(flight.id, 'adults', e.target.value)} /></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Number of Child" /><TextField fullWidth type="number" size="small" value={flight.children} onChange={(e) => handleFlightChange(flight.id, 'children', e.target.value)} /></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Number of Infant" /><TextField fullWidth type="number" size="small" value={flight.infants} onChange={(e) => handleFlightChange(flight.id, 'infants', e.target.value)} /></Grid>
              </Grid>

              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={3}><FieldLabel text="Departure Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={flight.depDate} onChange={(e) => handleFlightChange(flight.id, 'depDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Departure Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={flight.depTime} onChange={(e) => handleFlightChange(flight.id, 'depTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Arrival Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={flight.arrDate} onChange={(e) => handleFlightChange(flight.id, 'arrDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={3}><FieldLabel text="Arrival Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={flight.arrTime} onChange={(e) => handleFlightChange(flight.id, 'arrTime', e.target.value)} /></Grid>
              </Grid>

              {/* Visa Details Box */}
              <Box sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0', mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Visa Details</Typography>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} md={3}><FieldLabel text="Visa Country" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.visaCountry} onChange={(e) => handleFlightChange(flight.id, 'visaCountry', e.target.value)}><option>Mumbai</option><option>UAE</option></TextField></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Visa Type" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.visaType} onChange={(e) => handleFlightChange(flight.id, 'visaType', e.target.value)}><option>Goa</option><option>Tourist</option></TextField></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Entry Type" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.entryType} onChange={(e) => handleFlightChange(flight.id, 'entryType', e.target.value)}><option>Air India</option><option>Single</option></TextField></Grid>
                  <Grid item xs={12} md={3}><FieldLabel text="Validity" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={flight.validity} onChange={(e) => handleFlightChange(flight.id, 'validity', e.target.value)}><option>Connecting Flight</option><option>30 Days</option></TextField></Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}><FieldLabel text="Duration" required /><TextField fullWidth size="small" value={flight.visaDuration} onChange={(e) => handleFlightChange(flight.id, 'visaDuration', e.target.value)} /></Grid>
                  <Grid item xs={12} md={9}><FieldLabel text="Add Notes" /><TextField fullWidth size="small" placeholder="Type here..." value={flight.notes} onChange={(e) => handleFlightChange(flight.id, 'notes', e.target.value)} /></Grid>
                </Grid>
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

      {/* ==========================================
          TRAIN DETAILS 
          ========================================== */}
      {types.train && trains.map((train) => (
        <Paper key={train.id} elevation={0} sx={{ borderRadius: 2, mb: 4, border: train.isOpen ? '2px solid #0ea5e9' : '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
           <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: train.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleTrainOpen(train.id)}>
            <Typography variant="h6" fontWeight="800" color="#0f172a" fontSize="1.1rem">Train Details</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }} onClick={(e) => e.stopPropagation()}>
              <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => setTrains([...trains, { ...emptyTrain, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#475569', bgcolor: '#fff', textTransform: 'none', fontWeight: 600 }}>Add</Button>
              <IconButton size="small" onClick={() => setTrains(trains.filter(t => t.id !== train.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fef2f2', borderRadius: 1.5 }}><DeleteOutline fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => toggleTrainOpen(train.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: 1.5 }}>
                {train.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={train.isOpen}>
            <Box sx={{ p: 4, pt: 3 }}>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure From" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={train.depFrom} onChange={(e) => handleTrainChange(train.id, 'depFrom', e.target.value)}><option>Mumbai</option><option>Delhi</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival At" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={train.arrAt} onChange={(e) => handleTrainChange(train.id, 'arrAt', e.target.value)}><option>Goa</option><option>Chennai</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Number of Passengers" required /><TextField fullWidth type="number" size="small" value={train.passengers} onChange={(e) => handleTrainChange(train.id, 'passengers', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={train.depDate} onChange={(e) => handleTrainChange(train.id, 'depDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={train.depTime} onChange={(e) => handleTrainChange(train.id, 'depTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={train.arrDate} onChange={(e) => handleTrainChange(train.id, 'arrDate', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={train.arrTime} onChange={(e) => handleTrainChange(train.id, 'arrTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Train Name" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={train.trainName} onChange={(e) => handleTrainChange(train.id, 'trainName', e.target.value)}><option>Indian Express</option><option>Rajdhani</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Train Number" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={train.trainNo} onChange={(e) => handleTrainChange(train.id, 'trainNo', e.target.value)}><option>AI 632</option><option>12951</option></TextField></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Coach Class" /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={train.coach} onChange={(e) => handleTrainChange(train.id, 'coach', e.target.value)}><option>First Class</option><option>2A</option><option>3A</option><option>Sleeper</option></TextField></Grid>
              </Grid>
              <Box>
                <FieldLabel text="Add Notes" />
                <TextField fullWidth size="small" placeholder="Type here..." value={train.notes} onChange={(e) => handleTrainChange(train.id, 'notes', e.target.value)} />
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

      {/* ==========================================
          BUS DETAILS 
          ========================================== */}
      {types.bus && buses.map((bus) => (
        <Paper key={bus.id} elevation={0} sx={{ borderRadius: 2, mb: 4, border: bus.isOpen ? '2px solid #0ea5e9' : '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
           <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: bus.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleBusOpen(bus.id)}>
            <Typography variant="h6" fontWeight="800" color="#0f172a" fontSize="1.1rem">Bus Details</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }} onClick={(e) => e.stopPropagation()}>
              <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => setBuses([...buses, { ...emptyBus, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#475569', bgcolor: '#fff', textTransform: 'none', fontWeight: 600 }}>Add</Button>
              <IconButton size="small" onClick={() => setBuses(buses.filter(b => b.id !== bus.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fef2f2', borderRadius: 1.5 }}><DeleteOutline fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => toggleBusOpen(bus.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: 1.5 }}>
                {bus.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={bus.isOpen}>
            <Box sx={{ p: 4, pt: 3 }}>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Pickup Location" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={bus.pickup} onChange={(e) => handleBusChange(bus.id, 'pickup', e.target.value)}><option>Mumbai</option><option>Pune</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Drop-off Location" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={bus.dropoff} onChange={(e) => handleBusChange(bus.id, 'dropoff', e.target.value)}><option>Goa</option><option>Bangalore</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Number of Passengers" required /><TextField fullWidth type="number" size="small" value={bus.passengers} onChange={(e) => handleBusChange(bus.id, 'passengers', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={bus.depDate} onChange={(e) => handleBusChange(bus.id, 'depDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={bus.depTime} onChange={(e) => handleBusChange(bus.id, 'depTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={bus.arrDate} onChange={(e) => handleBusChange(bus.id, 'arrDate', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={bus.arrTime} onChange={(e) => handleBusChange(bus.id, 'arrTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Bus Name" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={bus.busName} onChange={(e) => handleBusChange(bus.id, 'busName', e.target.value)}><option>Indian Express</option><option>VRL Travels</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Class Type" /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={bus.classType} onChange={(e) => handleBusChange(bus.id, 'classType', e.target.value)}><option>Sleeper</option><option>Semi-Sleeper</option><option>Seater</option></TextField></Grid>
              </Grid>
              <Box>
                <FieldLabel text="Add Notes" />
                <TextField fullWidth size="small" placeholder="Type here..." value={bus.notes} onChange={(e) => handleBusChange(bus.id, 'notes', e.target.value)} />
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

      {/* ==========================================
          GROUND TRANSPORTATION 
          ========================================== */}
      {types.private && grounds.map((ground) => (
        <Paper key={ground.id} elevation={0} sx={{ borderRadius: 2, mb: 4, border: ground.isOpen ? '2px solid #0ea5e9' : '1px solid #e2e8f0', overflow: 'hidden', bgcolor: '#fff' }}>
           <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: ground.isOpen ? '1px solid #f1f5f9' : 'none' }} onClick={() => toggleGroundOpen(ground.id)}>
            <Typography variant="h6" fontWeight="800" color="#0f172a" fontSize="1.1rem">Ground Transportation</Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }} onClick={(e) => e.stopPropagation()}>
              <Button variant="outlined" size="small" startIcon={<Add />} onClick={() => setGrounds([...grounds, { ...emptyGround, id: Date.now() }])} sx={{ borderColor: '#e2e8f0', color: '#475569', bgcolor: '#fff', textTransform: 'none', fontWeight: 600 }}>Add</Button>
              <IconButton size="small" onClick={() => setGrounds(grounds.filter(g => g.id !== ground.id))} sx={{ color: '#ef4444', border: '1px solid #fecaca', bgcolor: '#fef2f2', borderRadius: 1.5 }}><DeleteOutline fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => toggleGroundOpen(ground.id)} sx={{ color: '#64748b', border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: 1.5 }}>
                {ground.isOpen ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          <Collapse in={ground.isOpen}>
            <Box sx={{ p: 4, pt: 3 }}>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Pickup Location" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={ground.pickup} onChange={(e) => handleGroundChange(ground.id, 'pickup', e.target.value)}><option>Mumbai</option><option>Airport</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Drop-off Location" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={ground.dropoff} onChange={(e) => handleGroundChange(ground.id, 'dropoff', e.target.value)}><option>Goa</option><option>Hotel</option></TextField></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Number of Passengers" required /><TextField fullWidth type="number" size="small" value={ground.passengers} onChange={(e) => handleGroundChange(ground.id, 'passengers', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={ground.depDate} onChange={(e) => handleGroundChange(ground.id, 'depDate', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Departure Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={ground.depTime} onChange={(e) => handleGroundChange(ground.id, 'depTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Date" required /><TextField fullWidth type="date" size="small" InputLabelProps={{ shrink: true }} value={ground.arrDate} onChange={(e) => handleGroundChange(ground.id, 'arrDate', e.target.value)} /></Grid>
              </Grid>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}><FieldLabel text="Arrival Time" required /><TextField fullWidth type="time" size="small" InputLabelProps={{ shrink: true }} value={ground.arrTime} onChange={(e) => handleGroundChange(ground.id, 'arrTime', e.target.value)} /></Grid>
                <Grid item xs={12} md={4}><FieldLabel text="Vehicle Type" required /><TextField fullWidth select SelectProps={{ native: true }} size="small" value={ground.vehicleType} onChange={(e) => handleGroundChange(ground.id, 'vehicleType', e.target.value)}><option>Sedan</option><option>SUV</option><option>Van</option></TextField></Grid>
              </Grid>
              <Box>
                <FieldLabel text="Add Notes" />
                <TextField fullWidth size="small" placeholder="Type here..." value={ground.notes} onChange={(e) => handleGroundChange(ground.id, 'notes', e.target.value)} />
              </Box>
            </Box>
          </Collapse>
        </Paper>
      ))}

    </Box>
  );
}