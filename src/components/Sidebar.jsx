import React from "react";
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
  TravelExplore,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDetails } = useApi();

  // 🚨 Your Menu Items mapped to the actual routes
  const menuItems = [
    { title: "Dashboard", icon: <GridView />, path: "/dashboard" },
    {
      title: "Lead Management",
      icon: <SupportAgent />,
      path: "/lead-management",
    }, // <-- NEW SECTION
    { title: "Itinerary Builder", icon: <Map />, path: "/itinerary-builder" },
    { title: "Settings", icon: <Settings />, path: "/settings" },
  ];

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
        position: "fixed", // Keeps it locked to the left side
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
            bgcolor: "#00c6ff",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TravelExplore sx={{ color: "#fff", fontSize: 20 }} />
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
          // Checks if the current URL matches the path so it highlights the right button
          const isActive = location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  bgcolor: isActive ? "#00c6ff" : "transparent",
                  color: isActive ? "#ffffff" : "#475569",
                  "&:hover": {
                    bgcolor: isActive ? "#00c6ff" : "#f1f5f9",
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
              bgcolor: "#00c6ff",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            J
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "#0f172a" }}
            >
              John Doe
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 500 }}
            >
              {userDetails["custom:agency_name"]}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
