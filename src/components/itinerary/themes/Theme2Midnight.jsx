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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import {
  FlightTakeoff,
  Hotel,
  LocationOn,
  CalendarMonth,
  CheckCircle,
  Cancel,
  ExpandMore,
  Phone,
  Email,
  WhatsApp,
  Description,
  FileDownload,
  AccountBalance,
  Security,
  Star,
  VerifiedUserOutlined,
  LocationOnOutlined,
  AccessTime,
  PeopleOutline,
  PaidOutlined,
  Flight,
  ShieldOutlined,
  LightbulbOutlined,
  Check,
  DirectionsCar,
  Restaurant,
  Wifi,
  Pool,
  NightsStay,
  Close,
  Public,
  Train, // 🚨 Added Train Icon
  DirectionsBus // 🚨 Added Bus Icon
} from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useBlobDownload } from "../../../services/backendApi";
import { useItinerary } from "../../../context/ItineraryContext";

// --- Theme Constants ---
const HERO_BG = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000";
const DAY1_IMG = "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800";
const DAY2_IMG = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800";
const HOTEL_IMG = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800";

const MIDNIGHT_BLUE = "#0f172a";
const BRAND_BLUE = "#1e3a8a";
const TEXT_MUTED = "#64748b";

// 🚨 CRASH PROTECTOR: Safely handles any rogue objects sent by the backend 🚨
const safeRender = (val, fallback = "") => {
  if (val === null || val === undefined || val === "") return fallback;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (Array.isArray(val)) return val.map((v) => safeRender(v, fallback)).join(", ");
  if (typeof val === "object") {
    try {
      const keysToCheck = ['name', 'title', 'description', 'label', 'location', 'duration', 'text'];
      for (const key of keysToCheck) {
        if (val[key] !== undefined && val[key] !== null && typeof val[key] !== "object") {
          return String(val[key]);
        }
      }
      return JSON.stringify(val);
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
};

const formatCamelCase = (text) => {
  if (!text) return "";
  const result = safeRender(text).replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const getOrdinalNum = (n) => {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "");
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

export default function Theme2Midnight() {
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
    visaData = [],
    bankDetails = [], 
    themeConfig = {}, 
  } = itineraryContext;

  const { userDetails: ud = {}, api } = useApi() || {};
  const [userDetails, setUserDetails] = useState(ud);
  const { getBlob } = useBlobDownload() || {};

  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState(HERO_BG);

  // --- LOGO & COVER INTEGRATION ---
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
          setCoverUrl(resolvedUrl && resolvedUrl.length > 0 ? resolvedUrl : HERO_BG);
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

  // --- 1. CLIENT & TRIP DATA ---
  const rawDestination = clientData?.destination || "Destination";
  const shortDestination = safeRender(rawDestination).split(",")[0];
  const title = clientData?.trip_title && clientData.trip_title.trim() !== "" ? clientData.trip_title : `Best of ${shortDestination}`;
  const fullName = `${clientData?.title || ""} ${clientData?.name || "Valued Guest"}`.trim();

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString === "object") return null;
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const datesLabel = clientData?.startDate && clientData?.endDate ? `${formatDate(clientData.startDate)} - ${formatDate(clientData.endDate)}` : "Dates to be confirmed";
  const durationStr = `${clientData?.days || 1} Days, ${Math.max(1, (clientData?.days || 10) - 1)} Nights`;

  const adults = parseInt(clientData?.adults) || 2;
  const childrenCount = parseInt(clientData?.children) || 0;
  const infantsCount = parseInt(clientData?.infants) || 0;
  let paxSummary = `${adults} Adults`;
  if (childrenCount > 0) paxSummary += `, ${childrenCount} Children`;
  if (infantsCount > 0) paxSummary += `, ${infantsCount} Infants`;
  const totalGuests = adults + childrenCount + infantsCount;

  const agentNameDisplay = userDetails?.["custom:full_name"] || "Travel Agent";
  const agentInitials = safeRender(agentNameDisplay).split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  const companyName = userDetails?.["custom:agency_name"] || "Travel Agency";

  // --- 2. DAY PLANNER DATA ---
  const rawDaysArray = (activeDays && activeDays.length > 0) ? activeDays : (dayPlannerData && dayPlannerData.length > 0) ? dayPlannerData : [];
  const isFormEmpty = rawDaysArray.length === 0 || (rawDaysArray.length === 1 && !rawDaysArray[0]?.title);
  const days = !isFormEmpty ? rawDaysArray : [{ title: `Arrival in ${shortDestination}`, description: "Welcome to your dream vacation!", meals: ["Breakfast"], transport: "Private Transfer" }];

  // --- 3. STAY DATA ---
  const hotels = stayData?.hotels?.length > 0 ? stayData.hotels : [];

  // --- 4. TRANSPORT DATA (ALL TYPES ADDED) ---
  const flights = transportData?.flights || (transportData?.airline ? [transportData] : []);
  const trains = transportData?.trains || [];
  const buses = transportData?.buses || [];
  const grounds = transportData?.grounds || [];
  const hasTransport = flights.length > 0 || trains.length > 0 || buses.length > 0 || grounds.length > 0;

  // --- 5. INCLUSIONS & EXCLUSIONS ---
  let displayInclusions = [];
  let displayExclusions = [];

  if (Array.isArray(inclExclData?.inclusions)) {
    displayInclusions = inclExclData.inclusions;
  } else {
    const rawInc = inclExclData?.inclusions || {};
    displayInclusions = Object.keys(rawInc).filter((k) => rawInc[k]).map(formatCamelCase);
  }

  if (Array.isArray(inclExclData?.exclusions)) {
    displayExclusions = inclExclData.exclusions;
  } else {
    const rawExc = inclExclData?.exclusions || {};
    displayExclusions = Object.keys(rawExc).filter((k) => rawExc[k]).map(formatCamelCase);
  }

  if (displayInclusions.length === 0) displayInclusions = ["Accommodation as per itinerary", "Daily Breakfast", "Airport Transfers", "All Local Taxes"];
  if (displayExclusions.length === 0) displayExclusions = ["International Flights", "Visa Fees", "Personal Expenses", "Travel Insurance"];

  // --- 6. VISA & BANK DATA ARRAYS ---
  const safeVisas = Array.isArray(visaData) ? visaData : [];
  
  const displayBanks = Array.isArray(bankDetails) && bankDetails.length > 0 
    ? bankDetails 
    : termsData?.bankDetails 
      ? [termsData.bankDetails] 
      : [{
          bankName: "Chase Bank",
          accountName: "Travel Agency",
          accountNumber: "****5847",
          ifscCode: "021000021"
        }];

  // --- 7. PRICING CALCULATIONS ---
  const formatCurrency = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  const priceItems = priceData?.items || [];
  const subtotal = priceItems.reduce((sum, item) => sum + (Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0), 0);
  const gstAmount = subtotal * ((Number(priceData?.taxes?.gst) || 0) / 100);
  const serviceTaxAmount = subtotal * ((Number(priceData?.taxes?.serviceTax) || 0) / 100);
  const totalTaxes = gstAmount + serviceTaxAmount;
  const discountValue = Number(priceData?.discount?.value) || 0;
  const discountAmount = priceData?.discount?.type === "Percentage (%)" ? subtotal * (discountValue / 100) : discountValue;
  const originalTotal = subtotal + totalTaxes; 
  const grandTotal = subtotal + totalTaxes - discountAmount;
  const hasPriceData = grandTotal > 0;
  const finalTotalDisplay = hasPriceData ? formatCurrency(grandTotal) : "TBD";

  // --- 8. SMART TERMS RENDERER ---
  const renderTerms = () => {
    if (!termsData) return <Typography variant="body2" color="#475569">Standard travel terms and conditions apply. A 30% deposit is required to confirm your booking.</Typography>;
    if (typeof termsData === "string") return <Typography variant="body2" color="#475569" sx={{ whiteSpace: "pre-line" }}>{safeRender(termsData)}</Typography>;

    const allSections = [];
    if (termsData.terms?.length > 0) allSections.push({ title: "General Terms", items: termsData.terms });
    if (termsData.policies?.length > 0) allSections.push({ title: "Cancellation Policy", items: termsData.policies });
    if (termsData.payments?.length > 0) allSections.push({ title: "Payment Schedule", items: termsData.payments });
    if (termsData.protections?.length > 0) allSections.push({ title: "Travel Protection", items: termsData.protections });

    if (allSections.length === 0) return <Typography variant="body2" color="#475569">Standard travel terms apply.</Typography>;

    return (
      <Grid container spacing={4}>
        {allSections.map((section, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Typography variant="subtitle2" fontWeight="800" color="#0f172a" mb={1}>{safeRender(section.title)}</Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, color: "#475569", fontSize: "0.875rem" }}>
              {(section.items || []).map((item, i) => (<li key={i} style={{ marginBottom: "6px", whiteSpace: "pre-line" }}>{safeRender(item)}</li>))}
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box id="itinerary-pdf-content" sx={{ bgcolor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", "& *": { fontFamily: "'Inter', sans-serif !important" } }}>
      
      {/* 1. EXACT HERO SECTION FROM SCREENSHOT */}
      <Box sx={{ 
        position: 'relative', height: 500, 
        backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.9) 100%)' },
        pageBreakInside: "avoid", breakInside: "avoid"
      }}>
        {logoUrl ? (
           <Box sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10,  p: 1,  }}>
              <img height={"40px"} width={"auto"} src={logoUrl} alt="Agency Logo" style={{ display: 'block' }} />
           </Box>
        ) : (
           <Box sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10, bgcolor: '#fff', px: 2, py: 1, borderRadius: 1 }}>
              <Typography variant="button" fontWeight="800" color={MIDNIGHT_BLUE}>LOGO</Typography>
           </Box>
        )}
        
        <Box sx={{ position: 'relative', zIndex: 1, color: '#fff', px: 3, mt: 4 }}>
          <Typography variant="overline" sx={{ letterSpacing: 3, color: '#fbbf24', fontWeight: 700, display: 'block', mb: 2 }}>
            PREPARED FOR {safeRender(fullName).toUpperCase()}
          </Typography>
          <Typography variant="h2" fontWeight="800" mb={1} sx={{ fontFamily: "'Playfair Display', serif !important" }}>
            {safeRender(title)}
          </Typography>
          <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 3, fontWeight: 500 }}>
            {safeRender(clientData?.days, 10)} Days of Paradise
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, opacity: 0.9 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth fontSize="small" />
              <Typography variant="body2" fontWeight="600">{safeRender(datesLabel)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime fontSize="small" />
              <Typography variant="body2" fontWeight="600">{safeRender(durationStr)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 10, mb: 6 }}>
        
        {/* 2. EXACT TRIP OVERVIEW WHITE BAR */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: '#fff', mb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="800" color={BRAND_BLUE} sx={{ width: '100%', mb: 3 }}>Trip Overview</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={2.4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar variant="rounded" sx={{ bgcolor: '#0f766e', color: '#fff', width: 40, height: 40, borderRadius: 2 }}><CalendarMonth fontSize="small" /></Avatar>
                <Box>
                  <Typography variant="caption" color={TEXT_MUTED} display="block">Travel Dates</Typography>
                  <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE} sx={{ lineHeight: 1.2 }}>
                    {safeRender(datesLabel)}
                  </Typography>
                  <Typography variant="caption" color={TEXT_MUTED}>{clientData?.startDate ? new Date(clientData.startDate).getFullYear() : ""}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={2.4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar variant="rounded" sx={{ bgcolor: '#0f766e', color: '#fff', width: 40, height: 40, borderRadius: 2 }}><AccessTime fontSize="small" /></Avatar>
                <Box>
                  <Typography variant="caption" color={TEXT_MUTED} display="block">Duration</Typography>
                  <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE} sx={{ lineHeight: 1.2 }}>{safeRender(clientData.days, 10)} Days</Typography>
                  <Typography variant="caption" color={TEXT_MUTED}>{Math.max(1, (clientData.days || 10) - 1)} Nights</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={2.4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar variant="rounded" sx={{ bgcolor: '#0f766e', color: '#fff', width: 40, height: 40, borderRadius: 2 }}><PeopleOutline fontSize="small" /></Avatar>
                <Box>
                  <Typography variant="caption" color={TEXT_MUTED} display="block">Travelers</Typography>
                  <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE} sx={{ lineHeight: 1.2 }}>{safeRender(adults)} Adults</Typography>
                  <Typography variant="caption" color={TEXT_MUTED}>{safeRender(childrenCount)} Children</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar variant="rounded" sx={{ bgcolor: '#0f766e', color: '#fff', width: 40, height: 40, borderRadius: 2 }}><LocationOn fontSize="small" /></Avatar>
                <Box>
                  <Typography variant="caption" color={TEXT_MUTED} display="block">Destination</Typography>
                  <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE} sx={{ lineHeight: 1.2 }}>{safeRender(rawDestination)}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar variant="rounded" sx={{ bgcolor: '#0f766e', color: '#fff', width: 40, height: 40, borderRadius: 2 }}><PaidOutlined fontSize="small" /></Avatar>
                <Box>
                  <Typography variant="caption" color={TEXT_MUTED} display="block">Total Cost</Typography>
                  <Typography variant="body2" fontWeight="900" color={MIDNIGHT_BLUE} sx={{ lineHeight: 1.2, fontSize: '1.1rem' }}>{finalTotalDisplay}</Typography>
                  {discountAmount > 0 && hasPriceData && (
                    <Typography variant="caption" color={TEXT_MUTED} sx={{ textDecoration: 'line-through' }}>{formatCurrency(originalTotal)}</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* 3. EXACT COST BREAKDOWN DARK BLUE BOX */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#202c4b', color: '#fff', mb: 6 }}>
          <Typography variant="subtitle1" fontWeight="800" mb={3} sx={{ opacity: 0.9 }}>Cost Breakdown</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {priceItems.map((item, idx) => {
              const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
              if (itemTotal === 0 && !item.description) return null; 
              return (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {safeRender(item.description) || safeRender(item.category) || "Item"} {Number(item.quantity) > 1 ? `(x${item.quantity})` : ""}
                  </Typography>
                  <Typography variant="body2" fontWeight="700">
                    {formatCurrency(itemTotal)}
                  </Typography>
                </Box>
              );
            })}
            
            {totalTaxes > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Taxes & Fees {priceData?.taxes?.gst ? `(GST ${priceData.taxes.gst}%)` : ""}</Typography>
                <Typography variant="body2" fontWeight="700">{formatCurrency(totalTaxes)}</Typography>
              </Box>
            )}

            {discountAmount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                <Typography variant="body2" sx={{ color: '#34d399' }}>Discount</Typography>
                <Typography variant="body2" fontWeight="700" sx={{ color: '#34d399' }}>-{formatCurrency(discountAmount)}</Typography>
              </Box>
            )}

            {!hasPriceData && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', pb: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Base Package</Typography>
                <Typography variant="body2" fontWeight="700">TBD</Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* 4. ALL TRANSPORT DETAILS LAYOUT (Flights, Trains, Buses, Grounds) */}
        {hasTransport && (
          <Box sx={{ mb: 6, pageBreakInside: "avoid", breakInside: "avoid" }}>
            <Typography variant="h5" fontWeight="800" color={MIDNIGHT_BLUE} mb={3} sx={{ fontFamily: "'Playfair Display', serif !important" }}>
              Transport Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              
              {/* FLIGHTS MAP */}
              {flights.map((flight, i) => {
                const isReturn = flight.isReturnFlight || (i === flights.length - 1 && flights.length > 1);
                const flightLabel = isReturn ? "Return Flight" : "Outbound Flight";

                return (
                  <Paper key={`flight-${i}`} elevation={0} sx={{ p: 1, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                    <Box sx={{ bgcolor: '#EFF6FF', borderRadius: 3, p: 3 }}>
                      
                      {/* Top Row: Airline & Class */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar variant="rounded" sx={{ bgcolor: '#155DFC', color: '#fff', width: 42, height: 42, borderRadius: 2 }}>
                            <Flight sx={{ fontSize: 24, transform: 'rotate(90deg)' }} />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">{safeRender(flightLabel)}</Typography>
                            <Typography variant="subtitle1" fontWeight="600" color={MIDNIGHT_BLUE}>
                              {safeRender(flight.airline, "Airline")} {flight.flightNo ? `- ${safeRender(flight.flightNo)}` : ''}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Class</Typography>
                          <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(flight.cabin || flight.classType, "Economy")}</Typography>
                        </Box>
                      </Box>

                      {/* Middle Grid: From -> Duration -> Stops -> Duration -> To */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', mb: 2, mt: 2 }}>
                        
                        {/* Faint connecting background line */}
                        <Box sx={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', bgcolor: '#bfdbfe', zIndex: 0 }} />

                        {/* Left Group */}
                        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pr: 2 }}>
                          <Box>
                            <Typography variant="caption" color={TEXT_MUTED} display="block">From</Typography>
                            <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(flight.depFrom, "Origin")}</Typography>
                          </Box>
                          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="caption" color={TEXT_MUTED} display="block">Duration:</Typography>
                            <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(flight.duration, "Direct")}</Typography>
                          </Box>
                        </Box>

                        {/* Center Group */}
                        <Box sx={{ bgcolor: '#EFF6FF', zIndex: 1, px: { xs: 1, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Flight sx={{ color: '#155DFC', fontSize: 18, transform: 'rotate(45deg)', mt: 0.3 }} />
                            <Box>
                              <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE} sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                                {safeRender(flight.layovers ? 'Stops' : 'Direct')}
                              </Typography>
                              {flight.layovers && (
                                <Typography variant="caption" color={TEXT_MUTED} sx={{ whiteSpace: 'pre-line', fontSize: '0.7rem' }}>
                                  {safeRender(flight.layovers)}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>

                        {/* Right Group */}
                        <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pl: 2, textAlign: 'right' }}>
                          <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="caption" color={TEXT_MUTED} display="block">Duration:</Typography>
                            <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(flight.duration, "Direct")}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color={TEXT_MUTED} display="block">To</Typography>
                            <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(flight.arrAt || flight.arrTo, "Destination")}</Typography>
                          </Box>
                        </Box>

                      </Box>

                      {/* Bottom Row: Date & Time */}
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">{isReturn ? 'Return' : 'Departure'}</Typography>
                        <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>
                          {formatDate(flight.depDate)} • {safeRender(flight.depTime, "TBD")} - {safeRender(flight.arrTime, "TBD")}
                        </Typography>
                      </Box>
                    </Box>

                  </Paper>
                );
              })}

              {/* TRAINS MAP */}
              {trains.map((train, i) => (
                <Paper key={`train-${i}`} elevation={0} sx={{ p: 1, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                  <Box sx={{ bgcolor: '#EFF6FF', borderRadius: 3, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: '#059669', color: '#fff', width: 42, height: 42, borderRadius: 2 }}>
                          <Train sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Train Journey</Typography>
                          <Typography variant="subtitle1" fontWeight="600" color={MIDNIGHT_BLUE}>
                            {safeRender(train.trainName, "Train")} {train.trainNo ? `- ${safeRender(train.trainNo)}` : ''}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Class / Coach</Typography>
                        <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(train.coach, "Standard")}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', mb: 2, mt: 2 }}>
                      <Box sx={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', bgcolor: '#bfdbfe', zIndex: 0 }} />
                      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pr: 2 }}>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">From</Typography>
                          <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(train.depFrom, "Origin")}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ bgcolor: '#EFF6FF', zIndex: 1, px: { xs: 1, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Train sx={{ color: '#059669', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE} sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>Direct</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pl: 2, textAlign: 'right' }}>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">To</Typography>
                          <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(train.arrAt, "Destination")}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Departure</Typography>
                      <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>
                        {formatDate(train.depDate)} • {safeRender(train.depTime, "TBD")} - {safeRender(train.arrTime, "TBD")}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}

              {/* BUSES MAP */}
              {buses.map((bus, i) => (
                <Paper key={`bus-${i}`} elevation={0} sx={{ p: 1, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                  <Box sx={{ bgcolor: '#EFF6FF', borderRadius: 3, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: '#D97706', color: '#fff', width: 42, height: 42, borderRadius: 2 }}>
                          <DirectionsBus sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Bus Journey</Typography>
                          <Typography variant="subtitle1" fontWeight="600" color={MIDNIGHT_BLUE}>
                            {safeRender(bus.busName, "Bus")}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Type</Typography>
                        <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(bus.classType, "Standard")}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', mb: 2, mt: 2 }}>
                      <Box sx={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', bgcolor: '#bfdbfe', zIndex: 0 }} />
                      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pr: 2 }}>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">From</Typography>
                          <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(bus.depFrom || bus.pickup, "Origin")}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ bgcolor: '#EFF6FF', zIndex: 1, px: { xs: 1, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DirectionsBus sx={{ color: '#D97706', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE} sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>Direct</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pl: 2, textAlign: 'right' }}>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">To</Typography>
                          <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(bus.arrAt || bus.dropoff, "Destination")}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Departure</Typography>
                      <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>
                        {formatDate(bus.depDate)} • {safeRender(bus.depTime, "TBD")} - {safeRender(bus.arrTime, "TBD")}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}

              {/* GROUNDS MAP */}
              {grounds.map((ground, i) => (
                <Paper key={`ground-${i}`} elevation={0} sx={{ p: 1, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                  <Box sx={{ bgcolor: '#EFF6FF', borderRadius: 3, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: '#4F46E5', color: '#fff', width: 42, height: 42, borderRadius: 2 }}>
                          <DirectionsCar sx={{ fontSize: 24 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Ground Transfer</Typography>
                          <Typography variant="subtitle1" fontWeight="600" color={MIDNIGHT_BLUE}>
                            {safeRender(ground.vehicleType, "Private Transfer")}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Passengers</Typography>
                        <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(ground.passengers, "1")} Guests</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', mb: 2, mt: 2 }}>
                      <Box sx={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', bgcolor: '#bfdbfe', zIndex: 0 }} />
                      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pr: 2 }}>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">Pickup</Typography>
                          <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(ground.pickup || ground.depFrom, "Origin")}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ bgcolor: '#EFF6FF', zIndex: 1, px: { xs: 1, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DirectionsCar sx={{ color: '#4F46E5', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE} sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>Direct</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 6 }, bgcolor: '#EFF6FF', zIndex: 1, pl: 2, textAlign: 'right' }}>
                        <Box>
                          <Typography variant="caption" color={TEXT_MUTED} display="block">Dropoff</Typography>
                          <Typography variant="body1" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(ground.dropoff || ground.arrAt, "Destination")}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" display="block">Date</Typography>
                      <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>
                        {formatDate(ground.depDate)} • {safeRender(ground.depTime, "TBD")} - {safeRender(ground.arrTime, "TBD")}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}

            </Box>
          </Box>
        )}

        {/* 5. EXACT TIMELINE ITINERARY */}
        <Box sx={{ mb: 8 }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {days.map((day, i) => {
              const resolveImgUrl = (imgObj) => {
                if (!imgObj) return null;
                return typeof imgObj === "string" ? imgObj : imgObj?.url || imgObj?.preview;
              };
              const dayImages = Array.isArray(day?.images) ? day.images : (day?.image ? [day.image] : []);
              const mappedImages = dayImages.map(img => resolveImgUrl(img)).filter(Boolean);
              
              if (mappedImages.length === 0) {
                mappedImages.push(i % 2 === 0 ? DAY1_IMG : DAY2_IMG);
              }
              
              const isMainBase64 = mappedImages[0]?.startsWith("data:image");
              const dayDateStr = getDayDate(clientData?.startDate, i);

              return (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {/* Left Circle Number */}
                  <Box sx={{ flexShrink: 0, pt: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: '#1e3a8a', color: '#fff', fontWeight: 700 }}>
                      {i + 1}
                    </Avatar>
                  </Box>

                  {/* Right Content Card */}
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      flexGrow: 1, 
                      borderRadius: 3, 
                      border: '1px solid #e2e8f0', 
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                      overflow: 'hidden', 
                      bgcolor: '#fff',
                      pb: 2
                    }}
                  >
                    {/* Header Row (Title & Arrow) */}
                    <Box sx={{ p: 2.5, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="700" color="#0f172a" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5 }}>
                          {safeRender(day?.title, `Day ${i + 1}`)}
                          {dayDateStr && (
                            <Typography component="span" variant="subtitle1" fontWeight="600" color="#64748b">
                              ({dayDateStr})
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>
                          {safeRender(day?.description)}
                        </Typography>
                      </Box>
                      <IconButton size="small" sx={{ color: '#94a3b8' }}>
                        <ExpandMore />
                      </IconButton>
                    </Box>

                    {/* Image & Details Grid */}
                    <Grid container spacing={3} sx={{ px: 2.5 }}>
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          width: { xs: '100%', sm: '523.2px' }, 
                          maxWidth: '100%',
                          height: '256px',                      
                          mt: '23.91px',                        
                          ml: { xs: 0, sm: '23.6px' },          
                          mb: { xs: 0, sm: '23.91px' },         
                          padding: '39px',
                          boxSizing: 'border-box'
                        }}>
                          
                          {mappedImages.length === 1 && (
                            <img 
                              src={mappedImages[0]} 
                              alt={`Day ${i+1}`} 
                              {...(!isMainBase64 && { crossOrigin: "anonymous" })} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} 
                            />
                          )}

                          {mappedImages.length === 2 && (
                            <Box sx={{ display: 'flex', gap: 1, height: '100%' }}>
                              <img src={mappedImages[0]} alt={`Day ${i+1}`} {...(!isMainBase64 && { crossOrigin: "anonymous" })} style={{ width: '50%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                              <img src={mappedImages[1]} alt={`Day ${i+1}`} {...(!isMainBase64 && { crossOrigin: "anonymous" })} style={{ width: '50%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                            </Box>
                          )}

                          {mappedImages.length >= 3 && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
                              <img src={mappedImages[0]} alt={`Day ${i+1}`} {...(!isMainBase64 && { crossOrigin: "anonymous" })} style={{ width: '100%', height: '50%', objectFit: 'cover', borderRadius: '14px' }} />
                              <Box sx={{ display: 'flex', gap: 1, height: '50%' }}>
                                <img src={mappedImages[1]} alt={`Day ${i+1}`} {...(!isMainBase64 && { crossOrigin: "anonymous" })} style={{ width: '50%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                                <img src={mappedImages[2]} alt={`Day ${i+1}`} {...(!isMainBase64 && { crossOrigin: "anonymous" })} style={{ width: '50%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Grid>

                      {/* Right: Activities & Footer Block */}
                      <Grid item xs={12} sm={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                        
                        <Box sx={{ flexGrow: 1, mt: { xs: 1, sm: '23.91px' } }}>
                          <Typography variant="caption" fontWeight="700" color="#64748b" display="block" mb={1.5}>
                            Activities
                          </Typography>
                          {day?.activities ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {Array.isArray(day.activities) ? (
                                day.activities.map((act, idx) => (
                                  <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <Check sx={{ fontSize: 16, color: '#10b981', flexShrink: 0, mt: '2px' }} />
                                    <Typography variant="body2" color="#475569" fontWeight="500" sx={{ wordBreak: 'break-word' }}>
                                      {safeRender(act, "Activity")}
                                    </Typography>
                                  </Box>
                                ))
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                  <Check sx={{ fontSize: 16, color: '#10b981', flexShrink: 0, mt: '2px' }} />
                                  <Typography variant="body2" color="#475569" fontWeight="500" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                                    {safeRender(day.activities)}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="#94a3b8" fontStyle="italic">No specific activities planned.</Typography>
                          )}
                        </Box>

                        <Box sx={{ mt: 3, p: 1.5, bgcolor: '#f0f9ff', borderRadius: 2, display: 'flex', gap: 4 }}>
                          <Box>
                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Transportation</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <DirectionsCar sx={{ fontSize: 16, color: '#3b82f6' }} />
                              <Typography variant="body2" fontWeight="600" color="#0f172a">
                                {safeRender(day?.transport, "No Transport")}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="#64748b" display="block" mb={0.5}>Food</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Restaurant sx={{ fontSize: 16, color: '#3b82f6' }} />
                              <Typography variant="body2" fontWeight="600" color="#0f172a">
                                {Array.isArray(day?.meals) && day.meals.length > 0 ? day.meals.join(", ") : safeRender(day?.meals, "Not included")}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* 6. LUXURY ACCOMMODATIONS */}
        {hotels.length > 0 && (
          <Box sx={{ mb: 6 }}>
             <Typography variant="h5" fontWeight="800" color={MIDNIGHT_BLUE} mb={4} textAlign="center" sx={{ fontFamily: "'Playfair Display', serif !important" }}>
               Luxury Accommodations
             </Typography>
             
             <Grid container spacing={3}>
               {hotels.map((hotel, i) => {
                  const finalHotelName = safeRender(hotel?.hotelName || hotel?.name || hotel?.hotel_name, "Selected Hotel");
                  return (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', pageBreakInside: "avoid", breakInside: "avoid", bgcolor: '#fff' }}>
                        
                        {/* Image Section */}
                        <Box sx={{ height: 220, position: 'relative' }}>
                          <img src={hotel?.image || HOTEL_IMG} alt={finalHotelName} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {/* Dark Gradient Overlay */}
                          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />
                          
                          {/* Top Right Rating Badge */}
                          <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#f59e0b', color: '#fff', px: 1.5, py: 0.5, borderRadius: 5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ fontSize: 14 }} />
                            <Typography variant="caption" fontWeight="800">{safeRender(hotel?.rating, "4.9")}</Typography>
                          </Box>

                          {/* Bottom Left Name & Location */}
                          <Box sx={{ position: 'absolute', bottom: 12, left: 16 }}>
                            <Typography variant="subtitle1" fontWeight="800" color="#fff" mb={0.2}>
                              {finalHotelName}
                            </Typography>
                            <Typography variant="caption" color="#fbbf24" display="flex" alignItems="center" gap={0.5} fontWeight="600">
                              <LocationOnOutlined sx={{ fontSize: 14 }} /> {safeRender(hotel?.location, safeRender(rawDestination))}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Content Section */}
                        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          
                          {/* Amenities Chips */}
                          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                            <Chip 
                              icon={<Wifi sx={{ fontSize: '14px !important', color: '#3b82f6' }} />} 
                              label="Free WiFi" 
                              size="small" 
                              sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 600, fontSize: '0.7rem' }} 
                            />
                            <Chip 
                              icon={<Pool sx={{ fontSize: '14px !important', color: '#f59e0b' }} />} 
                              label="Rooftop Pool" 
                              size="small" 
                              sx={{ bgcolor: '#fffbeb', color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem' }} 
                            />
                          </Box>

                          {/* Details Grid */}
                          <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color={TEXT_MUTED} display="block" mb={0.5}>Room Type</Typography>
                              <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{safeRender(hotel?.roomCat, "Valley View Villa")}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color={TEXT_MUTED} display="block" mb={0.5}>Guests</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PeopleOutline sx={{ fontSize: 16, color: TEXT_MUTED }} />
                                <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>{paxSummary}</Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={0.5} mb={0.5}>
                                <CalendarMonth sx={{ fontSize: 14 }} /> Check-in
                              </Typography>
                              <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>
                                {safeRender(hotel?.checkInDate, formatDate(clientData.startDate) || "May 17")}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={0.5} mb={0.5}>
                                <CalendarMonth sx={{ fontSize: 14 }} /> Check-out
                              </Typography>
                              <Typography variant="body2" fontWeight="600" color={MIDNIGHT_BLUE}>
                                {safeRender(hotel?.checkOutDate, formatDate(clientData.endDate) || "May 20")}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="caption" color={TEXT_MUTED} display="block" mb={0.5}>Check-in Time</Typography>
                              <Typography variant="body2" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(hotel?.checkInTime, "02:00 PM")}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color={TEXT_MUTED} display="block" mb={0.5}>Check-out Time</Typography>
                              <Typography variant="body2" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(hotel?.checkOutTime, "11:00 AM")}</Typography>
                            </Box>
                          </Box>

                        </Box>
                      </Paper>
                    </Grid>
                  )
               })}
             </Grid>
          </Box>
        )}

        {/* 7. EXACT INCLUSIONS & EXCLUSIONS SIDE BY SIDE (FLEX BOX NO WRAP) */}
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 3, mb: 6, alignItems: 'stretch' }}>
          
          <Paper elevation={0} sx={{ flex: 1, minWidth: 0, p: 4, borderRadius: 4, bgcolor: '#f0fdf4', border: '1px solid #d1fae5', pageBreakInside: "avoid", breakInside: "avoid" }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
               <Box sx={{ bgcolor: '#10b981', color: '#fff', borderRadius: 2, p: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Check fontSize="small" />
               </Box>
               <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE} sx={{ fontFamily: "'Playfair Display', serif !important" }}>What's Included</Typography>
             </Box>
             <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
               {displayInclusions.map((item, i) => (
                 <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: '#475569', fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 }}>
                   <Check sx={{ fontSize: 18, color: '#10b981', flexShrink: 0, mt: '2px' }} /> 
                   <Box sx={{ wordBreak: 'break-word' }}>{safeRender(item)}</Box>
                 </Box>
               ))}
             </Box>
          </Paper>
          
          <Paper elevation={0} sx={{ flex: 1, minWidth: 0, p: 4, borderRadius: 4, bgcolor: '#fef2f2', border: '1px solid #fee2e2', pageBreakInside: "avoid", breakInside: "avoid" }}>
             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
               <Box sx={{ bgcolor: '#ef4444', color: '#fff', borderRadius: 2, p: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Close fontSize="small" />
               </Box>
               <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE} sx={{ fontFamily: "'Playfair Display', serif !important" }}>Not Included</Typography>
             </Box>
             <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
               {displayExclusions.map((item, i) => (
                 <Box component="li" key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: '#475569', fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 }}>
                   <Close sx={{ fontSize: 18, color: '#ef4444', flexShrink: 0, mt: '2px' }} /> 
                   <Box sx={{ wordBreak: 'break-word' }}>{safeRender(item)}</Box>
                 </Box>
               ))}
             </Box>
          </Paper>

        </Box>

        {/* 🚨 8. DYNAMIC PAYMENT, BANK & VISA DETAILS (FULL WIDTH COLUMN STACK) 🚨 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: 6 }}>
          
          {/* Bank Account Details Full Width Box */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff', pageBreakInside: "avoid", breakInside: "avoid" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ bgcolor: '#3b82f6', color: '#fff', borderRadius: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AccountBalance fontSize="small" />
              </Box>
              <Typography variant="h5" fontWeight="800" color={MIDNIGHT_BLUE}>Bank Account Details</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {displayBanks.map((bank, idx) => (
                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column' }}>
                  
                  {/* 🚨 EXACT MATCH BANK DETAILS GRID 🚨 */}
                  <Grid container spacing={2} sx={{ mb: (bank.bankNotes || bank.additionalInstructions) ? 3 : 0 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ bgcolor: '#BEDBFF', p: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', height: '100%',width:"400px", }}>
                        <Typography variant="caption" color="#3b82f6" fontWeight="800" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }} display="block" mb={1}>Bank Name</Typography>
                        <Typography variant="body1" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(bank.bankName || bank.name, "Global Trust Bank")}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ bgcolor: '#BEDBFF', p: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', height: '100%',width:"400px", }}>
                        <Typography variant="caption" color="#3b82f6" fontWeight="800" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }} display="block" mb={1}>Account Holder Name</Typography>
                        <Typography variant="body1" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(bank.accountName || bank.accountHolderName, "Premium Voyages International")}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ bgcolor: '#BEDBFF', p: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', height: '100%',width:"400px", }}>
                        <Typography variant="caption" color="#3b82f6" fontWeight="800" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }} display="block" mb={1}>Account Number</Typography>
                        <Typography variant="body1" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(bank.accountNumber, "**** **** **9234")}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ bgcolor: '#BEDBFF', p: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', height: '100%' ,width:"400px",}}>
                        <Typography variant="caption" color="#3b82f6" fontWeight="800" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }} display="block" mb={1}>IFSC Code / Swift Code</Typography>
                        <Typography variant="body1" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(bank.ifscCode || bank.swiftCode || bank.routing, "GTBKUS44")}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ bgcolor: '#BEDBFF', p: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', height: '100%',width:"400px", }}>
                        <Typography variant="caption" color="#3b82f6" fontWeight="800" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }} display="block" mb={1}>Branch Name</Typography>
                        <Typography variant="body1" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(bank.branchName, "Main Branch")}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ bgcolor: '#BEDBFF', p: 2.5, borderRadius: 1, border: '1px solid #e2e8f0', height: '100%',width:"400px", }}>
                        <Typography variant="caption" color="#3b82f6" fontWeight="800" sx={{ letterSpacing: 0.5, textTransform: 'uppercase' }} display="block" mb={1}>Account Type</Typography>
                        <Typography variant="body1" fontWeight="700" color={MIDNIGHT_BLUE}>{safeRender(bank.accountType, "Corporate Savings")}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Transfer Instructions Box */}
                  {(bank.bankNotes || bank.additionalInstructions) && (
                    <Box sx={{ p: 3, bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 3, display: 'flex', gap: 2 }}>
                      <Box sx={{ color: '#f59e0b', pt: 0.2 }}>
                        <LightbulbOutlined />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="800" color="#b45309" mb={1}>Additional Instructions</Typography>
                        <Typography variant="body2" color="#92400e" sx={{ whiteSpace: 'pre-line', wordBreak: 'break-word', fontWeight: 500, lineHeight: 1.6 }}>
                          {safeRender(bank.bankNotes || bank.additionalInstructions)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
          
          {/* Visa Requirements Full Width Box */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff', pageBreakInside: "avoid", breakInside: "avoid" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ bgcolor: '#10b981', color: '#fff', borderRadius: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Security fontSize="small" />
              </Box>
              <Typography variant="h5" fontWeight="800" color={MIDNIGHT_BLUE}>Visa Requirements</Typography>
            </Box>
            
            {safeVisas.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}>
                {safeVisas.map((visa, i) => (
                  <Box key={i} sx={{ border: '1px solid #a7f3d0', bgcolor: '#f0fdf4', borderRadius: 3, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#10b981', width: 36, height: 36 }}><LanguageIcon fontSize="small" /></Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="800" color={MIDNIGHT_BLUE}>
                            {safeRender(visa?.visaCountry || visa?.country, "Visa")} {visa?.visaType && `(${safeRender(visa.visaType)})`}
                          </Typography>
                          <Typography variant="caption" color={TEXT_MUTED} fontWeight="500">
                            {safeRender(visa?.visaType, "Tourist Visa")} • {safeRender(visa?.entries, "Multiple Entry")}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip label="Approved" size="small" sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 800, px: 1 }} />
                    </Box>

                    <Divider sx={{ my: 2, borderColor: '#d1fae5' }} />

                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={0.5} fontWeight="600">
                        <CalendarMonth sx={{ fontSize: 16, color: '#10b981' }} /> Valid: {safeRender(visa?.validity, "May 15 - August 15, 2026")}
                      </Typography>
                      <Typography variant="caption" color={TEXT_MUTED} display="flex" alignItems="center" gap={0.5} fontWeight="600">
                        <Description sx={{ fontSize: 16, color: '#10b981' }} /> Duration: {safeRender(visa?.duration, "90 Days")}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color={TEXT_MUTED} sx={{ fontStyle: 'italic', mb: 4 }}>No specific visa requirements added.</Typography>
            )}

            {/* Important Notes Box Inside Visa Card */}
            <Box sx={{ p: 3, bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 3, display: 'flex', gap: 2 }}>
               <Box sx={{ color: '#f59e0b', pt: 0.2 }}>
                 <LightbulbOutlined />
               </Box>
               <Box>
                 <Typography variant="subtitle2" fontWeight="800" color="#b45309" mb={1}>Important Notes:</Typography>
                 <Box component="ul" sx={{ m: 0, pl: 2, color: "#92400e", fontSize: "0.875rem", fontWeight: 500, display: 'flex', flexDirection: 'column', gap: 1 }}>
                   <li>Passport must remain valid for minimum 6 months beyond your return travel date</li>
                   <li>Carry official visa approval documents with you at all times during travel</li>
                   <li>Keep digital and physical copies of all travel documents in separate locations</li>
                   <li>Verify entry requirements with respective embassies 72 hours before departure</li>
                 </Box>
               </Box>
            </Box>
          </Paper>

        </Box>

        {/* 🚨 9. EXACT TERMS AND CONDITIONS UI (FROM NEW IMAGE) 🚨 */}
        <Container maxWidth="md" sx={{ mb: 10 }}>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={4} textAlign="center" sx={{ fontFamily: "'Playfair Display', serif !important" }}>
            Terms & Conditions
          </Typography>
          {renderTerms()}
        </Container>

      </Container>

      {/* 🚨 10. EXACT FOOTER / CONSULTANT CARD UI (FROM NEW IMAGE) 🚨 */}
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
                    <Typography variant="subtitle1" fontWeight="800">{safeRender(agentNameDisplay)}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, display: "block" }}>Your Travel Consultant</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 1.5, borderRadius: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Phone fontSize="small" sx={{ opacity: 0.8, flexShrink: 0 }} />
                    <Typography variant="body2" fontWeight="600">{safeRender(userDetails?.["custom:tmp_pr_contact"])}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "rgba(255,255,255,0.1)", p: 1.5, borderRadius: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Email fontSize="small" sx={{ opacity: 0.8, flexShrink: 0 }} />
                    <Typography variant="body2" fontWeight="600">{safeRender(userDetails?.["email"])}</Typography>
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
                {userDetails?.["custom:branding"] ? JSON.parse(userDetails["custom:branding"]).map((value, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9", width: 40, height: 40 }}><VerifiedUserOutlined fontSize="small" /></Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="800" color="#0f172a">{safeRender(value.title)}</Typography>
                        <Typography variant="caption" color="#64748b">{safeRender(value.subtitle)}</Typography>
                      </Box>
                    </Box>
                  )) : (
                    <>
                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9", width: 40, height: 40 }}><VerifiedUserOutlined fontSize="small" /></Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color="#0f172a">Expert Planning</Typography>
                          <Typography variant="caption" color="#64748b">Tailored itineraries by specialists</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9", width: 40, height: 40 }}><ShieldOutlined fontSize="small" /></Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color="#0f172a">24/7 Support</Typography>
                          <Typography variant="caption" color="#64748b">We are always here for you</Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={2} mt={3}>Office Address</Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0ea5e9", width: 40, height: 40, flexShrink: 0 }}><LocationOnOutlined fontSize="small" /></Avatar>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="caption" color="#64748b">{safeRender(userDetails?.["custom:office_address"] || companyName)}</Typography>
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