import React, { useState } from 'react';
import { 
  Box, Typography, Paper, TextField, Button, Avatar, 
  Switch, Divider, IconButton, Grid 
} from '@mui/material';
import { 
  CloudUpload, NotificationsNone, DarkModeOutlined 
} from '@mui/icons-material';

export default function Settings() {
  // State for toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [smsNotif, setSmsNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Reusable styled Paper for the "cards"
  const SectionCard = ({ title, children, sx }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 4, 
        borderRadius: 3, 
        border: '1px solid #e2e8f0',
        mb: 4,
        ...sx
      }}
    >
      <Typography variant="h6" fontWeight="800" color="#0f172a" mb={3}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', pb: 8 }}>
      
      {/* PAGE HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="900" color="#0f172a">Settings</Typography>
          <Typography variant="body2" color="#64748b">Manage your account and preferences</Typography>
        </Box>
        <IconButton sx={{ bgcolor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <NotificationsNone color="action" />
        </IconButton>
      </Box>

      {/* 1. PROFILE INFORMATION */}
      <SectionCard title="Profile Information">
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#9E00FF', fontSize: '2rem', fontWeight: 'bold' }}>
            AJ
          </Avatar>
          <Button 
            variant="outlined" 
            startIcon={<CloudUpload />}
            sx={{ borderRadius: 2, textTransform: 'none', color: '#64748b', borderColor: '#e2e8f0', fontWeight: 600 }}
          >
            Upload Photo
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Full Name" defaultValue="Alex Johnson" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Email" defaultValue="alex@travelagency.com" variant="outlined" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Phone" defaultValue="+1 234 567 8900" variant="outlined" />
          </Grid>
        </Grid>
      </SectionCard>

      {/* 2. AGENCY BRANDING */}
      <SectionCard title="Agency Branding">
        <TextField fullWidth label="Agency Name" defaultValue="Paradise Travel Agency" variant="outlined" sx={{ mb: 3 }} />
        
        <Box 
          sx={{ 
            border: '2px dashed #e2e8f0', 
            borderRadius: 3, 
            p: 4, 
            textAlign: 'center',
            bgcolor: '#f8fafc',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          <CloudUpload sx={{ color: '#94a3b8', fontSize: 40, mb: 1 }} />
          <Typography variant="body2" color="#64748b" fontWeight="600">
            Click to upload agency logo
          </Typography>
          <Typography variant="caption" color="#94a3b8">
            PNG, JPG up to 2MB
          </Typography>
        </Box>
      </SectionCard>

      {/* 3. NOTIFICATION PREFERENCES */}
      <SectionCard title="Notification Preferences">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="subtitle2" fontWeight="700" color="#0f172a">Email Notifications</Typography>
            <Typography variant="caption" color="#64748b">Receive updates via email.</Typography>
          </Box>
          <Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} color="primary" />
        </Box>
        <Divider sx={{ my: 2 }} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="subtitle2" fontWeight="700" color="#0f172a">Push Notifications</Typography>
            <Typography variant="caption" color="#64748b">Receive push notifications.</Typography>
          </Box>
          <Switch checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} color="primary" />
        </Box>
        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" fontWeight="700" color="#0f172a">SMS Notifications</Typography>
            <Typography variant="caption" color="#64748b">Receive SMS updates.</Typography>
          </Box>
          <Switch checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} color="primary" />
        </Box>
      </SectionCard>

      {/* 4. THEME & APPEARANCE (Side by Side) */}
      <Grid container spacing={4} mb={4}>
        
        {/* Color Theme Card */}
        <Grid item xs={12} md={7}>
          <SectionCard title="Color Theme" sx={{ mb: 0, height: '100%' }}>
            {/* Mock Gradient Box */}
            <Box sx={{ height: 120, borderRadius: 2, background: 'linear-gradient(90deg, #121212 0%, #9E00FF 100%)', mb: 2 }} />
            
            <TextField 
              fullWidth 
              size="small" 
              defaultValue="#9E00FF" 
              InputProps={{
                startAdornment: <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#9E00FF', mr: 1 }} />
              }}
              sx={{ mb: 3 }}
            />

            <Typography variant="caption" fontWeight="700" color="#64748b" mb={1} display="block">
              Last Used
            </Typography>
            <Box display="flex" gap={1}>
              {/* Fake color swatches */}
              {['#0f172a', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'].map(color => (
                <Box key={color} sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: color, cursor: 'pointer' }} />
              ))}
            </Box>
          </SectionCard>
        </Grid>

        {/* Appearance Card */}
        <Grid item xs={12} md={5}>
          <SectionCard title="Appearance" sx={{ mb: 0, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: 2, display: 'flex' }}>
                  <DarkModeOutlined sx={{ color: '#f59e0b' }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight="700" color="#0f172a">Dark Mode</Typography>
                  <Typography variant="caption" color="#64748b">Toggle dark theme</Typography>
                </Box>
              </Box>
              <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
            </Box>
          </SectionCard>
        </Grid>

      </Grid>

      {/* 5. SAVE BUTTON */}
      <Button 
        fullWidth 
        variant="contained" 
        sx={{ 
          py: 2, 
          borderRadius: 3, 
          fontSize: '1rem', 
          fontWeight: 700,
          background: 'linear-gradient(90deg, #3b82f6 0%, #9E00FF 100%)', // Match the Figma button!
          boxShadow: '0 4px 14px rgba(158, 0, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #2563eb 0%, #7e22ce 100%)',
          }
        }}
      >
        Save Changes
      </Button>

    </Box>
  );
}