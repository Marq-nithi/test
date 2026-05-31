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
  Chip,
  Autocomplete,
} from "@mui/material";
import { Add, Remove, DeleteOutline } from "@mui/icons-material";
import { useItinerary } from "../../context/ItineraryContext";
import { useMasterEntries } from "../../services/backendApi";

// 🚨 EXACT FIGMA FIELD LABEL
const FieldLabel = ({ text, required }) => (
  <Typography
    variant="caption"
    sx={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      color: "#0f172a",
      mb: 1,
      display: "block",
      fontSize: "0.85rem",
    }}
  >
    {text} {required && <span style={{ color: "#ef4444" }}>*</span>}
  </Typography>
);

// 🚨 CUSTOM STYLED INPUT MATCHING EXACT FIGMA SPECS (44px Height, 0.67px Border, 8px Radius)
const StyledTextField = (props) => (
  <TextField
    {...props}
    sx={{
      "& .MuiOutlinedInput-root": {
        bgcolor: "#fff",
        borderRadius: "8px",     // Exact border radius
        height: "44px",          // Exact height
        padding: props.select ? "0px" : "0px",
        "& fieldset": {
          borderColor: "#e2e8f0",
          borderWidth: "0.67px", // Exact border width
          transition: "all 0.2s ease-in-out",
        },
        "&:hover fieldset": { borderColor: "#cbd5e1" },
        "&.Mui-focused fieldset": {
          borderColor: "#0ea5e9",
          borderWidth: "1px",
        },
      },
      "& .MuiInputBase-input": {
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
        fontSize: "14px",
        lineHeight: "100%",
        letterSpacing: "0px",
        color: "#334155",
        height: "100%",
        boxSizing: "border-box",
        px: 1.5,
        display: "flex",
        alignItems: "center",
      },
      "& .MuiSelect-select": {
        display: "flex",
        alignItems: "center",
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
    setHotels((prevHotels) => [
      ...prevHotels,
      {
        ...defaultHotel,
        id: Date.now(),
        type: "hotel",
        location: prevHotels[0]?.location || "",
      },
    ]);
  };

  const handleAddSplitStay = () => {
    setHotels((prevHotels) => [
      ...prevHotels,
      { ...defaultHotel, id: Date.now(), type: "split", location: "" },
    ]);
  };

  const handleRemoveHotel = (id) => {
    setHotels((prevHotels) => prevHotels.filter((hotel) => hotel.id !== id));
  };

  const handleClearAll = () => {
    setHotels([{ ...defaultHotel, id: Date.now() }]);
  };

  const handleUpdate = (id, field, value) => {
    setHotels((prevHotels) =>
      prevHotels.map((hotel) =>
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
    setHotels((prevHotels) =>
      prevHotels.map((hotel) => {
        if (hotel.id === id) {
          return { ...hotel, [field]: Math.max(1, hotel[field] + increment) };
        }
        return hotel;
      }),
    );
  };

  const handleMealUpdate = (id, mealType, checked) => {
    setHotels((prevHotels) =>
      prevHotels.map((hotel) => {
        if (hotel.id === id) {
          return { ...hotel, meals: { ...hotel.meals, [mealType]: checked } };
        }
        return hotel;
      }),
    );
  };

  const handleAddAmenity = (hotelId, event) => {
    if (event.key === "Enter" && event.target.value.trim() !== "") {
      event.preventDefault();
      const newAmenity = event.target.value.trim();
      const hotel = hotels.find((h) => h.id === hotelId);
      const safeAmenities = hotel.amenities || []; 

      if (!safeAmenities.includes(newAmenity)) {
        handleUpdate(hotelId, "amenities", [...safeAmenities, newAmenity]);
      }
      event.target.value = ""; 
    }
  };

  const handleRemoveAmenity = (hotelId, amenityToRemove) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    const safeAmenities = hotel.amenities || [];
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
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        pb: 12,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Box sx={{ maxWidth: "1136px", mx: "auto" }}>
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
            <Typography variant="h6" fontWeight="800" color="#0f172a" mb={0.5} sx={{ fontFamily: "'Inter', sans-serif" }}>
              Hotel Details
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ fontFamily: "'Inter', sans-serif" }}>
              Configure hotel accommodation for your client's trip
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={handleClearAll}
            sx={{
              borderColor: "#e2e8f0",
              color: "#0f172a",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              height: "36px",
              bgcolor: "#fff",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Clear All
          </Button>
        </Box>

        {/* HOTEL CARDS */}
        {(hotels || []).map((hotel, index) => {
          const safeAmenities = hotel.amenities || [];

          return (
            <Paper
              key={hotel.id}
              elevation={0}
              sx={{
                p: 4,
                border: "0.6px solid #e2e8f0", // Exact border width
                borderRadius: "12.51px",       // Exact border radius
                mb: 3,
                bgcolor: "#fff",
                position: "relative",
                width: "100%",
                maxWidth: "1136px",            // Exact width constraint
                minHeight: "399px",            // Exact height constraint
              }}
            >
              {/* CARD TITLE & DELETE BUTTON */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, color: "#0f172a", fontFamily: "'Inter', sans-serif" }}
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

              {/* 🚨 EXPLICIT VERTICAL LAYOUT TO PREVENT GRID COLLAPSING 🚨 */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                
                {/* --- ROW 1: LOCATION (Isolated, Exact 357px Width) --- */}
                <Box sx={{ width: "100%", maxWidth: "357px" }}>
                  <FieldLabel text="Location" />
                  <StyledTextField
                    fullWidth
                    placeholder="Goa, India"
                    value={hotel.location}
                    onChange={(e) =>
                      handleUpdate(hotel.id, "location", e.target.value)
                    }
                  />
                </Box>

                {/* --- ROW 2: HOTEL NAME, PREF, CATEGORY, ROOMS --- */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Hotel Name" required />
                    <Autocomplete
                      freeSolo
                      fullWidth
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
                      isOptionEqualToValue={(option, val) => {
                        if (!option || !val) return false;
                        return option?.value === val?.value || option?.label === val?.label || option?.label === val;
                      }}
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
                      <MenuItem value="Budget" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Budget</MenuItem>
                      <MenuItem value="3 Star" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>3 Star</MenuItem>
                      <MenuItem value="4 Star" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>4 Star</MenuItem>
                      <MenuItem value="5 Star" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>5 Star</MenuItem>
                      <MenuItem value="Luxury Resort" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Luxury Resort</MenuItem>
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

                  {/* ROOMS COUNTER (Exact 44px Height) */}
                  <Grid item xs={12} md={3}>
                    <FieldLabel text="Rooms" required />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        onClick={() => handleCountUpdate(hotel.id, "rooms", -1)}
                        sx={{
                          border: "0.67px solid #e2e8f0",
                          borderRadius: "8px",
                          width: "44px",
                          height: "44px",
                          bgcolor: "#f8fafc"
                        }}
                      >
                        <Remove sx={{ color: "#64748b", fontSize: "1.2rem" }} />
                      </IconButton>
                      <Box
                        sx={{
                          border: "0.67px solid #e2e8f0",
                          flexGrow: 1, 
                          height: "44px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "#f8fafc"
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "#334155", fontFamily: "'Inter', sans-serif" }}
                        >
                          {hotel.rooms || 1}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleCountUpdate(hotel.id, "rooms", 1)}
                        sx={{
                          border: "0.67px solid #e2e8f0",
                          borderRadius: "8px",
                          width: "44px",
                          height: "44px",
                          bgcolor: "#f8fafc"
                        }}
                      >
                        <Add sx={{ color: "#64748b", fontSize: "1.2rem" }} />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>

                {/* --- ROW 3: CHECK-IN / CHECK-OUT --- */}
                <Grid container spacing={3}>
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
                      <MenuItem value="12:00 PM" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>12:00 PM</MenuItem>
                      <MenuItem value="2:00 PM" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>2:00 PM</MenuItem>
                      <MenuItem value="3:00 PM" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>3:00 PM</MenuItem>
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
                      <MenuItem value="10:00 AM" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>10:00 AM</MenuItem>
                      <MenuItem value="11:00 AM" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>11:00 AM</MenuItem>
                      <MenuItem value="12:00 PM" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>12:00 PM</MenuItem>
                    </StyledTextField>
                  </Grid>
                </Grid>

                {/* --- ROW 4: MEAL PLAN (Isolated to its own row) --- */}
                <Box>
                  <FieldLabel text="Meal Plan" />
                  <FormGroup row sx={{ mt: 0, gap: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hotel.meals?.breakfast || false}
                          onChange={(e) =>
                            handleMealUpdate(hotel.id, "breakfast", e.target.checked)
                          }
                          size="small"
                          sx={{ "&.Mui-checked": { color: "#0ea5e9" } }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="#334155" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
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
                        <Typography variant="body2" color="#334155" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
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
                        <Typography variant="body2" color="#334155" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                          Dinner
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hotel.meals?.allInclusive || false}
                          onChange={(e) =>
                            handleMealUpdate(hotel.id, "allInclusive", e.target.checked)
                          }
                          size="small"
                          sx={{ "&.Mui-checked": { color: "#0ea5e9" } }}
                        />
                      }
                      label={
                        <Typography variant="body2" color="#334155" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500 }}>
                          All Inclusive
                        </Typography>
                      }
                    />
                  </FormGroup>
                </Box>
                
                {/* --- ROW 5: AMENITIES --- */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FieldLabel text="Amenities (Press Enter to add)" />
                    <StyledTextField
                      fullWidth
                      placeholder="Free Wifi"
                      onKeyDown={(e) => handleAddAmenity(hotel.id, e)}
                    />
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <FieldLabel text="Selected Amenities" />
                    <Box
                      sx={{
                        minHeight: "44px", // Matches input height
                        border: "0.67px solid #e2e8f0",
                        borderRadius: "8px",
                        bgcolor: "#fff",
                        p: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
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
                            fontFamily: "'Inter', sans-serif",
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
                          sx={{ color: "#94a3b8", ml: 1, fontFamily: "'Inter', sans-serif" }}
                        >
                          No amenities added
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>

              </Box>
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
            maxWidth: "1136px",
            mx: "auto",
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
                height: "36px",
                bgcolor: "#fff",
                fontFamily: "'Inter', sans-serif"
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
                height: "36px",
                bgcolor: "#fff",
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Split Stay
            </Button>
          </Box>

          <Button
            variant="outlined"
            size="small"
            sx={{
              color: "#0f172a",
              borderColor: "#e2e8f0",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              px: 3,
              height: "36px",
              bgcolor: "#fff",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Add-Ons
          </Button>
        </Box>
      </Box>
    </Box>
  );
}