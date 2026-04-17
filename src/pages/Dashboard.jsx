import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import {
  PeopleOutline,
  AccessTime,
  CheckCircleOutline,
  TrendingUp,
  CallMade,
  NotificationsNone,
} from "@mui/icons-material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// 🚨 IMPORT THE GLOBAL LEAD MEMORY
import { useLeads } from "../context/LeadContext";

// --- STATIC DATA FOR CHARTS (Since we don't have revenue context yet) ---
const revenueData = [
  { name: "Jan", value: 80 },
  { name: "Feb", value: 42 },
  { name: "Mar", value: 65 },
  { name: "Apr", value: 25 },
  { name: "May", value: 85 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 75 },
  { name: "Aug", value: 15 },
  { name: "Sep", value: 20 },
  { name: "Oct", value: 80 },
  { name: "Nov", value: 75 },
  { name: "Dec", value: 50 },
];

const destinationData = [
  { name: "Maldives", value: 20, color: "#ffb74d" },
  { name: "Dubai", value: 30, color: "#5c6bc0" },
  { name: "Thailand", value: 30, color: "#ef5350" },
  { name: "Europe", value: 20, color: "#26c6da" },
];

const activityData = [
  {
    title: "Bali Adventure Package",
    sub: "Sarah Johnson",
    time: "5 min ago",
    bg: "#f3e5f5",
  },
  {
    title: "Hotel Confirmation - Maldives",
    sub: "Mike Chen",
    time: "1 hour ago",
  },
  { title: "New Lead - Europe Tour", sub: "Emma Wilson", time: "2 hours ago" },
  {
    title: "Voucher Generated - Dubai",
    sub: "Alex Kumar",
    time: "3 hours ago",
  },
];

export default function Dashboard() {
  // 🚨 CONNECT TO THE GLOBAL LEADS
  const { leads } = useLeads();

  
  // 🚨 DYNAMIC MATH FOR KPI CARDS
  const totalLeads = leads.length;
  // Let's consider anything not "New" and not "Confirmed" as an active itinerary
  const activeItineraries = leads.filter(
    (l) => l.status === "Contacted" || l.status === "Qualified",
  ).length;
  const confirmedBookings = leads.filter(
    (l) => l.status === "Confirmed",
  ).length;

  // 🚨 DYNAMIC DATA FOR LEADS TABLE (Get the 5 most recent)
  const recentLeadsTable = [...leads].reverse().slice(0, 5);

  const kpiData = [
    {
      title: "New Leads",
      val: totalLeads.toString(),
      desc: "Total inquiries",
      icon: <PeopleOutline />,
      color: "#29b6f6",
    },
    {
      title: "Active Itineraries",
      val: activeItineraries.toString(),
      desc: "Trips in motion",
      icon: <AccessTime />,
      color: "#ff8a65",
    },
    {
      title: "Confirmed Bookings",
      val: confirmedBookings.toString(),
      desc: "Plans locked in",
      icon: <CheckCircleOutline />,
      color: "#66bb6a",
    },
    {
      title: "Total Revenue",
      val: "$29k",
      desc: "Value generated",
      icon: <TrendingUp />,
      color: "#ab47bc",
    }, // Hardcoded until you build a revenue context
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back! Here's an overview of your travel agency operations.
          </Typography>
        </Box>
        <IconButton sx={{ bgcolor: "#fff", border: "1px solid #e0e0e0" }}>
          <NotificationsNone />
        </IconButton>
      </Box>

      <Grid container spacing={2.5}>
        {/* --- KPI CARDS --- */}
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                borderTop: `4px solid ${kpi.color}`,
                position: "relative",
                bgcolor: "#fff",
              }}
            >
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  border: "1px solid #e0e0e0",
                }}
              >
                <CallMade fontSize="small" sx={{ color: "#888" }} />
              </IconButton>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    bgcolor: `${kpi.color}15`,
                    color: kpi.color,
                    p: 1,
                    borderRadius: 2,
                    display: "flex",
                  }}
                >
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {kpi.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {kpi.desc}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {kpi.val}
                </Typography>
                <Box sx={{ textAlign: "right", flexGrow: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "#4caf50", fontWeight: 700, display: "block" }}
                  >
                    +11%
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#999", fontSize: "0.65rem" }}
                  >
                    vs Last Week
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* --- CHARTS ROW --- */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Revenue Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Monthly revenue and profit trends
            </Typography>

            <Box sx={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ab47bc" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ab47bc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eee"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888" }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ab47bc"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#ab47bc" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Popular Destination
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Trending destinations this season
            </Typography>

            <Box sx={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={destinationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    stroke="none"
                  >
                    {destinationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* --- BOTTOM ROW --- */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Recent Leads
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#666",
                        borderBottom: "2px solid #eee",
                      }}
                    >
                      Customer
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#666",
                        borderBottom: "2px solid #eee",
                      }}
                    >
                      Destination
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#666",
                        borderBottom: "2px solid #eee",
                      }}
                    >
                      Travel Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#666",
                        borderBottom: "2px solid #eee",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLeadsTable.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ py: 3, color: "#999" }}
                      >
                        No leads created yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentLeadsTable.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ py: 1.5 }}>{row.name}</TableCell>
                        <TableCell sx={{ py: 1.5, color: "#666" }}>
                          {row.location}
                        </TableCell>
                        <TableCell sx={{ py: 1.5, color: "#666" }}>
                          {row.dates}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={row.status}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.7rem",
                              bgcolor:
                                row.status === "New"
                                  ? "#e3f2fd"
                                  : row.status === "Confirmed"
                                    ? "#e8f5e9"
                                    : "#fff8e1",
                              color:
                                row.status === "New"
                                  ? "#1976d2"
                                  : row.status === "Confirmed"
                                    ? "#2e7d32"
                                    : "#f57f17",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              bgcolor: "#fff",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Latest updates and events
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {activityData.map((act, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    gap: 2,
                    p: act.bg ? 1.5 : 0.5,
                    bgcolor: act.bg || "transparent",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#ab47bc",
                        boxShadow: "0 0 0 4px #ab47bc20",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {act.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {act.sub}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#999",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <AccessTime sx={{ fontSize: 12 }} /> {act.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
