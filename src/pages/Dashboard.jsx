import React from "react";
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

import { useLeads } from "../context/LeadContext";

// --- STATIC DATA FOR CHARTS ---
const revenueData = [
  { name: "Jan", value: 80 }, { name: "Feb", value: 42 }, { name: "Mar", value: 65 },
  { name: "Apr", value: 25 }, { name: "May", value: 85 }, { name: "Jun", value: 22 },
  { name: "Jul", value: 75 }, { name: "Aug", value: 15 }, { name: "Sep", value: 22 },
  { name: "Oct", value: 80 }, { name: "Nov", value: 75 }, { name: "Dec", value: 50 },
];

const destinationData = [
  { name: "Europe", value: 20, color: "#06b6d4" },
  { name: "Maldives", value: 20, color: "#f97316" },
  { name: "Dubai", value: 30, color: "#3b82f6" },
  { name: "Thailand", value: 30, color: "#f43f5e" },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="600">
      <tspan x={x} dy="-0.4em">{name}</tspan>
      <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
    </text>
  );
};

const activityData = [
  { title: "Bali Adventure Package", sub: "Sarah Johnson", time: "5 min ago" },
  { title: "Hotel Confirmation - Maldives", sub: "Mike Chen", time: "1 hour ago" },
  { title: "New Lead - Europe Tour", sub: "Emma Wilson", time: "2 hours ago" },
  { title: "Voucher Generated - Dubai", sub: "Alex Kumar", time: "3 hours ago" },
];

export default function Dashboard() {
  const { leads } = useLeads();

  const totalLeads = leads?.length > 0 ? leads.length : 43; 
  const activeItineraries = leads?.filter((l) => l.status === "Contacted" || l.status === "Qualified").length || 12;
  const confirmedBookings = leads?.filter((l) => l.status === "Confirmed").length || 76;

  const mockLeads = [
    { id: 1, name: "Emma Wilson", location: "Bali, Indonesia", budget: "$5,500", dates: "Jun 20-30", status: "New" },
    { id: 2, name: "James Chen", location: "Paris, France", budget: "$8,200", dates: "Jul 15-25", status: "New" },
    { id: 3, name: "Sofia Rodriguez", location: "Dubai, UAE", budget: "$6,800", dates: "Aug 5-12", status: "New" },
    { id: 4, name: "Michael Brown", location: "Tokyo, Japan", budget: "$7,500", dates: "Sep 1-10", status: "Pending" },
  ];
  const recentLeadsTable = leads?.length > 0 ? [...leads].reverse().slice(0, 4) : mockLeads;

  const kpiData = [
    { title: "New Leads", val: totalLeads.toString(), desc: "New journeys begin", icon: <PeopleOutline fontSize="small" />, color: "#0ea5e9", bg: "#e0f2fe" },
    { title: "Active Itineraries", val: activeItineraries.toString(), desc: "Trips in motion", icon: <AccessTime fontSize="small" />, color: "#f97316", bg: "#ffedd5" },
    { title: "Confirmed Bookings", val: confirmedBookings.toString(), desc: "Plans locked in", icon: <CheckCircleOutline fontSize="small" />, color: "#10b981", bg: "#dcfce7" },
    { title: "Total Revenue", val: "$29k", desc: "Value generated", icon: <TrendingUp fontSize="small" />, color: "#a855f7", bg: "#f3e8ff" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f8fafc", minHeight: "100vh", flexGrow: 1 }}>
      
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
          Welcome back! Here's an overview of your travel agency operations.
        </Typography>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={2} mb={3}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1px solid #e2e8f0",
                borderLeft: `5px solid ${kpi.color}`,
                position: "relative",
                bgcolor: "#fff",
                height: "100%", 
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)"
              }}
            >
              <IconButton size="small" sx={{ position: "absolute", top: 12, right: 12, border: "1px solid #e2e8f0", borderRadius: '6px', width: 26, height: 26 }}>
                <CallMade sx={{ fontSize: 14, color: "#94a3b8" }} />
              </IconButton>
              
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ bgcolor: kpi.bg, color: kpi.color, p: 0.8, borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
                    {kpi.title}
                  </Typography>
                  <Typography variant="caption" color="#64748b">
                    {kpi.desc}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 0.9 }}>
                  {kpi.val}
                </Typography>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700, display: "block", lineHeight: 1 }}>
                    +11%
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.65rem" }}>
                    vs Last Week
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS ROW */}
      <Grid container spacing={2} mb={3}>
        
        {/* Area Chart */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e2e8f0", bgcolor: "#fff", height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Revenue Overview
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
              Monthly revenue and profit trends
            </Typography>

            <Box sx={{ flexGrow: 1, minHeight: 280, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#8b5cf6" }}
                    dot={{ r: 3, strokeWidth: 2, fill: "#fff", stroke: "#8b5cf6" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e2e8f0", bgcolor: "#fff", height: "100%", width: "180%", display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Popular Destination
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mb: 1 }}>
              Trending destinations this season
            </Typography>

            <Box sx={{ flexGrow: 1, minHeight: 280, width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={destinationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    stroke="none"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {destinationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                  <Legend 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: "11px", color: "#475569", fontWeight: 500, paddingTop: "20px", whiteSpace: "nowrap" }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* BOTTOM ROW */}
      <Grid container spacing={2}>
        
        {/* Recent Leads Table */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e2e8f0", bgcolor: "#fff", height: "100%", display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>
              Recent Leads
            </Typography>
            <TableContainer sx={{ flexGrow: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1.5, px: 1 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1.5, px: 1 }}>Destination</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1.5, px: 1 }}>Budget</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1.5, px: 1 }}>Travel Date</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569", borderBottom: "1px solid #e2e8f0", py: 1.5, px: 1 }} align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLeadsTable.map((row, i) => (
                    <TableRow key={row.id || i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={{ py: 2, px: 1, color: "#334155", fontWeight: 500 }}>{row.name}</TableCell>
                      <TableCell sx={{ py: 2, px: 1, color: "#475569" }}>{row.location || row.dist_location || "TBD"}</TableCell>
                      <TableCell sx={{ py: 2, px: 1, color: "#475569" }}>{row.budget || "$5,000"}</TableCell>
                      <TableCell sx={{ py: 2, px: 1, color: "#475569" }}>{row.dates || (row.start_date ? row.start_date.substring(0, 10) : "TBD")}</TableCell>
                      <TableCell sx={{ py: 2, px: 1 }} align="right">
                        <Chip
                          label={row.status || "New"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            borderRadius: '6px',
                            height: '22px',
                            bgcolor: row.status === "Pending" ? "#fef3c7" : "#e0f2fe",
                            color: row.status === "Pending" ? "#d97706" : "#0284c7",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Activity List */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: "1px solid #e2e8f0", bgcolor: "#fff", height: "100%", display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
              Latest updates and events
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1, pr: 1, overflowY: 'auto' }}>
              {activityData.map((act, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 1.5,
                    bgcolor: i === 0 ? "#f8fafc" : "transparent",
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ mt: 0.6 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4f46e5", boxShadow: "0 0 0 3px #e0e7ff" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", fontSize: '0.8rem', mb: 0.2 }}>
                      {act.title}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", color: "#64748b", fontWeight: 500, fontSize: '0.7rem', mb: 0.2 }}>
                      {act.sub}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8", display: "flex", alignItems: "center", gap: 0.5, fontSize: '0.65rem' }}>
                      <AccessTime sx={{ fontSize: 11 }} /> {act.time}
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