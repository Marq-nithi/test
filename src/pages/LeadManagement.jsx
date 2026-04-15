import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

import {
  Add,
  EmailOutlined,
  PhoneOutlined,
  GroupOutlined,
  CalendarTodayOutlined,
  PeopleAlt,
  PhoneCallback,
  VerifiedUser,
  CheckCircleOutline,
  Close,
  FlightTakeoff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useItinerary } from "../context/ItineraryContext";
import { useLeads } from "../context/LeadContext";

export default function LeadManagement() {
  const navigate = useNavigate();
  const { setClientData, setStep } = useItinerary();
  const [allLeads, setAllLeads] = useState([]);
  const { api } = useApi();

  const loadAllLeads = () => {
    api.leads.getAllLeadUsers().then((res) => {
      setAllLeads(res);
    });
  };
  const createNewLead = (params) => {
    api.leads.createNewLead(params).then((data) => {
      alert("lead created done");
      loadAllLeads();
    });
  };
  useEffect(() => {
    loadAllLeads();
  }, []);

  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "Mr",
    clientName: "",
    phone: "",
    email: "",
    adults: 0,
    children: 0,
    infants: 0,
    childAge1: "",
    childAge2: "",
    destination: "",
    startDate: "",
    endDate: "",
    nights: 4,
    days: 5,
    handledBy: "",
    status: "New",
    source: "Website",
    tripTitle: "",
  });

  const handleFormChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSaveLead = () => {
    const newLead = {
      name: formData.clientName || "New Client",
      dist_location: formData.destination || "TBD",
      email: formData.email || "No email provided",
      phone: formData.phone || "No phone provided",
      no_of_adults: formData.adults,
      no_of_children: formData.children,
      no_of_infants: formData.infants,
      start_date: formData.startDate,
      end_date: formData.endDate,
      nights: formData.nights,
      days: formData.days,
      source: formData.source,
      pronounce: "Mr",
      status: formData.status,
      handled_by: formData.handledBy,
      trip_title: formData.tripTitle,
      title: formData.title,
    };

    createNewLead(newLead);

    setOpenModal(false);
    setFormData({
      title: "Mr",
      clientName: "",
      phone: "",
      email: "",
      adults: 0,
      children: 0,
      infants: 0,
      destination: "",
      startDate: "",
      endDate: "",
      nights: 4,
      days: 5,
      handledBy: "",
      status: "New",
      source: "Website",
      tripTitle: "",
    });
  };

  const handleStatusChange = (id, newStatus) => {
    api.leads
      .updateLeadStatus({
        lead_id: id,
        status: newStatus,
      })
      .then(() => {
        loadAllLeads();
      });
  };

  const handleCreateItinerary = (lead) => {
    const cleanSlate = {
      theme: "luxe",
      title: "Mr",
      clientName: "",
      phone: "",
      email: "",
      adults: 0,
      children: 0,
      infants: 0,
      childAge1: "",
      childAge2: "",
      destination: "",
      startDate: "",
      endDate: "",
      nights: 4,
      days: 5,
      handledBy: "",
      status: "In Progress",
      source: "Website",
      tripTitle: "",
    };

    setClientData(lead);

    setStep(1);
    navigate("/itinerary-builder");
  };

  const FieldLabel = ({ text, required }) => (
    <Typography
      variant="caption"
      sx={{ fontWeight: 700, color: "#475569", mb: 0.5, display: "block" }}
    >
      {text} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </Typography>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return { bg: "#e0f2fe", text: "#00c6ff" };
      case "Contacted":
        return { bg: "#ffedd5", text: "#f97316" };
      case "Qualified":
        return { bg: "#f3e8ff", text: "#a855f7" };
      case "Confirmed":
        return { bg: "#dcfce7", text: "#10b981" };
      default:
        return { bg: "#f1f5f9", text: "#64748b" };
    }
  };

  const stats = [
    {
      title: "New Leads",
      value: allLeads.filter((l) => l.status === "New").length,
      icon: <PeopleAlt />,
      color: "#00c6ff",
      bg: "#e0f2fe",
    },
    {
      title: "Contacted",
      value: allLeads.filter((l) => l.status === "Contacted").length,
      icon: <PhoneCallback />,
      color: "#f97316",
      bg: "#ffedd5",
    },
    {
      title: "Qualified",
      value: allLeads.filter((l) => l.status === "Qualified").length,
      icon: <VerifiedUser />,
      color: "#a855f7",
      bg: "#f3e8ff",
    },
    {
      title: "Confirmed",
      value: allLeads.filter((l) => l.status === "Confirmed").length,
      icon: <CheckCircleOutline />,
      color: "#10b981",
      bg: "#dcfce7",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: "#ffffff",
          px: { xs: 2, md: 4 },
          py: 3,
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>
              Lead Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Track & Manage your travel Leads
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
            sx={{
              bgcolor: "#00c6ff",
              color: "#fff",
              "&:hover": { bgcolor: "#00b4e6" },
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
            }}
          >
            Add New Lead
          </Button>
        </Box>
      </Box>

      {/* CONTENT */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          {/* STATS */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    borderBottom: `4px solid ${stat.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: stat.bg,
                        color: stat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="700"
                      color="text.secondary"
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight="900"
                    color="#0f172a"
                    sx={{
                      ml: 4,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* LIST */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {allLeads.map((lead) => {
              const style = getStatusStyle(lead.status);
              return (
                <Paper
                  key={lead.lead_id}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#00c6ff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
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
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#00c6ff",
                          color: "#fff",
                          fontWeight: 800,
                        }}
                      >
                        {lead.name.slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="800"
                          color="#0f172a"
                          sx={{ lineHeight: 1.2 }}
                        >
                          {lead.title}. {lead.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight="500"
                        >
                          {lead.dist_location}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", gap: 1.5, alignItems: "center" }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<FlightTakeoff fontSize="small" />}
                        onClick={() => handleCreateItinerary(lead)}
                        sx={{
                          bgcolor: "#0ea5e9",
                          color: "#fff",
                          "&:hover": { bgcolor: "#0284c7" },
                          fontWeight: 700,
                          borderRadius: 1.5,
                          textTransform: "none",
                          px: 2,
                          boxShadow: "none",
                        }}
                      >
                        Create Itinerary
                      </Button>

                      <Select
                        value={lead.status}
                        size="small"
                        onChange={(e) =>
                          handleStatusChange(lead.lead_id, e.target.value)
                        }
                        sx={{
                          bgcolor: style.bg,
                          color: style.text,
                          fontWeight: 800,
                          borderRadius: 1.5,
                          height: 32,
                          fontSize: "0.8rem",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-icon": { color: style.text },
                        }}
                      >
                        <MenuItem
                          value="New"
                          sx={{ fontWeight: 600, color: "#00c6ff" }}
                        >
                          New
                        </MenuItem>
                        <MenuItem
                          value="Contacted"
                          sx={{ fontWeight: 600, color: "#f97316" }}
                        >
                          Contacted
                        </MenuItem>
                        <MenuItem
                          value="Qualified"
                          sx={{ fontWeight: 600, color: "#a855f7" }}
                        >
                          Qualified
                        </MenuItem>
                        <MenuItem
                          value="Confirmed"
                          sx={{ fontWeight: 600, color: "#10b981" }}
                        >
                          Confirmed
                        </MenuItem>
                      </Select>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: { xs: 2, md: 4 },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <EmailOutlined sx={{ color: "#94a3b8", fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        {lead.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneOutlined sx={{ color: "#94a3b8", fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        {lead.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GroupOutlined sx={{ color: "#94a3b8", fontSize: 18 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        {`${lead.no_of_adults} Adults, ${lead.no_of_children} Children`}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarTodayOutlined
                        sx={{ color: "#94a3b8", fontSize: 18 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="500"
                      >
                        {lead.start_date + " to " + lead.end_date}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ADD NEW LEAD MODAL */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            pb: 1,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="900" color="#0f172a">
              Add New Lead
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new travel inquiry
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenModal(false)}
            size="small"
            sx={{ color: "#94a3b8" }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#f1f5f9", py: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight="800"
            color="#1e293b"
            mb={2}
          >
            Personal Information
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Customer Name" required />
              <TextField
                fullWidth
                size="small"
                placeholder="John Smith"
                value={formData.clientName}
                onChange={(e) => handleFormChange("clientName", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Select
                        value={formData.title}
                        onChange={(e) =>
                          handleFormChange("title", e.target.value)
                        }
                        variant="standard"
                        disableUnderline
                        sx={{
                          mr: 1,
                          "& .MuiSelect-select": {
                            py: 0,
                            fontSize: "0.875rem",
                          },
                        }}
                      >
                        <MenuItem value="Mr">Mr</MenuItem>
                        <MenuItem value="Mrs">Mrs</MenuItem>
                        <MenuItem value="Ms">Ms</MenuItem>
                      </Select>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mr: 1, my: 0.5 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Contact Number" required />
              <TextField
                fullWidth
                size="small"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Email Address" />
              <TextField
                fullWidth
                size="small"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Number of Adults" required />
              <Select
                fullWidth
                size="small"
                value={formData.adults}
                onChange={(e) => handleFormChange("adults", e.target.value)}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                  <MenuItem key={`a${n}`} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Number of Children" />
              <Select
                fullWidth
                size="small"
                value={formData.children}
                onChange={(e) => handleFormChange("children", e.target.value)}
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <MenuItem key={`c${n}`} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Number of Infant (0-2 Years)" />
              <Select
                fullWidth
                size="small"
                value={formData.infants}
                onChange={(e) => handleFormChange("infants", e.target.value)}
              >
                {[0, 1, 2, 3].map((n) => (
                  <MenuItem key={`i${n}`} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Typography
            variant="subtitle1"
            fontWeight="800"
            color="#1e293b"
            mb={2}
          >
            Travel Details
          </Typography>
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Destination" required />
              <TextField
                fullWidth
                size="small"
                placeholder="Enter destination"
                value={formData.destination}
                onChange={(e) =>
                  handleFormChange("destination", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Start Date" required />
              <TextField
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={(e) => handleFormChange("startDate", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="End Date" required />
              <TextField
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={(e) => handleFormChange("endDate", e.target.value)}
              />
            </Grid>
          </Grid>
          <Typography
            variant="subtitle1"
            fontWeight="800"
            color="#1e293b"
            mb={2}
          >
            Lead Management
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Status" required />
              <Select
                fullWidth
                size="small"
                value={formData.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Contacted">Contacted</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Source" required />
              <Select
                fullWidth
                size="small"
                value={formData.source}
                onChange={(e) => handleFormChange("source", e.target.value)}
              >
                <MenuItem value="Website">Website</MenuItem>
                <MenuItem value="Referral">Referral</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Trip Title" />
              <TextField
                fullWidth
                size="small"
                placeholder="Dive into Maldives"
                value={formData.tripTitle}
                onChange={(e) => handleFormChange("tripTitle", e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2, borderTop: "1px solid #f1f5f9" }}>
          <Button
            onClick={() => setOpenModal(false)}
            sx={{ color: "#64748b", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveLead}
            variant="contained"
            sx={{
              bgcolor: "#4338ca",
              color: "#fff",
              "&:hover": { bgcolor: "#3730a3" },
              fontWeight: 700,
              px: 4,
              borderRadius: 2,
            }}
          >
            Save Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
