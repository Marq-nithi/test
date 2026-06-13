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

  // --- 4. TRANSPORT DATA ---
  const flights = transportData?.flights || (transportData?.airline ? [transportData] : []);

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
           <Box sx={{ position: 'absolute', top: 24, left: 24, zIndex: 10, bgcolor: '#fff', p: 1, borderRadius: 1 }}>
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

        {/* 🚨 4. EXACT FLIGHT DETAILS LAYOUT 🚨 */}
        {flights.length > 0 && (
          <Box sx={{ mb: 6, pageBreakInside: "avoid", breakInside: "avoid" }}>
            <Typography variant="h5" fontWeight="800" color={MIDNIGHT_BLUE} mb={3} sx={{ fontFamily: "'Playfair Display', serif !important" }}>
              Flight Details
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {flights.map((flight, i) => {
                const isReturn = flight.isReturnFlight || (i === flights.length - 1 && flights.length > 1);
                const flightLabel = isReturn ? "Return Flight" : "Outbound Flight";

                return (
                  <Paper key={i} elevation={0} sx={{ p: 1, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
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
            </Box>
          </Box>
        )}

        {/* 5. EXACT TIMELINE ITINERARY */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h5" fontWeight="800" color={MIDNIGHT_BLUE} mb={4} textAlign="center">Your Journey, Day by Day</Typography>
          
          <Box sx={{ position: 'relative' }}>
            {/* The Vertical Dashed Line */}
            <Box sx={{ position: 'absolute', left: { xs: 24, md: 39 }, top: 20, bottom: 20, width: '2px', borderLeft: '2px dashed #cbd5e1', zIndex: 1 }} />

            {days.map((day, i) => {
              const resolveImgUrl = (imgObj) => {
                if (!imgObj) return null;
                return typeof imgObj === "string" ? imgObj : imgObj?.url || imgObj?.preview;
              };
              const dayImages = Array.isArray(day?.images) ? day.images : (day?.image ? [day.image] : []);
              const mainImg = resolveImgUrl(dayImages[0]) || (i % 2 === 0 ? DAY1_IMG : DAY2_IMG);
              const isMainBase64 = mainImg?.startsWith("data:image");

              return (
                <Box key={i} sx={{ display: 'flex', mb: 4, position: 'relative', zIndex: 2 }}>
                  {/* Number Circle aligned on the line */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: { xs: 50, md: 80 }, flexShrink: 0 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: BRAND_BLUE, color: '#fff', fontWeight: 800, border: '4px solid #f8fafc', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      {i + 1}
                    </Avatar>
                  </Box>

                  {/* Accordion Content */}
                  <Accordion defaultExpanded={i === 0} elevation={0} sx={{ flexGrow: 1, borderRadius: '12px !important', border: '1px solid #e2e8f0', '&:before': { display: 'none' }, overflow: 'hidden', pageBreakInside: "avoid", breakInside: "avoid", bgcolor: '#fff' }}>
                    <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 2, '& .MuiAccordionSummary-content': { m: 0 } }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="800" color={MIDNIGHT_BLUE}>{safeRender(day?.title, `Day ${i + 1}`)}</Typography>
                        {getDayDate(clientData?.startDate, i) && <Typography variant="caption" color={TEXT_MUTED} fontWeight="600">{getDayDate(clientData.startDate, i)}</Typography>}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Divider />
                      <Grid container>
                        <Grid item xs={12} sm={5}>
                          <img src={mainImg} alt={`Day ${i+1}`} {...(!isMainBase64 && { crossOrigin: "anonymous" })} style={{ width: '100%', height: '100%', minHeight: 220, objectFit: 'cover' }} />
                        </Grid>
                        <Grid item xs={12} sm={7} sx={{ p: 3 }}>
                          <Typography variant="subtitle2" fontWeight="800" color={MIDNIGHT_BLUE} mb={1}>Overview</Typography>
                          
                          <Typography variant="body2" color={TEXT_MUTED} mb={3} sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                            {safeRender(day?.description)}
                          </Typography>
                          
                          {/* 🚨 SAFELY RENDERS ACTIVITY OBJECTS INSTEAD OF CRASHING 🚨 */}
                          {day?.activities && (
                            <Box>
                              <Typography variant="subtitle2" fontWeight="800" color={MIDNIGHT_BLUE} mb={1}>Activities & Experiences</Typography>
                              {Array.isArray(day.activities) ? (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                  {day.activities.map((act, idx) => (
                                      <Chip 
                                        key={idx} 
                                        label={safeRender(act, "Activity")} 
                                        size="small" 
                                        sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }} 
                                      />
                                  ))}
                                </Box>
                              ) : (
                                <Typography variant="body2" color={TEXT_MUTED} sx={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                                  {safeRender(day.activities)}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* 6. LUXURY ACCOMMODATIONS */}
        {hotels.length > 0 && (
          <Box sx={{ mb: 6 }}>
             <Typography variant="h5" fontWeight="800" color={MIDNIGHT_BLUE} mb={4} textAlign="center">Luxury Accommodations</Typography>
             <Grid container spacing={3}>
               {hotels.map((hotel, i) => {
                  const finalHotelName = safeRender(hotel?.hotelName || hotel?.name || hotel?.hotel_name, "Selected Hotel");
                  return (
                    <Grid item xs={12} sm={6} key={i}>
                      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', pageBreakInside: "avoid", breakInside: "avoid", bgcolor: '#fff' }}>
                        <Box sx={{ height: 200, position: 'relative' }}>
                          <img src={hotel?.image || HOTEL_IMG} alt={finalHotelName} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <Chip label={hotel?.nights ? `${safeRender(hotel.nights)} Nights` : "Hotel"} size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#f59e0b', color: '#fff', fontWeight: 800 }} />
                        </Box>
                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE} mb={0.5}>{finalHotelName}</Typography>
                          <Box sx={{ display: 'flex', color: '#fbbf24', mb: 1 }}>
                            {[...Array(parseInt(hotel?.stars) || 5)].map((_, idx) => <Star key={idx} sx={{ fontSize: 16 }} />)}
                          </Box>
                          <Typography variant="body2" color={TEXT_MUTED} display="flex" alignItems="center" gap={0.5} mb={3}>
                            <LocationOn sx={{ fontSize: 16 }} /> {safeRender(hotel?.location, safeRender(rawDestination))}
                          </Typography>
                          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                             <Box>
                               <Typography variant="caption" color={TEXT_MUTED} display="block">Room Category</Typography>
                               <Typography variant="subtitle2" fontWeight="800" color={BRAND_BLUE}>{safeRender(hotel?.roomCat, "Deluxe Room")}</Typography>
                             </Box>
                             <Typography variant="caption" color={TEXT_MUTED}>Check-in: {safeRender(hotel?.checkInTime, "3:00 PM")}</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  )
               })}
             </Grid>
          </Box>
        )}

        {/* 7. EXACT INCLUSIONS & EXCLUSIONS SIDE BY SIDE */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', height: '100%', pageBreakInside: "avoid", breakInside: "avoid" }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                 <Box sx={{ bgcolor: '#10b981', color: '#fff', borderRadius: 1.5, p: 0.5, display: 'flex' }}><CheckCircle fontSize="small" /></Box>
                 <Typography variant="subtitle1" fontWeight="800" color="#065f46">What's Included</Typography>
               </Box>
               <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                 {displayInclusions.map((item, i) => (
                   <li key={i} style={{ display: 'flex', gap: '8px', color: '#047857', fontSize: '0.875rem', fontWeight: 500 }}>
                     <CheckCircle sx={{ fontSize: 16, color: '#34d399', mt: 0.3 }} /> 
                     {safeRender(item)}
                   </li>
                 ))}
               </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, bgcolor: '#fef2f2', border: '1px solid #fecaca', height: '100%', pageBreakInside: "avoid", breakInside: "avoid" }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                 <Box sx={{ bgcolor: '#ef4444', color: '#fff', borderRadius: 1.5, p: 0.5, display: 'flex' }}><Cancel fontSize="small" /></Box>
                 <Typography variant="subtitle1" fontWeight="800" color="#991b1b">Not Included</Typography>
               </Box>
               <Box component="ul" sx={{ m: 0, pl: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                 {displayExclusions.map((item, i) => (
                   <li key={i} style={{ display: 'flex', gap: '8px', color: '#b91c1c', fontSize: '0.875rem', fontWeight: 500 }}>
                     <Cancel sx={{ fontSize: 16, color: '#f87171', mt: 0.3 }} /> 
                     {safeRender(item)}
                   </li>
                 ))}
               </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 8. DYNAMIC PAYMENT & BANK DETAILS LIST */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f4f6f8', height: '100%', pageBreakInside: "avoid", breakInside: "avoid" }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Avatar variant="rounded" sx={{ bgcolor: BRAND_BLUE, color: '#fff', width: 36, height: 36 }}><AccountBalance fontSize="small" /></Avatar>
                <Typography variant="subtitle1" fontWeight="800" color={MIDNIGHT_BLUE}>Bank Account Details</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {displayBanks.map((bank, idx) => (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {idx > 0 && <Divider sx={{ my: 1, borderColor: '#cbd5e1' }} />}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Typography variant="body2" color={TEXT_MUTED} fontWeight="600">Bank Name</Typography>
                      <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>{safeRender(bank.bankName || bank.name, "Chase Bank")}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Typography variant="body2" color={TEXT_MUTED} fontWeight="600">Account Name</Typography>
                      <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>{safeRender(bank.accountName, "Travel Agency")}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', pb: 1 }}>
                      <Typography variant="body2" color={TEXT_MUTED} fontWeight="600">Account No.</Typography>
                      <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>{safeRender(bank.accountNumber, "****5847")}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color={TEXT_MUTED} fontWeight="600">Routing/IFSC</Typography>
                      <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>{safeRender(bank.routing || bank.ifscCode, "021000021")}</Typography>
                    </Box>
                    {bank.bankNotes && (
                      <Typography variant="caption" color={TEXT_MUTED} sx={{ mt: 1, whiteSpace: 'pre-line', fontStyle: 'italic' }}>
                        Note: {safeRender(bank.bankNotes)}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#f4f6f8', height: '100%', pageBreakInside: "avoid", breakInside: "avoid" }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Avatar variant="rounded" sx={{ bgcolor: '#10b981', color: '#fff', width: 36, height: 36 }}><Security fontSize="small" /></Avatar>
                <Typography variant="subtitle1" fontWeight="800" color={MIDNIGHT_BLUE}>Visa Requirements</Typography>
              </Box>
              
              {safeVisas.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {safeVisas.map((visa, i) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>{safeRender(visa?.visaCountry || visa?.country, "Visa")}</Typography>
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="600">{safeRender(visa?.visaType, "Tourist Visa")}</Typography>
                      </Box>
                      <Chip label="Approved" size="small" sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 800 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color={TEXT_MUTED} sx={{ fontStyle: 'italic' }}>No specific visa requirements added.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* 9. IMPORTANT NOTES (YELLOW BOX) */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#fffbeb', border: '1px solid #fde68a', mb: 6, pageBreakInside: "avoid", breakInside: "avoid" }}>
           <Typography variant="subtitle2" fontWeight="800" color="#b45309" mb={1} display="flex" alignItems="center" gap={1}>
             <LightbulbOutlined fontSize="small" /> Important Notes
           </Typography>
           <Box component="ul" sx={{ m: 0, pl: 3, color: "#92400e", fontSize: "0.875rem", fontWeight: 500 }}>
             <li>Please ensure your passport is valid for at least 6 months from the date of travel.</li>
             <li>Standard check-in time is 14:00 hrs and check-out is 12:00 hrs.</li>
             <li>Any special requests are subject to availability at the time of check-in.</li>
           </Box>
        </Paper>

        {/* 10. EXACT FOOTER BLOCKS */}
        <Grid container spacing={3} sx={{ mb: 6, pageBreakInside: "avoid", breakInside: "avoid" }}>
           <Grid item xs={12} md={7}>
             <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', height: '100%' }}>
               <Typography variant="h6" fontWeight="800" color={MIDNIGHT_BLUE} mb={4}>Why Choose Us</Typography>
               <Grid container spacing={4}>
                 {userDetails?.["custom:branding"] ? JSON.parse(userDetails["custom:branding"]).map((value, idx) => (
                    <Grid item xs={12} sm={6} key={idx} sx={{ display: "flex", gap: 2 }}>
                      <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#3b82f6", width: 40, height: 40 }}><VerifiedUserOutlined fontSize="small" /></Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>{safeRender(value.title)}</Typography>
                        <Typography variant="caption" color={TEXT_MUTED} fontWeight="500">{safeRender(value.subtitle)}</Typography>
                      </Box>
                    </Grid>
                  )) : (
                    <>
                      <Grid item xs={12} sm={6} sx={{ display: "flex", gap: 2 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#3b82f6", width: 40, height: 40 }}><VerifiedUserOutlined fontSize="small" /></Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>Expert Planning</Typography>
                          <Typography variant="caption" color={TEXT_MUTED} fontWeight="500">Tailored itineraries by specialists</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ display: "flex", gap: 2 }}>
                        <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#3b82f6", width: 40, height: 40 }}><ShieldOutlined fontSize="small" /></Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="800" color={MIDNIGHT_BLUE}>24/7 Support</Typography>
                          <Typography variant="caption" color={TEXT_MUTED} fontWeight="500">We are always here for you</Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
               </Grid>
             </Paper>
           </Grid>

           <Grid item xs={12} md={5}>
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
               
               {/* Consultant Card */}
               <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#202c4b', color: '#fff', display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                 <Avatar sx={{ width: 56, height: 56, bgcolor: '#f97316', fontSize: '1.2rem', fontWeight: 800 }}>{agentInitials}</Avatar>
                 <Box>
                   <Typography variant="caption" sx={{ opacity: 0.8, letterSpacing: 1, fontWeight: 600 }}>YOUR TRAVEL CONSULTANT</Typography>
                   <Typography variant="subtitle1" fontWeight="800" sx={{ mt: 0.5 }}>{safeRender(agentNameDisplay)}</Typography>
                   <Typography variant="caption" sx={{ opacity: 0.8 }} display="block">{safeRender(userDetails?.["custom:tmp_pr_contact"], "+1 234 567 8900")}</Typography>
                 </Box>
               </Paper>

               {/* Address Card */}
               <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                 <Avatar variant="rounded" sx={{ bgcolor: "#eff6ff", color: "#3b82f6", width: 48, height: 48 }}><LocationOnOutlined /></Avatar>
                 <Box>
                   <Typography variant="subtitle2" fontWeight="800" color={MIDNIGHT_BLUE}>Office Address</Typography>
                   <Typography variant="caption" color={TEXT_MUTED} fontWeight="500" sx={{ whiteSpace: 'pre-line' }}>{safeRender(userDetails?.["custom:office_address"] || companyName)}</Typography>
                 </Box>
               </Paper>
             </Box>
           </Grid>
        </Grid>

        {/* 11. BOTTOM STRIP */}
        <Box sx={{ bgcolor: '#202c4b', color: '#fff', p: 3, borderRadius: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', pageBreakInside: "avoid", breakInside: "avoid" }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="800">{safeRender(themeConfig?.footerText || companyName)}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>{safeRender(userDetails?.["custom:tmp_footer_text"])}</Typography>
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 600 }}>© 2026 All rights reserved.</Typography>
        </Box>

      </Container>
    </Box>
  );
}