// src/components/LeftNav.js
import React from 'react';
import { Box, Tooltip, IconButton, Divider, useTheme } from '@mui/material';
import { 
  Home, Briefcase, Handshake, ShoppingCart, Key, MapPin, Target, CalendarDays, 
  FileText, Bell, Settings, LogOut 
} from 'lucide-react';

const icons = [
  { icon: <Home size={20} />, title: 'Home' },
  { icon: <Briefcase size={20} />, title: 'Leads' },
  { icon: <Handshake size={20} />, title: 'Vendors' },
  { icon: <ShoppingCart size={20} />, title: 'Orders' },
  { icon: <Key size={20} />, title: 'Admin' },
  { icon: <MapPin size={20} />, title: 'Destinations' },
  { icon: <Target size={20} />, title: 'Sales' },
  { icon: <CalendarDays size={20} />, title: 'Events' },
  { icon: <FileText size={20} />, title: 'Reports' },
  { icon: <Bell size={20} />, title: 'Notifications' },
  { icon: <Settings size={20} />, title: 'Settings' },
];

const LeftNav = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      width: 60, 
      height: '100vh', 
      bgcolor: theme.palette.sidebar.bg, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      py: 3, 
      position: 'fixed', 
      left: 0, 
      top: 0 
    }}>
      {/* Figma Logo (Placeholder) */}
      <Box sx={{ mb: 4, width: 30, height: 30, bgcolor: 'primary.main', borderRadius: 1 }} />
      
      {icons.map((item, index) => (
        <Tooltip key={index} title={item.title} placement="right">
          <IconButton sx={{ mb: 1.5, color: theme.palette.sidebar.icon }}>
            {item.icon}
          </IconButton>
        </Tooltip>
      ))}

      <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ mt: 'auto' }}>
        <IconButton sx={{ color: theme.palette.sidebar.icon }}>
          <LogOut size={20} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default LeftNav;