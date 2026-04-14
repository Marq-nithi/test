import React, { useState, useEffect, useRef } from 'react';
import { 
  AppBar, Toolbar, Typography, Container, Paper, Grid, TextField, 
  MenuItem, Button, Box, Divider, List, ListItem, ListItemText, 
  IconButton, Card, CardMedia, ThemeProvider, createTheme, CssBaseline 
} from '@mui/material';
import { AddCircleOutline, DeleteOutline, PictureAsPdf, PhotoCamera } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Premium Theme Configuration ---
const theme = createTheme({
  palette: {
    primary: { main: '#b71c1c' }, // Premium Red
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
  },
});

const COUNTRY_DEFAULTS = {
  Dubai: ["Burj Khalifa", "Desert Safari", "Dhow Cruise"],
  Singapore: ["Universal Studios", "Gardens by the Bay", "Sentosa Island"],
  Thailand: ["Phi Phi Island", "Bangkok Temple Tour", "Phuket Beach"],
  Maldives: ["Water Villa Stay", "Snorkeling", "Private Dinner"],
};

export default function ItineraryBuilder() {
  const printRef = useRef();
  
  // --- State Management ---
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [formData, setFormData] = useState({
    tripTitle: '', customerName: '', country: '', location: '',
    travelDate: '', returnDate: '', adults: 1, children: 0,
    childAges: '', basePrice: 0, manualPrice: ''
  });
  const [days, setDays] = useState([]);

  // --- Logic: Handle Country Selection ---
  useEffect(() => {
    if (formData.country && COUNTRY_DEFAULTS[formData.country]) {
      const initialDays = COUNTRY_DEFAULTS[formData.country].map((activity, index) => ({
        id: index + 1,
        title: `Day ${index + 1}`,
        activities: [`• ${activity}`]
      }));
      setDays(initialDays);
    }
  }, [formData.country]);

  // --- Logic: Price Calculation ---
  const calculateFinalPrice = () => {
    if (formData.manualPrice) return formData.manualPrice;
    const base = parseFloat(formData.basePrice) || 0;
    const profit = base * 0.20;
    const gst = (base + profit) * 0.05;
    return (base + profit + gst).toFixed(2);
  };

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const addDay = () => {
    const newId = days.length + 1;
    setDays([...days, { id: newId, title: `Day ${newId}`, activities: [] }]);
  };

  const addActivity = (dayId) => {
    const activityName = prompt("Enter activity name:");
    if (activityName) {
      setDays(days.map(day => {
        if (day.id === dayId) {
          const formatted = `• ${activityName}`;
          if (!day.activities.includes(formatted)) {
            return { ...day, activities: [...day.activities, formatted] };
          }
        }
        return day;
      }));
    }
  };

  // --- PDF Export Logic ---
  const exportPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.tripTitle || 'Itinerary'}.pdf`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* HEADER SECTION */}
      <AppBar position="static" sx={{ mb: 4, px: 2 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {logo ? (
              <img src={logo} alt="logo" style={{ height: 40, marginRight: 15 }} />
            ) : (
              <IconButton color="inherit" component="label">
                <input hidden accept="image/*" type="file" onChange={(e) => handleFileUpload(e, setLogo)} />
                <PhotoCamera />
              </IconButton>
            )}
            <Typography variant="h6">Triumph Holidays</Typography>
          </Box>
          <Button variant="contained" color="inherit" sx={{ color: 'primary.main' }} onClick={exportPDF} startIcon={<PictureAsPdf />}>
            Download PDF
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {/* FORM SECTION */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" color="primary" gutterBottom>Plan Your Trip</Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Trip Title" name="tripTitle" onChange={handleInputChange} variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Customer Name" name="customerName" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField select fullWidth label="Country" name="country" value={formData.country} onChange={handleInputChange}>
                    {Object.keys(COUNTRY_DEFAULTS).map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Location" name="location" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="date" label="Travel Date" name="travelDate" InputLabelProps={{ shrink: true }} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="date" label="Return Date" name="returnDate" InputLabelProps={{ shrink: true }} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="number" label="Adults" name="adults" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="number" label="Children" name="children" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Children Ages (e.g. 5, 8)" name="childAges" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="number" label="Base Price ($)" name="basePrice" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth type="number" label="Manual Override ($)" name="manualPrice" onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" component="label" fullWidth startIcon={<PhotoCamera />}>
                    Upload Banner Image
                    <input hidden accept="image/*" type="file" onChange={(e) => handleFileUpload(e, setBanner)} />
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* PREVIEW & ITINERARY SECTION */}
          <Grid item xs={12} md={7}>
            <Paper ref={printRef} sx={{ p: 4, borderRadius: 2, minHeight: '800px' }}>
              {/* PDF Header Preview */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {logo && <img src={logo} alt="Logo" style={{ maxHeight: 60, marginBottom: 10 }} />}
                <Typography variant="h4" color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                  {formData.tripTitle || "Travel Itinerary"}
                </Typography>
                <Typography color="textSecondary">Prepared for: {formData.customerName || "Valued Guest"}</Typography>
              </Box>

              {banner && <CardMedia component="img" height="240" image={banner} sx={{ borderRadius: 2, mb: 3 }} />}

              <Grid container spacing={2} sx={{ mb: 3, bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2"><b>Destination:</b> {formData.location}, {formData.country}</Typography>
                  <Typography variant="body2"><b>Dates:</b> {formData.travelDate} to {formData.returnDate}</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2"><b>Pax:</b> {formData.adults} Adults, {formData.children} Children</Typography>
                  <Typography variant="h6" color="primary">Total: ${calculateFinalPrice()}</Typography>
                </Grid>
              </Grid>

              {/* DYNAMIC DAYS */}
              <Typography variant="h6" gutterBottom>Scheduled Activities</Typography>
              {days.map((day) => (
                <Box key={day.id} sx={{ mb: 2, p: 2, borderLeft: '4px solid #b71c1c', bgcolor: '#fffafa' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{day.title}</Typography>
                    <Button size="small" startIcon={<AddCircleOutline />} onClick={() => addActivity(day.id)}>Add Activity</Button>
                  </Box>
                  <List dense>
                    {day.activities.map((act, i) => (
                      <ListItem key={i}><ListItemText primary={act} /></ListItem>
                    ))}
                  </List>
                </Box>
              ))}
              
              <Button fullWidth variant="dashed" sx={{ border: '1px dashed #ccc', mt: 2 }} onClick={addDay} startIcon={<AddCircleOutline />}>
                Add Another Day
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}