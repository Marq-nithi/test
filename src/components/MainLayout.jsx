import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Typography, TextField, Button, Avatar, Paper, Chip, IconButton, AppBar, Toolbar 
} from '@mui/material';
import { 
  Dashboard, Map, Settings, Search, Menu as MenuIcon, ChevronLeft 
} from '@mui/icons-material';
import { useItinerary } from '../context/ItineraryContext';

const drawerWidth = 260;

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  // PULLING THE REAL-TIME BUDGET FROM CONTEXT
  const { step, handleNext, handlePrev, reviewData, settings } = useItinerary(); 
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Itinerary Builder', path: '/itinerary-builder', icon: <Map /> },
        { text: 'LeadManagemen', path: '/lead-management', icon: <Settings /> },

    { text: 'Settings', path: '/settings', icon: <Settings /> },
   ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: settings.mode === 'dark' ? '#0F172A' : '#fff' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ bgcolor: settings.primaryColor, color: '#fff', borderRadius: 1.5, p: 0.5, display: 'flex' }}><Map fontSize="small" /></Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: settings.mode === 'dark' ? '#fff' : '#1a1a1a' }}>ATLAS</Typography>
        <IconButton sx={{ ml: 'auto', display: { md: 'none' } }} onClick={handleDrawerToggle}><ChevronLeft /></IconButton>
      </Box>
      <Box sx={{ px: 3, mb: 4, mt: 1 }}>
        <TextField fullWidth size="small" placeholder="Search..." sx={{ bgcolor: settings.mode === 'dark' ? '#1E293B' : '#f5f7fa', borderRadius: 2, '& fieldset': { border: 'none' } }} InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }} />
      </Box>
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem button key={item.text} onClick={() => { navigate(item.path); setMobileOpen(false); }} sx={{ borderRadius: 2, mb: 0.5, py: 1.5, ...(isActive && { bgcolor: settings.primaryColor, color: '#fff' }) }}>
              <ListItemIcon sx={{ color: isActive ? '#fff' : 'text.secondary', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }} />
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Avatar sx={{ bgcolor: settings.primaryColor }}>J</Avatar>
        <Box><Typography variant="subtitle2" fontWeight="bold">John Doe</Typography><Typography variant="caption" color="text.secondary">Travel Agent</Typography></Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" elevation={0} sx={{ display: { md: 'none' }, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: 'text.primary' }}><MenuIcon /></IconButton>
          <Typography variant="h6" fontWeight="800" color="text.primary">ATLAS CRM</Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>{drawerContent}</Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' } }} open>{drawerContent}</Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', pt: { xs: 7, md: 0 } }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 14 }}>{children}</Box>

        {/* --- LIVE PRICING FOOTER --- */}
        <Paper elevation={16} sx={{ position: 'fixed', bottom: 0, right: 0, width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }, p: { xs: 2, md: 2 }, px: { xs: 2, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1000, borderRadius: 0, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
            <Box sx={{ bgcolor: 'text.primary', color: 'background.paper', py: 1, px: 2, borderRadius: 2 }}>
              <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, opacity: 0.7 }}>PROFIT / COST</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>---</Typography>
            </Box>
            <Box sx={{ borderLeft: '2px solid', borderColor: 'divider', pl: { xs: 2, md: 4 } }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 700 }}>CLIENT BUDGET / TOTAL</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" fontWeight="bold" color={settings.primaryColor}>{reviewData.budget}</Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 } }}>
            <Button variant="text" onClick={handlePrev} disabled={step === 1} sx={{ minWidth: { xs: 0, md: 64 }, px: { xs: 1, md: 2 }, fontWeight: 700 }}>Prev</Button>
            {/* DISABLED NOW PROPERLY SET TO 9 */}
            <Button variant="contained" onClick={handleNext} disabled={step === 9} sx={{ px: { xs: 2, md: 5 }, bgcolor: settings.primaryColor, color: '#fff' }}>Next Step</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}