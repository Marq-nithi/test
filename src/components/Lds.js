import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Badge,
  Avatar,
  Switch
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { motion } from "framer-motion";

 
/**
 * Premium Itinerary Builder App (MUI + Glass + Parallax + Dark Mode)
 */
export default function App() {
  // theme / mode
  const [dark, setDark] = useState(false);

  // form states
  const [country, setCountry] = useState("");
  const [days, setDays] = useState("");
  const [price, setPrice] = useState("");
  const [selectedDefault, setSelectedDefault] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [descriptions, setDescriptions] = useState([]);
  const [logo, setLogo] = useState(null);

  // cards saved
  const [cards, setCards] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // parallax offset (small effect)
  const [offsetY, setOffsetY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.pageYOffset);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // default options per country (can be extended)
  const [defaultOptions, setDefaultOptions] = useState({
    Dubai: [
      "Visit Burj Khalifa",
      "Desert Safari & BBQ",
      "Dhow Dinner Cruise"
    ],
    Singapore: [
      "Universal Studios Singapore",
      "Gardens by the Bay",
      "Sentosa Island Highlights"
    ],
    Thailand: [
      "Phi Phi Island Tour",
      "Bangkok Temple Tour",
      "Phuket Beach Day"
    ],
    Maldives: [
      "Water Villa Stay",
      "Snorkeling Trips",
      "Private Beach Dinner"
    ]
  });

  // MUI theme with gradient red primary and dark mode switch
  const theme = createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      primary: { main: "#d32f2f" }, // red
      background: {
        default: dark ? "#0b0b0b" : "#fff7f6"
      }
    },
    typography: {
      fontFamily: '"Inter", "Poppins", Arial, sans-serif'
    }
  });

  // Logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  // add default description (prevent duplicates)
  const addDefaultDescription = () => {
    if (!selectedDefault) return;
    if (descriptions.includes(selectedDefault)) return;
    setDescriptions((s) => [...s, selectedDefault]);
    setSelectedDefault("");
  };

  // add custom description
  const addCustomDescription = () => {
    if (!customInput) return;
    setDescriptions((s) => [...s, customInput]);
    setCustomInput("");
  };

  // edit a description inline (prompt for simplicity)
  const editDescription = (i) => {
    const updated = prompt("Edit description:", descriptions[i]);
    if (!updated) return;
    setDescriptions((s) => {
      const copy = [...s];
      copy[i] = updated;
      return copy;
    });
  };

  // delete description
  const deleteDescription = (i) =>
    setDescriptions((s) => s.filter((_, idx) => idx !== i));

  // create or update card
  const handleCreate = () => {
    if (!country || !days || descriptions.length === 0) {
      alert("Please fill country, days and add at least one description.");
      return;
    }
    const newCard = {
      country,
      days,
      price,
      descriptions,
      logo
    };

    if (editingIndex !== null) {
      setCards((c) => {
        const copy = [...c];
        copy[editingIndex] = newCard;
        return copy;
      });
      setEditingIndex(null);
    } else {
      setCards((c) => [newCard, ...c]); // newest first
    }
    // reset
    setCountry("");
    setDays("");
    setPrice("");
    setDescriptions([]);
    setLogo(null);
    setSelectedDefault("");
    setCustomInput("");
  };

  // edit card
  const handleEditCard = (idx) => {
    const card = cards[idx];
    setCountry(card.country);
    setDays(card.days);
    setPrice(card.price);
    setDescriptions([...card.descriptions]);
    setLogo(card.logo || null);
    setEditingIndex(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // delete card
  const handleDeleteCard = (idx) =>
    setCards((c) => c.filter((_, i) => i !== idx));

  // add new option to defaultOptions for current country
  const addOptionToCountry = (text) => {
    if (!country || !text) return;
    setDefaultOptions((d) => {
      const copy = { ...d };
      copy[country] = copy[country] ? [...copy[country], text] : [text];
      return copy;
    });
  };

  // get image for card header (unsplash query by country)
  const getImageForCountry = (c) =>
    `https://source.unsplash.com/800x600/?${encodeURIComponent(c + " travel")}`;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* hero + parallax background */}
      <div
        className="hero"
        style={{
          transform: `translateY(${offsetY * 0.05}px)`,
          background:
            "linear-gradient(180deg, rgba(211,47,47,0.85), rgba(255,255,255,0.02))"
        }}
      >
        <AppBar
          position="sticky"
          elevation={3}
          sx={{
            background: "linear-gradient(90deg,#b71c1c,#d32f2f)",
            backdropFilter: "saturate(140%) blur(6px)"
          }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Avatar sx={{ bgcolor: "white", color: "#d32f2f", mr: 1 }}>
                TH
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Triumph Holidays
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {dark ? "Dark" : "Light"}
              </Typography>
              <IconButton
                color="inherit"
                onClick={() => setDark((v) => !v)}
                sx={{ ml: 1 }}
              >
                {dark ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: 800,
              mb: 1,
              textShadow: "0 3px 10px rgba(0,0,0,0.4)"
            }}
          >
            Premium Travel Packages
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.9)", mb: 4 }}>
            Design, build, and sell premium holiday experiences — powered by Triumph Holidays.
          </Typography>

          {/* Form Card (glass) */}
          <Box
            sx={{
              backdropFilter: "blur(6px)",
              background: dark
                ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))"
                : "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.45))",
              border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(211,47,47,0.08)"}`,
              p: 3,
              borderRadius: 3,
              boxShadow: dark ? "0 8px 30px rgba(0,0,0,0.6)" : "0 10px 40px rgba(211,47,47,0.08)"
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Country</InputLabel>
                  <Select
                    value={country}
                    label="Country"
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    {Object.keys(defaultOptions).map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <TextField
                  fullWidth
                  label="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                {country ? (
                  <FormControl fullWidth>
                    <InputLabel>Default Description</InputLabel>
                    <Select
                      value={selectedDefault}
                      label="Default Description"
                      onChange={(e) => setSelectedDefault(e.target.value)}
                    >
                      {defaultOptions[country].map((opt, i) => (
                        <MenuItem key={i} value={opt} disabled={descriptions.includes(opt)}>
                          {`Description ${i + 1} - ${opt}`}
                        </MenuItem>
                      ))}
                    </Select>
                    <Button sx={{ mt: 1 }} variant="contained" onClick={addDefaultDescription}>
                      Add Default
                    </Button>
                  </FormControl>
                ) : (
                  <Box sx={{ height: 86 }} />
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Add custom description"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addCustomDescription(); }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Button
                  startIcon={<UploadFileIcon />}
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Logo
                  <input hidden accept="image/*" type="file" onChange={handleLogoUpload} />
                </Button>
                {logo && (
                  <Box sx={{ mt: 1 }}>
                    <img src={logo} alt="preview" style={{ width: 120, height: 60, objectFit: "contain", borderRadius: 6, background: "white", padding: 6 }} />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={3}>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={addCustomDescription}>Add Custom</Button>
                  <Button color="secondary" variant="contained" onClick={() => addOptionToCountry(customInput || "New Option")}>
                    Add to Defaults
                  </Button>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  {descriptions.map((d, i) => (
                    <Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, bgcolor: dark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.6)", borderRadius: 1 }}>
                      <Typography sx={{ color: dark ? "#fff" : "#000" }}>{i + 1}. {d}</Typography>
                      <Box>
                        <IconButton onClick={() => editDescription(i)}><EditIcon /></IconButton>
                        <IconButton onClick={() => deleteDescription(i)}><DeleteIcon /></IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Button size="large" fullWidth variant="contained" onClick={handleCreate} sx={{ py: 1.6, background: "linear-gradient(90deg,#b71c1c,#d32f2f)" }}>
                  {editingIndex !== null ? "Update Itinerary" : "Create Itinerary"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>

      {/* Cards */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        <Grid container spacing={4}>
          {cards.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="textSecondary">No packages yet — create one above 👆</Typography>
            </Grid>
          )}

          {cards.map((card, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 120 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: dark ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))" : "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.6))"
                  }}
                >
                  {/* top red bar with logo and price */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1, background: "linear-gradient(90deg,#b71c1c,#d32f2f)" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {card.logo ? (
                        <Avatar variant="rounded" src={card.logo} sx={{ width: 56, height: 36, bgcolor: "white" }} />
                      ) : (
                        <Avatar variant="rounded" sx={{ bgcolor: "white", color: "#d32f2f", fontWeight: 700 }}>TH</Avatar>
                      )}
                      <Typography sx={{ color: "white", fontWeight: 700 }}>{card.country}</Typography>
                    </Box>

                    <Badge
                      badgeContent={`₹ ${card.price || "-"}`}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          background: "#fff",
                          color: "#b71c1c",
                          fontWeight: 700,
                          padding: "8px 12px",
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  {/* image */}
                  <CardMedia
                    component="img"
                    height="180"
                    image={getImageForCountry(card.country)}
                    alt={card.country}
                    sx={{ objectFit: "cover" }}
                  />

                  <CardContent>
                    <Typography variant="subtitle1" sx={{ color: "#d32f2f", fontWeight: 700 }}>{card.days} Days</Typography>

                    {/* itinerary glass box */}
                    <Box sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      background: dark ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))" : "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.8))",
                      border: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(211,47,47,0.06)"}`
                    }}>
                      <Typography variant="subtitle2" sx={{ color: "#d32f2f", fontWeight: 700, mb: 1 }}>Itinerary</Typography>
                      {card.descriptions.map((d, i) => (
                        <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>• {d}</Typography>
                      ))}
                    </Box>

                    {/* actions */}
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2 }}>
                      <Button size="small" variant="outlined" onClick={() => handleEditCard(idx)}>Edit</Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleDeleteCard(idx)}>Delete</Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
