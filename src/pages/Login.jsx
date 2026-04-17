import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  InputAdornment,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  TravelExplore,
  CloudUpload,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const { api, login, setUser } = useApi();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    // Clear the specific error when the user starts typing again
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, logo: file });
  };

  // 🚨 3. VALIDATION ENGINE
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Email validation (Basic Regex)
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

    // Extra validation just for Sign Up
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
                formData.fullName.replace(
                  /[^\p{L}\p{M}\p{S}\p{N}\p{P}]+/gu,
                  "",
                ),
                otp,
              )
              .then(() => {
                alert("logup up done");
              });
          });
      } else {
        api.auth
          .loginByEmailPassword(formData.email, formData.password)
          .then(async (data) => {
            // api context provider login
            login(data.idToken);

            // application login flag
            const userDetails = await api.auth.loadUserDetails();
            setUser(userDetails);
            onLogin();
            navigate("/dashboard");
          });
      }
    }
  };

  const handleGoogleLogin = async () => {
    await api.auth.handleGoogleLogin();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212" }}>
      {/* LEFT SIDE: Image Panel */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          p: 6,
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TravelExplore sx={{ color: "#fff", fontSize: 32 }} />
          <Typography
            variant="h5"
            fontWeight="900"
            color="#fff"
            letterSpacing={2}
          >
            ATLAS
          </Typography>
        </Box>

        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 480, mb: 10 }}>
          <Typography
            variant="h3"
            fontWeight="900"
            color="#fff"
            mb={2}
            lineHeight={1.2}
          >
            Build Your Perfect Trip in Minutes
          </Typography>
          <Typography
            variant="body1"
            color="rgba(255,255,255,0.8)"
            lineHeight={1.8}
          >
            Handpicked destinations, seamless planning, and expert-crafted
            itineraries—everything you need for a stress-free journey.
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE: Form Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f8fafc",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            width: "100%",
            maxWidth: isSignUp ? 600 : 480, // Make panel slightly wider for Sign Up grid
            borderRadius: 4,
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
          }}
        >
          <Box mb={4}>
            <Typography variant="h4" fontWeight="900" color="#0f172a" mb={1}>
              Welcome to <span style={{ color: "#4f46e5" }}>ATLAS</span>
            </Typography>
            <Typography variant="body2" color="#64748b">
              {isSignUp
                ? "Register your agency to start building itineraries."
                : "Welcome back! Let's continue your journey."}
            </Typography>
          </Box>

          <form onSubmit={handleAuth} noValidate>
            {/* 🚨 DYNAMIC LAYOUT: Grid for Sign Up, Column for Login */}
            {isSignUp ? (
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Agency Name"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    error={!!errors.agencyName}
                    helperText={errors.agencyName}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Location (City/Country)"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    error={!!errors.location}
                    helperText={errors.location}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    startIcon={<CloudUpload />}
                    sx={{
                      height: "56px",
                      borderColor: "#c4c4c4",
                      color: formData.logo ? "#0f172a" : "#64748b",
                      justifyContent: "flex-start",
                      px: 2,
                    }}
                  >
                    {formData.logo ? formData.logo.name : "Upload Agency Logo"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    required
                  />
                </Grid>
              </Grid>
            ) : (
              // Standard Login Layout
              <Box display="flex" flexDirection="column" gap={2.5}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {/* Options row */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
              mb={1}
            >
              {isSignUp ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      required
                      sx={{
                        color: "#cbd5e1",
                        "&.Mui-checked": { color: "#4f46e5" },
                      }}
                    />
                  }
                  label={
                    <Typography variant="caption" color="#475569">
                      I accept the Terms and conditions
                    </Typography>
                  }
                />
              ) : (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "#cbd5e1",
                          "&.Mui-checked": { color: "#4f46e5" },
                        }}
                      />
                    }
                    label={
                      <Typography variant="caption" color="#475569">
                        Remember me
                      </Typography>
                    }
                  />
                  <Link
                    href="#"
                    variant="caption"
                    sx={{
                      color: "#4f46e5",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
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
              sx={{
                py: 1.5,
                mt: 1,
                bgcolor: "#4f46e5",
                fontSize: "1rem",
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              {isSignUp ? "Register Agency" : "Sign In"}
            </Button>

            {/* Social Login */}
            {!isSignUp && (
              <>
                <Divider
                  sx={{
                    my: 2,
                    "&::before, &::after": { borderColor: "#e2e8f0" },
                  }}
                >
                  <Typography variant="caption" color="#94a3b8">
                    Or Sign in with
                  </Typography>
                </Divider>
                <Box display="flex" gap={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      handleGoogleLogin();
                    }}
                    startIcon={<Google sx={{ color: "#DB4437" }} />}
                    sx={{
                      py: 1,
                      borderColor: "#e2e8f0",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    Google
                  </Button>
                </Box>
              </>
            )}

            {/* Toggle Form Link */}
            <Typography
              variant="caption"
              textAlign="center"
              mt={3}
              display="block"
              color="#64748b"
            >
              {isSignUp ? "Already registered? " : "New to Atlas? "}
              <Link
                component="button"
                type="button"
                onClick={handleToggleForm}
                sx={{
                  color: "#4f46e5",
                  fontWeight: 700,
                  textDecoration: "none",
                  verticalAlign: "baseline",
                }}
              >
                {isSignUp ? "Sign In" : "Create an Account"}
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
