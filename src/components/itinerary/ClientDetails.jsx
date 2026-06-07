import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  InputAdornment,
  MenuItem,
} from "@mui/material";

// 🚨 Correct import path
import { useItinerary } from "../../context/ItineraryContext";

const FieldLabel = ({ text, required }) => (
  <Typography
    variant="caption"
    sx={{
      fontFamily: "'Inter', sans-serif",
      fontWeight: 700,
      color: "#334155",
      mb: 0.8,
      display: "block",
      fontSize: "0.75rem",
    }}
  >
    {text} {required && <span style={{ color: "#ef4444" }}>*</span>}
  </Typography>
);

// 🚨 Styled TextField to match exact Figma specifications
const StyledTextField = (props) => (
  <TextField
    {...props}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        bgcolor: "#f8fafc",
        borderRadius: 2,
        "& fieldset": {
          borderColor: "#e2e8f0",
        },
        "&:hover fieldset": {
          borderColor: "#cbd5e1",
        },
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
        py: 1.15,
      },
      ...props.sx,
    }}
  />
);

export default function ClientDetails() {
  // 🚨 MATCHING YOUR CONTEXT EXACTLY: clientData & setClientData
  const { clientData, setClientData } = useItinerary();

  const emptyState = {
    title: "",
    name: "",
    contact: "",
    email: "",
    budget: "",
    adults: "",
    infants: "",
    children: "0",
    childAges: [],
    destination: "",
    startDate: "",
    endDate: "",
    nights: "",
    days: "",
    queryHandledBy: "",
    status: "",
    source: "",
  };

  // 🚨 Load from clientData
  const [formData, setFormData] = useState({ ...emptyState, ...(clientData || {}) });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🚨 Sync to setClientData
  useEffect(() => {
    if (setClientData) setClientData(formData);
  }, [formData, setClientData]);

  // AUTO-CALCULATION: Dates to Nights/Days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        setFormData((prev) => {
          const calculatedNights = diffDays.toString();
          const calculatedDays = (diffDays + 1).toString();
          // Prevent unnecessary state updates if values are already correct
          if (prev.nights === calculatedNights && prev.days === calculatedDays) return prev;
          
          return {
            ...prev,
            nights: calculatedNights,
            days: calculatedDays,
          };
        });
      } else {
        setFormData((prev) => {
          if (prev.nights === "" && prev.days === "") return prev;
          return { ...prev, nights: "", days: "" };
        });
      }
    } else {
      setFormData((prev) => {
        if (prev.nights === "" && prev.days === "") return prev;
        return { ...prev, nights: "", days: "" };
      });
    }
  }, [formData.startDate, formData.endDate]);

  const handleContactChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) handleChange("contact", value);
  };

  const normalizedEmail = String(formData?.email ?? "");
  const isEmailValid =
    normalizedEmail === "" ||
    normalizedEmail.toLowerCase().endsWith("@gmail.com");

  const handleChildAgeChange = (index, value) => {
    const newAges = [...(Array.isArray(formData.childAges) ? formData.childAges : [])];
    newAges[index] = value;
    handleChange("childAges", newAges);
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: { xs: 2, md: 1 },
        bgcolor: "transparent",
        minHeight: "100vh",
        pb: 12,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="800"
            color="#1e3a8a"
            mb={0.5}
            sx={{ fontFamily: "'Inter', sans-serif" }}
          >
            Client Information
          </Typography>
          <Typography
            variant="body2"
            color="#64748b"
            sx={{ fontFamily: "'Inter', sans-serif" }}
          >
            Enter your client's details to start building their perfect itinerary
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
        }}
      >
        {/* PERSONAL INFORMATION */}
        <Typography
          variant="subtitle2"
          fontWeight="800"
          color="#0f172a"
          mb={3}
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}
        >
          Personal Information
        </Typography>
        
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Customer Name" required />
            <Box sx={{ display: "flex", gap: 1 }}>
              <StyledTextField
                select
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                sx={{ width: "90px" }}
              >
                <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                  Title
                </MenuItem>
                <MenuItem value="Mr" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Mr</MenuItem>
                <MenuItem value="Mrs" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Mrs</MenuItem>
                <MenuItem value="Ms" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Ms</MenuItem>
              </StyledTextField>
              <StyledTextField
                fullWidth
                placeholder="John Smith"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Contact Number" required />
            <StyledTextField
              fullWidth
              placeholder="+91 9876543621"
              type="tel"
              value={formData.contact}
              onChange={handleContactChange}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Email Address" />
            <StyledTextField
              fullWidth
              placeholder="john@example.com"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!isEmailValid}
              helperText={
                !isEmailValid ? "Only @gmail.com addresses are allowed" : ""
              }
            />
          </Grid>

          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Adults" required />
            <StyledTextField
              select
              fullWidth
              value={formData.adults}
              onChange={(e) => handleChange("adults", e.target.value)}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                Select
              </MenuItem>
              <MenuItem value="1" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>1</MenuItem>
              <MenuItem value="2" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>2</MenuItem>
              <MenuItem value="3" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>3</MenuItem>
              <MenuItem value="4+" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>11</MenuItem>
            </StyledTextField>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Infant (0-2 Years)" />
            <StyledTextField
              select
              fullWidth
              value={formData.infants}
              onChange={(e) => handleChange("infants", e.target.value)}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                Select
              </MenuItem>
              <MenuItem value="0" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>0</MenuItem>
              <MenuItem value="1" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>1</MenuItem>
              <MenuItem value="2" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>2</MenuItem>
            </StyledTextField>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Children" />
            <StyledTextField
              select
              fullWidth
              value={formData.children}
              onChange={(e) => {
                handleChange("children", e.target.value);
                handleChange("childAges", []);
              }}
            >
              <MenuItem value="0" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>0</MenuItem>
              <MenuItem value="1" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>1</MenuItem>
              <MenuItem value="2" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>2</MenuItem>
              <MenuItem value="3" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>3</MenuItem>
              <MenuItem value="4" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>4</MenuItem>
            </StyledTextField>
          </Grid>

          {Array.from({ length: Number(formData.children) || 0 }).map(
            (_, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FieldLabel text={`Age of Child ${index + 1}`} required />
                <StyledTextField
                  select
                  fullWidth
                  value={formData.childAges[index] || ""}
                  onChange={(e) => handleChildAgeChange(index, e.target.value)}
                >
                  <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                    Select Age
                  </MenuItem>
                  {[...Array(11).keys()].map((age) => (
                    <MenuItem key={age + 2} value={(age + 2).toString()} sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                      {age + 2}
                    </MenuItem>
                  ))}
                </StyledTextField>
              </Grid>
            ),
          )}
        </Grid>

        {/* TRAVEL DETAILS */}
        <Typography
          variant="subtitle2"
          fontWeight="800"
          color="#0f172a"
          mb={3}
          mt={formData.children > 2 ? 4 : 0}
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}
        >
          Travel Details
        </Typography>
        
        <Grid container spacing={3} mb={5}>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Destination" required />
            <StyledTextField
              fullWidth
              placeholder="e.g. Dubai, UAE"
              value={formData.destination || ""}
              onChange={(e) => handleChange("destination", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Start Date" required />
            <StyledTextField
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="End Date" required />
            <StyledTextField
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Duration" />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <StyledTextField
                value={formData.nights}
                placeholder="4"
                onChange={(e) => handleChange("nights", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ "& .MuiTypography-root": { fontFamily: "'Inter', sans-serif", fontSize: "14px" } }}>Nights</InputAdornment>
                  ),
                }}
                sx={{ width: "50%" }}
              />
              <StyledTextField
                value={formData.days}
                placeholder="4"
                onChange={(e) => handleChange("days", e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" sx={{ "& .MuiTypography-root": { fontFamily: "'Inter', sans-serif", fontSize: "14px" } }}>Days</InputAdornment>
                  ),
                }}
                sx={{ width: "50%" }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* LEAD MANAGEMENT */}
        <Typography
          variant="subtitle2"
          fontWeight="800"
          color="#0f172a"
          mb={3}
          sx={{ fontFamily: "'Inter', sans-serif", fontSize: "1rem" }}
        >
          Lead Management
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Query Handled by" required />
            <StyledTextField
              select
              fullWidth
              value={formData.queryHandledBy}
              onChange={(e) => handleChange("queryHandledBy", e.target.value)}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                Select Agent
              </MenuItem>
              <MenuItem value="Alex" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Alex</MenuItem>
              <MenuItem value="Sarah" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Sarah</MenuItem>
              <MenuItem value="Mike" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Mike</MenuItem>
            </StyledTextField>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Status" required />
            <StyledTextField
              select
              fullWidth
              value={formData.status || "New"}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                Select Status
              </MenuItem>
              <MenuItem value="New" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>New</MenuItem>
              <MenuItem value="In Progress" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>In Progress</MenuItem>
              <MenuItem value="Closed" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Closed</MenuItem>
              <MenuItem value="Contacted" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Contacted</MenuItem>
            </StyledTextField>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FieldLabel text="Source" required />
            <StyledTextField
              select
              fullWidth
              value={formData.source || "Website"}
              onChange={(e) => handleChange("source", e.target.value)}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                Select Source
              </MenuItem>
              <MenuItem value="Website" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Website</MenuItem>
              <MenuItem value="Referral" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Referral</MenuItem>
              <MenuItem value="Social Media" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Social Media</MenuItem>
            </StyledTextField>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}