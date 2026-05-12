import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
} from "@mui/material";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import {
  Add,
  PeopleAlt,
  PhoneCallback,
  VerifiedUser,
  CheckCircleOutline,
  Close,
  Search,
  FilterList,
  MoreVert,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useItinerary } from "../context/ItineraryContext";

const INITIAL_FORM_STATE = {
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
};

export default function LeadManagement() {
  const navigate = useNavigate();
  const { setClientData, setStep } = useItinerary();
  const { api } = useApi();

  const [allLeads, setAllLeads] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const openMenu = Boolean(anchorEl);

  const loadAllLeads = () => {
    api.leads.getAllLeadUsers().then((res) => {
      setAllLeads(Array.isArray(res) ? res : []);
    });
  };

  const createNewLead = (params) => {
    api.leads.createNewLead(params).then(() => {
      loadAllLeads();
    });
  };

  useEffect(() => {
    loadAllLeads();
  }, []);

  const handleMenuClick = (event, lead) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLead(null);
  };

  const handleEditClick = () => {
    if (!selectedLead) return;
    setFormData({
      title: selectedLead.title || "Mr",
      clientName: selectedLead.name || "",
      phone: selectedLead.phone || "",
      email: selectedLead.email || "",
      adults: selectedLead.no_of_adults || 0,
      children: selectedLead.no_of_children || 0,
      infants: selectedLead.no_of_infants || 0,
      destination: selectedLead.dist_location || "",
      startDate: selectedLead.start_date || "",
      endDate: selectedLead.end_date || "",
      status: selectedLead.status || "New",
      source: selectedLead.source || "Website",
      tripTitle: selectedLead.trip_title || "",
      nights: selectedLead.nights || 4,
      days: selectedLead.days || 5,
      handledBy: selectedLead.handled_by || "",
    });
    setEditingLeadId(selectedLead.lead_id);
    setOpenModal(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (!selectedLead) return;
    if (
      window.confirm(
        `Are you sure you want to remove ${selectedLead.name} from this list?`,
      )
    ) {
      setAllLeads((prev) =>
        prev.filter((lead) => lead.lead_id !== selectedLead.lead_id),
      );
    }
    handleMenuClose();
  };

  const handleMenuCreateItinerary = () => {
    if (selectedLead) {
      const mappedClientData = {
        title: selectedLead.title || "Mr",
        name: selectedLead.name || "",
        email: selectedLead.email || "",
        contact: selectedLead.phone || "",
        destination: selectedLead.dist_location || "",
        startDate: selectedLead.start_date || "",
        endDate: selectedLead.end_date || "",
        adults: selectedLead.no_of_adults || 0,
        children: selectedLead.no_of_children || 0,
        infants: selectedLead.no_of_infants || 0,
        nights: selectedLead.nights || 0,
        days: selectedLead.days || 0,
        status: selectedLead.status || "New",
        source: selectedLead.source || "Website",
        trip_title:
          selectedLead.trip_title ||
          `Trip to ${selectedLead.dist_location || "Destination"}`,
        lead_id: selectedLead.lead_id,
        dist_location: selectedLead.dist_location || "",
        no_of_adults: selectedLead.no_of_adults || 0,
        no_of_children: selectedLead.no_of_children || 0,
        no_of_infants: selectedLead.no_of_infants || 0,
        start_date: selectedLead.start_date || "",
        end_date: selectedLead.end_date || "",
        handled_by: selectedLead.handled_by || "",
      };

      setClientData(mappedClientData);
      setStep(1);
      navigate("/itinerary-builder");
    }
    handleMenuClose();
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingLeadId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  const handleSaveLead = () => {
    const leadData = {
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
      pronounce: formData.title,
      status: formData.status,
      handled_by: formData.handledBy,
      trip_title: formData.tripTitle,
      title: formData.title,
    };

    if (editingLeadId) {
      // Keep edit behavior local unless dedicated update API is available.
      setAllLeads((prev) =>
        prev.map((lead) =>
          lead.lead_id === editingLeadId ? { ...lead, ...leadData } : lead,
        ),
      );
      handleCloseModal();
      return;
    }

    createNewLead(leadData);
    handleCloseModal();
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

  const filteredLeads = allLeads.filter((lead) => {
    const searchLower = searchQuery.toLowerCase();
    const refStr = `BK-2026-${lead.lead_id || ""}`.toLowerCase();
    return (
      (lead.name && lead.name.toLowerCase().includes(searchLower)) ||
      (lead.email && lead.email.toLowerCase().includes(searchLower)) ||
      (lead.dist_location &&
        lead.dist_location.toLowerCase().includes(searchLower)) ||
      refStr.includes(searchLower)
    );
  });

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

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const headerCellSx = {
    fontWeight: 800,
    color: "#1e293b",
    py: 2,
    borderBottom: "none",
    whiteSpace: "nowrap",
  };
  const bodyCellSx = {
    color: "#334155",
    fontWeight: 500,
    fontSize: "0.875rem",
    py: 2,
    whiteSpace: "nowrap",
  };

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
              bgcolor: "#2563eb",
              color: "#fff",
              "&:hover": { bgcolor: "#1d4ed8" },
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Add New Lead
          </Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, md: 4 } }}>
        <Box sx={{ maxWidth: 1400, mx: "auto" }}>
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
                    sx={{ ml: 4 }}
                  >
                    {stat.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              placeholder="Search leads by name, email, or destination..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                maxWidth: 800,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#fff",
                  "& fieldset": { borderColor: "#e2e8f0" },
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{
                color: "#475569",
                borderColor: "#e2e8f0",
                bgcolor: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              Filters
            </Button>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "#fff",
            }}
          >
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#bcebf0" }}>
                    <TableCell sx={headerCellSx}>Query Ref</TableCell>
                    <TableCell sx={headerCellSx}>Client Name</TableCell>
                    <TableCell sx={headerCellSx}>Destination</TableCell>
                    <TableCell sx={headerCellSx}>Travel Date</TableCell>
                    <TableCell sx={headerCellSx}>Travellers</TableCell>
                    <TableCell sx={headerCellSx}>Mail id</TableCell>
                    <TableCell sx={headerCellSx}>Contact Number</TableCell>
                    <TableCell sx={headerCellSx}>Status</TableCell>
                    <TableCell align="right" sx={headerCellSx}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        align="center"
                        sx={{ py: 6, color: "#64748b" }}
                      >
                        No leads found matching "{searchQuery}"
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => {
                      const queryRef = `${lead.lead_id}`;
                      const style = getStatusStyle(lead.status);

                      return (
                        <TableRow
                          key={lead.lead_id}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell sx={bodyCellSx}>{queryRef}</TableCell>
                          <TableCell
                            sx={{
                              ...bodyCellSx,
                              color: "#0f172a",
                              fontWeight: 600,
                            }}
                          >
                            {lead.title}. {lead.name}
                          </TableCell>
                          <TableCell sx={bodyCellSx}>
                            {lead.dist_location}
                          </TableCell>
                          <TableCell sx={bodyCellSx}>
                            {lead.start_date && lead.end_date
                              ? `${formatDate(lead.start_date)} - ${formatDate(lead.end_date)}`
                              : "TBD"}
                          </TableCell>
                          <TableCell sx={bodyCellSx}>
                            {`${lead.no_of_adults || 0} Adults${lead.no_of_children > 0 ? `, ${lead.no_of_children} Child` : ""}`}
                          </TableCell>
                          <TableCell sx={bodyCellSx}>{lead.email}</TableCell>
                          <TableCell sx={bodyCellSx}>{lead.phone}</TableCell>
                          <TableCell sx={{ py: 2, whiteSpace: "nowrap" }}>
                            <Select
                              value={lead.status || "New"}
                              size="small"
                              onChange={(e) =>
                                handleStatusChange(lead.lead_id, e.target.value)
                              }
                              sx={{
                                bgcolor: style.bg,
                                color: style.text,
                                fontWeight: 700,
                                borderRadius: 1.5,
                                height: 30,
                                fontSize: "0.75rem",
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
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ py: 2, whiteSpace: "nowrap" }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, lead)}
                            >
                              <MoreVert
                                fontSize="small"
                                sx={{ color: "#64748b" }}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  mt: 0.5,
                  minWidth: 140,
                  boxShadow:
                    "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0",
                },
              }}
            >
              <MenuItem
                onClick={handleEditClick}
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#334155",
                  py: 1,
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={handleDeleteClick}
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#ef4444",
                  py: 1,
                }}
              >
                Delete
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={handleMenuCreateItinerary}
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#0f172a",
                  py: 1,
                }}
              >
                Create Itinerary
              </MenuItem>
            </Menu>
          </Paper>
        </Box>
      </Box>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
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
              {editingLeadId ? "Edit Lead" : "Add New Lead"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editingLeadId
                ? `Updating Query Ref: BK-2026-${editingLeadId}`
                : "Create a new travel inquiry"}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseModal}
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
            onClick={handleCloseModal}
            sx={{ color: "#64748b", fontWeight: 600, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveLead}
            variant="contained"
            sx={{
              bgcolor: "#2563eb",
              color: "#fff",
              "&:hover": { bgcolor: "#1d4ed8" },
              fontWeight: 700,
              px: 4,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {editingLeadId ? "Save Changes" : "Save Lead"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
