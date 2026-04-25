import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, Avatar, 
  Switch, FormControlLabel, Select, MenuItem, Divider, IconButton
} from '@mui/material';
import { 
  CloudUploadOutlined, 
  NotificationsNoneOutlined, 
  PaletteOutlined, 
  PersonOutlineOutlined,
  BusinessOutlined
} from '@mui/icons-material';

// --- STYLED SUB-COMPONENTS ---
const FieldLabel = ({ text }) => (
  <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', mb: 0.8, display: 'block', fontSize: '0.75rem' }}>
    {text}
  </Typography>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
    {icon}
    <Typography variant="subtitle1" fontWeight="800" color="#0f172a">
      {title}
    </Typography>
  </Box>
);

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="900" color="#0f172a" mb={0.5}>Settings</Typography>
        <Typography variant="body2" color="#64748b">Manage your account and preferences</Typography>
      </Box>

      {/* 1. PROFILE INFORMATION */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <SectionHeader title="Profile Information" icon={<PersonOutlineOutlined sx={{ color: '#9333ea' }} />} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#9333ea', fontSize: '1.5rem', fontWeight: 700 }}>AJ</Avatar>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<CloudUploadOutlined />}
            sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#e2e8f0', color: '#475569' }}
          >
            Upload Photo
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Full Name" />
            <TextField fullWidth size="small" defaultValue="Alex Johnson" />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Email" />
            <TextField fullWidth size="small" defaultValue="alex@travelagency.com" />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Phone" />
            <TextField fullWidth size="small" defaultValue="+1 234 567 8900" />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. AGENCY BRANDING */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <SectionHeader title="Agency Branding" icon={<BusinessOutlined sx={{ color: '#9333ea' }} />} />
        
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <FieldLabel text="Agency Name" />
            <TextField fullWidth size="small" defaultValue="Paradise Travel Agency" />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Prefix Name" />
            <TextField fullWidth size="small" defaultValue="PT" />
          </Grid>
        </Grid>

        <FieldLabel text="Logo Upload" />
        <Box 
          sx={{ 
            p: 4, border: '2px dashed #e2e8f0', borderRadius: 3, 
            textAlign: 'center', bgcolor: '#fbfcfe', cursor: 'pointer',
            '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' }
          }}
        >
          <CloudUploadOutlined sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
          <Typography variant="body2" color="#64748b" fontWeight="600">
            Click to upload agency logo
          </Typography>
          <Typography variant="caption" color="#94a3b8">PNG, JPG up to 5MB</Typography>
        </Box>
      </Paper>

      {/* 3. NOTIFICATION PREFERENCES */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <SectionHeader title="Notification Preferences" icon={<NotificationsNoneOutlined sx={{ color: '#9333ea' }} />} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { key: 'email', label: 'Email Notifications', sub: 'Receive updates via email' },
            { key: 'push', label: 'Push Notifications', sub: 'Receive mobile notifications' },
            { key: 'sms', label: 'SMS Notifications', sub: 'Receive SMS updates' }
          ].map((item) => (
            <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight="700" color="#0f172a">{item.label}</Typography>
                <Typography variant="caption" color="#64748b">{item.sub}</Typography>
              </Box>
              <Switch 
                checked={notifications[item.key]} 
                onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                color="secondary"
              />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* 4. APPEARANCE */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <SectionHeader title="Appearance" icon={<PaletteOutlined sx={{ color: '#9333ea' }} />} />
        
        <Grid container spacing={4}>
          {/* Color Picker Simulation */}
          <Grid item xs={12} md={7}>
            <FieldLabel text="Color Theme" />
            <Box sx={{ border: '1px solid #e2e8f0', p: 2, borderRadius: 2 }}>
              <Box sx={{ 
                height: 150, width: '100%', borderRadius: 1.5, mb: 2,
                background: 'linear-gradient(to right, #fff, #9333ea)', // Mock picker
                position: 'relative'
              }}>
                <Box sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: '#fff', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.7rem', fontWeight: 700 }}>80%</Box>
              </Box>
              <Box sx={{ height: 10, width: '100%', borderRadius: 5, background: 'linear-gradient(to right, red, yellow, green, cyan, blue, magenta, red)', mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField size="small" defaultValue="#9D38FF" sx={{ width: 120 }} inputProps={{ style: { fontSize: '0.8rem', fontWeight: 700 } }} />
                <Typography variant="caption" fontWeight="800" color="#94a3b8">80%</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Mode & Font */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="body2" fontWeight="700" color="#0f172a">Dark Mode</Typography>
                <Typography variant="caption" color="#64748b">Toggle dark theme</Typography>
              </Box>
              <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            </Box>
            
            <Box>
              <FieldLabel text="Font Style" />
              <Select fullWidth size="small" defaultValue="Poppins">
                <MenuItem value="Poppins">Poppins</MenuItem>
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Roboto">Roboto</MenuItem>
              </Select>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* SAVE BUTTON */}
      <Button 
        fullWidth 
        variant="contained" 
        sx={{ 
          py: 1.5, 
          borderRadius: 2, 
          bgcolor: '#9333ea', 
          fontWeight: 800, 
          textTransform: 'none',
          '&:hover': { bgcolor: '#7e22ce' }
        }}
      >
        Save Changes
      </Button>

    </Box>
  );
}