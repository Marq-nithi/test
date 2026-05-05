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
    hotel_type: 'main', // 'main' has location, 'hotel' hides location, 'split' shows location
    location: 'Goa, India',
    hotel_name: '',
    hotel_preference: 'Luxury Resort',
    room_category: 'Deluxe',
    rooms: 1,
    nights: 1,
    check_in_date: '',
    check_in_time: '',
    check_out_date: '',
    check_out_time: '',
    meal_plan_breakfast: true,
    meal_plan_lunch: false,
    meal_plan_dinner: true,
    meal_plan_all_inc: false
  };

  // Load existing data from the global brain, otherwise start fresh
  const [hotels, setHotels] = useState(stayData?.hotels?.length ? stayData.hotels.map((hotel) => ({
    ...hotel,
    hotel_type: hotel.hotel_type || hotel.type || 'hotel',
    hotel_name: hotel.hotel_name ?? hotel.hotelName ?? '',
    hotel_preference: hotel.hotel_preference ?? hotel.hotelPref ?? 'Luxury Resort',
    room_category: hotel.room_category ?? hotel.roomCat ?? 'Deluxe',
    check_in_date: hotel.check_in_date ?? hotel.checkInDate ?? '',
    check_in_time: hotel.check_in_time ?? hotel.checkInTime ?? '',
    check_out_date: hotel.check_out_date ?? hotel.checkOutDate ?? '',
    check_out_time: hotel.check_out_time ?? hotel.checkOutTime ?? '',
    meal_plan_breakfast: hotel.meal_plan_breakfast ?? hotel.meals?.breakfast ?? false,
    meal_plan_lunch: hotel.meal_plan_lunch ?? hotel.meals?.lunch ?? false,
    meal_plan_dinner: hotel.meal_plan_dinner ?? hotel.meals?.dinner ?? false,
    meal_plan_all_inc: hotel.meal_plan_all_inc ?? hotel.meals?.allInclusive ?? false,
  })) : [{ ...defaultHotel }]);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // 🚀 INSTANT AUTO-SAVE
  // Every time 'hotels' or 'termsAccepted' changes, it saves to Context immediately
  useEffect(() => {
    const normalizedHotels = hotels.map((hotel) => ({
      hotel_type: hotel.hotel_type ?? null,
      location: hotel.location ?? null,
      hotel_name: hotel.hotel_name ?? null,
      hotel_preference: hotel.hotel_preference ?? null,
      room_category: hotel.room_category ?? null,
      rooms: hotel.rooms ?? null,
      nights: hotel.nights ?? null,
      check_in_date: hotel.check_in_date ?? null,
      check_in_time: hotel.check_in_time ?? null,
      check_out_date: hotel.check_out_date ?? null,
      check_out_time: hotel.check_out_time ?? null,
      meal_plan_breakfast: hotel.meal_plan_breakfast ?? null,
      meal_plan_lunch: hotel.meal_plan_lunch ?? null,
      meal_plan_dinner: hotel.meal_plan_dinner ?? null,
      meal_plan_all_inc: hotel.meal_plan_all_inc ?? null,
    }));
    setStayData({ hotels: normalizedHotels });
  }, [hotels, setStayData]);

  // Reusable label component
  const FieldLabel = ({ text, required }) => (
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
      {text} {required && <span style={{ color: '#d32f2f' }}>*</span>}
    </Typography>
  );

  // Handlers for adding/removing forms
  const handleAddHotel = () => {
    setHotels([...hotels, { ...defaultHotel, id: Date.now(), hotel_type: 'hotel', location: hotels[0]?.location || '' }]);
  };

  const handleAddSplitStay = () => {
    setHotels([...hotels, { ...defaultHotel, id: Date.now(), hotel_type: 'split', location: '' }]);
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
        return { ...hotel, [mealType]: checked };
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
              {hotel.hotel_type === 'main' ? 'Hotel Accommodation' : hotel.hotel_type === 'split' ? 'Split Stay Accommodation' : 'Additional Hotel'}
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
            {hotel.hotel_type !== 'hotel' && (
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
                value={hotel.hotel_name} onChange={(e) => handleUpdate(hotel.id, 'hotel_name', e.target.value)} 
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FieldLabel text="Hotel Preference" required />
              <Select 
                fullWidth size="small" 
                value={hotel.hotel_preference} onChange={(e) => handleUpdate(hotel.id, 'hotel_preference', e.target.value)}
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
                value={hotel.room_category} onChange={(e) => handleUpdate(hotel.id, 'room_category', e.target.value)}
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
                 value={hotel.check_in_date} onChange={(e) => handleUpdate(hotel.id, 'check_in_date', e.target.value)} 
                 InputLabelProps={{ shrink: true }} 
               />
            </Grid>
            <Grid item xs={12} md={3}>
               <FieldLabel text="Check-In Time" />
               <Select 
                 fullWidth size="small" 
                 value={hotel.check_in_time} onChange={(e) => handleUpdate(hotel.id, 'check_in_time', e.target.value)}
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
                 value={hotel.check_out_date} onChange={(e) => handleUpdate(hotel.id, 'check_out_date', e.target.value)} 
                 InputLabelProps={{ shrink: true }} 
               />
            </Grid>
            <Grid item xs={12} md={3}>
               <FieldLabel text="Check-Out Time" />
               <Select 
                 fullWidth size="small" 
                 value={hotel.check_out_time} onChange={(e) => handleUpdate(hotel.id, 'check_out_time', e.target.value)}
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
                <FormControlLabel control={<Checkbox checked={!!hotel.meal_plan_breakfast} onChange={(e) => handleMealUpdate(hotel.id, 'meal_plan_breakfast', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>Breakfast</Typography>} />
                <FormControlLabel control={<Checkbox checked={!!hotel.meal_plan_lunch} onChange={(e) => handleMealUpdate(hotel.id, 'meal_plan_lunch', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>Lunch</Typography>} />
                <FormControlLabel control={<Checkbox checked={!!hotel.meal_plan_dinner} onChange={(e) => handleMealUpdate(hotel.id, 'meal_plan_dinner', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>Dinner</Typography>} />
                <FormControlLabel control={<Checkbox checked={!!hotel.meal_plan_all_inc} onChange={(e) => handleMealUpdate(hotel.id, 'meal_plan_all_inc', e.target.checked)} size="small" sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#0ea5e9' } }} />} label={<Typography variant="body2" fontWeight={600}>All Inclusive</Typography>} />
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
