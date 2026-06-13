import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  Map,
  Settings,
  Search,
  Menu as MenuIcon,
  ChevronLeft,
  Storage,
  SupportAgent,
  TravelExplore
} from "@mui/icons-material";
import { useItinerary } from "../context/ItineraryContext";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

const drawerWidth = 260;

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 🚨 ADDED SAFETY: Fallbacks for useApi
  const { userDetails = {}, logout, api } = useApi() || {};
  
  // 🚨 ADDED SAFETY: Fallbacks for useItinerary to prevent runtime crashes (e.g. settings.mode)
  const { step, handleNext, handlePrev, reviewData, settings = {} } = useItinerary() || {};

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // 🚨 ADDED LOCAL STATE: Guarantees the button updates instantly when clicked
  const [activeTab, setActiveTab] = useState(location?.pathname || "");

  useEffect(() => {
    if (location?.pathname) {
      setActiveTab(location.pathname);
    }
  }, [location?.pathname]);

  const isItineraryBuilder = location?.pathname === "/itinerary-builder";

  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    { text: "Itinerary Builder", path: "/itinerary-builder", icon: <Map /> },
    { text: "Lead Management", path: "/lead-management", icon: <SupportAgent /> },
    { text: "Master Entries", path: "/masterentry", icon: <Storage /> },
    { text: "Settings", path: "/settings", icon: <Settings /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: settings?.mode === "dark" ? "#202a0f" : "#ffffff",
        fontFamily: "'Inter', sans-serif", // 🚨 APPLIED INTER FONT
      }}
    >
      {/* 1. LOGO AREA */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 32,  
            height: 32,
            background: "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)", 
            color: "#fff",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TravelExplore sx={{ fontSize: 20 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800, // Kept a bit bolder for the brand logo
            letterSpacing: 1,
            color: settings?.mode === "dark" ? "#fff" : "#0f172a",
          }}
        >
          ATLAS
        </Typography>
        <IconButton
          sx={{ ml: "auto", display: { md: "none" } }}
          onClick={handleDrawerToggle}
        >
          <ChevronLeft />
        </IconButton>
      </Box>

      {/* 2. SEARCH BAR */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: settings?.mode === "dark" ? "#1E293B" : "#f1f5f9",
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          <Search sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />
          <TextField
            variant="standard"
            placeholder="Search..."
            InputProps={{ disableUnderline: true }}
            sx={{ 
              width: "100%", 
              "& input": { 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 500, // 🚨 FONT WEIGHT 500
                fontSize: "0.875rem", 
                p: 0 
              } 
            }}
          />
        </Box>
      </Box>

      {/* 3. NAVIGATION MENU */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          // 🚨 SAFE STRING CHECK
          const isActive = activeTab?.includes(item.path) || false;

          return (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                setActiveTab(item.path); 
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                py: 1,
                background: isActive ? "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)" : "transparent",
                color: isActive ? "#ffffff" : "#475569",
                "&:hover": {
                  background: isActive ? "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)" : "#f1f5f9",
                },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? "#ffffff" : "#64748b",
                }}
              >
                {React.cloneElement(item.icon, { fontSize: "small" })}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: "'Inter', sans-serif", // 🚨 APPLIED INTER FONT
                  fontSize: "0.875rem",
                  fontWeight: 500, // 🚨 FONT WEIGHT 500 FOR ALL ITEMS
                }}
              />
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
              background: "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)", 
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            {userDetails?.["custom:full_name"]?.[0] || "U"}
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ 
                fontFamily: "'Inter', sans-serif", // 🚨 APPLIED INTER FONT
                fontWeight: 600, // Clean medium-bold look
                color: "#0f172a" 
              }}
            >
              {userDetails?.["custom:full_name"] || "User"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ 
                fontFamily: "'Inter', sans-serif", // 🚨 APPLIED INTER FONT
                color: "#64748b", 
                fontWeight: 500 // 🚨 FONT WEIGHT 500
              }}
            >
              {userDetails?.["custom:agency_name"] || "Agency"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 5. LOGOUT BUTTON */}
      <Divider />
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Button
          onClick={async () => {
            if (api?.auth?.handleLogout) {
              await api.auth.handleLogout();
            }
          }}
          variant="outlined"
          color="error"
          fullWidth
          sx={{
            fontFamily: "'Inter', sans-serif", // 🚨 APPLIED INTER FONT
            fontWeight: 500, // 🚨 FONT WEIGHT 500
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{ 
        display: "flex", 
        height: "100vh", 
        bgcolor: "background.default",
        fontFamily: "'Inter', sans-serif" // 🚨 APPLIED GLOBALLY
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: "none" },
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Inter', sans-serif", 
              fontWeight: 800, 
              color: "text.primary" 
            }}
          >
            ATLAS CRM
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          pt: { xs: 7, md: 0 },
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: "auto", pb: isItineraryBuilder ? 14 : 4 }}>
          {children}
        </Box>

        {/* --- 🚨 LIVE PRICING FOOTER (ONLY SHOWS ON ITINERARY PAGE) --- */}
        {isItineraryBuilder && (
          <Paper
            elevation={16}
            sx={{
              position: "fixed",
              bottom: 0,
              right: 0,
              width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
              p: { xs: 2, md: 2 },
              px: { xs: 2, md: 5 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 1000,
              borderRadius: 0,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 2, md: 4 },
              }}
            >
              <Box
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ 
                    fontFamily: "'Inter', sans-serif",
                    display: { xs: "none", sm: "block" }, 
                    opacity: 0.7 
                  }}
                ></Typography>
                <Typography 
                  variant="h6" 
                  sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                ></Typography>
              </Box>
              <Box
                sx={{
                  borderLeft: "2px solid",
                  borderColor: "divider",
                  pl: { xs: 2, md: 4 },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ 
                    fontFamily: "'Inter', sans-serif",
                    display: { xs: "none", sm: "block" }, 
                    fontWeight: 500 
                  }}
                ></Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: settings?.primaryColor || "inherit"
                    }}
                  ></Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: { xs: 1, md: 2 } }}>
              <Button
                variant="text"
                onClick={handlePrev}
                disabled={step === 1}
                sx={{
                  fontFamily: "'Inter', sans-serif", // 🚨 APPLIED INTER FONT
                  minWidth: { xs: 0, md: 64 },
                  px: { xs: 1, md: 2 },
                  fontWeight: 500, // 🚨 FONT WEIGHT 500
                }}
              >
                Prev
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={step === 10}
                sx={{
                  fontFamily: "'Inter', sans-serif", // 🚨 APPLIED INTER FONT
                  fontWeight: 500, // 🚨 FONT WEIGHT 500
                  px: { xs: 2, md: 5 },
                  background: "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)", 
                  color: "#fff",
                  boxShadow: "none",
                  textTransform: "none"
                }}
              >
                Next Step
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}