import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  Chip,
  Autocomplete,
} from "@mui/material";
import { Add, Remove, DeleteOutline } from "@mui/icons-material";
import { useItinerary } from "../../context/ItineraryContext";
import { useMasterEntries } from "../../services/backendApi";
// Exact Figma Field Label
const FieldLabel = ({ text, required }) => (
  <Typography
    variant="caption"
    sx={{
      fontWeight: 600,
      color: "#334155",
      mb: 1,
      display: "block",
      fontSize: "0.85rem",
    }}
  >
    {text} {required && <span style={{ color: "#ef4444" }}>*</span>}
  </Typography>
);

// Custom Styled Input matching your Figma aesthetic
const StyledTextField = (props) => (
  <TextField
    {...props}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        bgcolor: "#fff",
        borderRadius: "8px",
        "& fieldset": {
          borderColor: "#e2e8f0",
          transition: "all 0.2s ease-in-out",
        },
        "&:hover fieldset": { borderColor: "#cbd5e1" },
        "&.Mui-focused fieldset": {
          borderColor: "#0ea5e9",
          borderWidth: "1px",
        },
      },
      "& .MuiInputBase-input": {
        color: "#475569",
        fontSize: "0.875rem",
        fontWeight: 400,
      },
      ...props.sx,
    }}
  />
);

export default function StayDetails() {
  const { stayData, setStayData } = useItinerary();

  // The default blueprint for a new hotel
  const defaultHotel = {
    id: Date.now(),
    type: "main",
    location: "Goa, India",
    hotelName: "",
    hotelPref: "Luxury Resort",
    roomCat: "Deluxe",
    checkInDate: "",
    checkInTime: "3:00 PM",
    checkOutDate: "",
    checkOutTime: "11:00 AM",
    rooms: 1,
    price: "",
    amenities: [],
    meals: { breakfast: true, lunch: false, dinner: true, allInclusive: false },
  };

  // Load existing data from the global brain, otherwise start fresh
  const [hotels, setHotels] = useState(
    stayData?.hotels?.length ? stayData.hotels : [{ ...defaultHotel }],
  );
  const [sugg, setSugg] = useState([]);

  const { getAllMasterEntries } = useMasterEntries();
  useEffect(() => {
    getAllMasterEntries().then((data) => {
      const entries = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

      const hotelOptions = entries
        .filter((entry) => entry?.type === "Hotels" && entry?.params?.name)
        .map((entry) => ({
          value: entry.id,
          label: entry.params.name,
          price: entry.params.price ?? "",
          roomCat: entry.params.roomCat ?? "",
          location: entry.params.location ?? "",
          amenities: Array.isArray(entry.params.amenities)
            ? entry.params.amenities
            : [],
        }));

      setSugg(hotelOptions);
    });
  }, []);

  useEffect(() => {
    if (setStayData) setStayData({ hotels });
  }, [hotels, setStayData]);

  // Handlers
  const handleAddHotel = () => {
    setHotels([
      ...hotels,
      {
        ...defaultHotel,
        id: Date.now(),
        type: "hotel",
        location: hotels[0]?.location || "",
      },
    ]);
  };

  const handleAddSplitStay = () => {
    setHotels([
      ...hotels,
      { ...defaultHotel, id: Date.now(), type: "split", location: "" },
    ]);
  };

  const handleRemoveHotel = (id) => {
    setHotels(hotels.filter((hotel) => hotel.id !== id));
  };

  const handleClearAll = () => {
    setHotels([{ ...defaultHotel, id: Date.now() }]);
  };

  const handleUpdate = (id, field, value) => {
    setHotels(
      hotels.map((hotel) =>
        hotel.id === id ? { ...hotel, [field]: value } : hotel,
      ),
    );
  };

  const handleHotelSuggestionSelect = (hotelId, selectedOption) => {
    if (!selectedOption || typeof selectedOption === "string") {
      handleUpdate(hotelId, "hotelName", selectedOption || "");
      handleUpdate(hotelId, "hotelMasterId", null);
      return;
    }

    setHotels((prev) =>
      prev.map((hotel) =>
        hotel.id === hotelId
          ? {
              ...hotel,
              hotelName: selectedOption.label || "",
              hotelMasterId: selectedOption.value || null,
              location: selectedOption.location || hotel.location,
              roomCat: selectedOption.roomCat || hotel.roomCat,
              price: selectedOption.price || hotel.price,
              amenities:
                selectedOption.amenities?.length > 0
                  ? selectedOption.amenities
                  : hotel.amenities,
            }
          : hotel,
      ),
    );
  };

  const handleCountUpdate = (id, field, increment) => {
    setHotels(
      hotels.map((hotel) => {
        if (hotel.id === id) {
          return { ...hotel, [field]: Math.max(1, hotel[field] + increment) };
        }
        return hotel;
      }),
    );
  };

  const handleMealUpdate = (id, mealType, checked) => {
    setHotels(
      hotels.map((hotel) => {
        if (hotel.id === id) {
          return { ...hotel, meals: { ...hotel.meals, [mealType]: checked } };
        }
        return hotel;
      }),
    );
  };

  // 🚨 SAFE Amenities Handlers
  const handleAddAmenity = (hotelId, event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      event.preventDefault();
      const newAmenity = event.target.value.trim();
      const hotel = hotels.find((h) => h.id === hotelId);

      const safeAmenities = hotel.amenities || []; // Safety check

      if (!safeAmenities.includes(newAmenity)) {
        handleUpdate(hotelId, "amenities", [...safeAmenities, newAmenity]);
      }
      event.target.value = ""; // clear input
    }
  };

  const handleRemoveAmenity = (hotelId, amenityToRemove) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    const safeAmenities = hotel.amenities || []; // Safety check
    handleUpdate(
      hotelId,
      "amenities",
      safeAmenities.filter((a) => a !== amenityToRemove),
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        mx: "auto",
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        pb: 12,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="800" color="#0f172a" mb={0.5}>
            Hotel Details
          </Typography>
          <Typography variant="body2" color="#64748b">
            Configure hotel accommodation for your client's trip
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          onClick={handleClearAll}
          sx={{
            borderColor: "#e2e8f0",
            color: "#334155",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            bgcolor: "#fff",
          }}
        >
          Clear All
        </Button>
      </Box>

      {/* HOTEL CARDS */}
      {(hotels || []).map((hotel, index) => {
        // 🚨 SAFE AMENITIES ARRAY FOR RENDERING
        const safeAmenities = hotel.amenities || [];

        return (
          <Paper
            key={hotel.id}
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              mb: 3,
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "#0f172a" }}
              >
                {hotel.type === "main"
                  ? "Hotel Accommodation"
                  : hotel.type === "split"
                    ? "Split Stay Accommodation"
                    : "Additional Hotel"}
              </Typography>

              {index > 0 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveHotel(hotel.id)}
                  sx={{
                    color: "#ef4444",
                    border: "1px solid #fecaca",
                    bgcolor: "#fff",
                    borderRadius: "6px",
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={3}>
              {/* Row 1: Location, Hotel Name, Preference, Room Category */}
              <Grid item xs={12} md={12}>
                <FieldLabel text="Location" />
                <StyledTextField
                  fullWidth
                  placeholder="Goa, India"
                  value={hotel.location}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "location", e.target.value)
                  }
                />
              </Grid>
              <Grid item >
                <FieldLabel text="Hotel Name" required />
                <Autocomplete
                  freeSolo
                  sx={{
                    width : '300px'
                  }}
                  options={sugg}
                  value={
                    sugg.find(
                      (option) =>
                        option.value === hotel.hotelMasterId ||
                        option.value === hotel.hotelName ||
                        option.label === hotel.hotelName,
                    ) ||
                    hotel.hotelName ||
                    ""
                  }
                  onChange={(_, selectedOption) =>
                    handleHotelSuggestionSelect(hotel.id, selectedOption)
                  }
                  onInputChange={(_, inputValue, reason) => {
                    if (reason === "input") {
                      handleUpdate(hotel.id, "hotelName", inputValue);
                      handleUpdate(hotel.id, "hotelMasterId", null);
                    }
                  }}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option?.label || ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value ||
                    option.label === value.label
                  }
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      fullWidth
                      placeholder="e.g. SVG"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FieldLabel text="Hotel Preference" required />
                <StyledTextField
                  select
                  fullWidth
                  value={hotel.hotelPref || "Luxury Resort"}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "hotelPref", e.target.value)
                  }
                >
                  <MenuItem value="Budget">Budget</MenuItem>
                  <MenuItem value="3 Star">3 Star</MenuItem>
                  <MenuItem value="4 Star">4 Star</MenuItem>
                  <MenuItem value="5 Star">5 Star</MenuItem>
                  <MenuItem value="Luxury Resort">Luxury Resort</MenuItem>
                </StyledTextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <FieldLabel text="Room Category" />
                <StyledTextField
                  fullWidth
                  placeholder="Deluxe"
                  value={hotel.roomCat}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "roomCat", e.target.value)
                  }
                />
              </Grid>

              {/* Row 2: Check-in / Check-out */}
              <Grid item xs={12} md={3}>
                <FieldLabel text="Check-In Date" required />
                <StyledTextField
                  fullWidth
                  type="date"
                  value={hotel.checkInDate}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "checkInDate", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FieldLabel text="Check-In Time" />
                <StyledTextField
                  select
                  fullWidth
                  value={hotel.checkInTime || "3:00 PM"}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "checkInTime", e.target.value)
                  }
                >
                  <MenuItem value="12:00 PM">12:00 PM</MenuItem>
                  <MenuItem value="2:00 PM">2:00 PM</MenuItem>
                  <MenuItem value="3:00 PM">3:00 PM</MenuItem>
                </StyledTextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <FieldLabel text="Check-Out Date" required />
                <StyledTextField
                  fullWidth
                  type="date"
                  value={hotel.checkOutDate}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "checkOutDate", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FieldLabel text="Check-Out Time" />
                <StyledTextField
                  select
                  fullWidth
                  value={hotel.checkOutTime || "11:00 AM"}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "checkOutTime", e.target.value)
                  }
                >
                  <MenuItem value="10:00 AM">10:00 AM</MenuItem>
                  <MenuItem value="11:00 AM">11:00 AM</MenuItem>
                  <MenuItem value="12:00 PM">12:00 PM</MenuItem>
                </StyledTextField>
              </Grid>

              {/* Row 3: Rooms, Price, Amenities Input, Selected Amenities Box */}
              <Grid item xs={12} md={3}>
                <FieldLabel text="Rooms" required />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleCountUpdate(hotel.id, "rooms", -1)}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      width: 36,
                      height: 36,
                    }}
                  >
                    <Remove fontSize="small" sx={{ color: "#64748b" }} />
                  </IconButton>
                  <Box
                    sx={{
                      border: "1px solid #e2e8f0",
                      width: "100%",
                      height: 36,
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "#334155" }}
                    >
                      {hotel.rooms || 1}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleCountUpdate(hotel.id, "rooms", 1)}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      width: 36,
                      height: 36,
                    }}
                  >
                    <Add fontSize="small" sx={{ color: "#64748b" }} />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel text="Price" />
                <StyledTextField
                  fullWidth
                  type="number"
                  placeholder="200"
                  value={hotel.price || ""}
                  onChange={(e) =>
                    handleUpdate(hotel.id, "price", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ color: "#475569" }}
                      >
                        $
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel text="Amenities" />
                <StyledTextField
                  fullWidth
                  placeholder="Free Wifi (Press Enter)"
                  onKeyDown={(e) => handleAddAmenity(hotel.id, e)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FieldLabel text="Selected Amenities" />
                <Box
                  sx={{
                    minHeight: "40px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    bgcolor: "#fff",
                    p: 0.5,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    alignItems: "center",
                  }}
                >
                  {safeAmenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      onDelete={() => handleRemoveAmenity(hotel.id, amenity)}
                      size="small"
                      sx={{
                        bgcolor: "#f0f9ff",
                        color: "#0ea5e9",
                        border: "1px solid #bae6fd",
                        "& .MuiChip-deleteIcon": {
                          color: "#0ea5e9",
                          "&:hover": { color: "#0284c7" },
                        },
                      }}
                    />
                  ))}
                  {safeAmenities.length === 0 && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#94a3b8", ml: 1 }}
                    >
                      No amenities added
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Row 4: Meal Plan */}
              <Grid item xs={12}>
                <FieldLabel text="Meal Plan" />
                <FormGroup row sx={{ mt: -0.5, gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hotel.meals?.breakfast || false}
                        onChange={(e) =>
                          handleMealUpdate(
                            hotel.id,
                            "breakfast",
                            e.target.checked,
                          )
                        }
                        size="small"
                        sx={{ "&.Mui-checked": { color: "#0ea5e9" } }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        color="#334155"
                        fontWeight="500"
                      >
                        Breakfast
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hotel.meals?.lunch || false}
                        onChange={(e) =>
                          handleMealUpdate(hotel.id, "lunch", e.target.checked)
                        }
                        size="small"
                        sx={{ "&.Mui-checked": { color: "#0ea5e9" } }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        color="#334155"
                        fontWeight="500"
                      >
                        Lunch
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hotel.meals?.dinner || false}
                        onChange={(e) =>
                          handleMealUpdate(hotel.id, "dinner", e.target.checked)
                        }
                        size="small"
                        sx={{ "&.Mui-checked": { color: "#0ea5e9" } }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        color="#334155"
                        fontWeight="500"
                      >
                        Dinner
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hotel.meals?.allInclusive || false}
                        onChange={(e) =>
                          handleMealUpdate(
                            hotel.id,
                            "allInclusive",
                            e.target.checked,
                          )
                        }
                        size="small"
                        sx={{ "&.Mui-checked": { color: "#0ea5e9" } }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        color="#334155"
                        fontWeight="500"
                      >
                        All Inclusive
                      </Typography>
                    }
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Paper>
        );
      })}

      {/* BOTTOM ACTION BUTTONS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add sx={{ fontSize: 18 }} />}
            onClick={handleAddHotel}
            sx={{
              color: "#334155",
              borderColor: "#e2e8f0",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              bgcolor: "#fff",
            }}
          >
            Hotel
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add sx={{ fontSize: 18 }} />}
            onClick={handleAddSplitStay}
            sx={{
              color: "#334155",
              borderColor: "#e2e8f0",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              px: 2,
              bgcolor: "#fff",
            }}
          >
            Split Stay
          </Button>
        </Box>

        <Button
          variant="outlined"
          size="small"
          sx={{
            color: "#334155",
            borderColor: "#e2e8f0",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "8px",
            px: 3,
            bgcolor: "#fff",
          }}
        >
          Add-Ons
        </Button>
      </Box>
    </Box>
  );
}
