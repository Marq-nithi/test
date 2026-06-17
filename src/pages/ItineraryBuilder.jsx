import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Badge,
} from "@mui/material";
import {
  ChevronRight,
  Person,
  Hotel,
  Flight,
  CalendarMonth,
  AttachMoney,
  ListAlt,
  Gavel,
  Style,
  Visibility,
  Close,
  FolderOpen,
  CheckCircleOutline,
  DeleteOutline,
  CardTravel,
  AutoAwesome,
  Save,
  Add,
} from "@mui/icons-material";
import { useItinerary } from "../context/ItineraryContext";
import {
  useBlobDownload,
  useItineraryBuilderApi,
  useMasterEntries,
} from "../services/backendApi";

import ClientDetails from "../components/itinerary/ClientDetails";
import StayDetails from "../components/itinerary/StayDetails";
import TransportDetails from "../components/itinerary/TransportDetails";
import DayPlanner from "../components/itinerary/DayPlanner";
import PriceDetails from "../components/itinerary/PriceDetails";
import InclExcl from "../components/itinerary/InclExcl";
import TermsConditions from "../components/itinerary/TermsConditions";
import VisaDetails from "../components/itinerary/VisaDetails";
import ThemeSelection from "../components/itinerary/ThemeSelection";
import FinalItinerary from "../components/itinerary/FinalItinerary";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useNavigate } from "react-router-dom";
import { ItineraryLineItems } from "../components/ItineraryLineItems";

export default function ItineraryBuilder() {
  const navigate = useNavigate();
  const itineraryContext = useItinerary();
  const {
    step,
    setStep,
    clientData,
    stayData,
    transportData,
    dayPlannerData,
    priceData,
    inclExclData,
    termsData,
    selectedThemeId,
    bankDetails,
    resetItineraryState,
    showAllItinerary,
    setShowAllItinerary,
  } = itineraryContext;

  const { api } = useApi();
  const { getBlob } = useBlobDownload();
  const { getAllItineraryDraft, getItineraryDataById } =
    useItineraryBuilderApi();
  const { getAllMasterEntries } = useMasterEntries();

  const [savedDrafts, setSavedDrafts] = useState([]);
  const [openDraftModal, setOpenDraftModal] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState(null);

  const loadDrafts = async () => {
    const response = await getAllItineraryDraft();
    const payload = response?.data ?? response ?? [];
    const mappedDrafts = (Array.isArray(payload) ? payload : []).map(
      (draft) => ({
        id:
          draft.itinerary_id ||
          `DRF-${Math.floor(1000 + Math.random() * 9000)}`,
        itinerary_id: draft.itinerary_id,
        dateSaved: "--",
        clientName: draft.clientName || "Unnamed Client",
        destination: draft.destination || "TBD",
        dates: draft.dates || "Dates TBD",
        totalDays: draft.totalDays || 0,
        rawData: null,
      }),
    );
    setSavedDrafts(mappedDrafts);
  };

  useEffect(() => {
    getAllMasterEntries();
  }, []);

  const handleSaveDraft = async (is_draft = true) => {
    const lead_id = clientData.lead_id;
    const contact_payload = clientData;

    const transformStayPayload = (payload) => {
      if (!payload || !payload.hotels) return [];
      const hotels = payload.hotels.map((v) => ({
        hotel_type: v.type || "main",
        location: v.location || "",
        hotel_name: v.hotelName || "",
        hotel_preference: v.hotelPref || "",
        room_category: v.roomCat || "",
        check_in_date: v.checkInDate || "",
        check_in_time: v.checkInTime || "",
        check_out_date: v.checkOutDate || "",
        check_out_time: v.checkOutTime || "",
        rooms: v.rooms || 1,
        price: v.price || "",
        amenities: v.amenities || [],
        meal_plan_breakfast: v.meals?.breakfast || false,
        meal_plan_lunch: v.meals?.lunch || false,
        meal_plan_dinner: v.meals?.dinner || false,
        meal_plan_all_inc: v.meals?.allInclusive || false,
      }));
      return hotels;
    };

    const transformTransportPayload = (payload) => {
      if (!payload) return { trains: [], buses: [], grounds: [], flights: [] };
      
      const trains = (payload.trains || []).map((v) => ({
        depFrom: v.depFrom || "",
        arrAt: v.arrAt || "",
        passengers: v.passengers || "",
        depDate: v.depDate || "",
        depTime: v.depTime || "",
        arrDate: v.arrDate || "",
        arrTime: v.arrTime || "",
        trainName: v.trainName || "",
        trainNo: v.trainNo || "",
        coach: v.coach || "",
        notes: v.notes || "",
      }));

      const buses = (payload.buses || []).map((v) => ({
        depFrom: v.pickup || "",
        arrAt: v.dropoff || "",
        passengers: v.passengers || "",
        depDate: v.depDate || "",
        depTime: v.depTime || "",
        arrDate: v.arrDate || "",
        arrTime: v.arrTime || "",
        busName: v.busName || "",
        classType: v.classType || "",
        notes: v.notes || "",
      }));

      const grounds = (payload.grounds || []).map((v) => ({
        pickup: v.pickup || "",
        dropoff: v.dropoff || "",
        passengers: v.passengers || "",
        depDate: v.depDate || "",
        depTime: v.depTime || "",
        arrDate: v.arrDate || "",
        arrTime: v.arrTime || "",
        vehicleType: v.vehicleType || "",
        notes: v.notes || "",
      }));

      const flights = (payload.flights || []).map((v) => ({
        depFrom: v.depFrom || "",
        arrAt: v.arrAt || "",
        airline: v.airline || "",
        flightType: v.flightType || "",
        layovers: v.layovers || [],
        cabin: v.cabin || "",
        adults: v.adults || "",
        children: v.children || "",
        infants: v.infants || "",
        depDate: v.depDate || "",
        depTime: v.depTime || "",
        arrDate: v.arrDate || "",
        arrTime: v.arrTime || "",
        duration: v.duration || "",
        pricePerPerson: v.pricePerPerson || "",
        visaCountry: v.visaCountry || "",
        visaType: v.visaType || "",
        entryType: v.entryType || "",
        validity: v.validity || "",
        visaDuration: v.visaDuration || "",
        notes: v.notes || "",
      }));

      return { trains, buses, grounds, flights };
    };

    const iternerary_dayplanner = (dayPlannerData || []).map((v) => ({
      day: v.day || "",
      title: v.title || "",
      description: v.description || "",
      dayNumber: v.dayNumber || "",
      images: (v.images || []).map((iv) => iv.id),
      meals: v.meals || [],
    }));

    const iternerary_price = {
      items: (priceData?.items || []).map((v) => ({
        category: v.category || "",
        description: v.description || "",
        quantity: v.quantity || 1,
        unitPrice: v.unitPrice || 0,
      })),
      taxes: priceData?.taxes || { gst: 0, serviceTax: 0 },
      discount: priceData?.discount || { type: "Percentage (%)", value: 0 },
    };

    const itinerary_payload = {
      itinerary_contact: contact_payload || {},
      itinerary_hotels: transformStayPayload(stayData),
      iternerary_transports: transformTransportPayload(transportData),
      iternerary_dayplanner,
      iternerary_price,
      itinerary_inclexcl: inclExclData || { inclusions: [], exclusions: [] },
      itinerary_terms: termsData === "" ? {} : termsData,
      itinerary_theme: selectedThemeId || "Pearl", 
    };

    try {
      if (is_draft) {
        await api.itinerary.createDraftItinerary(lead_id, itinerary_payload);
      } else {
        await api.itinerary.createItinerary(lead_id, itinerary_payload);
      }

      const draftIdToUse =
        currentDraftId || `DRF-${Math.floor(1000 + Math.random() * 9000)}`;
      const currentDraft = {
        id: draftIdToUse,
        dateSaved: new Date().toLocaleTimeString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        clientName: clientData?.name || "Unnamed Client",
        destination:
          clientData?.destination || clientData?.dist_location || "TBD",
        dates:
          clientData?.startDate && clientData?.endDate
            ? `${clientData.startDate} to ${clientData.endDate}`
            : "Dates TBD",
        totalDays: Array.isArray(dayPlannerData) ? dayPlannerData.length : 0,
        rawData: {
          clientData,
          stayData,
          transportData,
          dayPlannerData,
          priceData,
          inclExclData,
          termsData,
          selectedThemeId,
        },
      };

      if (currentDraftId) {
        setSavedDrafts(
          savedDrafts.map((d) => (d.id === currentDraftId ? currentDraft : d)),
        );
      } else {
        setCurrentDraftId(draftIdToUse);
        setSavedDrafts([currentDraft, ...savedDrafts]);
      }

      setOpenDraftModal(true);
      if (resetItineraryState) resetItineraryState();
      setCurrentDraftId(null);
      navigate("/lead-management");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save draft. Please check console.");
    }
  };

  // 🚨 THIS IS THE FULLY FIXED TRANSLATOR FUNCTION FOR LOADING DRAFTS 🚨
  const handleLoadDraft = async (draft) => {
    const itineraryId = draft?.itinerary_id || draft?.id;
    if (!itineraryId) return;

    try {
      const response = await getItineraryDataById(itineraryId);
      const fullData = response?.data ?? response ?? {};

      console.log(" ITHU THAAN BACKEND DATA 🔥🔥", fullData);

      // 1. CLIENT DETAILS FIX
      const contact = fullData?.itinerary_contact || {};
      const mappedClientData = {
        ...contact,
        title: contact.title || "Mr",
        name: contact.name || "",
        contact: contact.contact || contact.phone ? String(contact.contact || contact.phone) : "",
        email: contact.email || "",
        budget: contact.budget ?? "",
        adults: contact.adults || contact.no_of_adults != null ? String(contact.adults || contact.no_of_adults) : "",
        children: contact.children || contact.no_of_children != null ? String(contact.children || contact.no_of_children) : "0",
        infants: contact.infants || contact.no_of_infants != null ? String(contact.infants || contact.no_of_infants) : "",
        childAges: Array.isArray(contact.childAges) ? contact.childAges : [],
        destination: contact.destination || contact.dist_location || "",
        startDate: contact.startDate || contact.start_date || "",
        endDate: contact.endDate || contact.end_date || "",
        nights: contact.nights != null ? String(contact.nights) : "",
        days: contact.days != null ? String(contact.days) : "",
        queryHandledBy: contact.queryHandledBy || contact.handled_by || "0",
        status: contact.status || "New",
        source: contact.source || "Website",
        trip_title: contact.trip_title || "",
      };

      // 2. STAY DETAILS FIX 
      const hotelsArray = fullData?.itinerary_hotels || [];
      const mappedStayData = {
        hotels: hotelsArray.map((hotel) => ({
          type: hotel.hotel_type || hotel.type || "main",
          location: hotel.location || "",
          hotelName: hotel.hotel_name || hotel.hotelName || "",
          hotelPref: hotel.hotel_preference || hotel.hotelPref || "",
          roomCat: hotel.room_category || hotel.roomCat || "",
          checkInDate: hotel.check_in_date || hotel.checkInDate || "",
          checkInTime: hotel.check_in_time || hotel.checkInTime || "",
          checkOutDate: hotel.check_out_date || hotel.checkOutDate || "",
          checkOutTime: hotel.check_out_time || hotel.checkOutTime || "",
          rooms: hotel.rooms ?? 1,
          price: hotel.price ?? "",
          amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
          meals: {
            breakfast: Boolean(hotel.meal_plan_breakfast || hotel.meals?.breakfast),
            lunch: Boolean(hotel.meal_plan_lunch || hotel.meals?.lunch),
            dinner: Boolean(hotel.meal_plan_dinner || hotel.meals?.dinner),
            allInclusive: Boolean(hotel.meal_plan_all_inc || hotel.meals?.allInclusive),
          },
        })),
      };

      // 3. TRANSPORT & VISA FIX
      const transportRaw = fullData?.iternerary_transports || fullData?.itinerary_transport?.[0]?.params || fullData?.itinerary_transport || {};
      const mappedTransportData = {
        trains: transportRaw.trains || [],
        buses: transportRaw.buses || [],
        grounds: transportRaw.grounds || [],
        flights: transportRaw.flights || [], 
      };

      // 4. DAY PLANNER FIX
      const plannerRaw = fullData?.iternerary_dayplanner || fullData?.itinerary_dayplanner || [];
      const mappedDayPlannerData = await Promise.all(
        plannerRaw.map(async (entry) => {
          const data = entry?.params || entry || {};
          const imageIds = Array.isArray(data.images) ? data.images : [];
          const resolvedImages = await Promise.all(
            imageIds.map(async (imgId) => {
              if (!imgId) return null;
              try {
                const blob = await getBlob(imgId);
                return { id: imgId, url: blob?.url || "" };
              } catch {
                return { id: imgId, url: "" };
              }
            })
          );
          return {
            day: data.day || 1,
            title: data.title || "",
            description: data.description || "",
            dayNumber: data.dayNumber || data.day || 1,
            images: resolvedImages.filter(Boolean),
            meals: Array.isArray(data.meals) ? data.meals : [],
            activities: data.activities || "",
            transport: data.transport || "Seat in Coach",
          };
        })
      );

      // 5. PRICE FIX
      const mappedPriceData = fullData?.iternerary_price || fullData?.itinerary_price || {
        items: [],
        taxes: { gst: 18, serviceTax: 5 },
        discount: { type: "Percentage (%)", value: 0 },
      };

      if (itineraryContext.setClientData) itineraryContext.setClientData(mappedClientData);
      if (itineraryContext.setStayData) itineraryContext.setStayData(mappedStayData);
      if (itineraryContext.setTransportData) itineraryContext.setTransportData(mappedTransportData);
      if (itineraryContext.setDayPlannerData) itineraryContext.setDayPlannerData(mappedDayPlannerData);
      if (itineraryContext.setPriceData) itineraryContext.setPriceData(mappedPriceData);
      if (itineraryContext.setInclExclData) itineraryContext.setInclExclData(fullData?.itinerary_inclexcl || { inclusions: {}, exclusions: {} });
      if (itineraryContext.setTermsData) itineraryContext.setTermsData(fullData?.itinerary_terms || "");
      if (itineraryContext.setSelectedThemeId) itineraryContext.setSelectedThemeId(fullData?.itinerary_themes?.[0]?.theme_id || fullData?.itinerary_theme || "Pearl");
      
      setCurrentDraftId(draft.id);
      setOpenDraftModal(false);
      if (itineraryContext.setStep) itineraryContext.setStep(1);

    } catch (error) {
      console.error("Failed to load draft:", error);
      alert("Failed to pull data from database.");
    }
  };

  const handleDeleteDraft = (id) => {
    setSavedDrafts(savedDrafts.filter((d) => d.id !== id));
    if (currentDraftId === id) setCurrentDraftId(null);
  };

  const steps = [
    { label: "Client Details", id: 1, icon: <Person fontSize="small" /> },
    { label: "Day Planner", id: 4, icon: <CalendarMonth fontSize="small" /> },
    { label: "Stay Details", id: 2, icon: <Hotel fontSize="small" /> },
    { label: "Transport", id: 3, icon: <Flight fontSize="small" /> },
    { label: "Price Details", id: 5, icon: <AttachMoney fontSize="small" /> },
    { label: "Incl & Excl", id: 6, icon: <ListAlt fontSize="small" /> },
    { label: "Terms & Con", id: 7, icon: <Gavel fontSize="small" /> },
    { label: "Visa Details", id: 8, icon: <CardTravel fontSize="small" /> },
    { label: "Template", id: 9, icon: <Style fontSize="small" /> },
    { label: "Review", id: 10, icon: <Visibility fontSize="small" /> },
  ];

  const componentRef = useRef(null);
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ClientDetails />;
      case 2:
        return <StayDetails />;
      case 3:
        return <TransportDetails />;
      case 4:
        return <DayPlanner />;
      case 5:
        return <PriceDetails />;
      case 6:
        return <InclExcl />;
      case 7:
        return <TermsConditions />;
      case 8:
        return <VisaDetails />;
      case 9:
        return <ThemeSelection />;
      case 10:
        return (
          <div ref={componentRef}>
            <FinalItinerary />
          </div>
        );
      default:
        return <ClientDetails />;
    }
  };

  const handleSharePdf = async () => {
    if (!componentRef.current) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = await html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#fafaf9",
        windowWidth: 1200,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      handleSaveDraft(false);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST",
      );

      const fileName = clientData?.name
        ? `Itinerary_${clientData.name.trim().replace(/\s+/g, "_")}.pdf`
        : "Itinerary.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error(
        "Single page execution thread faulted capturing current input state context:",
        error,
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: "#fff",
          borderBottom: "1px solid #e2e8f0",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AutoAwesome sx={{ color: "#0ea5e9", fontSize: 28 }} />
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Itinerary Builder
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontFamily: "'Inter', sans-serif" }}
              >
                Create stunning travel experiences for your clients
              </Typography>
            </Box>
          </Box>
          {!showAllItinerary && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              {step < 9 && (
                <Button
                  variant="contained"
                  onClick={handleSaveDraft}
                  startIcon={<Save sx={{ fontSize: "18px" }} />}
                  sx={{
                    background:
                      "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)", 
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    width: "130px", 
                    height: "33px", 
                    borderRadius: "9.23px", 
                    paddingLeft: "14.76px", 
                    paddingRight: "14.76px", 
                    gap: "11.07px", 
                    boxShadow: "none",
                    opacity: 1,
                    "& .MuiButton-startIcon": {
                      marginRight: 0, 
                    },
                  }}
                >
                  Save Draft
                </Button>
              )}

              {step === 10 && (
                <Button
                  variant="contained"
                  onClick={() => handleSharePdf()}
                  sx={{
                    bgcolor: "#00ff0d",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Share PDF
                </Button>
              )}
              <Button
                variant="contained"
                onClick={() => {
                  setShowAllItinerary(true);
                }}
                sx={{
                  background:
                    "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)", 
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: "9.23px", 
                  paddingLeft: "14.76px", 
                  paddingRight: "14.76px", 
                  gap: "11.07px", 
                  boxShadow: "none",
                  opacity: 1,
                  "& .MuiButton-startIcon": {
                    marginRight: 0, 
                  },
                }}
              >
                Back To All Itinerary
              </Button>
            </Box>
          )}
          {showAllItinerary && (
            <Button
              variant="contained"
              onClick={() => {
                setShowAllItinerary(false);
              }}
              sx={{
                background:
                  "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)", 
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                borderRadius: "9.23px", 
                paddingLeft: "14.76px", 
                paddingRight: "14.76px", 
                gap: "11.07px", 
                boxShadow: "none",
                opacity: 1,
                "& .MuiButton-startIcon": {
                  marginRight: 0, 
                },
              }}
            >
              Create New Itinerary
            </Button>
          )}
        </Box>
        {!showAllItinerary && (
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              display: "flex",
              flexWrap: "wrap", 
              alignItems: "center",
              pb: 2,
              gap: 1.5,
            }}
          >
            {steps.map((s, idx) => (
              <React.Fragment key={s.id}>
                <Chip
                  label={s.label}
                  icon={s.icon}
                  onClick={() => setStep && setStep(s.id)}
                  sx={{
                    bgcolor: step === s.id ? "transparent" : "#f8fafc",
                    background:
                      step === s.id
                        ? "linear-gradient(90deg,rgba(59, 114, 235, 1) 0%, rgba(0, 187, 167, 1) 50%)"
                        : "none",
                    color: step === s.id ? "#fff" : "#64748b",
                    fontWeight: step === s.id ? 600 : 500,
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    border: step === s.id ? "none" : "1px solid #f1f5f9",
                    cursor: "pointer",
                    height: "32px",
                    "& .MuiChip-icon": {
                      color: step === s.id ? "#fff" : "#94a3b8",
                    },
                  }}
                />
                {idx < steps.length - 1 && (
                  <ChevronRight sx={{ color: "#cbd5e1", fontSize: 18 }} />
                )}
              </React.Fragment>
            ))}

            <ChevronRight sx={{ color: "#cbd5e1", fontSize: 18 }} />
            
          </Box>
        )}
      </Box>

      {!showAllItinerary && (
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: step === 10 ? 0 : 5,
            pb: "160px",
          }}
        >
          {renderStepContent()}
        </Box>
      )}
      {showAllItinerary && (
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: step === 10 ? 0 : 5,
            pb: "160px",
          }}
        >
          <ItineraryLineItems />
        </Box>
      )}

      {/* DRAFTS MODAL */}
      <Dialog
        open={openDraftModal}
        onClose={() => setOpenDraftModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FolderOpen color="primary" />
            <Typography
              variant="h6"
              fontWeight="900"
              fontFamily="'Inter', sans-serif"
            >
              Saved Drafts
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDraftModal(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ bgcolor: "#f8fafc", fontFamily: "'Inter', sans-serif" }}
        >
          {savedDrafts.length === 0 ? (
            <Typography
              sx={{
                py: 4,
                textAlign: "center",
                fontFamily: "'Inter', sans-serif",
              }}
              color="text.secondary"
            >
              No drafts found.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {savedDrafts.map((draft) => (
                <Card
                  key={draft.id}
                  sx={{
                    border:
                      draft.id === currentDraftId
                        ? "2px solid #10b981"
                        : "1px solid #e2e8f0",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {draft.id === currentDraftId && (
                          <CheckCircleOutline
                            sx={{ color: "#10b981", fontSize: 18 }}
                          />
                        )}
                        <Typography
                          variant="subtitle2"
                          fontWeight={800}
                          color={
                            draft.id === currentDraftId ? "#10b981" : "#0ea5e9"
                          }
                        >
                          {draft.id === currentDraftId
                            ? "Current Session"
                            : `Draft Ref: ${draft.id}`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="caption"
                          fontWeight="600"
                          color="#64748b"
                        >
                          {draft.dateSaved}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDraft(draft.id)}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#0f172a",
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                        }}
                      >
                        {(draft.clientName || "U").charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="caption"
                          color="#64748b"
                          fontWeight="600"
                        >
                          CLIENT
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="800"
                          color="#0f172a"
                          sx={{ lineHeight: 1.2 }}
                        >
                          {draft.clientName}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant={
                        draft.id === currentDraftId ? "contained" : "outlined"
                      }
                      fullWidth
                      size="small"
                      onClick={() => handleLoadDraft(draft)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        bgcolor:
                          draft.id === currentDraftId
                            ? "#10b981"
                            : "transparent",
                        color: draft.id === currentDraftId ? "#fff" : "#0f172a",
                        borderColor: "#e2e8f0",
                        "&:hover": {
                          bgcolor:
                            draft.id === currentDraftId ? "#059669" : "#f8fafc",
                        },
                      }}
                    >
                      {draft.id === currentDraftId
                        ? "Keep Editing Current"
                        : "Load & Fill Data"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}