import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  InputBase,
  Divider,
} from "@mui/material";
import {
  GridView,
  SupportAgent,
  Map,
  Settings,
  Search,
  Storage,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

// 🚨 1. IMPORT YOUR LOCAL IMAGE HERE 
// (Change "../../assets/logo.png" to the actual path where your image is saved)
import logoImage from "../23.jpg"; 

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = useApi() || {}; // 🚨 Added fallback empty object

  // Local state: This guarantees the button updates instantly when clicked!
  const [activeTab, setActiveTab] = useState(location?.pathname || ""); // 🚨 Added optional chaining

  // Keep it synced if the URL changes from somewhere else (like the browser back button)
  useEffect(() => {
    if (location?.pathname) {
      setActiveTab(location.pathname);
    }
  }, [location?.pathname]);

  const menuItems = [
    { title: "Dashboard", icon: <GridView />, path: "/dashboard" },
    { title: "Lead Management", icon: <SupportAgent />, path: "/lead-management" },
    { title: "Itinerary Builder", icon: <Map />, path: "/itinerary-builder" },
    { title: "Master Entries", icon: <Storage />, path: "/masterentry" },
    { title: "Settings", icon: <Settings />, path: "/settings" },
  ];

  // Custom handler to force the state update immediately on click
  const handleNavigation = (path) => {
    setActiveTab(path); // Instantly change the active color
    navigate(path);     // Then navigate
  };

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      {/* 1. LOGO AREA */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 32,  
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 🚨 2. USE THE IMPORTED IMAGE HERE 🚨 */}
          <img 
            src={logoImage} 
            alt="Atlas Logo" 
            style={{ width: "100%", height: "100%", objectFit: "contain" }} 
          />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: 1 }}
        >
          ATLAS
        </Typography>
      </Box>
      
      {/* 2. SEARCH BAR */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f1f5f9",
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <Search sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Search..."
            sx={{ fontSize: "0.875rem", width: "100%" }}
          />
        </Box>
      </Box>

      {/* 3. NAVIGATION MENU */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          // 🚨 Added safe string check
          const isActive = activeTab?.includes(item.path) || false;

          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? "#8b5cf6" : "transparent", // Purple active background
                  color: isActive ? "#ffffff" : "#475569",
                  "&:hover": {
                    bgcolor: isActive ? "#8b5cf6" : "#f1f5f9",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 40, color: isActive ? "#ffffff" : "#64748b" }}
                >
                  {React.cloneElement(item.icon, { fontSize: "small" })}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* 4. BOTTOM USER PROFILE */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ borderColor: "#e2e8f0" }} />
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#8b5cf6", // Purple Avatar background
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {userDetails?.["custom:full_name"]?.[0] || "U"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "#0f172a" }}
            >
              {userDetails?.["custom:full_name"] || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 500 }}
            >
              {userDetails?.["custom:agency_name"] || "Agency"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  InputBase,
  Divider,
} from "@mui/material";
import {
  GridView,
  SupportAgent,
  Map,
  Settings,
  Search,
  Storage,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

// 🚨 1. IMPORT YOUR LOCAL IMAGE HERE 
// (Change "../../assets/logo.png" to the actual path where your image is saved)
import logoImage from "../23.jpg"; 

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = useApi() || {}; // 🚨 Added fallback empty object

  // Local state: This guarantees the button updates instantly when clicked!
  const [activeTab, setActiveTab] = useState(location?.pathname || ""); // 🚨 Added optional chaining

  // Keep it synced if the URL changes from somewhere else (like the browser back button)
  useEffect(() => {
    if (location?.pathname) {
      setActiveTab(location.pathname);
    }
  }, [location?.pathname]);

  const menuItems = [
    { title: "Dashboard", icon: <GridView />, path: "/dashboard" },
    { title: "Lead Management", icon: <SupportAgent />, path: "/lead-management" },
    { title: "Itinerary Builder", icon: <Map />, path: "/itinerary-builder" },
    { title: "Master Entries", icon: <Storage />, path: "/masterentry" },
    { title: "Settings", icon: <Settings />, path: "/settings" },
  ];

  // Custom handler to force the state update immediately on click
  const handleNavigation = (path) => {
    setActiveTab(path); // Instantly change the active color
    navigate(path);     // Then navigate
  };

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
      }}
    >
      {/* 1. LOGO AREA */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 32,  
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 🚨 2. USE THE IMPORTED IMAGE HERE 🚨 */}
          <img 
            src={logoImage} 
            alt="Atlas Logo" 
            style={{ width: "100%", height: "100%", objectFit: "contain" }} 
          />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: 1 }}
        >
          ATLAS
        </Typography>
      </Box>
      
      {/* 2. SEARCH BAR */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f1f5f9",
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <Search sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Search..."
            sx={{ fontSize: "0.875rem", width: "100%" }}
          />
        </Box>
      </Box>

      {/* 3. NAVIGATION MENU */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          // 🚨 Added safe string check
          const isActive = activeTab?.includes(item.path) || false;

          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? "#8b5cf6" : "transparent", // Purple active background
                  color: isActive ? "#ffffff" : "#475569",
                  "&:hover": {
                    bgcolor: isActive ? "#8b5cf6" : "#f1f5f9",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{ minWidth: 40, color: isActive ? "#ffffff" : "#64748b" }}
                >
                  {React.cloneElement(item.icon, { fontSize: "small" })}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 700 : 600,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* 4. BOTTOM USER PROFILE */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ borderColor: "#e2e8f0" }} />
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#8b5cf6", // Purple Avatar background
              color: "#fff",
              fontWeight: 800,
            }}
          >
            {userDetails?.["custom:full_name"]?.[0] || "U"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "#0f172a" }}
            >
              {userDetails?.["custom:full_name"] || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 500 }}
            >
              {userDetails?.["custom:agency_name"] || "Agency"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}}