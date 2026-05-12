import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  PeopleOutline,
  AccessTime,
  CheckCircleOutline,
  CallMade,
} from "@mui/icons-material";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useDashboardMetrics } from "../services/backendApi.js";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="11"
      fontWeight="600"
    >
      <tspan x={x} dy="-0.4em">
        {name}
      </tspan>
      <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
    </text>
  );
};

export default function Dashboard() {
  const { api } = useApi();
  const { kpiMetrics, popularDist } = useDashboardMetrics();
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    api.leads.getAllLeadUsers().then((res) => {
      const rows = Array.isArray(res) ? res : [];
      setRecentLeads([...rows].reverse().slice(0, 6));
    });
  }, [api]);

  const kpiStyles = [
    {
      icon: <PeopleOutline fontSize="small" />,
      color: "#0ea5e9",
      bg: "#e0f2fe",
    },
    {
      icon: <AccessTime fontSize="small" />,
      color: "#f97316",
      bg: "#ffedd5",
    },
    {
      icon: <CheckCircleOutline fontSize="small" />,
      color: "#10b981",
      bg: "#dcfce7",
    },
  ];

  const kpiData = (Array.isArray(kpiMetrics) ? kpiMetrics : []).map(
    (item, index) => ({
      ...item,
      ...kpiStyles[index % kpiStyles.length],
      val: item?.val ?? 0,
      desc: item?.desc || "",
      title: item?.title || "--",
    }),
  );
  const kpiGridMd = kpiData.length === 3 ? 4 : 3;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        flexGrow: 1,
      }}
    >
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
      <Grid container spacing={2} mb={3} alignItems="stretch">
        {kpiData.map((kpi, index) => (
          <Grid item  key={index} sx={{ 
            width : '300px'
           }}>
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
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)",
                width: "100%",
              }}
            >
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  width: 26,
                  height: 26,
                }}
              >
                <CallMade sx={{ fontSize: 14, color: "#94a3b8" }} />
              </IconButton>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}
              >
                <Box
                  sx={{
                    bgcolor: kpi.bg,
                    color: kpi.color,
                    p: 0.8,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {kpi.icon}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}
                  >
                    {kpi.title}
                  </Typography>
                  <Typography variant="caption" color="#64748b">
                    {kpi.desc}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 0.9 }}
                >
                  {kpi.val}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mb={3} alignItems="stretch">
        <Grid item xs={12} md={5} sx={{ display: "flex" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#fff",
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: "#0f172a" }}
            >
              Popular Destination
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mb: 1 }}>
              Trending destinations this season
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                minHeight: 280,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularDist}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    stroke="none"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {popularDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                      color: "#475569",
                      fontWeight: 500,
                      paddingTop: "20px",
                      whiteSpace: "nowrap",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7} sx={{ display: "flex" }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid #e2e8f0",
              bgcolor: "#fff",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
              Recent Leads
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
              Latest lead entries from your pipeline
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Destination</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Travel Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Travellers</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#64748b" }}>
                        No recent leads found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentLeads.map((lead) => (
                      <TableRow key={lead.lead_id}>
                        <TableCell>{`${lead.title || "Mr"}. ${lead.name || "--"}`}</TableCell>
                        <TableCell>{lead.dist_location || "TBD"}</TableCell>
                        <TableCell>{lead.start_date && lead.end_date ? `${lead.start_date} - ${lead.end_date}` : "TBD"}</TableCell>
                        <TableCell>{`${lead.no_of_adults || 0}A${lead.no_of_children ? `, ${lead.no_of_children}C` : ""}`}</TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status || "New"}
                            size="small"
                            sx={{ fontWeight: 700, bgcolor: "#f1f5f9", color: "#334155" }}
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
      </Grid>
    </Box>
  );
}
