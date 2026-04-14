import React from "react";
import { Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome to Triumph Holidays Dashboard ✈️
      </Typography>
      <Typography>
        Manage your travel packages and grow your travel business.
      </Typography>
    </Paper>
  );
}
