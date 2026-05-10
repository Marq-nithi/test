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
  BusinessOutlined,
  WbSunnyOutlined,
  ColorizeOutlined
} from '@mui/icons-material';

// --- STYLED SUB-COMPONENTS ---
const FieldLabel = ({ text }) => (
  <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.8, display: 'block', fontSize: '0.75rem' }}>
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

// Figma-style Input
const StyledTextField = (props) => (
  <TextField
    {...props}
    size="small"
    sx={{
      '& .MuiOutlinedInput-root': {
        bgcolor: '#f8fafc',
        borderRadius: '8px',
        '& fieldset': { borderColor: '#e2e8f0', transition: 'all 0.2s ease-in-out' },
        '&:hover fieldset': { borderColor: '#cbd5e1' },
        '&.Mui-focused fieldset': { borderColor: '#0ea5e9', borderWidth: '1px' },
      },
      '& .MuiInputBase-input': { color: '#334155', fontSize: '0.875rem', fontWeight: 500 },
      ...props.sx
    }}
  />
);

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const [darkMode, setDarkMode] = useState(false);
  const [fontStyle, setFontStyle] = useState('Poppins');

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto', bgcolor: '#f8fafc', minHeight: '100vh', pb: 10 }}>
      
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="800" color="#0f172a" mb={0.5}>Settings</Typography>
        <Typography variant="body2" color="#64748b">Manage your account and preferences</Typography>
      </Box>

      {/* 1. PROFILE INFORMATION */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <SectionHeader title="Profile Information" icon={<PersonOutlineOutlined sx={{ color: '#9333ea' }} />} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#9333ea', fontSize: '1.5rem', fontWeight: 700 }}>AJ</Avatar>
          <Button 
            variant="outlined" 
            size="small" 
            startIcon={<CloudUploadOutlined />}
            sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#e2e8f0', color: '#475569', borderRadius: 2 }}
          >
            Upload Photo
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Full Name" />
            <StyledTextField fullWidth defaultValue="Alex Johnson" />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Email" />
            <StyledTextField fullWidth defaultValue="alex@travelagency.com" />
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldLabel text="Phone" />
            <StyledTextField fullWidth defaultValue="+1 234 567 8900" />
          </Grid>
        </Grid>
      </Paper>

      {/* 2. AGENCY BRANDING */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <SectionHeader title="Agency Branding" icon={<BusinessOutlined sx={{ color: '#9333ea' }} />} />
        
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <FieldLabel text="Agency Name" />
            <StyledTextField fullWidth defaultValue="Paradise Travel Agency" />
          </Grid>
          <Grid item xs={12} md={4}>
            <FieldLabel text="Prefix Name" />
            <StyledTextField fullWidth defaultValue="PT" />
          </Grid>
        </Grid>

        <FieldLabel text="Logo Upload" />
        <Box 
          sx={{ 
            p: 4, border: '2px dashed #cbd5e1', borderRadius: 3, 
            textAlign: 'center', bgcolor: '#f8fafc', cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' }
          }}
        >
          <CloudUploadOutlined sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
          <Typography variant="body2" color="#475569" fontWeight="600">
            Click to upload agency logo
          </Typography>
          <Typography variant="caption" color="#94a3b8">PNG, JPG up to 5MB</Typography>
        </Box>
      </Paper>

      {/* 3. NOTIFICATION PREFERENCES */}
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Notification Preferences</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[
            { key: 'email', label: 'Email Notifications', sub: 'Receive updates via email' },
            { key: 'push', label: 'Push Notifications', sub: 'Receive push notifications' },
            { key: 'sms', label: 'SMS Notifications', sub: 'Receive SMS updates' }
          ].map((item) => (
            <Box key={item.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Box>
                <Typography variant="body2" fontWeight="700" color="#0f172a" mb={0.2}>{item.label}</Typography>
                <Typography variant="caption" color="#64748b">{item.sub}</Typography>
              </Box>
              <Switch 
                checked={notifications[item.key]} 
                onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                color="primary"
              />
            </Box>
          ))}
        </Box>
      </Paper>

      {/* 4. CHANGE PASSWORD (NEW) */}
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

      {/* 5. THEME & APPEARANCE CARDS */}
      <Grid container spacing={3} mb={4}>
        
        {/* Color Theme */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Color Theme</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Gradient Box Mockup */}
              <Box sx={{ 
                height: 140, width: '100%', borderRadius: 2,
                background: 'linear-gradient(to bottom right, #fff, #9333ea, #000)', 
                position: 'relative'
              }}>
                <Box sx={{ position: 'absolute', top: 20, right: 30, width: 12, height: 12, borderRadius: '50%', border: '2px solid #fff' }} />
              </Box>

              {/* Sliders Mockup */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: '#9333ea' }} />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ height: 12, width: '100%', borderRadius: 5, background: 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', right: '10%', top: -2, width: 16, height: 16, borderRadius: '50%', bgcolor: '#fff', border: '2px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  </Box>
                  <Box sx={{ height: 12, width: '100%', borderRadius: 5, background: 'linear-gradient(to right, #e2e8f0, #9333ea)', position: 'relative' }}>
                    <Box sx={{ position: 'absolute', right: '0%', top: -2, width: 16, height: 16, borderRadius: '50%', bgcolor: '#fff', border: '2px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  </Box>
                </Box>
                <Box sx={{ bgcolor: '#0f172a', color: '#fff', px: 1, py: 0.5, borderRadius: 1, fontSize: '0.65rem', fontWeight: 800 }}>80%</Box>
              </Box>

              {/* Format Toggles */}
              <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', borderRadius: 2, p: 0.5, mt: 1 }}>
                {['Hex', 'RGB', 'HSL', 'HSB'].map((fmt, i) => (
                  <Box key={fmt} sx={{ flex: 1, textAlign: 'center', py: 0.5, bgcolor: i === 0 ? '#fff' : 'transparent', borderRadius: 1.5, fontSize: '0.75rem', fontWeight: i === 0 ? 700 : 500, color: i === 0 ? '#0f172a' : '#64748b', cursor: 'pointer', boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.05)' : 'none' }}>
                    {fmt}
                  </Box>
                ))}
              </Box>

              {/* Hex Input */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', mt: 1 }}>
                <ColorizeOutlined sx={{ color: '#475569', fontSize: 20 }} />
                <StyledTextField size="small" defaultValue="#9E00FF" sx={{ flexGrow: 1 }} />
                <StyledTextField size="small" defaultValue="80" sx={{ width: 60 }} InputProps={{ endAdornment: <Typography variant="caption" color="#94a3b8">%</Typography> }} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Appearance */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Appearance</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <WbSunnyOutlined sx={{ color: '#f59e0b', fontSize: 22 }} />
                <Box>
                  <Typography variant="body2" fontWeight="700" color="#0f172a">Dark Mode</Typography>
                  <Typography variant="caption" color="#64748b">Toggle dark theme</Typography>
                </Box>
              </Box>
              <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            </Box>
            
            <Box>
              <FieldLabel text="Font Style" />
              <StyledTextField 
                select 
                fullWidth 
                value={fontStyle}
                
                onChange={(e) => setFontStyle(e.target.value)}
              >
                <MenuItem value="Poppins">Poppins</MenuItem>
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Roboto">Roboto</MenuItem>
              </StyledTextField>
            </Box>
          </Paper>
        </Grid>
      </Grid> 

      {/* SAVE BUTTON */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          sx={{ 
            px: 6,
            py: 1.5, 
            borderRadius: 2, 
            bgcolor: '#0ea5e9', 
            color: '#fff',
            fontWeight: 800, 
            textTransform: 'none',
            boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)',
            '&:hover': { bgcolor: '#0284c7', boxShadow: 'none' }
          }}
        >
          Save Changes
        </Button>
      </Box>

    </Box>
  );
}