import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Select, MenuItem, 
  IconButton, FormGroup, FormControlLabel, Checkbox, Divider, Button 
} from '@mui/material';
import { Add, Remove, AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext';

export default function StayDetails() {
  const { stayData, setStayData } = useItinerary();

  // The default blueprint for a new hotel
  const defaultHotel = {
    id: Date.now(),
    type: 'main', // 'main' has location, 'hotel' hides location, 'split' shows location
    location: 'Goa, India',
    hotelName: '',
    hotelPref: 'Luxury Resort',
    roomCat: 'Deluxe',
    rooms: 1,
    nights: 1,
    checkInDate: '',
    checkInTime: '3:00 PM',
    checkOutDate: '',
    checkOutTime: '11:00 AM',
    meals: { breakfast: true, lunch: false, dinner: true, allInclusive: false }
  };

  // Load existing data from the global brain, otherwise start fresh
  const [hotels, setHotels] = useState(stayData?.hotels?.length ? stayData.hotels : [{ ...defaultHotel }]);
  const [termsAccepted, setTermsAccepted] = useState(stayData?.termsAccepted ?? true);

  // 🚀 INSTANT AUTO-SAVE
  // Every time 'hotels' or 'termsAccepted' changes, it saves to Context immediately
  useEffect(() => {
    setStayData({ hotels, termsAccepted });
  }, [hotels, termsAccepted, setStayData]);

  // Reusable label component
  const FieldLabel = ({ text, required }) => (
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
      {text} {required && <span style={{ color: '#d32f2f' }}>*</span>}
    </Typography>
  );

  // Handlers for adding/removing forms
  const handleAddHotel = () => {
    setHotels([...hotels, { ...defaultHotel, id: Date.now(), type: 'hotel', location: hotels[0]?.location || '' }]);
  };

  const handleAddSplitStay = () => {
    setHotels([...hotels, { ...defaultHotel, id: Date.now(), type: 'split', location: '' }]);
  };

  const handleRemoveHotel = (id) => {
    setHotels(hotels.filter(hotel => hotel.id !== id));
  };

  // Handlers for updating fields
  const handleUpdate = (id, field, value) => {
    setHotels(hotels.map(hotel => hotel.id === id ? { ...hotel, [field]: value } : hotel));
  };

  const handleCountUpdate = (id, field, increment) => {
    setHotels(hotels.map(hotel => {
      if (hotel.id === id) {
        return { ...hotel, [field]: Math.max(1, hotel[field] + increment) };
      }
      return hotel;
    }));
  };

  const handleMealUpdate = (id, mealType, checked) => {
    setHotels(hotels.map(hotel => {
      if (hotel.id === id) {
        return { ...hotel, meals: { ...hotel.meals, [mealType]: checked } };
      }
      return hotel;
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto', bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e293b', mb: 0.5 }}>
        Hotel Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Configure hotel accommodation for your client's trip
      </Typography>
      
      {hotels.map((hotel, index) => (
        <Paper key={hotel.id} elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 3, mb: 4, bgcolor: '#fff', position: 'relative' }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b' }}>
              {hotel.type === 'main' ? 'Hotel Accommodation' : hotel.type === 'split' ? 'Split Stay Accommodation' : 'Additional Hotel'}
            </Typography>
            
            {/* Show delete button for everything except the first main hotel */}
            {index > 0 && (
              <IconButton color="error" onClick={() => handleRemoveHotel(hotel.id)} size="small">
                <DeleteOutline />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={3}>
            {/* Conditionally render Location field */}
            {hotel.type !== 'hotel' && (
              <>
                <Grid item xs={12} md={6}>
                  <FieldLabel text="Location" />
                  <Select 
                    fullWidth size="small" 
                    value={hotel.location} 
                    onChange={(e) => handleUpdate(hotel.id, 'location', e.target.value)}
                  >
                    <MenuItem value="Goa, India">Goa, India</MenuItem>
                    <MenuItem value="Maldives">Maldives</MenuItem>
                    <MenuItem value="Bali, Indonesia">Bali, Indonesia</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>
              </>
            )}

            {/* Row 1: Hotel Name & Room Details */}
            <Grid item xs={12} md={3}>
              <FieldLabel text="Hotel Name" required />
              <TextField 
                fullWidth size="small" placeholder="e.g. Taj Exotica"
                value={hotel.hotelName} onChange={(e) => handleUpdate(hotel.id, 'hotelName', e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FieldLabel text="Hotel Preference" required />
              <Select 
                fullWidth size="small" 
                value={hotel.hotelPref} onChange={(e) => handleUpdate(hotel.id, 'hotelPref', e.target.value)}
              >
                <MenuItem value="Luxury Resort">Luxury Resort</MenuItem>
                <MenuItem value="Boutique Hotel">Boutique Hotel</MenuItem>
                <MenuItem value="Standard Hotel">Standard Hotel</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={3}>
              <FieldLabel text="Room Category" />
              <Select 
                fullWidth size="small" 
                value={hotel.roomCat} onChange={(e) => handleUpdate(hotel.id, 'roomCat', e.target.value)}
              >
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
                <MenuItem value="Suite">Suite</MenuItem>
                <MenuItem value="Ocean View">Ocean View</MenuItem>
              </Select>
            </Grid>
            
            {/* Number counters */}
            <Grid item xs={6} md={1.5}>
              <FieldLabel text="Rooms" required />
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 1, height: '40px', justifyContent: 'space-between', px: 1 }}>
                <IconButton size="small" onClick={() => handleCountUpdate(hotel.id, 'rooms', -1)}><Remove fontSize="small" /></IconButton>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{hotel.rooms}</Typography>
                <IconButton size="small" onClick={() => handleCountUpdate(hotel.id, 'rooms', 1)}><Add fontSize="small" /></IconButton>
              </Box>
            </Grid>
            <Grid item xs={6} md={1.5}>
              <FieldLabel text="Nights" required />
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: 1, height: '40px', justifyContent: 'space-between', px: 1 }}>
                <IconButton size="small" onClick={() => handleCountUpdate(hotel.id, 'nights', -1)}><Remove fontSize="small" /></IconButton>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{hotel.nights}</Typography>
                <IconButton size="small" onClick={() => handleCountUpdate(hotel.id, 'nights', 1)}><Add fontSize="small" /></IconButton>
              </Box>
            </Grid>

            {/* Row 2: Check-in / Check-out */}
            <Grid item xs={12} md={3}>
               <FieldLabel text="Check-In Date" required />
               <TextField 
                 fullWidth size="small" type="date" 
                 value={hotel.checkInDate} onChange={(e) => handleUpdate(hotel.id, 'checkInDate', e.target.value)} 
                 InputLabelProps={{ shrink: true }} 
               />
            </Grid>
            <Grid item xs={12} md={3}>
               <FieldLabel text="Check-In Time" />
               <Select 
                 fullWidth size="small" 
                 value={hotel.checkInTime} onChange={(e) => handleUpdate(hotel.id, 'checkInTime', e.target.value)}
               >
                 <MenuItem value="12:00 PM">12:00 PM</MenuItem>
                 <MenuItem value="2:00 PM">2:00 PM</MenuItem>
                 <MenuItem value="3:00 PM">3:00 PM</MenuItem>
               </Select>
            </Grid>
            <Grid item xs={12} md={3}>
               <FieldLabel text="Check-Out Date" required />
               <TextField 
                 fullWidth size="small" type="date" 
                 value={hotel.checkOutDate} onChange={(e) => handleUpdate(hotel.id, 'checkOutDate', e.target.value)} 
                 InputLabelProps={{ shrink: true }} 
               />
            </Grid>
            <Grid item xs={12} md={3}>
               <FieldLabel text="Check-Out Time" />
               <Select 
                 fullWidth size="small" 
                 value={hotel.checkOutTime} onChange={(e) => handleUpdate(hotel.id, 'checkOutTime', e.target.value)}
               >
                 <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                 <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                 <MenuItem value="12:00 PM">12:00 PM</MenuItem>
               </Select>
            </Grid>

            {/* Row 3: Meal Plan */}
            <Grid item xs={12}>
              <FieldLabel text="Meal Plan" />
              <FormGroup row sx={{ mt: -0.5 }}>
                <FormControlLabel control={<Checkbox checked={hotel.meals.breakfast} onChange={(e) => handleMealUpdate(hotel.id, 'breakfast', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>Breakfast</Typography>} />
                <FormControlLabel control={<Checkbox checked={hotel.meals.lunch} onChange={(e) => handleMealUpdate(hotel.id, 'lunch', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>Lunch</Typography>} />
                <FormControlLabel control={<Checkbox checked={hotel.meals.dinner} onChange={(e) => handleMealUpdate(hotel.id, 'dinner', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>Dinner</Typography>} />
                <FormControlLabel control={<Checkbox checked={hotel.meals.allInclusive} onChange={(e) => handleMealUpdate(hotel.id, 'allInclusive', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>All Inclusive</Typography>} />
              </FormGroup>
            </Grid>

            {/* Add Buttons (Only show on the LAST hotel block) */}
            {index === hotels.length - 1 && (
              <Grid item xs={12} sx={{ display: 'flex', gap: 2, pt: 1 }}>
                <Button variant="outlined" size="small" startIcon={<AddCircleOutline />} onClick={handleAddHotel} sx={{ color: '#1e293b', borderColor: '#cbd5e1', fontWeight: 700, textTransform: 'none' }}>
                  Add Hotel
                </Button>
                <Button variant="outlined" size="small" startIcon={<AddCircleOutline />} onClick={handleAddSplitStay} sx={{ color: '#1e293b', borderColor: '#cbd5e1', fontWeight: 700, textTransform: 'none' }}>
                  Add Split Stay
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>
      ))}
      
      {/* Terms and Conditions Card */}
      <Paper elevation={0} sx={{ p: 4, border: '1px solid #e2e8f0', borderRadius: 3, bgcolor: '#fff' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 2 }}>Hotel Terms & Conditions</Typography>
        <FormControlLabel 
          control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} 
          label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Select All</Typography>} 
        />
        <Box sx={{ mt: 1 }}>
          <FormControlLabel 
            control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} 
            label={<Typography variant="body2" color="text.secondary">Early check-in and late check-out are subject to availability and may incur additional charges.</Typography>} 
          />
        </Box>
      </Paper>
    </Box>
  );
}