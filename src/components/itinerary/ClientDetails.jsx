import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

import { useItinerary } from "../../context/ItineraryContext";

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

const StyledTextField = (props) => (
  <TextField
    {...props}
    size="small"
    sx={{
      "& .MuiOutlinedInput-root": {
        bgcolor: "#f8fafc",
        borderRadius: "8px",
        "& fieldset": {
          borderColor: "#e2e8f0",
          borderWidth: "1px",
          transition: "all 0.2s ease-in-out",
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
        fontWeight: 500,
        fontSize: "14px",
        color: "#334155",
        py: 1.15,
      },
      ...props.sx,
    }}
  />
);

export default function ClientDetails() {
  const { clientData, setClientData } = useItinerary();

  const emptyState = {
    title: "Mr",
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
    queryHandledBy: "0",
    status: "New",
    source: "Website",
    trip_title: "",
  };

  const [formData, setFormData] = useState({
    ...emptyState,
    ...(clientData || {}),
  });

  // 🚨 NEW: Sync form state whenever clientData changes (like when a draft is loaded)
  useEffect(() => {
    if (clientData && Object.keys(clientData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...clientData,
        // Ensure childAges is an array to prevent mapping errors
        childAges: Array.isArray(clientData.childAges) ? clientData.childAges : [],
      }));
    }
  }, [clientData]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (setClientData) setClientData(updated); // Sync context immediately on change
      return updated;
    });
  };

  const handleClearAll = () => {
    setFormData(emptyState);
    if (setClientData) setClientData(emptyState);
  };

  // AUTO-CALCULATION: Dates to Nights/Days
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      // Ensure dates are valid before calculating
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setFormData((prev) => {
          const calculatedNights = diffDays.toString();
          const calculatedDays = (diffDays + 1).toString();
          if (prev.nights === calculatedNights && prev.days === calculatedDays)
            return prev;

          const updated = {
            ...prev,
            nights: calculatedNights,
            days: calculatedDays,
          };
          if (setClientData) setClientData(updated);
          return updated;
        });
      } else {
        setFormData((prev) => {
          if (prev.nights === "" && prev.days === "") return prev;
          const updated = { ...prev, nights: "", days: "" };
          if (setClientData) setClientData(updated);
          return updated;
        });
      }
    } else {
      setFormData((prev) => {
        if (prev.nights === "" && prev.days === "") return prev;
        const updated = { ...prev, nights: "", days: "" };
        if (setClientData) setClientData(updated);
        return updated;
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
    const newAges = [
      ...(Array.isArray(formData.childAges) ? formData.childAges : []),
    ];
    newAges[index] = value;
    handleChange("childAges", newAges);
  };

  // 🚨 Format dates strictly for <input type="date" /> safely parsing DB data
  const formatDateForInput = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return "";
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) return "";
      return parsedDate.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "1136px",
        mx: "auto",
        p: { xs: 2, md: 1 },
        bgcolor: "transparent",
        minHeight: "100vh",
        pb: 12,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
        }}
      >
        {/* HEADER SECTION */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
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
          <Button
            variant="outlined"
            onClick={handleClearAll}
            sx={{
              borderColor: "#e2e8f0",
              color: "#0f172a",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
            }}
          >
            Clear All
          </Button>
        </Box>

        {/* PERSONAL INFORMATION */}
        <Typography
          variant="subtitle1"
          fontWeight="800"
          color="#0f172a"
          mb={2.5}
          sx={{ fontFamily: "'Inter', sans-serif" }}
        >
          Personal Information
        </Typography>

        <Grid container spacing={3} mb={5}>
          {/* Row 1 */}
          <Grid item xs={12} md={4}>
            <FieldLabel text="Customer Name" required />
            <Box sx={{ display: "flex", gap: 1 }}>
              <StyledTextField
                select
                value={formData.title || "Mr"}
                onChange={(e) => handleChange("title", e.target.value)}
                sx={{ width: "90px" }}
              >
                <MenuItem value="Mr" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Mr</MenuItem>
                <MenuItem value="Mrs" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Mrs</MenuItem>
                <MenuItem value="Ms" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Ms</MenuItem>
              </StyledTextField>
              <StyledTextField
                fullWidth
                placeholder="John Smith"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <FieldLabel text="Contact Number" required />
            <StyledTextField
              fullWidth
              placeholder="9876543621"
              type="tel"
              value={formData.contact || ""}
              onChange={handleContactChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FieldLabel text="Email Address" />
            <StyledTextField
              fullWidth
              placeholder="john@example.com"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!isEmailValid}
              helperText={!isEmailValid ? "Only @gmail.com addresses are allowed" : ""}
            />
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} md={4}>
            <FieldLabel text="Budget" />
            <StyledTextField
              fullWidth
              placeholder="₹4000"
              value={formData.budget || ""}
              onChange={(e) => handleChange("budget", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Adults" required />
            <StyledTextField
              select
              fullWidth
              value={formData.adults || ""}
              onChange={(e) => handleChange("adults", e.target.value)}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Select</MenuItem>
              <MenuItem value="1" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>1</MenuItem>
              <MenuItem value="2" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>2</MenuItem>
              <MenuItem value="3" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>3</MenuItem>
              <MenuItem value="4" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>4</MenuItem>
              <MenuItem value="5" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>5</MenuItem>
              <MenuItem value="6+" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>6+</MenuItem>
            </StyledTextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Infant (0-2 Years)" />
            <StyledTextField
              select
              fullWidth
              value={formData.infants || ""}
              onChange={(e) => handleChange("infants", e.target.value)}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>Select</MenuItem>
              <MenuItem value="0" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>0</MenuItem>
              <MenuItem value="1" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>1</MenuItem>
              <MenuItem value="2" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>2</MenuItem>
            </StyledTextField>
          </Grid>

          {/* Row 3 (Children) */}
          <Grid item xs={12} md={4}>
            <FieldLabel text="Number of Children" />
            <StyledTextField
              select
              fullWidth
              value={formData.children || "0"}
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

          {Array.from({ length: Number(formData.children) || 0 }).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FieldLabel text={`Age of Child ${index + 1}`} required />
              <StyledTextField
                select
                fullWidth
                value={formData.childAges?.[index] || ""}
                onChange={(e) => handleChildAgeChange(index, e.target.value)}
              >
                <MenuItem value="" disabled sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>0</MenuItem>
                {[...Array(11).keys()].map((age) => (
                  <MenuItem key={age + 2} value={(age + 2).toString()} sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>
                    {age + 2}
                  </MenuItem>
                ))}
              </StyledTextField>
            </Grid>
          ))}
        </Grid>

        {/* TRAVEL DETAILS */}
        <Typography
          variant="subtitle1"
          fontWeight="800"
          color="#0f172a"
          mb={2.5}
          sx={{ fontFamily: "'Inter', sans-serif" }}
        >
          Travel Details
        </Typography>

        <Grid container spacing={3} mb={5}>
          {/* Row 1 */}
          <Grid item xs={12} md={4}>
            <FieldLabel text="Destination" required />
            <StyledTextField
              fullWidth
              placeholder="Destination"
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
              value={formatDateForInput(formData.startDate)}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FieldLabel text="End Date" required />
            <StyledTextField
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formatDateForInput(formData.endDate)}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} md={8}>
            <FieldLabel text="Duration" />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <StyledTextField
                select
                value={formData.nights || ""}
                onChange={(e) => handleChange("nights", e.target.value)}
                sx={{ width: "100px" }}
              >
                <MenuItem value="" disabled>Select</MenuItem>
                {[...Array(30).keys()].map((n) => (
                  <MenuItem key={n} value={n.toString()}>{n}</MenuItem>
                ))}
              </StyledTextField>
              <Typography variant="body2" color="#475569" fontWeight="600" sx={{ fontFamily: "'Inter', sans-serif", mr: 1 }}>
                Nights
              </Typography>

              <StyledTextField
                select
                value={formData.days || ""}
                onChange={(e) => handleChange("days", e.target.value)}
                sx={{ width: "100px" }}
              >
                <MenuItem value="" disabled>Select</MenuItem>
                {[...Array(30).keys()].map((n) => (
                  <MenuItem key={n} value={n.toString()}>{n}</MenuItem>
                ))}
              </StyledTextField>
              <Typography variant="body2" color="#475569" fontWeight="600" sx={{ fontFamily: "'Inter', sans-serif" }}>
                Days
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* LEAD MANAGEMENT */}
        <Typography
          variant="subtitle1"
          fontWeight="800"
          color="#0f172a"
          mb={2.5}
          sx={{ fontFamily: "'Inter', sans-serif" }}
        >
          Lead Management
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Query Handled by" required />
            <StyledTextField
              select
              fullWidth
              value={formData.queryHandledBy || "0"}
              onChange={(e) => handleChange("queryHandledBy", e.target.value)}
            >
              <MenuItem value="0" sx={{ fontFamily: "'Inter', sans-serif", fontSize: "14px" }}>0</MenuItem>
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