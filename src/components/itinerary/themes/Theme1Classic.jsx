import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Avatar,
  Button,
  Container,
} from "@mui/material";
import {
  FlightTakeoff,
  Hotel,
  LocationOn,
  CalendarMonth,
  CheckCircle,
  Cancel,
  Public,
  AccessTime,
  Phone,
  Email,
  PersonOutline,
  Description,
  AccountBalance,
  DirectionsCar,
  Restaurant,
  Flight,
  Train,
  DirectionsBus,
  WhatsApp,
  VerifiedUserOutlined,
  ShieldOutlined,
  AccessTimeOutlined,
  LocationOnOutlined,
  Security,
} from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useBlobDownload } from "../../../services/backendApi";

import { useItinerary } from "../../../context/ItineraryContext";

const HERO_BG =
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=2000";
const DAY1_IMG =
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800";
const DAY2_IMG =
  "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800";
const HOTEL_IMG =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800";

const DAY_COLORS = [
  "#f97316",
  "#0ea5e9",
  "#8b5cf6",
  "#10b981",
  "#f43f5e",
  "#3b82f6",
  "#a855f7",
];

const formatCamelCase = (text) => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Helper for formatting "10th April 2026"
const getOrdinalNum = (n) => {
  return (
    n +
    (n > 0
      ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : "")
  );
};
const getDayDate = (startDate, dayIndex) => {
  if (!startDate) return null;
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayIndex);
  const day = getOrdinalNum(date.getDate());
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function Theme1Classic() {
  const {
    clientData = {},
    activeDays,
    dayPlannerData,
    transportData,
    stayData,
    inclExclData,
    termsData,
    reviewData,
    visaData,
    themeConfig,
  } = useItinerary();

  // 🚨 DYNAMIC HERO BANNER

  // to use the user datails
  const { userDetails } = useApi();
  const { getBlob } = useBlobDownload();

  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoId = userDetails?.picture;
        const coverId = userDetails["custom:tmp_cover_img_id"];

        // for get logo background
        if (!logoId) {
          setLogoUrl("");
        } else {
          const logoBlobData = await getBlob(logoId);
          setLogoUrl(logoBlobData?.url || "");
        }

        // for get cover image
        if (!coverId || !coverId.length > 0) {
          setCoverUrl(HERO_BG);
        } else {
          const coverBlobData = await getBlob(coverId);
          setCoverUrl(coverBlobData?.url || "");
        }
      } catch (error) {
        console.error("Failed to load logo:", error);
        setLogoUrl("");
      }
    };

    loadLogo();
  }, [userDetails?.picture]);

  // 1. CLIENT & TRIP DATA
  const rawDestination = clientData.destination || "Destination";
  const shortDestination = rawDestination.split(",")[0];
  const title =
    clientData.trip_title && clientData.trip_title.trim() !== ""
      ? clientData.trip_title
      : `Best of ${shortDestination}`;
  const fullName =
    `${clientData.title || ""} ${clientData.name || "Valued Guest"}`.trim();
  const phone =
    `${clientData.contactCode || ""} ${clientData.contact || ""}`.trim() ||
    "N/A";
  const email = clientData.email || "N/A";

  const budget =
    reviewData?.budget !== "$0.00"
      ? reviewData?.budget
      : clientData.budget
        ? `$${clientData.budget}`
        : "TBD";

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;
  const dates =
    clientData.startDate && clientData.endDate
      ? `${formatDate(clientData.startDate)} - ${formatDate(clientData.endDate)}`
      : "Dates TBD";

  const adults = parseInt(clientData.adults) || 2;
  const childrenCount = parseInt(clientData.children) || 0;
  let pax = `${adults} Adults`;
  if (childrenCount > 0) pax += `, ${childrenCount} Children`;

  // Dynamic Footer Info
  const agentNameDisplay = userDetails["custom:full_name"];
  const agentInitials = agentNameDisplay
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const agencyPhone = userDetails["custom:mobile"];
  const agencyEmail = userDetails["custom:tmp_support_email"];
  const companyName = userDetails["custom:agency_name"];

  // 2. DAY PLANNER DATA
  const rawDaysArray = activeDays || dayPlannerData || [];
  const isFormEmpty =
    rawDaysArray.length === 0 ||
    (rawDaysArray.length === 1 && !rawDaysArray[0].title);
  const days = !isFormEmpty
    ? rawDaysArray
    : [
        {
          title: `Arrival in ${shortDestination}`,
          description: "Welcome to your dream vacation!",
          meals: ["Breakfast"],
          transport: "Private Transfer",
        },
      ];

  // 3. STAY DATA
  const hotels = stayData?.hotels?.length > 0 ? stayData.hotels : [];

  // 4. TRANSPORT DATA
  let flights = [];
  if (transportData?.flights?.length > 0) {
    flights = transportData.flights;
  } else if (transportData?.airline || transportData?.depFrom) {
    flights = [transportData];
  }

  // 5. INCLUSIONS & EXCLUSIONS DATA
  let displayInclusions = [];
  let displayExclusions = [];

  if (Array.isArray(inclExclData?.inclusions)) {
    displayInclusions = inclExclData.inclusions;
  } else {
    const rawInc = inclExclData?.inclusions || {};
    displayInclusions = Object.keys(rawInc)
      .filter((k) => rawInc[k])
      .map(formatCamelCase);
  }

  if (Array.isArray(inclExclData?.exclusions)) {
    displayExclusions = inclExclData.exclusions;
  } else {
    const rawExc = inclExclData?.exclusions || {};
    displayExclusions = Object.keys(rawExc)
      .filter((k) => rawExc[k])
      .map(formatCamelCase);
  }

  if (displayInclusions.length === 0)
    displayInclusions = [
      "Accommodation as per itinerary",
      "Daily Breakfast",
      "Airport Transfers",
      "All Local Taxes",
    ];
  if (displayExclusions.length === 0)
    displayExclusions = [
      "International Flights",
      "Visa Fees",
      "Personal Expenses",
      "Travel Insurance",
    ];

  // 6. VISA DATA
  const safeVisas = Array.isArray(visaData) ? visaData : [];

  // 7. SMART TERMS & CONDITIONS RENDERER
  const renderTerms = () => {
    if (!termsData)
      return (
        <Typography variant="body2" color="#475569">
          Standard travel terms and conditions apply. A 30% deposit is required
          to confirm your booking.
        </Typography>
      );

    if (typeof termsData === "string") {
      return (
        <Typography
          variant="body2"
          color="#475569"
          sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
        >
          {termsData}
        </Typography>
      );
    }

    const allSections = [];
    if (termsData.terms?.length > 0)
      allSections.push({ title: "General Terms", items: termsData.terms });
    if (termsData.policies?.length > 0)
      allSections.push({
        title: "Cancellation Policy",
        items: termsData.policies,
      });
    if (termsData.payments?.length > 0)
      allSections.push({
        title: "Payment Schedule",
        items: termsData.payments,
      });
    if (termsData.protections?.length > 0)
      allSections.push({
        title: "Travel Protection",
        items: termsData.protections,
      });

    if (allSections.length === 0)
      return (
        <Typography variant="body2" color="#475569">
          Standard travel terms apply.
        </Typography>
      );

    return (
      <Grid container spacing={4}>
        {allSections.map((section, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              color="#0f172a"
              mb={1}
            >
              {section.title}
            </Typography>
            <Box
              component="ul"
              sx={{ m: 0, pl: 2, color: "#475569", fontSize: "0.875rem" }}
            >
              {section.items.map((item, i) => (
                <li
                  key={i}
                  style={{
                    marginBottom: "6px",
                    wordBreak: "break-word",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item}
                </li>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box
      id="itinerary-pdf-content"
      sx={{
        bgcolor: "#fff",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* --- HERO SECTION --- */}
      <Box
        sx={{
          position: "relative",
          height: 450,
          backgroundImage: `url(${coverUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)",
          },
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <img height={300} width={700} src={logoUrl}></img>
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ color: "#fff", mt: 4 }}>
            <Typography
              variant="h2"
              fontWeight="900"
              mb={1}
              sx={{ wordBreak: "break-word" }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Chip
                label={dates}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                }}
                icon={<CalendarMonth sx={{ color: "#fff !important" }} />}
              />
              <Chip
                label={rawDestination}
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                }}
                icon={<LocationOn sx={{ color: "#fff !important" }} />}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* --- OVERLAPPING SUMMARY --- */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 10,
          mt: -8,
          mb: 8,
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <Paper
          elevation={10}
          sx={{ borderRadius: 4, bgcolor: "#fff", overflow: "hidden" }}
        >
          <Box
            sx={{
              bgcolor: "#f8fafc",
              px: 4,
              py: 2.5,
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9" }}>
                <PersonOutline />
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  color="#64748b"
                  fontWeight="600"
                  display="block"
                >
                  PREPARED FOR
                </Typography>
                <Typography
                  variant="subtitle2"
                  fontWeight="800"
                  color="#0f172a"
                >
                  {fullName}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography
                variant="caption"
                color="#475569"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <Phone fontSize="small" sx={{ color: "#94a3b8" }} /> {phone}
              </Typography>
              <Typography
                variant="caption"
                color="#475569"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <Email fontSize="small" sx={{ color: "#94a3b8" }} /> {email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ p: 4 }}>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#fff7ed",
                      color: "#f97316",
                      borderRadius: 2,
                    }}
                  >
                    <AccessTime />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="#64748b"
                      fontWeight="600"
                      display="block"
                    >
                      Duration
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      fontWeight="800"
                      color="#0f172a"
                    >
                      {clientData.days || 4} Days
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: "#ecfdf5",
                      color: "#10b981",
                      borderRadius: 2,
                    }}
                  >
                    <Hotel />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="#64748b"
                      fontWeight="600"
                      display="block"
                    >
                      Guests
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      fontWeight="800"
                      color="#0f172a"
                    >
                      {pax}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" fontWeight="700" color="#64748b">
                  Total Estimated Cost
                </Typography>
                <Typography variant="h5" fontWeight="900" color="#f97316">
                  {budget}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* 🚨 TRANSPORT TIMELINE 🚨 */}
      {flights.length > 0 && (
        <Container maxWidth="md" sx={{ mb: 8 }}>
          <Typography
            variant="h5"
            fontWeight="900"
            color="#0f172a"
            mb={1}
            textAlign="center"
          >
            Transport Itinerary
          </Typography>
          <Typography variant="body2" color="#64748b" mb={5} textAlign="center">
            Premium cabin experience throughout your trip
          </Typography>

          <Box sx={{ position: "relative", py: 2 }}>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: "#fed7aa",
                transform: "translateX(-50%)",
              }}
            />

            {flights.map((flight, i) => {
              const isEven = i % 2 === 0;
              let typeLabel =
                i === 0
                  ? "DEPARTURE"
                  : i === flights.length - 1
                    ? "RETURN"
                    : "CONNECTION";

              return (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      md: isEven ? "row" : "row-reverse",
                    },
                    alignItems: "center",
                    position: "relative",
                    mb: { xs: 4, md: 6 },
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 36,
                      height: 36,
                      bgcolor: "#f97316",
                      borderRadius: "50%",
                      color: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                      boxShadow: "0 0 0 6px #fff",
                    }}
                  >
                    <FlightTakeoff fontSize="small" />
                  </Box>

                  <Box
                    sx={{
                      width: { xs: "100%", md: "45%" },
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        borderBottom: "4px solid #f97316",
                        position: "relative",
                        bgcolor: "#fff",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                        minHeight: 140,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#f97316",
                            fontWeight: 800,
                            letterSpacing: 0.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <FlightTakeoff sx={{ fontSize: 16 }} /> {typeLabel}
                        </Typography>
                        <Chip
                          label={flight.classType || flight.cabin || "Economy"}
                          size="small"
                          sx={{
                            bgcolor: "#ffedd5",
                            color: "#ea580c",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight="800"
                        color="#0f172a"
                        mb={1}
                        sx={{ wordBreak: "break-word" }}
                      >
                        {flight.airline || "Flight Details"}{" "}
                        {flight.flightNo ? `| ${flight.flightNo}` : ""}
                      </Typography>

                      <Grid container spacing={1} alignItems="center" mt={1}>
                        <Grid item xs={5}>
                          <Typography
                            variant="caption"
                            color="#64748b"
                            display="flex"
                            alignItems="flex-start"
                            gap={0.5}
                            mb={0.5}
                            sx={{ wordBreak: "break-word" }}
                          >
                            <LocationOn sx={{ fontSize: 14, mt: 0.2 }} />{" "}
                            {flight.depFrom || "Origin"}
                          </Typography>
                          {flight.depDate && (
                            <Typography
                              variant="caption"
                              color="#94a3b8"
                              display="block"
                            >
                              {formatDate(flight.depDate)}
                            </Typography>
                          )}
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            color="#334155"
                          >
                            {flight.depTime || "TBD"}
                          </Typography>
                        </Grid>

                        <Grid item xs={2} textAlign="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.5,
                              color: "#94a3b8",
                              mb: 0.5,
                            }}
                          >
                            <AccessTime sx={{ fontSize: 12 }} />
                            <Typography variant="caption">
                              {flight.duration || "Direct"}
                            </Typography>
                          </Box>
                          <Divider
                            sx={{
                              borderColor: "#fed7aa",
                              borderBottomWidth: 2,
                            }}
                          />
                        </Grid>

                        <Grid item xs={5} textAlign="right">
                          <Typography
                            variant="caption"
                            color="#64748b"
                            display="flex"
                            alignItems="flex-start"
                            justifyContent="flex-end"
                            gap={0.5}
                            mb={0.5}
                            sx={{ wordBreak: "break-word" }}
                          >
                            <LocationOn sx={{ fontSize: 14, mt: 0.2 }} />{" "}
                            {flight.arrTo || "Destination"}
                          </Typography>
                          {flight.arrDate && (
                            <Typography
                              variant="caption"
                              color="#94a3b8"
                              display="block"
                              align="right"
                            >
                              {formatDate(flight.arrDate)}
                            </Typography>
                          )}
                          <Typography
                            variant="body2"
                            fontWeight="700"
                            color="#334155"
                            align="right"
                          >
                            {flight.arrTime || "TBD"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>

                  <Box
                    sx={{ display: { xs: "none", md: "block" }, width: "10%" }}
                  />
                  <Box
                    sx={{ display: { xs: "none", md: "block" }, width: "45%" }}
                  />
                </Box>
              );
            })}
          </Box>
        </Container>
      )}

      {/* 🚨 DAY PLANNER WITH BULLETPROOF IMAGE EXTRACTOR 🚨 */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Typography
          variant="h5"
          fontWeight="900"
          color="#0f172a"
          mb={1}
          textAlign="center"
        >
          Detailed Itinerary
        </Typography>
        <Typography variant="body2" color="#64748b" mb={5} textAlign="center">
          Every moment carefully curated for your perfect journey
        </Typography>

        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              position: "absolute",
              top: 20,
              bottom: 0,
              left: 39,
              width: 2,
              bgcolor: "#e2e8f0",
              zIndex: 0,
            }}
          />

          {days.map((day, i) => {
            const color = DAY_COLORS[i % DAY_COLORS.length];
            const safeMeals = Array.isArray(day.meals) ? day.meals : [];
            const mealString =
              safeMeals.length > 0 && !safeMeals.includes("No Meals")
                ? safeMeals.join(" & ")
                : "No Meals";

            // 🚨 BULLETPROOF IMAGE EXTRACTOR 🚨
            let uploadedImg = null;
            if (Array.isArray(day.images) && day.images.length > 0) {
              const imgObj = day.images[0];
              uploadedImg =
                typeof imgObj === "string"
                  ? imgObj
                  : imgObj.data_url ||
                    imgObj.dataURL ||
                    imgObj.url ||
                    imgObj.preview ||
                    imgObj.src;
            } else if (day.image) {
              uploadedImg =
                typeof day.image === "string"
                  ? day.image
                  : day.image.data_url ||
                    day.image.dataURL ||
                    day.image.url ||
                    day.image.preview ||
                    day.image.src;
            }

            const displayImg =
              uploadedImg || (i % 2 === 0 ? DAY1_IMG : DAY2_IMG);
            const isBase64 = displayImg.startsWith("data:image");

            const displayDate = getDayDate(clientData.startDate, i);

            return (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  mb: 4,
                  position: "relative",
                  zIndex: 1,
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: 80 },
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: { xs: "flex-start", sm: "center" },
                    mb: { xs: 2, sm: 0 },
                  }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      width: 70,
                      height: 70,
                      bgcolor: color,
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      border: "3px solid #fff",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        lineHeight: 1,
                        fontWeight: 800,
                        fontSize: "0.6rem",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Day
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ lineHeight: 1, fontWeight: 900, my: 0.3 }}
                    >
                      {i + 1}
                    </Typography>
                    {displayDate && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.45rem",
                          lineHeight: 1,
                          fontWeight: 600,
                        }}
                      >
                        {displayDate}
                      </Typography>
                    )}
                  </Paper>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    ml: { xs: 0, sm: 4 },
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    borderRadius: 3,
                    border: `1.5px solid ${color}60`,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    minHeight: 90,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", md: 280 },
                      minHeight: { xs: 200, md: "100%" },
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={displayImg}
                      alt={day.title || `Day ${i + 1}`}
                      {...(!isBase64 && { crossOrigin: "anonymous" })} // Only apply to remote URLs
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="800"
                      color="#0f172a"
                      mb={1}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {day.title || `Day ${i + 1}`}
                    </Typography>
                    {day.description && (
                      <Typography
                        variant="body2"
                        color="#475569"
                        mb={2}
                        sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
                      >
                        {day.description}
                      </Typography>
                    )}

                    {day.activities && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="body2"
                          color="#475569"
                          sx={{
                            whiteSpace: "pre-line",
                            wordBreak: "break-word",
                            pl: 2,
                            borderLeft: `2px solid ${color}40`,
                          }}
                        >
                          {day.activities}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2,
                        display: "flex",
                        gap: 3,
                        flexWrap: "wrap",
                        borderTop: "1px solid #f1f5f9",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="#64748b"
                        fontWeight="600"
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ wordBreak: "break-word" }}
                      >
                        <DirectionsCar
                          fontSize="small"
                          sx={{ color: "#cbd5e1" }}
                        />{" "}
                        {day.transport && day.transport !== "No Transport"
                          ? day.transport
                          : "No Transport"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="#64748b"
                        fontWeight="600"
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{ wordBreak: "break-word" }}
                      >
                        <Restaurant
                          fontSize="small"
                          sx={{ color: "#cbd5e1" }}
                        />{" "}
                        {mealString}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Container>

      {/* --- HOTELS WITH MIN-HEIGHT --- */}
      {hotels.length > 0 && (
        <Container maxWidth="md" sx={{ mb: 8 }}>
          <Typography
            variant="h5"
            fontWeight="900"
            color="#0f172a"
            mb={1}
            textAlign="center"
          >
            Luxury Accommodations
          </Typography>
          <Typography variant="body2" color="#64748b" mb={4} textAlign="center">
            Where you will be staying
          </Typography>

          <Grid container spacing={3}>
            {hotels.map((hotel, i) => {
              const safeAmenities = hotel.amenities || [];
              const mealsList = Object.keys(hotel.meals || {})
                .filter((k) => hotel.meals[k])
                .map(formatCamelCase);
              const finalHotelName =
                hotel?.hotelName ||
                hotel?.name ||
                hotel?.hotel_name ||
                "Selected Hotel";

              return (
                <Grid item xs={12} sm={6} key={i}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "100%",
                      pageBreakInside: "avoid",
                      breakInside: "avoid",
                    }}
                  >
                    <Box
                      sx={{
                        height: 180,
                        position: "relative",
                        width: "100%",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={hotel.image || HOTEL_IMG}
                        alt={finalHotelName}
                        crossOrigin="anonymous"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Chip
                        label={hotel.hotelPref || "Hotel"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: "#fff",
                          fontWeight: 700,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        p: 3,
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="800"
                        color="#0f172a"
                        mb={0.5}
                        sx={{ wordBreak: "break-word" }}
                      >
                        {finalHotelName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="#64748b"
                        display="flex"
                        alignItems="flex-start"
                        gap={0.5}
                        mb={2}
                        sx={{ wordBreak: "break-word" }}
                      >
                        <LocationOn
                          fontSize="small"
                          sx={{ mt: 0.2, flexShrink: 0 }}
                        />
                        {hotel.location || rawDestination}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mb: 2,
                          bgcolor: "#f8fafc",
                          p: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="#94a3b8"
                            display="block"
                          >
                            Check-in
                          </Typography>
                          <Typography variant="body2" fontWeight="700">
                            {hotel.checkInDate
                              ? formatDate(hotel.checkInDate)
                              : "TBD"}{" "}
                            • {hotel.checkInTime || "3:00 PM"}
                          </Typography>
                        </Box>
                      </Box>

                      {safeAmenities.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            mb: 2,
                          }}
                        >
                          {safeAmenities.map((am) => (
                            <Chip
                              key={am}
                              label={am}
                              size="small"
                              sx={{
                                bgcolor: "#f0f9ff",
                                color: "#0ea5e9",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                              }}
                            />
                          ))}
                        </Box>
                      )}

                      <Box sx={{ mt: "auto" }}>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography
                          variant="caption"
                          color="#64748b"
                          display="flex"
                          alignItems="flex-start"
                          gap={0.5}
                          sx={{ wordBreak: "break-word" }}
                        >
                          <Restaurant
                            fontSize="small"
                            sx={{ mt: 0.2, flexShrink: 0 }}
                          />
                          Meals: {mealsList.join(", ") || "Room Only"}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="#64748b"
                          display="flex"
                          alignItems="flex-start"
                          gap={0.5}
                          mt={0.5}
                          sx={{ wordBreak: "break-word" }}
                        >
                          <Hotel
                            fontSize="small"
                            sx={{ mt: 0.2, flexShrink: 0 }}
                          />
                          Room: {hotel.roomCat || "Standard"} (
                          {hotel.rooms || 1} Room)
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}

      {/* --- INCLUSIONS & EXCLUSIONS --- */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h4" fontWeight="900" color="#0f172a" mb={1}>
            What's Included
          </Typography>
          <Typography variant="body2" color="#64748b">
            Transparent pricing with no hidden fees
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                width: "400px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#10b981",
                  color: "#fff",
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    p: 1,
                    borderRadius: 2,
                    display: "flex",
                  }}
                >
                  <CheckCircle fontSize="small" />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="800"
                    sx={{ lineHeight: 1.2 }}
                  >
                    Included
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, display: "block" }}
                  >
                    Everything you need for a perfect trip
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  p: 4,
                  bgcolor: "#fff",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                {displayInclusions.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      width: "100%",
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 18,
                        color: "#10b981",
                        mt: 0.2,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="#475569"
                      sx={{
                        flex: 1,
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                width: "400px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#ef4444",
                  color: "#fff",
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.25)",
                    p: 1,
                    borderRadius: 2,
                    display: "flex",
                  }}
                >
                  <Cancel fontSize="small" />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="800"
                    sx={{ lineHeight: 1.2 }}
                  >
                    Not Included
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, display: "block" }}
                  >
                    Additional costs to consider
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  p: 4,
                  bgcolor: "#fff",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                }}
              >
                {displayExclusions.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      width: "100%",
                    }}
                  >
                    <Cancel
                      sx={{
                        fontSize: 18,
                        color: "#ef4444",
                        mt: 0.2,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="#475569"
                      sx={{
                        flex: 1,
                        wordBreak: "break-word",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* --- VISA DETAILS & BANK DETAILS --- */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Grid container spacing={4} alignItems="stretch">
          {/* Bank Details (Left Column) */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#1e3a8a",
                color: "#fff",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Avatar
                  sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#fff" }}
                >
                  <AccountBalance />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">
                    Bank Account Details
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    For balance payment
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, display: "block", mb: 0.5 }}
                    >
                      Bank Name
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {termsData?.bankDetails?.bankName || "Chase Bank N.A."}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, display: "block", mb: 0.5 }}
                    >
                      Account Holder
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {termsData?.bankDetails?.accountName ||
                        "Wanderlust Elite Travel"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, display: "block", mb: 0.5 }}
                    >
                      Account Number
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {termsData?.bankDetails?.accountNumber ||
                        "**** **** **5847"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, display: "block", mb: 0.5 }}
                    >
                      Account Type
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {termsData?.bankDetails?.accountType ||
                        "Business Checking"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, display: "block", mb: 0.5 }}
                    >
                      Branch Name
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {termsData?.bankDetails?.branchName || "Main Branch"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.7, display: "block", mb: 0.5 }}
                    >
                      Routing / SWIFT
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="600"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {termsData?.bankDetails?.routing ||
                        termsData?.bankDetails?.ifscCode ||
                        "021000021"}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {termsData?.bankDetails?.bankNotes && (
                <Box
                  sx={{
                    mt: 2,
                    bgcolor: "rgba(255,255,255,0.05)",
                    p: 2,
                    borderRadius: 2,
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.7, display: "block", mb: 0.5 }}
                  >
                    Payment Instructions
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
                  >
                    {termsData.bankDetails.bankNotes}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Visa Requirements (Right Column) */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: "#1e3a8a",
                color: "#fff",
                height: "100%",
                width: "800px",
                display: "flex",
                flexDirection: "column",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Avatar
                  sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#fff" }}
                >
                  <Security />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">
                    Visa Requirements
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Essential travel documents
                  </Typography>
                </Box>
              </Box>

              {safeVisas.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    flexGrow: 1,
                  }}
                >
                  {safeVisas.map((visa, i) => (
                    <Box
                      key={i}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.05)",
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <Public sx={{ fontSize: 18, opacity: 0.8 }} />
                          <Typography variant="body2" fontWeight="700">
                            {visa.visaCountry ||
                              visa.country ||
                              "Visa Required"}
                          </Typography>
                        </Box>
                        <Chip
                          label="Approved"
                          size="small"
                          sx={{
                            bgcolor: "rgba(16, 185, 129, 0.2)",
                            color: "#34d399",
                            height: 22,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            border: "1px solid rgba(16, 185, 129, 0.5)",
                          }}
                        />
                      </Box>
                      <Box sx={{ pl: 3.5 }}>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.8, display: "block", mb: 0.5 }}
                        >
                          {visa.visaType || "Tourist Visa"} •{" "}
                          {visa.entryType || "Single Entry"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.8, display: "block" }}
                        >
                          Duration:{" "}
                          {visa.duration || visa.visaDuration || "TBD"}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  {safeVisas.some((v) => v.notes || v.documents) && (
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.05)",
                        p: 2,
                        borderRadius: 2,
                        mt: "auto",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          opacity: 0.9,
                          display: "block",
                          mb: 1,
                          fontWeight: 700,
                        }}
                      >
                        Important Notes:
                      </Typography>
                      {safeVisas.map(
                        (visa, i) =>
                          (visa.notes || visa.documents) && (
                            <Typography
                              key={i}
                              variant="caption"
                              sx={{
                                opacity: 0.7,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                                mb: 0.5,
                                whiteSpace: "pre-line",
                                wordBreak: "break-word",
                              }}
                            >
                              • {visa.notes || visa.documents}
                            </Typography>
                          ),
                      )}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    bgcolor: "rgba(255,255,255,0.05)",
                    p: 2,
                    borderRadius: 2,
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    No specific visa requirements added for this itinerary.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* --- TERMS & CONDITIONS --- */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
            pageBreakInside: "avoid",
            breakInside: "avoid",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="800"
            color="#0f172a"
            mb={3}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Description color="primary" /> Terms & Conditions
          </Typography>
          {renderTerms()}
        </Paper>
      </Container>

      {/* --- FOOTER SECTION --- */}
      <Box
        sx={{
          bgcolor: "#f8fafc",
          pt: 8,
          pb: 4,
          mt: 8,
          borderTop: "1px solid #e2e8f0",
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1}>
              Your Luxury Travel Consultant
            </Typography>
            <Typography variant="body2" color="#64748b">
              We're here to make your dream vacation a reality
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="stretch" mb={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={10}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "#1e3a8a",
                  color: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" fontWeight="800" mb={0.5}>
                  Connect With Your Travel Expert
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.8, display: "block", mb: 4 }}
                >
                  Personalized service for your dream vacation
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: "#eab308",
                      color: "#0f172a",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                    }}
                  >
                    {agentInitials}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="800">
                      {agentNameDisplay}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.8, display: "block" }}
                    >
                      Your Travel Consultant
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      p: 1.5,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Phone fontSize="small" sx={{ opacity: 0.8 }} />
                    <Typography variant="body2" fontWeight="600">
                      {userDetails["custom:tmp_pr_contact"]}
                      {userDetails["custom:tmp_se_contact"] &&
                      userDetails["custom:tmp_se_contact"].length > 0
                        ? ` / ${userDetails["custom:tmp_se_contact"]}`
                        : ""}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      p: 1.5,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Email fontSize="small" sx={{ opacity: 0.8 }} />
                    <Typography variant="body2" fontWeight="600">
                      {agencyEmail}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      p: 1.5,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <LanguageIcon fontSize="small" sx={{ opacity: 0.8 }} />
                    <Typography variant="body2" fontWeight="600">
                      {userDetails["custom:tmp_website"]}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<WhatsApp />}
                    sx={{
                      bgcolor: "#10b981",
                      color: "#fff",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: "none",
                      mt: 1,
                      "&:hover": { bgcolor: "#059669" },
                    }}
                  >
                    Chat on WhatsApp - {userDetails["custom:tmp_pr_contact"]}
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="800"
                  color="#0f172a"
                  mb={3}
                >
                  Why Choose Us
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    mb: 4,
                  }}
                >
                  {userDetails["custom:branding"] &&
                    JSON.parse(
                      userDetails["custom:branding"]
                        ? userDetails["custom:branding"]
                        : [],
                    ).map((value) => (
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: "#e0f2fe",
                            color: "#0ea5e9",
                            width: 40,
                            height: 40,
                          }}
                        >
                          <VerifiedUserOutlined fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight="800"
                            color="#0f172a"
                          >
                            {value.title}
                          </Typography>
                          <Typography variant="caption" color="#64748b">
                            {value.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                </Box>

                <Typography
                  variant="subtitle1"
                  fontWeight="800"
                  color="#0f172a"
                  mb={2}
                >
                  Office Address
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e0f2fe",
                      color: "#0ea5e9",
                      width: 40,
                      height: 40,
                    }}
                  >
                    <LocationOnOutlined fontSize="small" />
                  </Avatar>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="caption" color="#64748b">
                      {userDetails["custom:office_address"]}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              bgcolor: "#334155",
              color: "#fff",
              p: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
              <Typography variant="body2" fontWeight="700">
                {themeConfig?.footerText || companyName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {userDetails["custom:tmp_footer_text"]}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              © 2026 All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
