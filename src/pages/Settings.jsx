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
  Select,
  MenuItem,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useBlobDownload, useBlobUpload } from "../services/backendApi";
import {
  CloudUploadOutlined,
  DeleteOutline,
  AddOutlined,
  KeyboardArrowUp,
  VisibilityOff,
  LightMode,
  ColorizeOutlined,
} from "@mui/icons-material";

// --- FIGMA STYLED SUB-COMPONENTS ---

const FieldLabel = ({ text }) => (
  <Typography
    sx={{
      fontFamily: "Inter, sans-serif",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "20px",
      color: "#374151",
      mb: 1,
      display: "block",
    }}
  >
    {text}
  </Typography>
);

const SectionHeader = ({ title }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
    <Typography
      sx={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: "18px",
        lineHeight: "28px",
        color: "#111827",
      }}
    >
      {title}
    </Typography>
    <IconButton size="small" sx={{ border: "1px solid #E5E7EB", borderRadius: 1.5 }}>
      <KeyboardArrowUp fontSize="small" sx={{ color: "#6B7280" }} />
    </IconButton>
  </Box>
);

const CardPaper = ({ children, sx }) => (
  <Paper
    elevation={0}
    sx={{
      width: "100%",
      maxWidth: "1162px",
      borderRadius: "10px",
      border: "0.8px solid #E5E7EB",
      bgcolor: "#ffffff",
      p: 4,
      mb: 3,
      mx: "auto",
      ...sx,
    }}
  >
    {children}
  </Paper>
);

const StyledTextField = (props) => (
  <TextField
    {...props}
    fullWidth
    sx={{
      width: "100%",
      "& .MuiOutlinedInput-root": {
        height: "49.6px",
        borderRadius: "8px",
        bgcolor: "#ffffff",
        padding: props.select ? "0px" : "0px",
        "& fieldset": {
          border: "0.8px solid #E5E7EB",
          transition: "all 0.2s ease-in-out",
        },
        "&:hover fieldset": { borderColor: "#D1D5DB" },
        "&.Mui-focused fieldset": {
          borderColor: "#8b5cf6",
          borderWidth: "1px",
        },
      },
      "& .MuiInputBase-input": {
        padding: "12px 16px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "20px",
        color: "#1F2937",
        boxSizing: "border-box",
        height: "100%",
      },
      "& .MuiSelect-select": {
        display: "flex",
        alignItems: "center",
      },
      ...props.sx,
    }}
  />
);

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontStyle, setFontStyle] = useState("Poppins");
  
  const { userDetails, api } = useApi();
  const { uploadBlob } = useBlobUpload();
  const { getBlob } = useBlobDownload();

  const [userD, setUserD] = useState(userDetails);
  const [logoUrl, setLogoUrl] = useState("");

  const [brandingList, setBrandingList] = useState([
    { title: "", subtitle: "" },
  ]);

  const handleSaveChanges = () => {
    const newPayaLoad = {
      "custom:full_name": userD["custom:full_name"] || "",
      email: userD.email || "",
      "custom:mobile": userD["custom:mobile"] || "",
      "custom:agency_name": userD["custom:agency_name"] || "",
      given_name: userD.given_name || "",
      picture: userD.picture || "",
      "custom:tmp_website": userD["custom:tmp_website"] || "",
      "custom:office_address": userD["custom:office_address"] || "",
      "custom:support_email": userD["custom:support_email"] || "",
      "custom:tmp_pr_contact": userD["custom:tmp_pr_contact"] || "",
      "custom:tmp_se_contact": userD["custom:tmp_se_contact"] || "",
      "custom:tmp_footer_text": userD["custom:tmp_footer_text"] || "",
      "custom:branding": JSON.stringify(brandingList) || "[]",
    };
    api.auth.updateProfileAttribute(newPayaLoad).then(() => {
      api.auth.loadUserDetails().then((data) => {
        setUserD(data);
      });
    });
  };

  useEffect(() => {
    if (!userD) return;
    let branding = [];
    try {
      branding = JSON.parse(userD["custom:branding"] || "[]");
    } catch (e) {
      branding = [];
    }
    setBrandingList(
      branding.length
        ? branding
        : [
            {
              title: "",
              subtitle: "",
            },
          ],
    );
  }, [userD]);

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

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [currentPasswod, setCurrentPassword] = useState("");

  const handleChangeNewPassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert("New Password is not matching.");
      return;
    } else {
      api.auth
        .changePassword(currentPasswod, newPassword)
        .then((data) => {
          if (data.success) {
            setNewPassword("");
            setCurrentPassword("");
            setConfirmNewPassword("");
            alert("Password Has Been Updated.");
          } else {
            alert("Error in password update.");
          }
        })
        .catch(() => {
          alert("Error in password update.");
        });
    }
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
        maxWidth: 1200,
        mx: "auto",
        bgcolor: "#F9FAFB",
        minHeight: "100vh",
        pb: 10,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: 4, px: 2 }}>
        <Typography variant="h5" fontWeight="700" color="#111827" mb={0.5}>
          Settings
        </Typography>
        <Typography variant="body2" color="#6B7280">
          Manage your account and preferences
        </Typography>
      </Box>

      {/* 1. PROFILE INFORMATION */}
      <CardPaper>
        <SectionHeader title="Profile Information" />
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: "#4F46E5",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            {(userD?.["custom:full_name"] || "")
              .trim()
              .slice(0, 2)
              .toUpperCase() || "AJ"}
          </Avatar>
          <Button
            variant="outlined"
            startIcon={<CloudUploadOutlined fontSize="small" />}
            sx={{
              borderColor: "#E5E7EB",
              color: "#374151",
              textTransform: "none",
              fontWeight: 500,
              fontFamily: "Inter",
              borderRadius: "8px",
            }}
          >
            Upload Photo
          </Button>
        </Box>

        {/* Form Fields - Stacked Vertically, Full Width */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <FieldLabel text="Full Name" />
            <StyledTextField
              placeholder="Alex Johnson"
              value={userD?.["custom:full_name"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:full_name", e.target.value)
              }
            />
          </Box>
          <Box>
            <FieldLabel text="Email" />
            <StyledTextField
              placeholder="alex@travelagency.com"
              value={userD?.email || ""}
              onChange={(e) => handeleUserDtChange("email", e.target.value)}
            />
          </Box>
          <Box>
            <FieldLabel text="Phone" />
            <StyledTextField
              placeholder="+1 234 567 8900"
              value={userD?.["custom:mobile"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:mobile", e.target.value)
              }
            />
          </Box>
        </Box>
      </CardPaper>

      {/* 2. AGENCY BRANDING */}
      <CardPaper>
        <SectionHeader title="Agency Branding" />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 3 }}>
          <Box>
            <FieldLabel text="Agency Name" />
            <StyledTextField
              placeholder="Paradise Travel Agency"
              value={userD?.["custom:agency_name"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:agency_name", e.target.value)
              }
            />
          </Box>
          <Box>
            <FieldLabel text="Prefix Name" />
            <StyledTextField
              placeholder="PT"
              value={userD?.["given_name"] || ""}
              onChange={(e) =>
                handeleUserDtChange("given_name", e.target.value)
              }
            />
          </Box>
          <Box>
            <FieldLabel text="Support Email" />
            <StyledTextField
              placeholder="support@agency.com"
              value={userD?.["custom:support_email"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:support_email", e.target.value)
              }
            />
          </Box>
          <Box>
            <FieldLabel text="Website" />
            <StyledTextField
              placeholder="www.agency.com"
              value={userD?.["custom:tmp_website"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:tmp_website", e.target.value)
              }
            />
          </Box>
          <Box>
            <FieldLabel text="Office Address" />
            <StyledTextField
              placeholder="123 Commerce St"
              value={userD?.["custom:office_address"] || ""}
              onChange={(e) =>
                handeleUserDtChange("custom:office_address", e.target.value)
              }
            />
          </Box>
        </Box>

        <FieldLabel text="Logo Upload" />
        <Box
          onClick={handleAgencyLogoUpload}
          sx={{
            width: "100%",
            py: 4,
            border: "1px dashed #D1D5DB",
            borderRadius: "8px",
            textAlign: "center",
            bgcolor: "#FAFAFA",
            cursor: "pointer",
            transition: "all 0.2s",
            mb: 3,
            "&:hover": { bgcolor: "#F3F4F6", borderColor: "#9CA3AF" },
          }}
        >
          {logoUrl ? (
            <Box
              component="img"
              src={logoUrl}
              alt="Agency Logo"
              sx={{
                height: 80,
                objectFit: "contain",
                borderRadius: 1,
                mb: 1,
                mx: "auto",
              }}
            />
          ) : (
            <CloudUploadOutlined sx={{ fontSize: 28, color: "#6B7280", mb: 1 }} />
          )}
          <Typography variant="body2" sx={{ color: "#374151", fontWeight: 500, fontFamily: "Inter" }}>
            {logoUrl ? "Click to replace agency logo" : "Click to upload agency logo"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#6B7280", fontFamily: "Inter", mt: 0.5, display: "block" }}>
            SVG, PNG, JPG or GIF (max. 800x400px)
          </Typography>
        </Box>

        {/* Dynamic Branding List Preserved */}
        <Divider sx={{ my: 3 }} />
        <FieldLabel text="Additional Branding Info (Dynamic List)" />
        {brandingList.map((item, index) => (
          <Grid container spacing={2} alignItems="center" mb={2} key={index}>
            <Grid item xs={12} md={5}>
              <StyledTextField
                placeholder="Title (e.g. IATA Accredited)"
                value={item.title}
                onChange={(e) => {
                  const newList = [...brandingList];
                  newList[index].title = e.target.value;
                  setBrandingList(newList);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledTextField
                placeholder="Subtitle"
                value={item.subtitle}
                onChange={(e) => {
                  const newList = [...brandingList];
                  newList[index].subtitle = e.target.value;
                  setBrandingList(newList);
                }}
              />
            </Grid>
            <Grid item xs={12} md={1} sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => {
                  if (brandingList.length > 1) {
                    setBrandingList(brandingList.filter((_, i) => i !== index));
                  }
                }}
                disabled={brandingList.length === 1}
                sx={{ border: "1px solid #FCA5A5", color: "#EF4444", borderRadius: "8px" }}
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
              {index === brandingList.length - 1 && (
                <IconButton
                  onClick={() => setBrandingList([...brandingList, { title: "", subtitle: "" }])}
                  sx={{ border: "1px solid #E5E7EB", color: "#374151", borderRadius: "8px" }}
                >
                  <AddOutlined fontSize="small" />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}

        <Box sx={{ mt: 3 }}>
          <FieldLabel text="Footer Text" />
          <StyledTextField
            placeholder="Add custom footer text..."
            value={userD?.["custom:tmp_footer_text"] || ""}
            onChange={(e) =>
              handeleUserDtChange("custom:tmp_footer_text", e.target.value)
            }
          />
        </Box>
      </CardPaper>

      {/* 3. CHANGE PASSWORD */}
      <CardPaper>
        <SectionHeader title="Change Password" />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <FieldLabel text="Current Password" />
            <StyledTextField
              value={currentPasswod}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              placeholder="Enter current password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VisibilityOff sx={{ color: "#9CA3AF", fontSize: 20, cursor: "pointer" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <FieldLabel text="New Password" />
            <StyledTextField
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="Enter new password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VisibilityOff sx={{ color: "#9CA3AF", fontSize: 20, cursor: "pointer" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <FieldLabel text="Confirm Password" />
            <StyledTextField
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              type="password"
              placeholder="Confirm new password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VisibilityOff sx={{ color: "#9CA3AF", fontSize: 20, cursor: "pointer" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box>
            <Button 
              onClick={handleChangeNewPassword}
              variant="outlined"
              sx={{ 
                textTransform: 'none', 
                fontFamily: 'Inter', 
                fontWeight: 600, 
                borderRadius: '8px',
                borderColor: '#E5E7EB',
                color: '#374151'
              }}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      </CardPaper>

      {/* 4. BOTTOM TWO COLUMNS (Color Theme & Appearance) */}
    
      {/* SAVE BUTTON FULL WIDTH BOTTOM */}
      <Box sx={{ maxWidth: "1162px", mx: "auto", mt: 4 }}>
        <Button
          fullWidth
          onClick={handleSaveChanges}
          sx={{
            background: "linear-gradient(90deg, #4F46E5 0%, #8B5CF6 100%)",
            color: "#fff",
            py: 2,
            borderRadius: "10px",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Save Changes
        </Button>
      </Box>

    </Box>
  );
}