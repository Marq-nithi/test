import React, { useState, useRef } from 'react';
import { 
  Box, Typography, Grid, Paper, Button, TextField, 
  MenuItem, Select, InputAdornment, IconButton
} from '@mui/material';
import { 
  CloudUploadOutlined, PaletteOutlined, 
  CheckCircle, ContactPhoneOutlined, StyleOutlined, DeleteOutline
} from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext';

// --- COMPACT Styled Components for the Customization Form ---
const FormSection = ({ title, children, icon }) => (
  <Paper elevation={0} sx={{ p: 2.5, mb: 2, border: '1px solid #e2e8f0', borderRadius: 2.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {React.cloneElement(icon, { sx: { fontSize: 20 } })}
      <Typography variant="subtitle2" fontWeight="800" color="#1e293b">{title}</Typography>
    </Box>
    {children}
  </Paper>
);

const StyledLabel = ({ text }) => (
  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
    {text}
  </Typography>
);

export default function ThemeSelection() {
  const { clientData, setClientData, themeConfig, setThemeConfig } = useItinerary();
  const [activeTab, setActiveTab] = useState('templates');
  
  // 🚨 THE FIX: This Ref directly controls the hidden file input
  const fileInputRef = useRef(null);

  const config = themeConfig || {
    coverImage: null, primaryColor: '#3b82f6', secondaryColor: '#06b6d4',
    primaryContact: '', secondaryContact: '', supportEmail: '', website: '',
    fontStyle: 'Inter', footerText: ''
  };

  const themes = [
    {
      id: 'midnight',
      name: 'Midnight Slate',
      description: 'Deep charcoal and champagne gold for ultimate luxury.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      bgColor: '#0f172a', textColor: '#ffffff', accentColor: '#fbbf24'
    },
    {
      id: 'luxe',
      name: 'Classic Luxe',
      description: 'Timeless ivory and serif typography with goldenrod accents.',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      bgColor: '#ffffff', textColor: '#1e293b', accentColor: '#d4af37'
    },
    {
      id: 'coastal',
      name: 'Coastal Serenity',
      description: 'Airy ocean blues and clean whites for refreshing vibes.',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
      bgColor: '#f0f9ff', textColor: '#082f49', accentColor: '#0ea5e9'
    }
  ];

  const selectedTheme = clientData?.theme || 'luxe';

  const handleSelectTheme = (themeId) => {
    if (setClientData) setClientData({ ...clientData, theme: themeId });
  };

  const handleCustomChange = (field, value) => {
    if (setThemeConfig) {
      setThemeConfig({ ...config, [field]: value });
    }
  };

  // 🚨 THE FIX: Robust file upload logic using FileReader
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Saves the image as a Base64 string so it survives page refreshes in localStorage!
        handleCustomChange('coverImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
    
    // Clear the input so you can re-upload the same file later if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => handleCustomChange('coverImage', null);

  // Helper to trigger the hidden file input
  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ pt: 3, pb: 10, px: { xs: 2, md: 4 }, maxWidth: 1000, mx: 'auto' }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Box sx={{ bgcolor: '#f1f5f9', p: 0.5, borderRadius: 2, display: 'flex', gap: 0.5 }}>
          <Button 
            onClick={() => setActiveTab('templates')}
            sx={{ 
              px: 3, py: 0.6, borderRadius: 1.5, textTransform: 'none', fontWeight: 700, fontSize: '0.85rem',
              bgcolor: activeTab === 'templates' ? '#fff' : 'transparent',
              color: activeTab === 'templates' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'templates' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              '&:hover': { bgcolor: activeTab === 'templates' ? '#fff' : '#e2e8f0' }
            }}
          >
            Templates
          </Button>
          <Button 
            onClick={() => setActiveTab('customize')}
            sx={{ 
              px: 3, py: 0.6, borderRadius: 1.5, textTransform: 'none', fontWeight: 700, fontSize: '0.85rem',
              bgcolor: activeTab === 'customize' ? '#fff' : 'transparent',
              color: activeTab === 'customize' ? '#2563eb' : '#64748b',
              boxShadow: activeTab === 'customize' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              '&:hover': { bgcolor: activeTab === 'customize' ? '#fff' : '#e2e8f0' }
            }}
          >
            Customize Template
          </Button>
        </Box>
      </Box>

      {activeTab === 'templates' ? (
        <Grid container spacing={2.5} justifyContent="center">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <Grid item xs={12} sm={4} key={theme.id}>
                <Paper 
                  elevation={0}
                  onClick={() => handleSelectTheme(theme.id)}
                  sx={{ 
                    borderRadius: 3, overflow: 'hidden', cursor: 'pointer',
                    border: isSelected ? `2px solid ${theme.accentColor}` : '1px solid #e2e8f0',
                    transition: 'all 0.2s ease', transform: isSelected ? 'scale(1.02)' : 'none',
                    bgcolor: theme.bgColor, color: theme.textColor, height: '100%', display: 'flex', flexDirection: 'column'
                  }}
                >
                  <Box sx={{ height: 140, overflow: 'hidden', position: 'relative' }}>
                    <img src={theme.image} alt={theme.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {isSelected && (
                      <CheckCircle sx={{ position: 'absolute', top: 8, right: 8, color: theme.accentColor, bgcolor: '#fff', borderRadius: '50%', fontSize: 20 }} />
                    )}
                  </Box>
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Typography variant="body1" fontWeight="800" mb={0.5} sx={{ fontSize: '0.95rem' }}>{theme.name}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.4, display: 'block' }}>{theme.description}</Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          
          <FormSection title="Cover Page" icon={<PaletteOutlined color="primary" />}>
            <StyledLabel text="Cover Image" />
            
            {config.coverImage ? (
              <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', height: 180, border: '1px solid #e2e8f0', mb: 2 }}>
                <img src={config.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton 
                  onClick={removeImage} 
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fee2e2', color: '#ef4444' } }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                {/* 🚨 THE FIX: Hidden Input triggered by the Ref */}
                <input 
                  accept="image/png, image/jpeg, image/jpg" 
                  style={{ display: 'none' }} 
                  ref={fileInputRef} 
                  type="file" 
                  onChange={handleImageUpload} 
                />
                <Box 
                  onClick={handleBoxClick} // 🚨 THE FIX: Direct click handler
                  sx={{ 
                    border: '1.5px dashed #cbd5e1', borderRadius: 2, p: 2, textAlign: 'center', mb: 2, bgcolor: '#f8fafc',
                    cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9', borderColor: '#3b82f6' }
                  }}
                >
                  <CloudUploadOutlined sx={{ fontSize: 28, color: '#94a3b8', mb: 0.5 }} />
                  <Typography variant="caption" fontWeight="700" color="#475569" display="block">Click to upload or drag and drop</Typography>
                </Box>
              </>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Primary Color" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input 
                    type="color" value={config.primaryColor} onChange={(e) => handleCustomChange('primaryColor', e.target.value)}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <TextField 
                    fullWidth size="small" placeholder="#3b82f6"
                    value={config.primaryColor}
                    onChange={(e) => handleCustomChange('primaryColor', e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Secondary Color" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <input 
                    type="color" value={config.secondaryColor} onChange={(e) => handleCustomChange('secondaryColor', e.target.value)}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  />
                  <TextField 
                    fullWidth size="small" placeholder="#06b6d4"
                    value={config.secondaryColor}
                    onChange={(e) => handleCustomChange('secondaryColor', e.target.value)}
                  />
                </Box>
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Contact Information" icon={<ContactPhoneOutlined color="primary" />}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Primary Contact" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Select size="small" defaultValue="+91" sx={{ width: 90 }}>
                    <MenuItem value="+91">+91</MenuItem>
                    <MenuItem value="+1">+1</MenuItem>
                    <MenuItem value="+44">+44</MenuItem>
                  </Select>
                  <TextField 
                    fullWidth size="small" placeholder="9876543210" 
                    value={config.primaryContact} onChange={(e) => handleCustomChange('primaryContact', e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Secondary Contact" />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Select size="small" defaultValue="+91" sx={{ width: 90 }}>
                    <MenuItem value="+91">+91</MenuItem>
                    <MenuItem value="+1">+1</MenuItem>
                  </Select>
                  <TextField 
                    fullWidth size="small" placeholder="9876543210" 
                    value={config.secondaryContact} onChange={(e) => handleCustomChange('secondaryContact', e.target.value)}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Support Email" />
                <TextField 
                  fullWidth size="small" placeholder="support@travelhub.com" 
                  value={config.supportEmail} onChange={(e) => handleCustomChange('supportEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledLabel text="Website" />
                <TextField 
                  fullWidth size="small" placeholder="www.travelhub.com" 
                  value={config.website} onChange={(e) => handleCustomChange('website', e.target.value)}
                />
              </Grid>
            </Grid>
          </FormSection>

          <FormSection title="Branding & Style" icon={<StyleOutlined color="primary" />}>
            <Box sx={{ mb: 2 }}>
              <StyledLabel text="Font Style" />
              <Select 
                fullWidth size="small" 
                value={config.fontStyle || 'Inter'} 
                onChange={(e) => handleCustomChange('fontStyle', e.target.value)}
              >
                <MenuItem value="Inter">Inter (Modern)</MenuItem>
                <MenuItem value="Playfair Display">Playfair Display (Luxury)</MenuItem>
                <MenuItem value="Poppins">Poppins (Clean)</MenuItem>
              </Select>
            </Box>
            <Box>
              <StyledLabel text="Footer Text" />
              <TextField 
                fullWidth multiline rows={2} 
                placeholder="Add custom footer text..." 
                variant="outlined" size="small"
                value={config.footerText} onChange={(e) => handleCustomChange('footerText', e.target.value)}
              />
            </Box>
          </FormSection>

        </Box>
      )}
    </Box>
  );
}