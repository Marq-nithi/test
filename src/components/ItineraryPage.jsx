import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  AppBar,
  Toolbar,
  Box
} from "@mui/material";
import jsPDF from "jspdf";
import { COUNTRY_DEFAULTS } from "../constants";

export default function ItineraryBuilder() {
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [country, setCountry] = useState("");
  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [childAge, setChildAge] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [actualPrice, setActualPrice] = useState(0);
  const [manualPrice, setManualPrice] = useState("");
  const [days, setDays] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setCountry(selected);

    if (COUNTRY_DEFAULTS[selected]) {
      const autoDays = COUNTRY_DEFAULTS[selected].map((item, index) => ({
        day: `Day ${index + 1}`,
        title: item.title,
        description: item.description
      }));
      setDays(autoDays);
    }
  };

  const addDay = () => {
    setDays([
      ...days,
      { day: `Day ${days.length + 1}`, title: "", description: "" }
    ]);
  };

  const handleDayChange = (index, field, value) => {
    const updated = [...days];
    updated[index][field] = value;
    setDays(updated);
  };

  const calculatePrice = () => {
    const profit = actualPrice * 0.2;
    const subtotal = actualPrice + profit;
    const gst = subtotal * 0.05;
    return (subtotal + gst).toFixed(2);
  };

  const finalPrice = manualPrice || calculatePrice();

  const saveTrip = () => {
    const newTrip = {
      customerName,
      country,
      finalPrice
    };
    setSavedTrips([...savedTrips, newTrip]);
  };

  const deleteTrip = (index) => {
    const updated = [...savedTrips];
    updated.splice(index, 1);
    setSavedTrips(updated);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Triumph Holidays - Travel Itinerary", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Customer: ${customerName}`, 20, y);
    y += 7;
    doc.text(`Country: ${country}`, 20, y);
    y += 7;
    doc.text(`Travel Date: ${travelDate}`, 20, y);
    y += 7;
    doc.text(`Return Date: ${returnDate}`, 20, y);
    y += 10;

    days.forEach((d) => {
      doc.setFontSize(14);
      doc.text(d.day + " - " + d.title, 20, y);
      y += 6;
      doc.setFontSize(11);
      doc.text(d.description, 25, y);
      y += 10;
    });

    doc.setFontSize(14);
    doc.text(`Total Price: ₹${finalPrice}`, 20, y);

    doc.save("Itinerary.pdf");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {logo && (
            <img src={logo} alt="logo" height="40" style={{ marginRight: 20 }} />
          )}
          <Typography variant="h6">Triumph Holidays</Typography>
        </Toolbar>
      </AppBar>

      {banner && (
        <Box
          component="img"
          src={banner}
          sx={{ width: "100%", height: 200, objectFit: "cover" }}
        />
      )}

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Select Country"
              value={country}
              onChange={handleCountryChange}
            >
              {Object.keys(COUNTRY_DEFAULTS).map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="number"
              fullWidth
              label="Adult"
              value={adult}
              onChange={(e) => setAdult(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="number"
              fullWidth
              label="Child"
              value={child}
              onChange={(e) => setChild(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Child Age"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="date"
              fullWidth
              label="Travel Date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setTravelDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="date"
              fullWidth
              label="Return Date"
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              type="number"
              fullWidth
              label="Actual Cost"
              value={actualPrice}
              onChange={(e) => setActualPrice(Number(e.target.value))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Manual Price Override"
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h5">Days & Activities</Typography>

          {days.map((d, i) => (
            <Card key={i} sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">{d.day}</Typography>

                <TextField
                  fullWidth
                  label="Title"
                  value={d.title}
                  onChange={(e) =>
                    handleDayChange(i, "title", e.target.value)
                  }
                  sx={{ mt: 1 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={d.description}
                  onChange={(e) =>
                    handleDayChange(i, "description", e.target.value)
                  }
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          ))}

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={addDay}
          >
            Add Day
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="h6">
            Final Price: ₹{finalPrice}
          </Typography>
        </Box>

        <Box mt={2}>
          <Button variant="contained" onClick={saveTrip} sx={{ mr: 2 }}>
            Save Trip
          </Button>

          <Button variant="outlined" onClick={downloadPDF}>
            Download PDF
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="h5">Saved Trips</Typography>

          {savedTrips.map((trip, index) => (
            <Card key={index} sx={{ mt: 2 }}>
              <CardContent>
                <Typography>
                  {trip.customerName} - {trip.country}
                </Typography>
                <Typography>₹{trip.finalPrice}</Typography>

                <Button
                  color="error"
                  onClick={() => deleteTrip(index)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </>
  );
}
