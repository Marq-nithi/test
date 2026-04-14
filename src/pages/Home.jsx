import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import FlightIcon from "@mui/icons-material/Flight";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";

export default function Dashboard() {

  // Dummy Data (Later connect with real state)
  const totalQueries = 42;
  const totalItineraries = 28;
  const totalRevenue = 850000;
  const growth = 22;

  const recentQueries = [
    { id: 1, name: "Arun", destination: "Dubai", date: "12-02-2026" },
    { id: 2, name: "Priya", destination: "Singapore", date: "14-02-2026" },
    { id: 3, name: "Rahul", destination: "Thailand", date: "15-02-2026" }
  ];

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>

      {/* Header Section */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(90deg,#b71c1c,#e53935)",
          color: "white"
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Triumph Holidays Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Monitor performance, manage queries & grow revenue
        </Typography>
      </Paper>

      {/* KPI CARDS */}
      <Grid container spacing={3}>

        {[
          {
            title: "Total Queries",
            value: totalQueries,
            icon: <PeopleIcon />,
          },
          {
            title: "Itineraries Created",
            value: totalItineraries,
            icon: <FlightIcon />,
          },
          {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: <CurrencyRupeeIcon />,
          },
          {
            title: "Monthly Growth",
            value: `${growth}%`,
            icon: <TrendingUpIcon />,
          }
        ].map((item, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card sx={cardStyle}>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      {item.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" mt={1}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Avatar sx={avatarStyle}>{item.icon}</Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

      </Grid>

      {/* SECOND ROW */}
      <Grid container spacing={3} mt={1}>

        {/* Revenue Progress */}
        <Grid item xs={12} md={6}>
          <Paper sx={sectionStyle}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Monthly Revenue Target
            </Typography>
            <Typography variant="body2" mb={1}>
              ₹6,00,000 Target
            </Typography>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography mt={1} fontWeight="bold">
              75% Achieved
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={sectionStyle}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Quick Actions
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ backgroundColor: "#b71c1c" }}
              >
                Create Itinerary
              </Button>

              <Button variant="outlined" color="primary">
                Add Query
              </Button>

              <Button variant="outlined" color="primary">
                View Reports
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* RECENT QUERIES TABLE */}
      <Grid container spacing={3} mt={1}>
        <Grid item xs={12}>
          <Paper sx={sectionStyle}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Queries
            </Typography>









             <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>ID</b></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Destination</b></TableCell>
                    <TableCell><b>Date</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentQueries.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.destination}</TableCell>
                      <TableCell>{row.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
}

/* --- STYLES --- */

const cardStyle = {
  borderRadius: 3,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-5px)"
  }
};

const avatarStyle = {
  bgcolor: "#b71c1c",
  width: 56,
  height: 56
};

const sectionStyle = {
  p: 3,
  borderRadius: 3,
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};