import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, IconButton, 
  Checkbox, FormControlLabel, MenuItem, Divider 
} from '@mui/material';
import { 
  Flight, Train, DirectionsBus, LocalTaxi, DeleteOutline, AddCircleOutline 
} from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext';

export default function TransportDetails() {
  const { transportData, setTransportData } = useItinerary();

  // Load existing data if they go back, otherwise set defaults
  const [types, setTypes] = useState(
    transportData?.types?.flight !== undefined 
      ? transportData.types 
      : { flight: true, train: false, bus: false, private: false }
  );
  
  const emptyFlight = { depFrom: '', arrAt: '', passengers: 1, depDate: '', depTime: '10:00 AM', arrDate: '', airline: '', flightNo: '', cabin: 'Economy' };
  const emptyTrain = { depFrom: '', arrAt: '', passengers: 1, depDate: '', depTime: '08:00 AM', arrDate: '', trainName: '', trainNo: '', coach: '2A' };
  const emptyGround = { pickup: '', dropoff: '', vehicle: 'Sedan' };

  const [flights, setFlights] = useState(transportData?.flights?.length ? transportData.flights : [emptyFlight]);
  const [trains, setTrains] = useState(transportData?.trains?.length ? transportData.trains : [emptyTrain]);
  const [grounds, setGrounds] = useState(transportData?.grounds?.length ? transportData.grounds : [emptyGround]);

  // 🚀 THE MAGIC AUTO-SAVE HOOK
  useEffect(() => {
    setTransportData({ types, flights, trains, grounds });
  }, [types, flights, trains, grounds, setTransportData]);

  const FieldLabel = ({ text, required }) => (
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
      {text} {required && <span style={{ color: '#d32f2f' }}>*</span>}
    </Typography>
  );

  const handleTypeToggle = (type) => setTypes(prev => ({ ...prev, [type]: !prev[type] }));
  
  const handleFlightChange = (index, field, value) => { const newArr = [...flights]; newArr[index][field] = value; setFlights(newArr); };
  const handleTrainChange = (index, field, value) => { const newArr = [...trains]; newArr[index][field] = value; setTrains(newArr); };
  const handleGroundChange = (index, field, value) => { const newArr = [...grounds]; newArr[index][field] = value; setGrounds(newArr); };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto', bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="900" color="#1e293b" mb={0.5}>Transport Details</Typography>
        <Typography variant="body2" color="text.secondary">Configure the journey and transfer details for your client.</Typography>
      </Box>

      {/* TRANSPORT SELECTOR */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="subtitle2" fontWeight="800" mb={2} color="#1e293b">Select Transport Modes Needed</Typography>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <FormControlLabel control={<Checkbox checked={types.flight} onChange={() => handleTypeToggle('flight')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }}/>} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}><Flight fontSize="small" sx={{ color: '#0ea5e9' }} /> Flights</Box>} />
          <FormControlLabel control={<Checkbox checked={types.train} onChange={() => handleTypeToggle('train')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#f97316' } }}/>} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}><Train fontSize="small" sx={{ color: '#f97316' }} /> Trains</Box>} />
          <FormControlLabel control={<Checkbox checked={types.private} onChange={() => handleTypeToggle('private')} sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#10b981' } }}/>} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}><LocalTaxi fontSize="small" sx={{ color: '#10b981' }} /> Ground Transfers</Box>} />
        </Box>
      </Paper>

      {/* FLIGHTS */}
      {types.flight && flights.map((flight, index) => (
        <Paper key={`flight-${index}`} elevation={0} sx={{ p: 4, borderRadius: 3, mb: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="800" color="#0ea5e9" display="flex" alignItems="center" gap={1}>
              <Flight /> Flight Segment {flights.length > 1 ? `#${index + 1}` : ''}
            </Typography>
            {flights.length > 1 && (
              <IconButton size="small" color="error" onClick={() => setFlights(flights.filter((_, i) => i !== index))}><DeleteOutline /></IconButton>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}><FieldLabel text="Departure Airport" required /><TextField fullWidth placeholder="e.g. New York (JFK)" size="small" value={flight.depFrom} onChange={(e) => handleFlightChange(index, 'depFrom', e.target.value)} /></Grid>
            <Grid item xs={12} md={4}><FieldLabel text="Arrival Airport" required /><TextField fullWidth placeholder="e.g. Paris (CDG)" size="small" value={flight.arrAt} onChange={(e) => handleFlightChange(index, 'arrAt', e.target.value)} /></Grid>
            <Grid item xs={12} md={4}><FieldLabel text="Passengers" /><TextField fullWidth type="number" size="small" value={flight.passengers} onChange={(e) => handleFlightChange(index, 'passengers', e.target.value)} /></Grid>
            
            <Grid item xs={12} md={3}><FieldLabel text="Departure Date" /><TextField fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" value={flight.depDate} onChange={(e) => handleFlightChange(index, 'depDate', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><FieldLabel text="Departure Time" /><TextField fullWidth type="time" InputLabelProps={{ shrink: true }} size="small" value={flight.depTime} onChange={(e) => handleFlightChange(index, 'depTime', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><FieldLabel text="Arrival Date" /><TextField fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" value={flight.arrDate} onChange={(e) => handleFlightChange(index, 'arrDate', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><FieldLabel text="Cabin Class" /><TextField fullWidth select size="small" value={flight.cabin} onChange={(e) => handleFlightChange(index, 'cabin', e.target.value)}><MenuItem value="Economy">Economy</MenuItem><MenuItem value="Premium Economy">Premium Economy</MenuItem><MenuItem value="Business">Business</MenuItem><MenuItem value="First Class">First Class</MenuItem></TextField></Grid>
            
            <Grid item xs={12} md={6}><FieldLabel text="Airline" /><TextField fullWidth placeholder="e.g. Emirates" size="small" value={flight.airline} onChange={(e) => handleFlightChange(index, 'airline', e.target.value)} /></Grid>
            <Grid item xs={12} md={6}><FieldLabel text="Flight Number" /><TextField fullWidth placeholder="e.g. EK 201" size="small" value={flight.flightNo} onChange={(e) => handleFlightChange(index, 'flightNo', e.target.value)} /></Grid>

            {index === flights.length - 1 && (
              <Grid item xs={12} sx={{ display: 'flex', mt: 1 }}>
                <Button variant="outlined" size="small" startIcon={<AddCircleOutline />} onClick={() => setFlights([...flights, emptyFlight])} sx={{ color: '#1e293b', borderColor: '#cbd5e1', fontWeight: 700, textTransform: 'none' }}>Add Connecting Flight</Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}

      {/* TRAINS */}
      {types.train && trains.map((train, index) => (
        <Paper key={`train-${index}`} elevation={0} sx={{ p: 4, borderRadius: 3, mb: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="800" color="#f97316" display="flex" alignItems="center" gap={1}>
              <Train /> Train Journey {trains.length > 1 ? `#${index + 1}` : ''}
            </Typography>
            {trains.length > 1 && (
              <IconButton size="small" color="error" onClick={() => setTrains(trains.filter((_, i) => i !== index))}><DeleteOutline /></IconButton>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}><FieldLabel text="Departure Station" required /><TextField fullWidth size="small" value={train.depFrom} onChange={(e) => handleTrainChange(index, 'depFrom', e.target.value)} /></Grid>
            <Grid item xs={12} md={4}><FieldLabel text="Arrival Station" required /><TextField fullWidth size="small" value={train.arrAt} onChange={(e) => handleTrainChange(index, 'arrAt', e.target.value)} /></Grid>
            <Grid item xs={12} md={4}><FieldLabel text="Passengers" /><TextField fullWidth type="number" size="small" value={train.passengers} onChange={(e) => handleTrainChange(index, 'passengers', e.target.value)} /></Grid>
            
            <Grid item xs={12} md={3}><FieldLabel text="Departure Date" /><TextField fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" value={train.depDate} onChange={(e) => handleTrainChange(index, 'depDate', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><FieldLabel text="Departure Time" /><TextField fullWidth type="time" InputLabelProps={{ shrink: true }} size="small" value={train.depTime} onChange={(e) => handleTrainChange(index, 'depTime', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><FieldLabel text="Arrival Date" /><TextField fullWidth type="date" InputLabelProps={{ shrink: true }} size="small" value={train.arrDate} onChange={(e) => handleTrainChange(index, 'arrDate', e.target.value)} /></Grid>
            <Grid item xs={12} md={3}><FieldLabel text="Coach Class" /><TextField fullWidth select size="small" value={train.coach} onChange={(e) => handleTrainChange(index, 'coach', e.target.value)}><MenuItem value="1A">First Class (1A)</MenuItem><MenuItem value="2A">Second AC (2A)</MenuItem><MenuItem value="Standard">Standard</MenuItem></TextField></Grid>
            
            <Grid item xs={12} md={6}><FieldLabel text="Train Name" /><TextField fullWidth size="small" value={train.trainName} onChange={(e) => handleTrainChange(index, 'trainName', e.target.value)} /></Grid>
            <Grid item xs={12} md={6}><FieldLabel text="Train Number" /><TextField fullWidth size="small" value={train.trainNo} onChange={(e) => handleTrainChange(index, 'trainNo', e.target.value)} /></Grid>

            {index === trains.length - 1 && (
              <Grid item xs={12} sx={{ display: 'flex', mt: 1 }}>
                <Button variant="outlined" size="small" startIcon={<AddCircleOutline />} onClick={() => setTrains([...trains, emptyTrain])} sx={{ color: '#1e293b', borderColor: '#cbd5e1', fontWeight: 700, textTransform: 'none' }}>Add Another Train</Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}

      {/* GROUND TRANSPORT */}
      {(types.private) && grounds.map((ground, index) => (
        <Paper key={`ground-${index}`} elevation={0} sx={{ p: 4, borderRadius: 3, mb: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="800" color="#10b981" display="flex" alignItems="center" gap={1}>
              <DirectionsBus /> Ground Transfer {grounds.length > 1 ? `#${index + 1}` : ''}
            </Typography>
            {grounds.length > 1 && (
              <IconButton size="small" color="error" onClick={() => setGrounds(grounds.filter((_, i) => i !== index))}><DeleteOutline /></IconButton>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}><FieldLabel text="Pickup Location" /><TextField fullWidth placeholder="e.g. Airport" size="small" value={ground.pickup} onChange={(e) => handleGroundChange(index, 'pickup', e.target.value)} /></Grid>
            <Grid item xs={12} md={4}><FieldLabel text="Drop-off Location" /><TextField fullWidth placeholder="e.g. Hotel" size="small" value={ground.dropoff} onChange={(e) => handleGroundChange(index, 'dropoff', e.target.value)} /></Grid>
            <Grid item xs={12} md={4}><FieldLabel text="Vehicle Type" /><TextField fullWidth select size="small" value={ground.vehicle} onChange={(e) => handleGroundChange(index, 'vehicle', e.target.value)}><MenuItem value="Sedan">Sedan</MenuItem><MenuItem value="SUV">SUV</MenuItem><MenuItem value="Minivan">Minivan</MenuItem><MenuItem value="Luxury Coach">Luxury Coach</MenuItem></TextField></Grid>
            
            {index === grounds.length - 1 && (
              <Grid item xs={12} sx={{ display: 'flex', mt: 1 }}>
                <Button variant="outlined" size="small" startIcon={<AddCircleOutline />} onClick={() => setGrounds([...grounds, emptyGround])} sx={{ color: '#1e293b', borderColor: '#cbd5e1', fontWeight: 700, textTransform: 'none' }}>Add Another Transfer</Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}