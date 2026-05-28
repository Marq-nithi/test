import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
} from "@mui/material";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useBlobDownload, useBlobUpload } from "../services/backendApi";
import {
  CloudUploadOutlined,
  NotificationsNoneOutlined,
  PaletteOutlined,
  PersonOutlineOutlined,
  BusinessOutlined,
  WbSunnyOutlined,
  ColorizeOutlined,
  DeleteOutline,
  AddOutlined
} from "@mui/icons-material";

// --- STYLED SUB-COMPONENTS ---
const FieldLabel = ({ text }) => (
  <Typography
    variant="caption"
    sx={{
      fontWeight: 600,
      color: "#475569",
      mb: 0.8,
      display: "block",
      fontSize: "0.75rem",
    }}
  >
    {text}
  </Typography>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
    {icon && icon}
    <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
      {title}
    </Typography>
  </Box>
);

// Figma-style Input
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
          transition: "all 0.2s ease-in-out",
        },
        "&:hover fieldset": { borderColor: "#cbd5e1" },
        "&.Mui-focused fieldset": {
          borderColor: "#0ea5e9",
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

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [fontStyle, setFontStyle] = useState("Poppins");
  const { userDetails, api } = useApi();
  const { uploadBlob } = useBlobUpload();
  const { getBlob } = useBlobDownload();

  const [userD, setUserD] = useState(userDetails || {});
  const [logoUrl, setLogoUrl] = useState("");

  // 🚨 LOCAL STATE FOR BRANDING (NO BACKEND INTEGRATION) 🚨
  const [brandingList, setBrandingList] = useState([{ title: "", subtitle: "" }]);

  const handleSaveChanges = () => {
    // 🚨 BACKEND PAYLOAD UNTOUCHED 🚨
    const newPayaLoad = {
      "custom:full_name": userD["custom:full_name"] || "",
      email: userD.email || "",
      "custom:mobile": userD["custom:mobile"] || "",
      "custom:agency_name": userD["custom:agency_name"],
      given_name: userD.given_name || "",
      picture: userD.picture || "",
    };
    api.auth.updateProfileAttribute(newPayaLoad).then(() => {
      api.auth.loadUserDetails().then((data) => {
        setUserD(data);
      });
    });
  };

  useEffect(() => {
    setUserD(userDetails || {});
  }, [userDetails]);

  useEffect(() => {
    api.auth.loadUserDetails().then((data) => {
      setUserD(data);
    });
  }, []);

  const handeleUserDtChange = (field, value) => {
    setUserD((prev) => ({
      ...(prev || {}),
      [field]: value,
    }));
  };

  const handleAgencyLogoUpload = async () => {
    const uploadedId = await uploadBlob("image/*");
    if (!uploadedId) return;
    handeleUserDtChange("picture", uploadedId);
    const blobData = await getBlob(uploadedId);
    setLogoUrl(blobData?.url || "");
  };

  useEffect(() => {
    const pictureId = userD?.picture;
    if (!pictureId) {
      setLogoUrl("");
      return;
    }
    if (
      typeof pictureId === "string" &&
      (pictureId.startsWith("http") ||
        pictureId.startsWith("data:") ||
        pictureId.startsWith("blob:"))
    ) {
      setLogoUrl(pictureId);
      return;
    }
    getBlob(pictureId).then((blobData) => {
      setLogoUrl(blobData?.url || "");
    });
  }, [userD?.picture, getBlob]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1000,
        mx: "auto",
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        pb: 10,
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="800" color="#0f172a" mb={0.5}>
          Settings
        </Typography>
        <Typography variant="body2" color="#64748b">
          Manage your account and preferences
        </Typography>
      </Box>

      {/* 1. PROFILE INFORMATION */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
        }}
      >
        <SectionHeader
          title="Profile Information"
          icon={<PersonOutlineOutlined sx={{ color: "#9333ea" }} />}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "#9333ea",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {(userD["custom:full_name"] || "")
                  .trim()
                  .slice(0, 2)
                  .toUpperCase() || "NA"}
              </Avatar>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Full Name" />
            <StyledTextField
              fullWidth
              value={userD["custom:full_name"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:full_name", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Email" />
            <StyledTextField
              fullWidth
              value={userD.email || ""}
              onChange={(e) => handeleUserDtChange("email", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Phone" />
            <StyledTextField
              fullWidth
              value={userD["custom:mobile"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:mobile", e.target.value)
              }
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. AGENCY BRANDING */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
        }}
      >
        <SectionHeader
          title="Agency Branding"
          icon={<BusinessOutlined sx={{ color: "#9333ea" }} />}
        />

        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <FieldLabel text="Agency Name" />
            <StyledTextField
              fullWidth
              value={userD["custom:agency_name"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:agency_name", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Prefix Name" />
            <StyledTextField
              fullWidth
              value={userD["given_name"] || ""}
              onChange={(e) =>
                handeleUserDtChange("given_name", e.target.value)
              }
            />
          </Grid>
        </Grid>

        <FieldLabel text="Logo Upload" />
        <Box
          onClick={handleAgencyLogoUpload}
          sx={{
            p: 4,
            border: "2px dashed #cbd5e1",
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "#f8fafc",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": { bgcolor: "#f1f5f9", borderColor: "#94a3b8" },
          }}
        >
          {logoUrl ? (
            <Box
              component="img"
              src={logoUrl}
              alt="Agency Logo"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                bgcolor: "#fff",
                p: 1,
                mb: 1,
                mx: "auto",
              }}
            />
          ) : (
            <CloudUploadOutlined
              sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }}
            />
          )}
          <Typography variant="body2" color="#475569" fontWeight="600">
            {logoUrl
              ? "Click to replace agency logo"
              : "Click to upload agency logo"}
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            PNG, JPG up to 5MB
          </Typography>
          {userD?.picture && (
            <Typography
              variant="caption"
              color="#0ea5e9"
              sx={{ display: "block", mt: 1 }}
            >
              Uploaded id: {userD.picture}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* 3. CONTACT INFORMATION */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <SectionHeader title="Contact Information" />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Primary Contact" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Select 
                size="small" 
                defaultValue="+91" 
                sx={{ 
                  width: 85, bgcolor: '#f8fafc', borderRadius: 2, 
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '& .MuiSelect-select': { py: 1.05, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }
                }}
              >
                <MenuItem value="+91">+91</MenuItem>
                <MenuItem value="+1">+1</MenuItem>
                <MenuItem value="+44">+44</MenuItem>
              </Select>
              <StyledTextField 
                fullWidth 
                placeholder="9876543210" 
                value={userD["custom:primary_contact"] || ""}
                onChange={(e) => handeleUserDtChange("custom:primary_contact", e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <FieldLabel text="Secondary Contact" />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Select 
                size="small" 
                defaultValue="+91" 
                sx={{ 
                  width: 85, bgcolor: '#f8fafc', borderRadius: 2, 
                  '& fieldset': { borderColor: '#e2e8f0' },
                  '&:hover fieldset': { borderColor: '#cbd5e1' },
                  '& .MuiSelect-select': { py: 1.05, fontSize: '0.875rem', fontWeight: 500, color: '#334155' }
                }}
              >
                <MenuItem value="+91">+91</MenuItem>
                <MenuItem value="+1">+1</MenuItem>
                <MenuItem value="+44">+44</MenuItem>
              </Select>
              <StyledTextField 
                fullWidth 
                placeholder="9876543210" 
                value={userD["custom:secondary_contact"] || ""}
                onChange={(e) => handeleUserDtChange("custom:secondary_contact", e.target.value)}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <FieldLabel text="Support Email" />
            <StyledTextField 
              fullWidth 
              placeholder="support@travelhub.com" 
              value={userD["custom:support_email"] || ""}
              onChange={(e) => handeleUserDtChange("custom:support_email", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FieldLabel text="Website" />
            <StyledTextField 
              fullWidth 
              placeholder="www.travelhub.com" 
              value={userD["custom:website"] || ""}
              onChange={(e) => handeleUserDtChange("custom:website", e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FieldLabel text="Office Address" />
            <StyledTextField 
              fullWidth 
              placeholder="eg: 123 Commerce St, Adyar, Chennai -28" 
              value={userD["custom:office_address"] || ""}
              onChange={(e) => handeleUserDtChange("custom:office_address", e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 🚨 4. BRANDING DETAILS (LOCAL UI ONLY) 🚨 */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <SectionHeader title="Branding" />
        
        {brandingList.map((item, index) => (
          <Grid container spacing={2} alignItems="flex-end" mb={3} key={index}>
            <Grid item xs={12} md={4}>
              <FieldLabel text="Title" />
              <StyledTextField 
                fullWidth 
                placeholder="IATA Accredited" 
                value={item.title}
                onChange={(e) => {
                  const newList = [...brandingList];
                  newList[index].title = e.target.value;
                  setBrandingList(newList);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldLabel text="Sub-Title" />
              <StyledTextField 
                fullWidth 
                placeholder="Certified by International Air Transport" 
                value={item.subtitle}
                onChange={(e) => {
                  const newList = [...brandingList];
                  newList[index].subtitle = e.target.value;
                  setBrandingList(newList);
                }}
              />
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => {
                  if (brandingList.length > 1) {
                    setBrandingList(brandingList.filter((_, i) => i !== index));
                  }
                }}
                disabled={brandingList.length === 1}
                sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: 2, borderColor: '#fecaca', bgcolor: '#fef2f2' }}
              >
                <DeleteOutline fontSize="small" />
              </Button>
              {index === brandingList.length - 1 && (
                <Button 
                  variant="outlined" 
                  onClick={() => setBrandingList([...brandingList, { title: "", subtitle: "" }])}
                  sx={{ minWidth: 40, width: 40, height: 40, p: 0, borderRadius: 2, borderColor: '#e2e8f0', color: '#0f172a' }}
                >
                  <AddOutlined fontSize="small" />
                </Button>
              )}
            </Grid>
          </Grid>
        ))}

        <Box>
          <FieldLabel text="Footer Text" />
          <StyledTextField 
            fullWidth 
            placeholder="Add custom footer text..." 
            value={userD["custom:footer_text"] || ""}
            onChange={(e) => handeleUserDtChange("custom:footer_text", e.target.value)}
          />
        </Box>
      </Paper>

      {/* CHANGE PASSWORD */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Change Password</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <FieldLabel text="Current Password" />
            <StyledTextField fullWidth type="password" placeholder="Enter current password" />
          </Box>
          <Box>
            <FieldLabel text="New Password" />
            <StyledTextField fullWidth type="password" placeholder="Enter New current password" />
          </Box>
          <Box>
            <FieldLabel text="Confirm Password" />
            <StyledTextField fullWidth type="password" placeholder="Confirm new password" />
          </Box>
        </Box>
      </Paper> 

      {/* SAVE BUTTON */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Button
          onClick={() => {
            handleSaveChanges();
          }}
          variant="contained"
          sx={{
            px: 6,
            py: 1.5,
            borderRadius: 2,
            bgcolor: "#0ea5e9",
            color: "#fff",
            fontWeight: 800,
            textTransform: "none",
            boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)",
            "&:hover": { bgcolor: "#0284c7", boxShadow: "none" },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}