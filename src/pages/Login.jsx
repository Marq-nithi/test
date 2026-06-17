import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  InputAdornment,
  Paper,
  Grid,
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CloudUpload,
  HeadsetMicOutlined,
  ChatBubbleOutline,
  EmailOutlined,
  PhoneOutlined,
  MenuBookOutlined,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

// 🚨 1. IMPORT YOUR LOCAL IMAGE HERE 
import logoImage from "../23 (1).webp";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const { api, login, setUser } = useApi();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State for the Contact Support Popover
  const [supportAnchorEl, setSupportAnchorEl] = useState(null);

  // 🚨 1. FORM DATA STATE
  const [formData, setFormData] = useState({
    fullName: "",
    agencyName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
    logo: null,
  });

  // 🚨 2. ERROR TRACKING STATE
  const [errors, setErrors] = useState({});

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrors({}); // Clear errors when switching modes
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, logo: file });
  };

  const handleSupportClick = (event) => {
    setSupportAnchorEl(event.currentTarget);
  };

  const handleSupportClose = () => {
    setSupportAnchorEl(null);
  };

  const supportOpen = Boolean(supportAnchorEl);

  // 🚨 3. VALIDATION ENGINE
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email format is invalid";
      isValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    if (isSignUp) {
      if (!formData.fullName) {
        tempErrors.fullName = "Name is required";
        isValid = false;
      }
      if (!formData.agencyName) {
        tempErrors.agencyName = "Agency name is required";
        isValid = false;
      }
      if (!formData.phone) {
        tempErrors.phone = "Phone number is required";
        isValid = false;
      }
      if (!formData.location) {
        tempErrors.location = "Location is required";
        isValid = false;
      }

      if (formData.password.length < 6) {
        tempErrors.password = "Password must be at least 6 characters";
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (isSignUp) {
        api.auth
          .signUpEmailPassword(
            formData.fullName.replace(/[^\p{L}\p{M}\p{S}\p{N}\p{P}]+/gu, ""),
            formData.email,
            formData.password,
            {
              "custom:agency_logo_url": "",
              "custom:agency_name": formData.agencyName,
              "custom:full_name": formData.fullName,
              "custom:location": formData.location,
              "custom:mobile": formData.phone,
            },
          )
          .then((data) => {
            const otp = prompt(`Enter the OTP send to : ${formData.email}`);
            api.auth
              .confirmUserSingUp(
                formData.fullName.replace(/[^\p{L}\p{M}\p{S}\p{N}\p{P}]+/gu, ""),
                otp,
              )
              .then(() => {
                alert("Sign up successful!");
              });
          });
      } else {
        api.auth
          .loginByEmailPassword(formData.email, formData.password)
          .then(async (data) => {
            if (data.singIn) {
              login(data.idToken);
              const userDetails = {};
              setUser(userDetails);
              onLogin();
              navigate("/dashboard");
            } else {
              const newPassword = await prompt("Enter Your New Password");
              api.auth.confirmNewPassword(newPassword).then(() => {
                api.auth.handleLogout().then(() => {
                  alert("User has confirmed successful login with new password");
                });
              });
            }
          })
          .catch(() => {
            alert("Invalid Login");
          });
      }
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F1F5F9", p: { xs: 2, md: 3 } }}>
      
      {/* 🚨 LEFT SIDE IMAGE 🚨 */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundImage: "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 4,
          overflow: "hidden",
          p: 6,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2  }}>
          <Box sx={{ width: 120, height: 40, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="900" color="#fff" letterSpacing={1}>
              LOGO
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 480, mb: 4 }}>
          <Typography variant="h3" fontWeight="800" color="#fff" mb={2} lineHeight={1.2}>
            Build Your Perfect Trip in Minutes
          </Typography>
          <Typography variant="body1" color="rgba(255,255,255,0.85)" lineHeight={1.6} mb={2}>
            Handpicked destinations, seamless planning, and expert-crafted
            itineraries—everything you need for a stress-free journey.
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.7)">
            Go further. Experience more.
          </Typography>
        </Box>
      </Box>

      {/* 🚨 RIGHT SIDE FORM 🚨 */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          px: { xs: 2, sm: 6, md: 10 },
          maxWidth: { xs: "100%", md: "600px" },
          mx: "auto",
         }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5 },
            width: "100%",
            borderRadius: 5,
            border: "3px solid #f1f5f9",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
            mb: 3
          }}
        >
          <Box mb={4} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" fontWeight="800" color="#0f172a" mb={1}>
                Welcome to <span style={{ color: "#3b82f6" }}>CRM</span>
              </Typography>
              <Typography variant="body2" color="#64748b">
                {isSignUp
                  ? "Register your agency to start building itineraries."
                  : "Welcome back! Let's continue your journey."}
              </Typography>
            </Box>
            {!isSignUp && (
              <Avatar src={logoImage} sx={{ width: 48, height: 48, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            )}
          </Box>

          <form onSubmit={handleAuth} noValidate>
            {isSignUp ? (
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Agency Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter agency name"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    error={!!errors.agencyName}
                    helperText={errors.agencyName}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Location
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="City / Country"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    error={!!errors.location}
                    helperText={errors.location}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Agency Logo
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUpload />}
                    sx={{
                      height: "40px",
                      borderColor: "#cbd5e1",
                      color: formData.logo ? "#0f172a" : "#94a3b8",
                      justifyContent: "flex-start",
                      px: 2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 400,
                    }}
                  >
                    {formData.logo ? formData.logo.name : "Upload image"}
                    <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="**********"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end" size="small">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="**********"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            ) : (
              <Box display="flex" flexDirection="column" gap={2.5}>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#0f172a" mb={1} display="block">
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="**********"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end" size="small">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
            )}

            <Box display="flex" justifyContent="flex-end" mt={1.5} mb={4}>
              {!isSignUp && (
                <Link
                  href="#"
                  variant="body2"
                  sx={{
                    color: "#3b82f6",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                   
                </Link>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disableElevation
              sx={{
                color: "white",
                py: 1.5,
                bgcolor: "#3f51b5",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#303f9f" },
              }}
            >
              {isSignUp ? "Register Agency" : "Sign in"}
            </Button>
            
            {/* <Box sx={{ mt: 3, textAlign: "center", position: 'relative' }}>
              <Divider sx={{ mb: 3 }}>
                <Typography variant="caption" color="#94a3b8" sx={{ px: 1 }}>or</Typography>
              </Divider>
              <Typography variant="body2" color="#0f172a" fontWeight="600">
                {isSignUp ? "Already a user? " : "New User? "}
                <Link
                  component="button"
                  type="button"
                  onClick={handleToggleForm}
                  sx={{
                    color: "#3b82f6",
                    fontWeight: 700,
                    textDecoration: "none",
                    verticalAlign: "baseline",
                    "&:hover": { textDecoration: "underline" }
                  }}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Link>
              </Typography>
            </Box> */}
          </form>
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%', position: 'relative' }}>
          
          {/* 🚨 EXACT UI: Contact Support Box 🚨 */}
          <Paper 
            elevation={0} 
            sx={{ 
              width: "100%", 
              p: 2.5, 
              borderRadius: 3, 
              bgcolor: "#f8fafc", 
              border: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box sx={{ bgcolor: "#fff", p: 1, borderRadius: '50%', display: 'flex', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-7 7c0 2.2 1.4 4.3 3 5.4a4 4 0 0 1 2 2.6" />
                  <path d="M19 9a7 7 0 0 0-7-7" />
                </svg>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight="700" color="#0f172a" mb={0.2}>
                  Facing issues signing in?
                </Typography>
                <Typography variant="caption" color="#64748b" display="block">
                  Contact our support team and we'll get back to you.
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              onClick={handleSupportClick}
              endIcon={<ArrowForwardIos sx={{ fontSize: '12px !important' }}/>}
              sx={{ 
                borderRadius: 2, 
                textTransform: "none", 
                fontWeight: 600,
                color: "#3b82f6",
                borderColor: "#bfdbfe",
                bgcolor: "#fff",
                whiteSpace: "nowrap",
                px: 2,
                "&:hover": { bgcolor: "#f0f9ff", borderColor: "#93c5fd" }
              }}
            >
              Contact Support
            </Button>
          </Paper>

          {/* 🚨 EXACT UI: The Floating Support Popover Menu 🚨 */}
          <Popover
            open={supportOpen}
            anchorEl={supportAnchorEl}
            onClose={handleSupportClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: -2,
                width: 320,
                borderRadius: 4,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                overflow: 'hidden'
              }
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}>
                <HeadsetMicOutlined />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="800" color="#0f172a">Need Help?</Typography>
                <Typography variant="body2" color="#64748b">We're here to help you.</Typography>
              </Box>
            </Box>
            <List sx={{ p: 1 }}>
              <ListItem button sx={{ borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: '#f8fafc' } }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 36, height: 36 }}>
                    <ChatBubbleOutline fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="body2" fontWeight="700" color="#0f172a">Chat with Support</Typography>} 
                  secondary={<Typography variant="caption" color="#94a3b8">Chat live with our team</Typography>} 
                />
                <ArrowForwardIos sx={{ fontSize: 14, color: '#cbd5e1' }} />
              </ListItem>
              
              <ListItem button sx={{ borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: '#f8fafc' } }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981', width: 36, height: 36 }}>
                    <EmailOutlined fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="body2" fontWeight="700" color="#0f172a">Email Support</Typography>} 
                  secondary={<Typography variant="caption" color="#94a3b8">support@crm.com</Typography>} 
                />
                <ArrowForwardIos sx={{ fontSize: 14, color: '#cbd5e1' }} />
              </ListItem>

              <ListItem button sx={{ borderRadius: 2, mb: 0.5, '&:hover': { bgcolor: '#f8fafc' } }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#faf5ff', color: '#a855f7', width: 36, height: 36 }}>
                    <PhoneOutlined fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="body2" fontWeight="700" color="#0f172a">Call Us</Typography>} 
                  secondary={<Typography variant="caption" color="#94a3b8">+91 98765 43210</Typography>} 
                />
                <ArrowForwardIos sx={{ fontSize: 14, color: '#cbd5e1' }} />
              </ListItem>

              <ListItem button sx={{ borderRadius: 2, '&:hover': { bgcolor: '#f8fafc' } }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#fffbeb', color: '#f59e0b', width: 36, height: 36 }}>
                    <MenuBookOutlined fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography variant="body2" fontWeight="700" color="#0f172a">Help Center</Typography>} 
                  secondary={<Typography variant="caption" color="#94a3b8">Browse articles & guides</Typography>} 
                />
                <ArrowForwardIos sx={{ fontSize: 14, color: '#cbd5e1' }} />
              </ListItem>
            </List>
          </Popover>

        </Box>
      </Box>
    </Box>
  );
}