import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  CloudUploadOutlined,
  PaletteOutlined,
  CheckCircle,
  DeleteOutline,
  Check,
  Search,
} from "@mui/icons-material";
import { useItinerary } from "../../context/ItineraryContext";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";

import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useBlobDownload, useBlobUpload } from "../../services/backendApi";

// --- COMPACT Styled Components for the Customization Form ---
const FormSection = ({ title, children, icon }) => (
  <Paper
    elevation={0}
    sx={{ p: 2.5, mb: 2, border: "1px solid #e2e8f0", borderRadius: 2.5 }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
      {React.cloneElement(icon, { sx: { fontSize: 20 } })}
      <Typography variant="subtitle2" fontWeight="800" color="#1e293b">
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

const StyledLabel = ({ text }) => (
  <Typography
    variant="caption"
    sx={{
      fontWeight: 700,
      color: "#64748b",
      mb: 0.5,
      display: "block",
      fontSize: "0.75rem",
    }}
  >
    {text}
  </Typography>
);

export default function ThemeSelection() {
  const { clientData, setClientData, themeConfig, setThemeConfig } = useItinerary();
  const [activeTab, setActiveTab] = useState("templates");

  const { userDetails, api } = useApi();
  const [userD, setUserD] = useState(userDetails || {});
  const { uploadBlob } = useBlobUpload();
  const { getBlob } = useBlobDownload();

  const [config, setConfig] = useState({
    coverImage: "",
    coverImageId: userD["custom:tmp_cover_img_id"] || "",
    primaryColor: userD["custom:tmp_pr_color"] || "",
    secondaryColor: userD["custom:tmp_se_color"] || "",
    primaryContact: userD["custom:tmp_pr_contact"] || "",
    secondaryContact: userD["custom:tmp_se_contact"] || "",
    supportEmail: userD["custom:tmp_support_email"] || "",
    website: userD["custom:tmp_website"] || "",
    fontStyle: userD["custom:tmp_font_style"] || "",
    footerText: userD["custom:tmp_footer_text"] || "",
  });

  useEffect(() => {
    setUserD(userDetails || {});
  }, [userDetails]);

  useEffect(() => {
    const init = async () => {
      let freshUser = userD;
      try {
        freshUser = await api.auth.loadUserDetails();
        setUserD(freshUser);
      } catch (err) {
        console.error("Failed to load user details:", err);
      }

      const blobId = freshUser?.["custom:tmp_cover_img_id"];
      if (blobId && blobId.length > 0) {
        try {
          const res = await getBlob(blobId);
          const resolvedUrl = res?.url;
          setConfig((prev) => ({
            ...prev,
            coverImage: resolvedUrl && resolvedUrl.length > 0 ? resolvedUrl : "",
            coverImageId: blobId,
          }));
        } catch (err) {
          console.error("Failed to load cover image blob:", err);
          setConfig((prev) => ({
            ...prev,
            coverImage: "",
            coverImageId: blobId, 
          }));
        }
      }
    };

    init();
  }, []);

  const handleSaveChanges = () => {
    const newPayload = {
      "custom:tmp_cover_img_id": config.coverImageId || "",
      "custom:tmp_pr_color": config.primaryColor || "",
      "custom:tmp_se_color": config.secondaryColor || "",
      "custom:tmp_font_style": config.fontStyle || "",
    };
    api.auth.updateProfileAttribute(newPayload).then(() => {
      api.auth.loadUserDetails().then((data) => {
        setUserD(data);
      });
    });
  };

  const handleBoxClick = async () => {
    try {
      const uploadedId = await uploadBlob("image/*");
      if (!uploadedId) return;

      const blobData = await getBlob(uploadedId);
      const url = blobData?.url;

      if (!url) {
        console.error("Uploaded blob returned no URL");
        return;
      }

      setConfig((prev) => ({
        ...prev,
        coverImage: url,
        coverImageId: uploadedId,
      }));
    } catch (err) {
      console.error("Failed to upload or fetch cover image:", err);
    }
  };

  const fileInputRef = useRef(null);

  const themes = [
    {
      id: "midnight",
      name: "Midnight Slate",
      category: "Luxury",
      description: "Deep charcoal and champagne gold for ultimate luxury.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      bgColor: "#0f172a",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
    },
    {
      id: "luxe",
      name: "Luxury Escape",
      category: "Luxury",
      description: "Elegant design for premium travel experiences.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      bgColor: "#ffffff",
      textColor: "#1e293b",
      accentColor: "#d4af37",
    },
    // {
    //   id: "coastal",
    //   name: "Coastal Serenity",
    //   category: "Adventure",
    //   description: "Airy ocean blues and clean whites for refreshing vibes.",
    //   image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
    //   bgColor: "#f0f9ff",
    //   textColor: "#082f49",
    //   accentColor: "#0ea5e9",
    // },
  ];

  const selectedTheme = clientData?.theme || "luxe";

  const handleSelectTheme = (themeId) => {
    if (setClientData) setClientData({ ...clientData, theme: themeId });
  };

  const handleCustomChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ pt: 4, pb: 10, px: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="800" color="#0f172a" mb={0.5}>
            Choose your Style
          </Typography>
          <Typography variant="body2" color="#64748b" fontWeight="500">
            Select and customize a professional template
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          size="small" 
          sx={{ 
            borderRadius: 2, 
            textTransform: "none", 
            fontWeight: 700, 
            color: "#0f172a", 
            borderColor: "#e2e8f0",
            "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" }
          }}
        >
          Clear All
        </Button>
      </Box>

      {/* TABS */}
      <Box sx={{ display: "flex", mb: 4 }}>
        <Box
          sx={{
            bgcolor: "#f8fafc",
            p: 0.5,
            borderRadius: 3,
            display: "flex",
            gap: 0.5,
            border: "1px solid #f1f5f9"
          }}
        >
          <Button
            onClick={() => setActiveTab("templates")}
            sx={{
              px: 3,
              py: 0.8,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              bgcolor: activeTab === "templates" ? "#fff" : "transparent",
              color: activeTab === "templates" ? "#0f172a" : "#64748b",
              boxShadow: activeTab === "templates" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
              "&:hover": { bgcolor: activeTab === "templates" ? "#fff" : "#f1f5f9" },
            }}
          >
            Templates
          </Button>
          <Button
            onClick={() => setActiveTab("customize")}
            sx={{
              px: 3,
              py: 0.8,
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              bgcolor: activeTab === "customize" ? "#fff" : "transparent",
              color: activeTab === "customize" ? "#0f172a" : "#64748b",
              boxShadow: activeTab === "customize" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
              "&:hover": { bgcolor: activeTab === "customize" ? "#fff" : "#f1f5f9" },
            }}
          >
            Customize Template
          </Button>
        </Box>
      </Box>

      {activeTab === "templates" ? (
        <>
          {/* EXACT SCREENSHOT UI: Card Grid with precise dimensions and removed zoom effect */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: { xs: "center", md: "flex-start" } }}>
            {themes.map((theme) => {
              const isSelected = selectedTheme === theme.id;
              
              return (
                <Paper
                  key={theme.id}
                  elevation={0}
                  onClick={() => handleSelectTheme(theme.id)}
                  sx={{
                    width: "256.53px",
                    height: "342.05px", 
                    borderRadius: 4,
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    border: isSelected ? "3px solid #06b6d4" : "1px solid #e2e8f0",
                    boxShadow: isSelected 
                      ? "0 12px 24px -8px rgba(6, 182, 212, 0.5), 0 0 0 4px rgba(6, 182, 212, 0.1)" 
                      : "0 4px 6px -1px rgba(0,0,0,0.05)",
                    // 🚨 Zoom effect removed 🚨
                    bgcolor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Top Image Section with inner padding */}
                  <Box sx={{ height: "155px", position: "relative", p: 1.5, pb: 0 }}>
                    <img
                      src={theme.image}
                      alt={theme.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "12px", // Inner image radius
                      }}
                    />
                    
                    {/* Overlapping Blue Checkmark overlay */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "-22px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          bgcolor: "#2563eb",
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                          border: "3px solid #fff",
                          zIndex: 10
                        }}
                      >
                        <Check sx={{ color: "#fff", fontSize: 24, strokeWidth: 3 }} />
                      </Box>
                    )}
                  </Box>

                  {/* Content Section */}
                  <Box sx={{ px: 2, pb: 2, pt: isSelected ? 3.5 : 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={0.5}>
                      {theme.name}
                    </Typography>
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Chip 
                        label={theme.category || "General"} 
                        size="small" 
                        sx={{ 
                          height: 22, 
                          fontSize: "0.7rem", 
                          fontWeight: 700, 
                          bgcolor: "#f1f5f9", 
                          color: "#64748b" 
                        }} 
                      />
                    </Box>

                    <Typography variant="caption" color="#64748b" sx={{ mb: 2, flexGrow: 1, lineHeight: 1.5 }}>
                      {theme.description}
                    </Typography>

                    {/* Pill button at bottom */}
                    <Button
                      fullWidth
                      variant="contained"
                      disableElevation
                      sx={{
                        borderRadius: 6,
                        textTransform: "none",
                        fontWeight: 700,
                        py: 0.8,
                        fontSize: "0.8rem",
                        bgcolor: isSelected ? "#06b6d4" : "#f1f5f9",
                        color: isSelected ? "#fff" : "#475569",
                        "&:hover": {
                          bgcolor: isSelected ? "#0891b2" : "#e2e8f0",
                        },
                      }}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </>
      ) : (
        <Box sx={{ maxWidth: 700, mx: "auto" }}>
          <FormSection
            title="Cover Page"
            icon={<PaletteOutlined color="primary" />}
          >
            <StyledLabel text="Cover Image" />

            {config.coverImage && config.coverImage.length > 0 ? (
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 180,
                  border: "1px solid #e2e8f0",
                  mb: 2,
                }}
              >
                <img
                  src={config.coverImage}
                  alt="Cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  onClick={handleBoxClick}
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "#fee2e2", color: "#ef4444" },
                  }}
                >
                  <CameraswitchIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setConfig((prev) => ({
                      ...prev,
                      coverImage: "",
                      coverImageId: "",
                    }));
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "#fee2e2", color: "#ef4444" },
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Box
                onClick={handleBoxClick}
                sx={{
                  border: "1.5px dashed #cbd5e1",
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  mb: 2,
                  bgcolor: "#f8fafc",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f1f5f9", borderColor: "#3b82f6" },
                }}
              >
                <CloudUploadOutlined
                  sx={{ fontSize: 28, color: "#94a3b8", mb: 0.5 }}
                />
                <Typography
                  variant="caption"
                  fontWeight="700"
                  color="#475569"
                  display="block"
                >
                  Click to upload or drag and drop
                </Typography>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Primary Color" />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) =>
                      handleCustomChange("primaryColor", e.target.value)
                    }
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="#3b82f6"
                    value={config.primaryColor}
                    onChange={(e) =>
                      handleCustomChange("primaryColor", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Secondary Color" />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) =>
                      handleCustomChange("secondaryColor", e.target.value)
                    }
                    style={{
                      width: 40,
                      height: 40,
                      padding: 0,
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="#06b6d4"
                    value={config.secondaryColor}
                    onChange={(e) =>
                      handleCustomChange("secondaryColor", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box sx={{ mb: 2 }}>
                  <StyledLabel text="Font Style" />
                  <Select
                    fullWidth
                    size="small"
                    value={config.fontStyle || "Inter"}
                    onChange={(e) =>
                      handleCustomChange("fontStyle", e.target.value)
                    }
                  >
                    <MenuItem value="Inter">Inter (Modern)</MenuItem>
                    <MenuItem value="Playfair Display">
                      Playfair Display (Luxury)
                    </MenuItem>
                    <MenuItem value="Poppins">Poppins (Clean)</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Button
                sx={{ color: "white" }}
                onClick={handleSaveChanges}
                variant="contained"
              >
                Save Custom Template
              </Button>
            </Box>
          </FormSection>
        </Box>
      )}
    </Box>
  );
}