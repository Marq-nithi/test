import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box
} from "@mui/material";
import jsPDF from "jspdf";

/* ================= COUNTRY DATA ================= */

const countryData = {
  India: {
    banner:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80",
    days: [
      {
        image:
          "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
        title: "Arrival in Delhi",
        description: "Arrival at airport and transfer to hotel."
      },
      {
        image:
          "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
        title: "Taj Mahal Visit",
        description: "Explore the iconic Taj Mahal."
      },
      {
        image:
          "https://images.unsplash.com/photo-1599661046827-dacff0f0e0e6?auto=format&fit=crop&w=800&q=80",
        title: "Jaipur City Tour",
        description: "Visit Amber Fort and City Palace."
      }
    ]
  },

  Dubai: {
    banner:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=80",
    days: [
      {
        image:
          "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=80",
        title: "Burj Khalifa Visit",
        description: "Visit the world's tallest building."
      },
      {
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        title: "Desert Safari",
        description: "Dune bashing and BBQ dinner."
      },
      {
        image:
          "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80",
        title: "Dubai Marina Cruise",
        description: "Evening cruise with dinner."
      }
    ]
  },

  Singapore: {
    banner:
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1400&q=80",
    days: [
      {
        image:
          "https://images.unsplash.com/photo-1526481280690-906a5d0c4c0e?auto=format&fit=crop&w=800&q=80",
        title: "Marina Bay Sands",
        description: "Visit Marina Bay Sands SkyPark."
      },
      {
        image:
          "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80",
        title: "Sentosa Island",
        description: "Universal Studios experience."
      },
      {
        image:
          "https://images.unsplash.com/photo-1555217851-6141535bd771?auto=format&fit=crop&w=800&q=80",
        title: "Night Safari",
        description: "Explore wildlife at night."
      }
    ]
  },

  Thailand: {
    banner:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1400&q=80",
    days: [
      {
        image:
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80",
        title: "Bangkok Temple Tour",
        description: "Visit Wat Arun and Grand Palace."
      },
      {
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        title: "Pattaya Beach",
        description: "Relax by the beach."
      },
      {
        image:
          "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=80",
        title: "Phuket Island Tour",
        description: "Island hopping adventure."
      }
    ]
  }
};

/* ================= APP ================= */

export default function App() {
  const defaultForm = {
    name: "",
    title: "",
    age: "",
    country: "",
    days: "",
    banner: ""
  };

  const [form, setForm] = useState(defaultForm);
  const [itinerary, setItinerary] = useState([]);

  /* SAFE Draft Loading */
  useEffect(() => {
    const draft = localStorage.getItem("itineraryDraft");

    if (draft) {
      try {
        const parsed = JSON.parse(draft);

        if (parsed?.form) setForm(parsed.form);
        if (parsed?.itinerary) setItinerary(parsed.itinerary);
      } catch (error) {
        console.log("Draft corrupted, clearing...");
        localStorage.removeItem("itineraryDraft");
      }
    }
  }, []);

  const handleChange = (field, value) => {
    if (field === "country") {
      setForm((prev) => ({
        ...prev,
        country: value,
        banner: countryData[value]?.banner || ""
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!form.country || !form.days) return;

    const selectedDays = countryData[form.country]?.days || [];
    const count = parseInt(form.days) || 0;

    setItinerary(selectedDays.slice(0, count));
  };

  const saveDraft = () => {
    localStorage.setItem(
      "itineraryDraft",
      JSON.stringify({ form, itinerary })
    );
    alert("Draft Saved Successfully!");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(form.title || "Travel Itinerary", 20, 20);
    doc.text(`Name: ${form.name}`, 20, 30);
    doc.text(`Age: ${form.age}`, 20, 40);
    doc.text(`Country: ${form.country}`, 20, 50);

    let y = 60;
    itinerary.forEach((day, index) => {
      doc.text(`Day ${index + 1} - ${day.title}`, 20, y);
      y += 10;
      doc.text(day.description, 20, y);
      y += 20;
    });

    doc.save("itinerary.pdf");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Travel Itinerary Builder
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Age"
            value={form.age}
            onChange={(e) => handleChange("age", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Country"
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
          >
            {Object.keys(countryData).map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Number of Days"
            type="number"
            value={form.days}
            onChange={(e) => handleChange("days", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>
            Create Itinerary
          </Button>

          <Button sx={{ ml: 2 }} onClick={saveDraft}>
            Save Draft
          </Button>

          <Button sx={{ ml: 2 }} onClick={downloadPDF}>
            Download PDF
          </Button>
        </Grid>
      </Grid>

      {/* Banner */}
      {form.banner && (
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardMedia
              component="img"
              height="250"
              image={form.banner}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/1400x400?text=Banner+Image")
              }
            />
          </Card>
        </Box>
      )}

      {/* Days */}
      <Box sx={{ mt: 4 }}>
        {itinerary.map((day, index) => (
          <Card key={index} sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="200"
              image={day.image}
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/800x400?text=Day+Image")
              }
            />
            <CardContent>
              <Typography variant="h6">
                Day {index + 1} – {day.title}
              </Typography>
              <Typography>{day.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}