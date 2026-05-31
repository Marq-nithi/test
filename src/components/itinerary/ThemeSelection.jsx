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
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  CloudUploadOutlined,
  PaletteOutlined,
  CheckCircle,
  ContactPhoneOutlined,
  StyleOutlined,
  DeleteOutline,
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
  const { clientData, setClientData, themeConfig, setThemeConfig } =
    useItinerary();
  const [activeTab, setActiveTab] = useState("templates");

  const { userDetails, api } = useApi();
  const [userD, setUserD] = useState(userDetails || {});
  const { uploadBlob } = useBlobUpload();
  const { getBlob } = useBlobDownload();

  const [config, setConfig] = useState({
    // ✅ FIX 1: Don't store the blob ID as coverImage — start as empty string.
    // The actual URL will be resolved async in useEffect below.
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
      // ✅ FIX 2: Load user details first so we get the latest cover ID
      let freshUser = userD;
      try {
        freshUser = await api.auth.loadUserDetails();
        setUserD(freshUser);
      } catch (err) {
        console.error("Failed to load user details:", err);
      }

      // ✅ FIX 3: Resolve blob ID → URL in a separate try/catch with proper fallback
      const blobId = freshUser?.["custom:tmp_cover_img_id"];
      if (blobId && blobId.length > 0) {
        try {
          const res = await getBlob(blobId);
          const resolvedUrl = res?.url;
          setConfig((prev) => ({
            ...prev,
            // ✅ FIX 4: Only set coverImage if we actually got a valid URL back
            coverImage:
              resolvedUrl && resolvedUrl.length > 0 ? resolvedUrl : "",
            coverImageId: blobId,
          }));
        } catch (err) {
          console.error("Failed to load cover image blob:", err);
          // ✅ FIX 5: On failure, keep coverImage as "" (show the upload box, not a broken image)
          setConfig((prev) => ({
            ...prev,
            coverImage: "",
            coverImageId: blobId, // keep the ID so we don't lose the reference
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
    // ✅ FIX 6: Wrap upload+blob fetch in try/catch to avoid silent failures
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
      description: "Deep charcoal and champagne gold for ultimate luxury.",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      bgColor: "#0f172a",
      textColor: "#ffffff",
      accentColor: "#fbbf24",
    },
    {
      id: "luxe",
      name: "Classic Luxe",
      description:
        "Timeless ivory and serif typography with goldenrod accents.",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      bgColor: "#ffffff",
      textColor: "#1e293b",
      accentColor: "#d4af37",
    },
    {
      id: "coastal",
      name: "Coastal Serenity",
      description: "Airy ocean blues and clean whites for refreshing vibes.",
      image:
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      bgColor: "#f0f9ff",
      textColor: "#082f49",
      accentColor: "#0ea5e9",
    },
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

  const removeImage = () => handleCustomChange("coverImage", null);

  return (
    <Box
      sx={{ pt: 3, pb: 10, px: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <Box
          sx={{
            bgcolor: "#f1f5f9",
            p: 0.5,
            borderRadius: 2,
            display: "flex",
            gap: 0.5,
          }}
        >
          <Button
            onClick={() => setActiveTab("templates")}
            sx={{
              px: 3,
              py: 0.6,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              bgcolor: activeTab === "templates" ? "#fff" : "transparent",
              color: activeTab === "templates" ? "#2563eb" : "#64748b",
              boxShadow:
                activeTab === "templates"
                  ? "0 2px 4px rgba(0,0,0,0.05)"
                  : "none",
              "&:hover": {
                bgcolor: activeTab === "templates" ? "#fff" : "#e2e8f0",
              },
            }}
          >
            Templates
          </Button>
          <Button
            onClick={() => setActiveTab("customize")}
            sx={{
              px: 3,
              py: 0.6,
              borderRadius: 1.5,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              bgcolor: activeTab === "customize" ? "#fff" : "transparent",
              color: activeTab === "customize" ? "#2563eb" : "#64748b",
              boxShadow:
                activeTab === "customize"
                  ? "0 2px 4px rgba(0,0,0,0.05)"
                  : "none",
              "&:hover": {
                bgcolor: activeTab === "customize" ? "#fff" : "#e2e8f0",
              },
            }}
          >
            Customize Template
          </Button>
        </Box>
      </Box>

      {activeTab === "templates" ? (
        <Grid container spacing={2.5} justifyContent="center">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <Grid item xs={12} sm={4} key={theme.id}>
                <Paper
                  elevation={0}
                  onClick={() => handleSelectTheme(theme.id)}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: isSelected
                      ? `2px solid ${theme.accentColor}`
                      : "1px solid #e2e8f0",
                    transition: "all 0.2s ease",
                    transform: isSelected ? "scale(1.02)" : "none",
                    bgcolor: theme.bgColor,
                    color: theme.textColor,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={theme.image}
                      alt={theme.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {isSelected && (
                      <CheckCircle
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: theme.accentColor,
                          bgcolor: "#fff",
                          borderRadius: "50%",
                          fontSize: 20,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      fontWeight="800"
                      mb={0.5}
                      sx={{ fontSize: "0.95rem" }}
                    >
                      {theme.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.8, lineHeight: 1.4, display: "block" }}
                    >
                      {theme.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ maxWidth: 700, mx: "auto" }}>
          <FormSection
            title="Cover Page"
            icon={<PaletteOutlined color="primary" />}
          >
            <StyledLabel text="Cover Image" />

            {/* ✅ FIX 7: Check for a truthy non-empty string URL, not just any truthy value */}
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
                  {/* ✅ FIX 8: onClick moved to the IconButton, not the icon child */}
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
                  {/* ✅ FIX 9: onClick moved to the IconButton, not the icon child */}
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
