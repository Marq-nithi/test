 import React, { useState, useEffect } from "react";
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
  LocalTaxi,
  WhatsApp,
  VerifiedUserOutlined,
  ShieldOutlined,
  AccessTimeOutlined,
  LocationOnOutlined,
  Security,
  WifiOutlined,
  LocalCafeOutlined,
  SpaOutlined,
  FitnessCenterOutlined,
  Star,
  AutoAwesome,
  EmojiEvents,
  PeopleOutline,
  PaidOutlined,
  LightbulbOutlined,
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
  if (!text) return "";
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

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
  const itineraryContext = useItinerary() || {};
  const {
    clientData = {},
    activeDays = [],
    dayPlannerData = [],
    transportData = {},
    stayData = {},
    priceData = {},
    inclExclData = {},
    termsData = "",
    reviewData = {},
    visaData = [],
    themeConfig = {},
  } = itineraryContext;

  const { userDetails: ud = {}, api } = useApi() || {};
  const [userDetails, setUserDetails] = useState(ud);
  const { getBlob } = useBlobDownload() || {};

  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState(HERO_BG);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoId = userDetails?.picture;
        if (!logoId) {
          setLogoUrl("");
        } else if (getBlob) {
          const logoBlobData = await getBlob(logoId);
          setLogoUrl(logoBlobData?.url || "");
        }
      } catch (error) {
        console.error("Failed to load logo:", error);
        setLogoUrl("");
      }

      try {
        const coverId = userDetails?.["custom:tmp_cover_img_id"];
        if (!coverId || !coverId.length) {
          setCoverUrl(HERO_BG);
        } else if (getBlob) {
          const coverBlobData = await getBlob(coverId);
          const resolvedUrl = coverBlobData?.url;
          setCoverUrl(
            resolvedUrl && resolvedUrl.length > 0 ? resolvedUrl : HERO_BG,
          );
        }
      } catch (error) {
        console.error("Failed to load cover image:", error);
        setCoverUrl(HERO_BG);
      }
    };

    if (userDetails) loadLogo();
  }, [userDetails, getBlob]);

  useEffect(() => {
    if (api?.auth?.loadUserDetails) {
      api.auth.loadUserDetails().then((data) => {
        setUserDetails(data || {});
      });
    }
  }, [api]);

  const rawDestination = clientData?.destination || "Destination";
  const shortDestination = rawDestination.split(",")[0];
  const title =
    clientData?.trip_title && clientData.trip_title.trim() !== ""
      ? clientData.trip_title
      : `Best of ${shortDestination}`;
  const fullName =
    `${clientData?.title || ""} ${clientData?.name || "Valued Guest"}`.trim();

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const adults = parseInt(clientData?.adults) || 2;
  const childrenCount = parseInt(clientData?.children) || 0;
  let pax = `${adults} Adults`;
  if (childrenCount > 0) pax += `, ${childrenCount} Child`;

  const agentNameDisplay = userDetails?.["custom:full_name"] || "Travel Agent";
  const agentInitials = agentNameDisplay
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const companyName = userDetails?.["custom:agency_name"] || "Travel Agency";

  const rawDaysArray = (activeDays && activeDays.length > 0) 
    ? activeDays 
    : (dayPlannerData && dayPlannerData.length > 0) 
      ? dayPlannerData 
      : [];

  const isFormEmpty = rawDaysArray.length === 0 || (rawDaysArray.length === 1 && !rawDaysArray[0]?.title);
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

  const hotels = stayData?.hotels?.length > 0 ? stayData.hotels : [];

  const flights = transportData?.flights || (transportData?.airline ? [transportData] : []);
  const trains = transportData?.trains || [];
  const buses = transportData?.buses || [];
  const grounds = transportData?.grounds || [];
  
  const hasTransport = flights.length > 0 || trains.length > 0 || buses.length > 0 || grounds.length > 0;

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

  const safeVisas = Array.isArray(visaData) ? visaData : [];

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  const priceItems = priceData?.items || [];
  const subtotal = priceItems.reduce(
    (sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0),
    0
  );
  
  const gstAmount = subtotal * ((Number(priceData?.taxes?.gst) || 0) / 100);
  const serviceTaxAmount = subtotal * ((Number(priceData?.taxes?.serviceTax) || 0) / 100);
  const totalTaxes = gstAmount + serviceTaxAmount;

  const discountValue = Number(priceData?.discount?.value) || 0;
  const discountAmount =
    priceData?.discount?.type === "Percentage (%)"
      ? subtotal * (discountValue / 100)
      : discountValue;

  const grandTotal = subtotal + totalTaxes - discountAmount;
  const originalTotal = subtotal + totalTaxes;
  const hasPriceData = grandTotal > 0;
  const finalTotalDisplay = hasPriceData ? formatCurrency(grandTotal) : "TBD";

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
              {(section.items || []).map((item, i) => (
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
        bgcolor: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 🚨 HERO SECTION 🚨 */}
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
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)",
            zIndex: 0, 
          },
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <img
          height={"auto"}
          width={"250px"}
          src={logoUrl}
          crossOrigin="anonymous"
          style={{
            position: "relative",
            zIndex: 10,
            padding: "20px",
          }}
          alt="Agency Logo"
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            pb: 8,
          }}
        >
          <Box sx={{ color: "#fff" }}>
            <Typography
              variant="h2"
              fontWeight="900"
              mb={1}
              sx={{ wordBreak: "break-word", whiteSpace: "normal" }}
            >
              {title}
            </Typography>

            <Typography
              variant="h6"
              fontWeight="500"
              sx={{ opacity: 0.9, mb: 3 }}
            >
              {clientData?.days || 10} Days • 2 Countries • Unforgettable
              Memories
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Chip
                label="Premium Experience"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
                icon={
                  <AutoAwesome
                    sx={{
                      color: "#fbbf24 !important",
                      fontSize: "1rem !important",
                    }}
                  />
                }
              />
              <Chip
                label="Best Seller"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                  backdropFilter: "blur(4px)",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
                icon={
                  <EmojiEvents
                    sx={{
                      color: "#fbbf24 !important",
                      fontSize: "1rem !important",
                    }}
                  />
                }
              />
            </Box>

            <Typography
              variant="subtitle2"
              sx={{
                color: "#fbbf24",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              PREPARED FOR {fullName.toUpperCase()}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* OVERLAPPING TRIP SUMMARY CARD */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 10,
          mt: -10,
          mb: 8,
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <Paper
          elevation={10}
          sx={{ borderRadius: 4, bgcolor: "#fff", overflow: "hidden", p: 4 }}
        >
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={4}>
            Trip Summary
          </Typography>

          <Grid container spacing={3} mb={4}sx={{
            width:"900px",gap:"90px"
          }}>
            <Grid item xs={6} sm={3} sx={{ gap: 10 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ p: 1.5, bgcolor: "#fff7ed", color: "#f97316", borderRadius: 2, display: "flex" }}>
                  <CalendarMonth />
                </Box>
                <Box>
                  <Typography variant="caption" color="#64748b" fontWeight="600" display="block">
                    Travel Dates
                  </Typography>
                  <Typography variant="body2" fontWeight="800" color="#0f172a" sx={{ lineHeight: 1.2 }}>
                    {clientData?.startDate && clientData?.endDate
                      ? `${new Date(clientData.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${new Date(clientData.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : "Dates TBD"}
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    {clientData?.startDate ? new Date(clientData.startDate).getFullYear() : ""}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ p: 1.5, bgcolor: "#eff6ff", color: "#3b82f6", borderRadius: 2, display: "flex" }}>
                  <AccessTime />
                </Box>
                <Box>
                  <Typography variant="caption" color="#64748b" fontWeight="600" display="block">
                    Duration
                  </Typography>
                  <Typography variant="body2" fontWeight="800" color="#0f172a" sx={{ lineHeight: 1.2 }}>
                    {clientData?.days || 10} Days
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    {Math.max(1, (clientData?.days || 10) - 1)} Nights
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ p: 1.5, bgcolor: "#f3e8ff", color: "#a855f7", borderRadius: 2, display: "flex" }}>
                  <PeopleOutline />
                </Box>
                <Box>
                  <Typography variant="caption" color="#64748b" fontWeight="600" display="block">
                    Travelers
                  </Typography>
                  <Typography variant="body2" fontWeight="800" color="#0f172a" sx={{ lineHeight: 1.2 }}>
                    {adults} Adults
                  </Typography>
                  <Typography variant="caption" color="#94a3b8">
                    {childrenCount} Children
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box sx={{ p: 1.5, bgcolor: "#ecfdf5", color: "#10b981", borderRadius: 2, display: "flex" }}>
                  <PaidOutlined />
                </Box>
                <Box>
                  <Typography variant="caption" color="#64748b" fontWeight="600" display="block">
                    Total Cost
                  </Typography>
                  <Typography variant="body2" fontWeight="800" color="#0f172a" sx={{ lineHeight: 1.2 }}>
                    {finalTotalDisplay}
                  </Typography>
                  {discountAmount > 0 && hasPriceData && (
                    <Typography variant="caption" color="#94a3b8" sx={{ textDecoration: "line-through" }}>
                      {formatCurrency(originalTotal)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3, borderColor: "#f1f5f9" }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
            {priceItems.map((item, idx) => {
              const itemTotal = (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0);
              if (itemTotal === 0 && !item?.description && !item?.category) return null; 

              return (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="#475569">
                    {item?.description || item?.category || "Item"} {Number(item?.quantity) > 1 ? `(x${item.quantity})` : ""}
                  </Typography>
                  <Typography variant="body2" fontWeight="700" color="#0f172a">
                    {formatCurrency(itemTotal)}
                  </Typography>
                </Box>
              );
            })}

            {totalTaxes > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="#475569">
                  Taxes & Fees {priceData?.taxes?.gst ? `(GST ${priceData.taxes.gst}%)` : ""}
                </Typography>
                <Typography variant="body2" fontWeight="700" color="#0f172a">
                  {formatCurrency(totalTaxes)}
                </Typography>
              </Box>
            )}

            {discountAmount > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="#10b981" fontWeight="600">
                  Discount {priceData?.discount?.type === "Percentage (%)" ? `(${priceData.discount.value}%)` : ""}
                </Typography>
                <Typography variant="body2" fontWeight="700" color="#10b981">
                  -{formatCurrency(discountAmount)}
                </Typography>
              </Box>
            )}
            
            {!hasPriceData && (
               <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="#475569">Base Package</Typography>
                <Typography variant="body2" fontWeight="700" color="#0f172a">TBD</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 3, borderColor: "#f1f5f9" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="subtitle1" fontWeight="900" color="#0f172a">
              Total Amount
            </Typography>
            <Typography variant="h5" fontWeight="900" color="#f97316">
              {finalTotalDisplay}
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: "#f0f9ff",
              p: 2,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <LightbulbOutlined sx={{ color: "#eab308", fontSize: 20 }} />
            <Typography variant="body2" color="#334155">
              <span style={{ fontWeight: 700 }}>Flexible Payment:</span> Pay
              a 30% deposit now, rest 30 days before departure
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* TRANSPORT TIMELINE */}
      {hasTransport && (
        <Container maxWidth="md" sx={{ mb: 8 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1} textAlign="center">
            Transport Itinerary
          </Typography>
          <Typography variant="body2" color="#64748b" mb={5} textAlign="center">
            Premium travel experience throughout your trip
          </Typography>

          <Box sx={{ position: "relative", py: 2 }}>
            <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, bgcolor: "#fed7aa", transform: "translateX(-50%)" }} />

            {/* 🚨 REDESIGNED FIGMA FLIGHT CARD 🚨 */}
            {flights.map((flight, i) => {
              const isEven = i % 2 === 0;
              let typeLabel = flight?.isReturnFlight ? "RETURN FLIGHT" : (i === 0 ? "DEPARTURE" : i === flights.length - 1 ? "RETURN" : "CONNECTION");

              return (
                <Box key={`flight-${i}`} sx={{ display: "flex", flexDirection: { xs: "column", md: isEven ? "row" : "row-reverse" }, alignItems: "center", position: "relative", mb: { xs: 4, md: 6 }, pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <Box sx={{ display: { xs: "none", md: "flex" }, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 36, height: 36, bgcolor: "#f97316", borderRadius: "50%", color: "#fff", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 0 0 6px #fff" }}>
                    <FlightTakeoff fontSize="small" />
                  </Box>
                  <Box sx={{ width: { xs: "100%", md: "45%" }, mb: { xs: 2, md: 0 } }}>
                    
                    {/* 🚨 FIGMA UI IMPLEMENTATION HERE 🚨 */}
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                      
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                        <Typography variant="caption" sx={{ color: "#f97316", fontWeight: 800, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <FlightTakeoff sx={{ fontSize: 16 }} /> {typeLabel}
                        </Typography>
                        <Chip label={flight?.classType || flight?.cabin || "Economy"} size="small" sx={{ bgcolor: "#ffedd5", color: "#ea580c", fontWeight: 700, fontSize: "0.75rem", borderRadius: "12px", height: "24px" }} />
                      </Box>
                      
                      <Typography variant="h5" fontWeight="800" color="#0f172a" mb={2} sx={{ wordBreak: "break-word" }}>
                        {flight?.airline || "Flight Details"} {flight?.flightNo ? `| ${flight.flightNo}` : ""}
                      </Typography>
                      
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={4}>
                          <Typography variant="body2" fontWeight="700" color="#0f172a" display="flex" alignItems="center" gap={0.5}>
                            <LocationOnOutlined sx={{ fontSize: 16, color: "#94a3b8" }} /> {flight?.depFrom || "Origin"}
                          </Typography>
                          <Box sx={{ pl: 2.5, mt: 0.5 }}>
                            {flight?.depDate && <Typography variant="caption" color="#64748b" display="block">{formatDate(flight.depDate)}</Typography>}
                            <Typography variant="caption" color="#94a3b8" display="block">{flight?.depTime || "TBD"}</Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={4} textAlign="center">
                          <Chip icon={<AccessTime sx={{ fontSize: "14px !important", color: "#64748b" }} />} label={flight?.duration || "Direct"} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: "0.75rem", borderRadius: "12px" }} />
                        </Grid>
                        
                        <Grid item xs={4} textAlign="right">
                          <Typography variant="body2" fontWeight="700" color="#0f172a" display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                            <LocationOnOutlined sx={{ fontSize: 16, color: "#94a3b8" }} /> {flight?.arrTo || "Destination"}
                          </Typography>
                          <Box sx={{ pr: 2.5, mt: 0.5 }}>
                            {flight?.arrDate && <Typography variant="caption" color="#64748b" display="block" align="right">{formatDate(flight.arrDate)}</Typography>}
                            <Typography variant="caption" color="#94a3b8" display="block" align="right">{flight?.arrTime || "TBD"}</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {/* Layovers Section */}
                      {flight?.flightType === 'Connecting Flight' && flight?.layovers && flight.layovers.length > 0 && flight.layovers.some(l => l.location || l.duration) && (
                        <Box sx={{ mt: 2.5 }}>
                          <Divider sx={{ borderColor: "#f97316", borderBottomWidth: 3, borderRadius: 2, mb: 2.5 }} />
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            {flight.layovers.map((layover, lIdx) => {
                              if(!layover.location && !layover.duration) return null;
                              return (
                                <Box key={lIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                  <Flight sx={{ fontSize: 20, color: '#f97316', transform: 'rotate(45deg)', mt: 0.2 }} />
                                  <Box textAlign="left">
                                    <Typography variant="body2" fontWeight="700" color="#334155">
                                      Stop {lIdx + 1} - {layover.location || 'TBD'}
                                    </Typography>
                                    <Typography variant="caption" color="#64748b" display="block">
                                      Layover Time: {layover.duration || 'TBD'}
                                    </Typography>
                                  </Box>
                                </Box>
                              )
                            })}
                          </Box>
                        </Box>
                      )}
                    </Paper>

                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "10%" }} />
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "45%" }} />
                </Box>
              );
            })}

            {/* Trains Mapping */}
            {trains.map((train, i) => {
              const isEven = (flights.length + i) % 2 === 0;
              return (
                <Box key={`train-${i}`} sx={{ display: "flex", flexDirection: { xs: "column", md: isEven ? "row" : "row-reverse" }, alignItems: "center", position: "relative", mb: { xs: 4, md: 6 }, pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <Box sx={{ display: { xs: "none", md: "flex" }, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 36, height: 36, bgcolor: "#0ea5e9", borderRadius: "50%", color: "#fff", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 0 0 6px #fff" }}>
                    <Train fontSize="small" />
                  </Box>
                  <Box sx={{ width: { xs: "100%", md: "45%" }, mb: { xs: 2, md: 0 } }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", borderBottom: "4px solid #0ea5e9", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="caption" sx={{ color: "#0ea5e9", fontWeight: 800, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Train sx={{ fontSize: 16 }} /> RAILWAY
                        </Typography>
                        <Chip label={train?.coach || "Standard"} size="small" sx={{ bgcolor: "#e0f2fe", color: "#0284c7", fontWeight: 700, fontSize: "0.7rem" }} />
                      </Box>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" mb={1} sx={{ wordBreak: "break-word" }}>
                        {train?.trainName || "Train Details"} {train?.trainNo ? `| ${train.trainNo}` : ""}
                      </Typography>
                      <Grid container spacing={1} alignItems="center" mt={1}>
                        <Grid item xs={5}>
                          <Typography variant="caption" color="#64748b" display="flex" alignItems="flex-start" gap={0.5} mb={0.5} sx={{ wordBreak: "break-word" }}>
                            <LocationOn sx={{ fontSize: 14, mt: 0.2, flexShrink: 0 }} /> {train?.depFrom || "Origin"}
                          </Typography>
                          {train?.depDate && <Typography variant="caption" color="#94a3b8" display="block">{formatDate(train.depDate)}</Typography>}
                          <Typography variant="body2" fontWeight="700" color="#334155">{train?.depTime || "TBD"}</Typography>
                        </Grid>
                        <Grid item xs={2} textAlign="center"><Divider sx={{ borderColor: "#bae6fd", borderBottomWidth: 2 }} /></Grid>
                        <Grid item xs={5} textAlign="right">
                          <Typography variant="caption" color="#64748b" display="flex" alignItems="flex-start" justifyContent="flex-end" gap={0.5} mb={0.5} sx={{ wordBreak: "break-word" }}>
                            <LocationOn sx={{ fontSize: 14, mt: 0.2, flexShrink: 0 }} /> {train?.arrAt || "Destination"}
                          </Typography>
                          {train?.arrDate && <Typography variant="caption" color="#94a3b8" display="block" align="right">{formatDate(train.arrDate)}</Typography>}
                          <Typography variant="body2" fontWeight="700" color="#334155" align="right">{train?.arrTime || "TBD"}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "10%" }} />
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "45%" }} />
                </Box>
              );
            })}

            {/* Buses Mapping */}
            {buses.map((bus, i) => {
              const isEven = (flights.length + trains.length + i) % 2 === 0;
              return (
                <Box key={`bus-${i}`} sx={{ display: "flex", flexDirection: { xs: "column", md: isEven ? "row" : "row-reverse" }, alignItems: "center", position: "relative", mb: { xs: 4, md: 6 }, pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <Box sx={{ display: { xs: "none", md: "flex" }, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 36, height: 36, bgcolor: "#10b981", borderRadius: "50%", color: "#fff", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 0 0 6px #fff" }}>
                    <DirectionsBus fontSize="small" />
                  </Box>
                  <Box sx={{ width: { xs: "100%", md: "45%" }, mb: { xs: 2, md: 0 } }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", borderBottom: "4px solid #10b981", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 800, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <DirectionsBus sx={{ fontSize: 16 }} /> BUS JOURNEY
                        </Typography>
                        <Chip label={bus?.classType || "Seater"} size="small" sx={{ bgcolor: "#d1fae5", color: "#059669", fontWeight: 700, fontSize: "0.7rem" }} />
                      </Box>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" mb={1} sx={{ wordBreak: "break-word" }}>
                        {bus?.busName || "Bus Details"}
                      </Typography>
                      <Grid container spacing={1} alignItems="center" mt={1}>
                        <Grid item xs={5}>
                          <Typography variant="caption" color="#64748b" display="flex" alignItems="flex-start" gap={0.5} mb={0.5} sx={{ wordBreak: "break-word" }}>
                            <LocationOn sx={{ fontSize: 14, mt: 0.2, flexShrink: 0 }} /> {bus?.pickup || "Pickup"}
                          </Typography>
                          {bus?.depDate && <Typography variant="caption" color="#94a3b8" display="block">{formatDate(bus.depDate)}</Typography>}
                          <Typography variant="body2" fontWeight="700" color="#334155">{bus?.depTime || "TBD"}</Typography>
                        </Grid>
                        <Grid item xs={2} textAlign="center"><Divider sx={{ borderColor: "#6ee7b7", borderBottomWidth: 2 }} /></Grid>
                        <Grid item xs={5} textAlign="right">
                          <Typography variant="caption" color="#64748b" display="flex" alignItems="flex-start" justifyContent="flex-end" gap={0.5} mb={0.5} sx={{ wordBreak: "break-word" }}>
                            <LocationOn sx={{ fontSize: 14, mt: 0.2, flexShrink: 0 }} /> {bus?.dropoff || "Drop-off"}
                          </Typography>
                          {bus?.arrDate && <Typography variant="caption" color="#94a3b8" display="block" align="right">{formatDate(bus.arrDate)}</Typography>}
                          <Typography variant="body2" fontWeight="700" color="#334155" align="right">{bus?.arrTime || "TBD"}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "10%" }} />
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "45%" }} />
                </Box>
              );
            })}

            {/* Ground Transport Mapping */}
            {grounds.map((ground, i) => {
              const isEven = (flights.length + trains.length + buses.length + i) % 2 === 0;
              return (
                <Box key={`ground-${i}`} sx={{ display: "flex", flexDirection: { xs: "column", md: isEven ? "row" : "row-reverse" }, alignItems: "center", position: "relative", mb: { xs: 4, md: 6 }, pageBreakInside: "avoid", breakInside: "avoid" }}>
                  <Box sx={{ display: { xs: "none", md: "flex" }, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 36, height: 36, bgcolor: "#8b5cf6", borderRadius: "50%", color: "#fff", alignItems: "center", justifyContent: "center", zIndex: 2, boxShadow: "0 0 0 6px #fff" }}>
                    <LocalTaxi fontSize="small" />
                  </Box>
                  <Box sx={{ width: { xs: "100%", md: "45%" }, mb: { xs: 2, md: 0 } }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", borderBottom: "4px solid #8b5cf6", bgcolor: "#fff", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="caption" sx={{ color: "#8b5cf6", fontWeight: 800, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <LocalTaxi sx={{ fontSize: 16 }} /> GROUND TRANSFER
                        </Typography>
                        <Chip label={ground?.vehicleType || "Sedan"} size="small" sx={{ bgcolor: "#ede9fe", color: "#6d28d9", fontWeight: 700, fontSize: "0.7rem" }} />
                      </Box>
                      <Typography variant="h6" fontWeight="800" color="#0f172a" mb={1} sx={{ wordBreak: "break-word" }}>
                        Private Transfer
                      </Typography>
                      <Grid container spacing={1} alignItems="center" mt={1}>
                        <Grid item xs={5}>
                          <Typography variant="caption" color="#64748b" display="flex" alignItems="flex-start" gap={0.5} mb={0.5} sx={{ wordBreak: "break-word" }}>
                            <LocationOn sx={{ fontSize: 14, mt: 0.2, flexShrink: 0 }} /> {ground?.pickup || "Pickup"}
                          </Typography>
                          {ground?.depDate && <Typography variant="caption" color="#94a3b8" display="block">{formatDate(ground.depDate)}</Typography>}
                          <Typography variant="body2" fontWeight="700" color="#334155">{ground?.depTime || "TBD"}</Typography>
                        </Grid>
                        <Grid item xs={2} textAlign="center"><Divider sx={{ borderColor: "#c4b5fd", borderBottomWidth: 2 }} /></Grid>
                        <Grid item xs={5} textAlign="right">
                          <Typography variant="caption" color="#64748b" display="flex" alignItems="flex-start" justifyContent="flex-end" gap={0.5} mb={0.5} sx={{ wordBreak: "break-word" }}>
                            <LocationOn sx={{ fontSize: 14, mt: 0.2, flexShrink: 0 }} /> {ground?.dropoff || "Drop-off"}
                          </Typography>
                          {ground?.arrDate && <Typography variant="caption" color="#94a3b8" display="block" align="right">{formatDate(ground.arrDate)}</Typography>}
                          <Typography variant="body2" fontWeight="700" color="#334155" align="right">{ground?.arrTime || "TBD"}</Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "10%" }} />
                  <Box sx={{ display: { xs: "none", md: "block" }, width: "45%" }} />
                </Box>
              );
            })}
          </Box>
        </Container>
      )}

      {/* DETAILED ITINERARY */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1} textAlign="center">
          Detailed Itinerary
        </Typography>
        <Typography variant="body2" color="#64748b" mb={5} textAlign="center">
          Every moment carefully curated for your perfect journey
        </Typography>

        <Box sx={{ position: "relative", pl: { xs: 8, sm: 10 } }}>
          <Box sx={{ display: { xs: "none", sm: "block" }, position: "absolute", top: 20, bottom: 0, left: 45, width: 2, bgcolor: "#e2e8f0", zIndex: 0 }} />

          {days.map((day, i) => {
            const color = DAY_COLORS[i % DAY_COLORS.length];
            const safeMeals = Array.isArray(day?.meals) ? day.meals : [];
            const mealString = safeMeals.length > 0 && !safeMeals.includes("No Meals") ? safeMeals.join(" & ") : "No Meals";
            const displayDate = getDayDate(clientData?.startDate, i);

            const resolveImgUrl = (imgObj) => {
              if (!imgObj) return null;
              return typeof imgObj === "string" ? imgObj : imgObj?.url || imgObj?.preview || imgObj?.src || imgObj?.data_url || imgObj?.dataURL;
            };

            const dayImages = Array.isArray(day?.images) ? day.images : (day?.image ? [day.image] : []);
            const resolvedImages = dayImages.map(resolveImgUrl).filter(Boolean);
            
            const displayImages = resolvedImages.length > 0 ? resolvedImages : [i % 2 === 0 ? DAY1_IMG : DAY2_IMG];

            const mainImg = displayImages[0];
            const subImages = displayImages.slice(1);
            const isMainBase64 = mainImg?.startsWith("data:image");

            return (
              <Box key={i} sx={{ display: "flex", flexDirection: "row", mb: 4, position: "relative", zIndex: 1, pageBreakInside: "avoid", breakInside: "avoid" }}>
                
                <Box sx={{ width: { xs: 80, md: 100 }, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Paper elevation={2} sx={{ width: 70, height: 70, bgcolor: color, borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff", border: "3px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", zIndex: 2, flexShrink: 0 }}>
                    <Typography variant="caption" sx={{ lineHeight: 1, fontWeight: 800, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: 0.5 }}>Day</Typography>
                    <Typography variant="h5" sx={{ lineHeight: 1, fontWeight: 900, my: 0.3 }}>{i + 1}</Typography>
                    {displayDate && <Typography variant="caption" sx={{ fontSize: "0.45rem", lineHeight: 1, fontWeight: 600 }}>{displayDate}</Typography>}
                  </Paper>
                  {i !== days.length - 1 && <Box sx={{ width: 2, flexGrow: 1, bgcolor: `${color}60`, mt: -1, mb: -4, zIndex: 0 }} />}
                </Box>

                <Paper elevation={0} sx={{ flexGrow: 1, display: "flex", flexDirection: { xs: "column", md: "row" }, borderRadius: 3, border: `1.5px solid ${color}`, overflow: "hidden", bgcolor: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  
                  <Box sx={{ width: { xs: "100%", md: 320 }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 1, p: 1.5, bgcolor: "#f8fafc", borderRight: { md: "1px solid #e2e8f0" } }}>
                    
                    <Box sx={{ width: "100%", height: subImages.length > 0 ? 160 : 220, position: "relative", borderRadius: 2, overflow: "hidden" }}>
                      <img 
                        src={mainImg} 
                        alt={day?.title || `Day ${i + 1}`} 
                        {...(!isMainBase64 && { crossOrigin: "anonymous" })}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                      />
                      <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(255,255,255,0.9)", px: 1.5, py: 0.5, borderRadius: 1.5, fontWeight: 800, color: "#0ea5e9", fontSize: "0.75rem", backdropFilter: "blur(4px)" }}>
                        DAY {i + 1}
                      </Box>
                    </Box>

                    {subImages.length > 0 && (
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: 1 }}>
                        {subImages.map((imgUrl, idx) => {
                          const isSubBase64 = imgUrl?.startsWith("data:image");
                          return (
                            <Box key={idx} sx={{ height: 90, borderRadius: 2, overflow: "hidden" }}>
                              <img 
                                src={imgUrl} 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                {...(!isSubBase64 && { crossOrigin: "anonymous" })}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    )}

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ bgcolor: "#e2e8f0", p: 0.5, borderRadius: 1, display: "flex" }}>
                          <DirectionsBus sx={{ fontSize: 16, color: "#475569" }} />
                        </Box>
                        <Typography variant="caption" color="#475569" fontWeight="600">
                          {day?.transport && day.transport !== "No Transport" ? day.transport : "No Transport"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ bgcolor: "#e2e8f0", p: 0.5, borderRadius: 1, display: "flex" }}>
                          <Restaurant sx={{ fontSize: 16, color: "#475569" }} />
                        </Box>
                        <Typography variant="caption" color="#475569" fontWeight="600">
                          {mealString}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" fontWeight="800" color="#0f172a" sx={{ wordBreak: "break-word", whiteSpace: "normal", mb: 1.5 }}>
                      {day?.title || `Day ${i + 1} Plan`}
                    </Typography>

                    {day?.description && (
                      <Typography variant="body2" color="#475569" sx={{ whiteSpace: "pre-line", wordBreak: "break-word", mb: 2, lineHeight: 1.6 }}>
                        {day.description}
                      </Typography>
                    )}

                    {day?.activities && (
                      <Typography variant="body2" color="#475569" sx={{ whiteSpace: "pre-line", wordBreak: "break-word", lineHeight: 1.6 }}>
                        {day.activities}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Container>

      {/* --- HOTELS --- */}
      {hotels.length > 0 && (
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1} textAlign="center">
            Hotel Accommodations
          </Typography>
          <Typography variant="body2" color="#64748b" mb={4} textAlign="center">
            Handpicked luxury hotels for your comfort
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {hotels.map((hotel, i) => {
              const rawAmenities = hotel?.amenities || [];
              const defaultAmenities = ["Free WiFi", "Spa & Pool", "Breakfast", "Fitness"];
              const safeAmenities = rawAmenities.length > 0 ? rawAmenities : defaultAmenities;
              const finalHotelName = hotel?.hotelName || hotel?.name || hotel?.hotel_name || "Selected Hotel";

              return (
                <Grid item key={i} sx={{ display: "flex", justifyContent: "center" }}>
                  <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", height: "auto", width: { xs: "100%", sm: "389px" }, mx: "auto", pageBreakInside: "avoid", breakInside: "avoid" }}>
                    <Box sx={{ height: 160, position: "relative", width: "100%", flexShrink: 0 }}>
                      <img src={hotel?.image || HOTEL_IMG} alt={finalHotelName} crossOrigin="anonymous" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <Chip label={hotel?.nights ? `${hotel.nights} Nights` : hotel?.hotelPref || "Hotel"} size="small" sx={{ position: "absolute", top: 12, right: 12, bgcolor: "#fff", fontWeight: 700 }} />
                    </Box>
                    <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" sx={{ wordBreak: "break-word", lineHeight: 1.2 }}>{finalHotelName}</Typography>
                        <Box sx={{ display: "flex", color: "#f97316", mt: 0.2, flexShrink: 0 }}>
                          {[...Array(parseInt(hotel?.stars) || 5)].map((_, idx) => <Star key={idx} sx={{ fontSize: 12 }} />)}
                        </Box>
                      </Box>
                      <Typography variant="caption" color="#64748b" display="flex" alignItems="flex-start" gap={0.5} mb={3} sx={{ wordBreak: "break-word" }}>
                        {hotel?.location || rawDestination}
                      </Typography>

                      {safeAmenities.length > 0 && (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          {safeAmenities.slice(0, 4).map((am, idx) => {
                            let Icon = CheckCircle;
                            const text = am.toLowerCase();
                            if (text.includes("wifi")) Icon = WifiOutlined;
                            else if (text.includes("breakfast") || text.includes("meal") || text.includes("coffee")) Icon = LocalCafeOutlined;
                            else if (text.includes("spa") || text.includes("pool") || text.includes("view") || text.includes("massage")) Icon = SpaOutlined;
                            else if (text.includes("fit") || text.includes("gym")) Icon = FitnessCenterOutlined;

                            return (
                              <Grid item xs={6} key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Icon sx={{ fontSize: 16, color: "#94a3b8", flexShrink: 0 }} />
                                <Typography variant="caption" color="#475569" fontWeight="600" sx={{ wordBreak: "break-word" }}>{am}</Typography>
                              </Grid>
                            );
                          })}
                        </Grid>
                      )}

                      <Box sx={{ mt: "auto" }}>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                          <Typography variant="caption" fontWeight="800" color="#0f172a" sx={{ fontSize: "0.7rem", wordBreak: "break-word" }}>{pax}</Typography>
                          <Typography variant="caption" fontWeight="800" color="#3b82f6" sx={{ fontSize: "0.7rem", textAlign: "right" }}>{hotel?.roomCat || "Deluxe Room"}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" color="#94a3b8" sx={{ fontSize: "0.6rem" }}>Check-in: {hotel?.checkInTime || "3:00 PM"}</Typography>
                          <Typography variant="caption" color="#94a3b8" sx={{ fontSize: "0.6rem" }}>Check-out: {hotel?.checkOutTime || "12:00 PM"}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}

      {/* INCLUSIONS & EXCLUSIONS */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="h4" fontWeight="900" color="#0f172a" mb={1}>What's Included</Typography>
          <Typography variant="body2" color="#64748b">Transparent pricing with no hidden fees</Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", display: "flex", flexDirection: "column", height: "auto", width: { xs: "100%", sm: "389px" }, mx: "auto", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <Box sx={{ bgcolor: "#10b981", color: "#fff", p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ bgcolor: "rgba(255,255,255,0.25)", p: 1, borderRadius: 2, display: "flex" }}><CheckCircle fontSize="small" /></Box>
                <Box>
                  <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>Included</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Everything you need for a perfect trip</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 4, bgcolor: "#fff", flexGrow: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                {displayInclusions.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, width: "100%" }}>
                    <CheckCircle sx={{ fontSize: 18, color: "#10b981", mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" color="#475569" sx={{ flex: 1, wordBreak: "break-word" }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          <Grid item sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", display: "flex", flexDirection: "column", height: "auto", width: { xs: "100%", sm: "389px" }, mx: "auto", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <Box sx={{ bgcolor: "#ef4444", color: "#fff", p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ bgcolor: "rgba(255,255,255,0.25)", p: 1, borderRadius: 2, display: "flex" }}><Cancel fontSize="small" /></Box>
                <Box>
                  <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>Not Included</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>Additional costs to consider</Typography>
                </Box>
              </Box>
              <Box sx={{ p: 4, bgcolor: "#fff", flexGrow: 1, display: "flex", flexDirection: "column", gap: 2.5 }}>
                {displayExclusions.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, width: "100%" }}>
                    <Cancel sx={{ fontSize: 18, color: "#ef4444", mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="body2" color="#475569" sx={{ flex: 1, wordBreak: "break-word" }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* VISA DETAILS & BANK DETAILS */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
          <Grid item sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#1e3a8a", color: "#fff", height: "auto", width: { xs: "100%", sm: "389px" }, mx: "auto", display: "flex", flexDirection: "column", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#fff", flexShrink: 0 }}><AccountBalance /></Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">Bank Account Details</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>For balance payment</Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 0.5 }}>Bank Name</Typography>
                    <Typography variant="body2" fontWeight="600">{termsData?.bankDetails?.bankName || "Chase Bank N.A."}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 0.5 }}>Account Holder</Typography>
                    <Typography variant="body2" fontWeight="600">{termsData?.bankDetails?.accountName || "Wanderlust Elite Travel"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 0.5 }}>Account Number</Typography>
                    <Typography variant="body2" fontWeight="600">{termsData?.bankDetails?.accountNumber || "**** **** **5847"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 0.5 }}>Account Type</Typography>
                    <Typography variant="body2" fontWeight="600">{termsData?.bankDetails?.accountType || "Business Checking"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 0.5 }}>Branch Name</Typography>
                    <Typography variant="body2" fontWeight="600">{termsData?.bankDetails?.branchName || "Main Branch"}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 1.5, borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 0.5 }}>Routing / SWIFT</Typography>
                    <Typography variant="body2" fontWeight="600">{termsData?.bankDetails?.routing || termsData?.bankDetails?.ifscCode || "021000021"}</Typography>
                  </Box>
                </Grid>
              </Grid>
              {termsData?.bankDetails?.bankNotes && (
                <Box sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.05)", p: 2, borderRadius: 2, flexGrow: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: "block", mb: 0.5 }}>Payment Instructions</Typography>
                  <Typography variant="body2">{termsData.bankDetails.bankNotes}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item sx={{ display: "flex", justifyContent: "center" }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#1e3a8a", color: "#fff", height: "auto", width: { xs: "100%", sm: "389px" }, mx: "auto", display: "flex", flexDirection: "column", pageBreakInside: "avoid", breakInside: "avoid" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", color: "#fff", flexShrink: 0 }}><Security /></Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="700">Visa Requirements</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>Essential travel documents</Typography>
                </Box>
              </Box>
              {safeVisas.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
                  {safeVisas.map((visa, i) => (
                    <Box key={i} sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, gap: 1 }}>
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                          <Public sx={{ fontSize: 18, opacity: 0.8, mt: 0.2, flexShrink: 0 }} />
                          <Typography variant="body2" fontWeight="700">{visa?.visaCountry || visa?.country || "Visa Required"}</Typography>
                        </Box>
                        <Chip label="Approved" size="small" sx={{ bgcolor: "rgba(16, 185, 129, 0.2)", color: "#34d399", height: 22, fontSize: "0.65rem", fontWeight: 700, border: "1px solid rgba(16, 185, 129, 0.5)", flexShrink: 0 }} />
                      </Box>
                      <Box sx={{ pl: 3.5 }}>
                        <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 0.5 }}>{visa?.visaType || "Tourist Visa"} • {visa?.entryType || "Single Entry"}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8, display: "block" }}>Duration: {visa?.duration || visa?.visaDuration || "TBD"}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ bgcolor: "rgba(255,255,255,0.05)", p: 2, borderRadius: 2, flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>No specific visa requirements added.</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* TERMS & CONDITIONS */}
      <Container maxWidth="md" sx={{ mb: 10 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid #e2e8f0", bgcolor: "#f8fafc", pageBreakInside: "avoid", breakInside: "avoid" }}>
          <Typography variant="h6" fontWeight="800" color="#0f172a" mb={3} display="flex" alignItems="center" gap={1}><Description color="primary" /> Terms & Conditions</Typography>
          {renderTerms()}
        </Paper>
      </Container>

      {/* FOOTER SECTION */}
      <Box sx={{ bgcolor: "#f8fafc", pt: 8, pb: 4, mt: 8, borderTop: "1px solid #e2e8f0", pageBreakInside: "avoid", breakInside: "avoid" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography variant="h5" fontWeight="900" color="#0f172a" mb={1}>Your Luxury Travel Consultant</Typography>
            <Typography variant="body2" color="#64748b">We're here to make your dream vacation a reality</Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch" mb={4}>
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Paper elevation={10} sx={{ p: 4, borderRadius: 4, bgcolor: "#1e3a8a", color: "#fff", height: "auto", width: { xs: "100%", sm: "389px" }, mx: "auto", display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" fontWeight="800" mb={0.5}>Connect With Your Travel Expert</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 4 }}>Personalized service for your dream vacation</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: "#eab308", color: "#0f172a", fontWeight: 800, fontSize: "1.2rem", flexShrink: 0 }}>{agentInitials}</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="800">{agentNameDisplay}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, display: "block" }}>Your Travel Consultant</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 1.5, borderRadius: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Phone fontSize="small" sx={{ opacity: 0.8, flexShrink: 0 }} />
                    <Typography variant="body2" fontWeight="600">{userDetails?.["custom:tmp_pr_contact"] || ""}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 1.5, borderRadius: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Email fontSize="small" sx={{ opacity: 0.8, flexShrink: 0 }} />
                    <Typography variant="body2" fontWeight="600">{userDetails?.["email"] || ""}</Typography>
                  </Box>
                  <Button variant="contained" startIcon={<WhatsApp />} sx={{ bgcolor: "#10b981", color: "#fff", py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: "none", mt: 1, "&:hover": { bgcolor: "#059669" } }}>
                    Chat on WhatsApp
                  </Button>
                </Box>
              </Paper>
            </Grid>

            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0", bgcolor: "#fff", height: "auto", width: { xs: "100%", sm: "389px" }, mx: "auto", display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={3}>Why Choose Us</Typography>
                {userDetails?.["custom:branding"] &&
                  JSON.parse(userDetails["custom:branding"] ? userDetails["custom:branding"] : "[]").map((value, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9", width: 40, height: 40 }}><VerifiedUserOutlined fontSize="small" /></Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="800" color="#0f172a">{value.title}</Typography>
                        <Typography variant="caption" color="#64748b">{value.subtitle}</Typography>
                      </Box>
                    </Box>
                  ))}
                <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={2} mt={3}>Office Address</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9", width: 40, height: 40, flexShrink: 0 }}><LocationOnOutlined fontSize="small" /></Avatar>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="caption" color="#64748b">{userDetails?.["custom:office_address"] || ""}</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}