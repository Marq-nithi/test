import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Checkbox, FormControlLabel, 
  Link, IconButton, InputAdornment, Paper, Divider 
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook, TravelExplore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// 🚨 Notice the onLogin prop! This is what tells the App to unlock the Dashboard.
export default function Login({ onLogin }) {
  const navigate = useNavigate();
  
  // State to toggle between Login and Sign Up views
  const [isSignUp, setIsSignUp] = useState(false);
  
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleForm = () => setIsSignUp(!isSignUp);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // Simulated login action
  const handleAuth = (e) => {
    e.preventDefault();
    
    // 🚨 1. Flip the security switch in App.jsx to TRUE (Logged In)
    if (onLogin) onLogin(); 
    
    // 🚨 2. Teleport the user inside the app!
    navigate('/dashboard'); 
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#121212' }}>
      
      {/* LEFT SIDE: Image Panel (Hides on mobile) */}
      <Box 
        sx={{ 
          flex: 1, 
          display: { xs: 'none', md: 'flex' }, 
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          p: 6,
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TravelExplore sx={{ color: '#fff', fontSize: 32 }} />
          <Typography variant="h5" fontWeight="900" color="#fff" letterSpacing={2}>
            ATLAS
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 480, mb: 10 }}>
          <Typography variant="h3" fontWeight="900" color="#fff" mb={2} lineHeight={1.2}>
            Build Your Perfect Trip in Minutes
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.8)" lineHeight={1.8}>
            Handpicked destinations, seamless planning, and expert-crafted itineraries—everything you need for a stress-free journey.
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE: Form Panel */}
      <Box 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#f8fafc',
          p: { xs: 3, sm: 6 }
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, sm: 6 }, 
            width: '100%', 
            maxWidth: 480, 
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
          }}
        >
          <Box mb={4}>
            <Typography variant="h4" fontWeight="900" color="#0f172a" mb={1}>
              Welcome to <span style={{ color: '#4f46e5' }}>ATLAS</span>
            </Typography>
            <Typography variant="body2" color="#64748b">
              {isSignUp ? "Let's get you set up to start your journey." : "Welcome back! Let's continue your journey."}
            </Typography>
          </Box>

          <form onSubmit={handleAuth}>
            <Box display="flex" flexDirection="column" gap={2.5}>
              
              {/* Only show Full Name if it's the Sign Up form */}
              {isSignUp && (
                <TextField fullWidth label="Full Name" placeholder="Enter your name" variant="outlined" required />
              )}

              <TextField fullWidth label="Email" placeholder="Enter your email" variant="outlined" type="email" required />

              <TextField 
                fullWidth 
                label="Password" 
                placeholder="••••••••" 
                variant="outlined" 
                type={showPassword ? 'text' : 'password'}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              {/* Only show Confirm Password if it's the Sign Up form */}
              {isSignUp && (
                <TextField fullWidth label="Confirm Password" placeholder="••••••••" variant="outlined" type={showPassword ? 'text' : 'password'} required />
              )}

              {/* Options row (Remember Me / Forgot Password vs Terms & Conditions) */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={-1}>
                {isSignUp ? (
                  <FormControlLabel 
                    control={<Checkbox required sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#4f46e5' } }} />} 
                    label={<Typography variant="caption" color="#475569">I accept the Terms and conditions</Typography>} 
                  />
                ) : (
                  <>
                    <FormControlLabel 
                      control={<Checkbox sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#4f46e5' } }} />} 
                      label={<Typography variant="caption" color="#475569">Remember me</Typography>} 
                    />
                    <Link href="#" variant="caption" sx={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                      Forgot Password?
                    </Link>
                  </>
                )}
              </Box>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ py: 1.5, mt: 1, bgcolor: '#4f46e5', fontSize: '1rem', '&:hover': { bgcolor: '#4338ca' } }}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
              
              {/* Social Login (Only on Sign In state) */}
              {!isSignUp && (
                <>
                  <Divider sx={{ my: 2, '&::before, &::after': { borderColor: '#e2e8f0' } }}>
                    <Typography variant="caption" color="#94a3b8">Or Sign in with</Typography>
                  </Divider>
                  <Box display="flex" gap={2}>
                    <Button fullWidth variant="outlined" startIcon={<Facebook sx={{ color: '#1877F2' }}/>} sx={{ py: 1, borderColor: '#e2e8f0', color: '#475569', fontWeight: 600 }}>Facebook</Button>
                    <Button fullWidth variant="outlined" startIcon={<Google sx={{ color: '#DB4437' }}/>} sx={{ py: 1, borderColor: '#e2e8f0', color: '#475569', fontWeight: 600 }}>Google</Button>
                  </Box>
                </>
              )}

              {/* Toggle Form Link */}
              <Typography variant="caption" textAlign="center" mt={3} color="#64748b">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <Link component="button" type="button" onClick={handleToggleForm} sx={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none', verticalAlign: 'baseline' }}>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Link>
              </Typography>

            </Box>
          </form>
        </Paper>
      </Box>

    </Box>
  );
}