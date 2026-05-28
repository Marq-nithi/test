import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Search,
  Add,
  LocationOn,
  EditOutlined,
  DeleteOutline,
  Close,
  Hotel,
  DirectionsRun,
  DirectionsCar,
  Star,
  ExploreOutlined,
} from "@mui/icons-material";
import { useMasterEntries } from "../services/backendApi";
import MainLayout from "../components/MainLayout";

// --- CUSTOM STYLED COMPONENTS FOR NEAT ALIGNMENT ---
const FieldLabel = ({ text }) => (
  <Typography
    variant="caption"
    sx={{
      fontWeight: 700,
      color: "#475569",
      mb: 0.8,
      display: "block",
      fontSize: "0.75rem",
    }}
  >
    {text}
  </Typography>
);

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
          borderColor: "#8b5cf6", // Updated focus color to match the modal's purple theme
          borderWidth: "1px",
        },
      },
      "& .MuiInputBase-input": {
        color: "#334155",
        fontSize: "0.875rem",
        fontWeight: 500,
      },
      ...props.sx,
    }}
  />
);

export default function MasterEntries() {
  const [activeTab, setActiveTab] = useState("Destinations");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🚨 Local state for the current activity input string inside the modal 🚨
  const [currentActivityInput, setCurrentActivityInput] = useState("");

  const { getAllMasterEntries, createMasterEntries, deleteMasterEntrie } =
    useMasterEntries();

  // DYNAMIC INITIAL DATA
  const [entries, setEntries] = useState([]);

  const handleAllMasters = () => {
    getAllMasterEntries().then((data) => {
      setEntries(
        data.map((v) => ({
          id: v.id,
          category: v.type,
          ...v.params,
        })),
      );
    });
  };

  const handleDelete = async (id) => {
    await deleteMasterEntrie(id);
    handleAllMasters();
  };

  useEffect(() => {
    handleAllMasters();
  }, []);

  // FORM STATE
  const [formData, setFormData] = useState({});

  // Handlers
  const handleOpenModal = () => {
    if (activeTab === "Destinations")
      setFormData({
        name: "",
        country: "",
        budget: "",
        popular: false,
        // 🚨 Note: activities is now an array 🚨
        days: [{ title: "", description: "", activities: [] }], 
      });
    if (activeTab === "Hotels")
      setFormData({
        name: "",
        location: "",
        roomCat: "",
        stars: "5 Star",
        price: "",
        link: "",
        amenities: "",
      });
    if (activeTab === "Activities")
      setFormData({
        name: "",
        categoryType: "Sightseeing",
        duration: "",
        description: "",
        price: "",
        minPax: "",
        difficulty: "Easy",
      });
    if (activeTab === "Transport")
      setFormData({ 
        name: "", 
        type: "Water Sports", 
        route: "", 
        capacity: "" 
      });

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setCurrentActivityInput(""); // reset local input
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // --- DAY-WISE ACTIVITIES HANDLERS ---
  const handleDayChange = (index, field, value) => {
    const newDays = [...(formData.days || [])];
    newDays[index][field] = value;
    setFormData({ ...formData, days: newDays });
  };

  // 🚨 FIXED LOGIC FOR ADDING ACTIVITIES TO A SPECIFIC DAY 🚨
  const handleAddActivityToDay = (dayIndex) => {
    if (!currentActivityInput.trim()) return;
    
    const newDays = [...(formData.days || [])];
    const currentActivities = newDays[dayIndex].activities || [];
    
    // Ensure activities is an array, then push new item
    newDays[dayIndex].activities = Array.isArray(currentActivities) 
      ? [...currentActivities, currentActivityInput.trim()]
      : [currentActivityInput.trim()];

    setFormData({ ...formData, days: newDays });
    setCurrentActivityInput(""); // Clear the input field after adding
  };

  const handleRemoveActivityFromDay = (dayIndex, activityIndex) => {
    const newDays = [...(formData.days || [])];
    if (Array.isArray(newDays[dayIndex].activities)) {
      newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_, i) => i !== activityIndex);
      setFormData({ ...formData, days: newDays });
    }
  };

  const handleAddDay = () => {
    setFormData({
      ...formData,
      days: [
        ...(formData.days || []),
        { title: "", description: "", activities: [] },
      ],
    });
  };

  const handleRemoveDay = (index) => {
    const newDays = formData.days.filter((_, i) => i !== index);
    setFormData({ ...formData, days: newDays });
  };

  const handleAddEntry = () => {
    if (!formData.name?.trim()) return;
    
    // Convert array of activities back to string if needed by backend, 
    // or keep as array if backend supports it. Assuming array is fine.
    const newEntry = { category: activeTab, ...formData };
    
    createMasterEntries(newEntry).then(() => {
      handleAllMasters();
    });
    handleCloseModal();
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesTab = entry.category === activeTab;
    const matchesSearch =
      (entry.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.country || entry.location || entry.route || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    {
      label: "Destinations",
      icon: <LocationOn fontSize="small" />,
      count: entries.filter((e) => e.category === "Destinations").length,
    },
    {
      label: "Hotels",
      icon: <Hotel fontSize="small" />,
      count: entries.filter((e) => e.category === "Hotels").length,
    },
    {
      label: "Activities",
      icon: <DirectionsRun fontSize="small" />,
      count: entries.filter((e) => e.category === "Activities").length,
    },
    {
      label: "Transport",
      icon: <DirectionsCar fontSize="small" />,
      count: entries.filter((e) => e.category === "Transport").length,
    },
  ];

  // RENDER NEAT, ALIGNED FORMS BASED ON TAB
  const renderModalContent = () => {
    if (activeTab === "Destinations")
      return (
        <Box sx={{ mt: 0.5 }}>
          {/* Top Section */}
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FieldLabel text="Destination Name" />
              <StyledTextField
                fullWidth
                name="name"
                placeholder="e.g., Paris, France"
                value={formData.name || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel text="Country" />
              <StyledTextField
                fullWidth
                name="country"
                placeholder="e.g., France"
                value={formData.country || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FieldLabel text="Average Budget" />
              <StyledTextField
                fullWidth
                name="budget"
                placeholder="e.g., ₹2000-3000"
                value={formData.budget || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.popular || false}
                    onChange={handleInputChange}
                    name="popular"
                    sx={{ "&.Mui-checked": { color: "#0ea5e9" } }}
                  />
                }
                label={
                  <Typography variant="body2" fontWeight="600" color="#475569">
                    Mark as popular destination
                  </Typography>
                }
              />
            </Grid>
          </Grid>

          {/* Day-wise Activities Section */}
          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography
              variant="body2"
              fontWeight="700"
              color="#0f172a"
              mb={1.5}
            >
              Day-wise Activities (Optional)
            </Typography>

            {(formData.days || []).map((day, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  borderRadius: "12px",
                  p: 2,
                  mb: 2,
                }}
              >
                {/* Day Header & Delete Icon */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight="700" color="#475569">
                    Day {index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveDay(index)}
                    sx={{ color: "#ef4444", p: 0.5 }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>

                {/* Day Fields */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <FieldLabel text="Day Title *" />
                    <StyledTextField
                      fullWidth
                      placeholder="e.g., Arrival in Rome & Colosseum Visit"
                      value={day.title}
                      onChange={(e) =>
                        handleDayChange(index, "title", e.target.value)
                      }
                    />
                  </Box>
                  <Box>
                    <FieldLabel text="Description" />
                    <StyledTextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Describe the day's activities - Sights, meals, transfers, special experiences..."
                      value={day.description}
                      onChange={(e) =>
                        handleDayChange(index, "description", e.target.value)
                      }
                    />
                  </Box>

                  {/* 🚨 FIXED ACTIVITY INPUT FIELD 🚨 */}
                  <Box>
                    <FieldLabel text="Activities & Experiences" />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <StyledTextField
                        fullWidth
                        placeholder="e.g., Colosseum Guided Tour"
                        value={currentActivityInput}
                        onChange={(e) => setCurrentActivityInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddActivityToDay(index);
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleAddActivityToDay(index)}
                        sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' }, minWidth: '80px', boxShadow: 'none' }}
                      >
                        Add
                      </Button>
                    </Box>
                    
                    {/* Display Added Activities */}
                    {Array.isArray(day.activities) && day.activities.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                        {day.activities.map((act, actIndex) => (
                          <Chip 
                            key={actIndex} 
                            label={act} 
                            onDelete={() => handleRemoveActivityFromDay(index, actIndex)}
                            size="small"
                            sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>

                </Box>
              </Box>
            ))}

            {/* Add Another Day Button */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddDay}
              sx={{
                mt: 1,
                borderRadius: "8px",
                borderColor: "#e2e8f0",
                color: "#0f172a",
                fontWeight: 600,
                textTransform: "none",
                py: 1,
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              Add Another Day
            </Button>
          </Box>
        </Box>
      );

    if (activeTab === "Hotels")
      return (
        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Hotel Name" />
            <StyledTextField
              fullWidth
              name="name"
              placeholder="e.g., Grand Plaza Hotel"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Location" />
            <StyledTextField
              fullWidth
              name="location"
              placeholder="e.g., Dubai, UAE"
              value={formData.location || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Room Category" />
            <StyledTextField
              fullWidth
              name="roomCat"
              placeholder="Deluxe Suite"
              value={formData.roomCat || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Star Rating" />
            <StyledTextField
              select
              fullWidth
              name="stars"
              value={formData.stars || "5 Star"}
              onChange={handleInputChange}
            >
              <MenuItem value="3 Star">3 Star</MenuItem>
              <MenuItem value="4 Star">4 Star</MenuItem>
              <MenuItem value="5 Star">5 Star</MenuItem>
            </StyledTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Price/Night" />
            <StyledTextField
              fullWidth
              name="price"
              placeholder="₹200"
              value={formData.price || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FieldLabel text="Trip Advisor Link" />
            <StyledTextField
              fullWidth
              name="link"
              placeholder="Tripadvisor Official Website"
              value={formData.link || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FieldLabel text="Amenities" />
            <Box sx={{ display: "flex", gap: 1 }}>
              <StyledTextField
                fullWidth
                name="amenities"
                placeholder="e.g., Pool, Spa, WiFi, Restaurant"
                value={formData.amenities || ""}
                onChange={handleInputChange}
              />
              <IconButton
                sx={{ border: "1px dashed #cbd5e1", borderRadius: 2 }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      );

    if (activeTab === "Activities")
      return (
        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <FieldLabel text="Activity Name" />
            <StyledTextField
              fullWidth
              name="name"
              placeholder="e.g., Scuba Diving"
              value={formData.name || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Category" />
            <StyledTextField
              select
              fullWidth
              name="categoryType"
              value={formData.categoryType || "Sightseeing"}
              onChange={handleInputChange}
            >
              <MenuItem value="Sightseeing">Sightseeing</MenuItem>
              <MenuItem value="Water Sports">Water Sports</MenuItem>
              <MenuItem value="Adventure">Adventure</MenuItem>
            </StyledTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Duration" />
            <StyledTextField
              fullWidth
              name="duration"
              placeholder="e.g., 2-3 hours"
              value={formData.duration || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FieldLabel text="Description" />
            <StyledTextField
              fullWidth
              multiline
              rows={3}
              name="description"
              placeholder="Activity description and highlights..."
              value={formData.description || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Price per Person" />
            <StyledTextField
              fullWidth
              name="price"
              placeholder="$75"
              value={formData.price || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel text="Min. Participants" />
            <StyledTextField
              fullWidth
              type="number"
              name="minPax"
              placeholder="2"
              value={formData.minPax || ""}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FieldLabel text="Difficulty Level" />
            <StyledTextField
              select
              fullWidth
              name="difficulty"
              value={formData.difficulty || "Easy"}
              onChange={handleInputChange}
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Moderate">Moderate</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </StyledTextField>
          </Grid>
        </Grid>
      );

    // 🚨 UPDATED TRANSPORT FORM UI 🚨
    return (
      <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
        <Grid item xs={12}>
          <FieldLabel text="Vehicle Name" />
          <StyledTextField
            fullWidth
            name="name"
            placeholder="e.g., Scuba Diving"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FieldLabel text="Vehicle Type" />
          <StyledTextField
            select
            fullWidth
            name="type"
            value={formData.type || "Water Sports"}
            onChange={handleInputChange}
          >
            <MenuItem value="Water Sports">Water Sports</MenuItem>
            <MenuItem value="Private Transfer">Private Transfer</MenuItem>
            <MenuItem value="Shared Coach">Shared Coach</MenuItem>
            <MenuItem value="Ferry / Boat">Ferry / Boat</MenuItem>
            <MenuItem value="Flight">Flight</MenuItem>
            <MenuItem value="Train">Train</MenuItem>
          </StyledTextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldLabel text="Route" />
          <StyledTextField
            fullWidth
            name="route"
            placeholder="e.g., NYC-Paris"
            value={formData.route || ""}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FieldLabel text="Capacity" />
          <StyledTextField
            fullWidth
            type="number"
            name="capacity"
            placeholder="2"
            value={formData.capacity || ""}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    );
  };

  const renderEntryCard = (entry) => {
    if (activeTab === "Hotels") {
      return (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Hotel sx={{ color: "#475569", fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
              {entry.name}
            </Typography>
            <Box sx={{ display: "flex", color: "#fbbf24" }}>
              {[...Array(parseInt(entry.stars) || 5)].map((_, i) => (
                <Star key={i} sx={{ fontSize: 16 }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
            <Typography variant="caption" color="#64748b">
              {entry.location || "Location TBA"}
            </Typography>
            <Chip
              label={entry.roomCat || "Hotel"}
              size="small"
              sx={{
                bgcolor: "#e0f2fe",
                color: "#0ea5e9",
                fontWeight: 700,
                height: 20,
                fontSize: "0.65rem",
              }}
            />
          </Box>
          <Typography variant="caption" fontWeight="800" color="#10b981">
            {entry.price || "Price TBA"} / night
          </Typography>
        </Box>
      );
    }

    if (activeTab === "Activities") {
      return (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <ExploreOutlined sx={{ color: "#475569", fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
              {entry.name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
            <Typography variant="caption" color="#64748b">
              {entry.location || "Location TBA"}
            </Typography>
            <Chip
              label={entry.categoryType || "Activity"}
              size="small"
              sx={{
                bgcolor: "#ffedd5",
                color: "#f59e0b",
                fontWeight: 700,
                height: 20,
                fontSize: "0.65rem",
              }}
            />
          </Box>
          <Typography variant="caption" color="#64748b" fontWeight="600">
            Duration: {entry.duration || "TBA"}{" "}
            <span style={{ marginLeft: 8, color: "#10b981" }}>
              Price: {entry.price || "TBA"}
            </span>
          </Typography>
        </Box>
      );
    }
    
    if (activeTab === "Transport") {
      return (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <DirectionsCar sx={{ color: "#475569", fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
              {entry.name}
            </Typography>
            <Chip
              label={entry.type || "Vehicle"}
              size="small"
              sx={{
                bgcolor: "#f3e8ff",
                color: "#7e22ce",
                fontWeight: 700,
                height: 20,
                fontSize: "0.65rem",
              }}
            />
          </Box>
          <Typography variant="caption" color="#64748b" fontWeight="600">
            Route: {entry.route || "N/A"} | Capacity: {entry.capacity || "N/A"} PAX
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <LocationOn sx={{ color: "#64748b", fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
            {entry.name}
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ mr: 1 }}>
            {entry.country}
          </Typography>
          {entry.popular && (
            <Chip
              label="Popular"
              size="small"
              sx={{
                bgcolor: "#fffbeb",
                color: "#f59e0b",
                fontWeight: 700,
                height: 20,
                fontSize: "0.7rem",
              }}
            />
          )}
        </Box>
        <Typography variant="body2" color="#475569" mb={0.5}>
          {entry.description}
        </Typography>
        <Typography variant="caption" color="#94a3b8" fontWeight="600">
          Best Season: {entry.season}
        </Typography>
      </Box>
    );
  };

  return (
    <MainLayout>
      {/* 🚨 Perfectly aligned box with proper padding to match your exact screenshot */}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          width: "100%",
          boxSizing: "border-box",
          bgcolor: "#f8fafc",
          minHeight: "100vh",
          pb: 10,
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="800" color="#0f172a" mb={0.5}>
            Master Entries
          </Typography>
          <Typography variant="body2" color="#64748b">
            Manage your central travel inventory database
          </Typography>
        </Box>

        {/* 🚨 EXACT MATCH TABS */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 4,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.label;
            return (
              <Button
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                startIcon={tab.icon}
                sx={{
                  bgcolor: isActive ? "#0ea5e9" : "#fff", // Exact bright blue
                  color: isActive ? "#fff" : "#64748b",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  border: isActive ? "none" : "1px solid #e2e8f0",
                  boxShadow: isActive
                    ? "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
                    : "none",
                  "&:hover": { bgcolor: isActive ? "#0284c7" : "#f1f5f9" },
                  flexShrink: 0,
                }}
              >
                {tab.label}
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    bgcolor: isActive ? "rgba(255,255,255,0.2)" : "#f1f5f9",
                    color: isActive ? "#fff" : "#94a3b8",
                    px: 1,
                    py: 0.2,
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                  }}
                >
                  {tab.count}
                </Box>
              </Button>
            );
          })}
        </Box>

        {/* SEARCH & ADD BAR */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#94a3b8" }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: "#fff",
                borderRadius: "8px",
                "& fieldset": { borderColor: "#e2e8f0" },
              },
            }}
            size="small"
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenModal}
            sx={{
              bgcolor: "#0ea5e9",
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              px: 3,
              flexShrink: 0,
              "&:hover": { bgcolor: "#0284c7" },
              boxShadow: "none",
            }}
          >
            Add New
          </Button>
        </Box>

        {/* LIST ENTRIES */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredEntries.map((entry) => (
            <Paper
              key={entry.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: "#fff",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
              }}
            >
              {renderEntryCard(entry)}

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    color: "#64748b",
                  }}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(entry.id)}
                  sx={{
                    border: "1px solid #fee2e2",
                    borderRadius: "8px",
                    color: "#ef4444",
                    bgcolor: "#fef2f2",
                    "&:hover": { bgcolor: "#fecaca" },
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
          {filteredEntries.length === 0 && (
            <Typography textAlign="center" color="#94a3b8" py={4}>
              No {activeTab.toLowerCase()} found matching "{searchQuery}"
            </Typography>
          )}
        </Box>

        {/* --- ADD NEW MODAL --- */}
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: "16px" } }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
              pb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="800" color="#0f172a">
              Add New {activeTab.replace(/s$/, "")}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              size="small"
              sx={{ color: "#94a3b8" }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ px: 3, py: 1 }}>
            {renderModalContent()}
          </DialogContent>

          <Box sx={{ px: 3, pb: 3, pt: 1 }}>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={handleCloseModal}
                variant="outlined"
                sx={{
                  color: "#475569",
                  borderColor: "#e2e8f0",
                  textTransform: "none",
                  fontWeight: 700,
                  flex: 1,
                  borderRadius: "8px",
                  py: 1,
                  "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddEntry}
                variant="contained"
                sx={{
                  background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)", // 🚨 EXACT PURPLE GRADIENT FROM SCREENSHOT 🚨
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  flex: 1,
                  borderRadius: "8px",
                  boxShadow: "none",
                  py: 1,
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Add Entry
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Box>
    </MainLayout>
  );
}