import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";
import {
  Map,
  ChevronRight,
  Replay,
  Person,
  Hotel,
  Flight,
  CalendarMonth,
  AttachMoney,
  ListAlt,
  Gavel,
  Style,
  Visibility,
} from "@mui/icons-material";
import { useItinerary } from "../context/ItineraryContext";

// Import all 9 of our step components!
import ClientDetails from "../components/itinerary/ClientDetails";
import StayDetails from "../components/itinerary/StayDetails";
import TransportDetails from "../components/itinerary/TransportDetails";
import DayPlanner from "../components/itinerary/DayPlanner";
import PriceDetails from "../components/itinerary/PriceDetails";
import InclExcl from "../components/itinerary/InclExcl";
import TermsConditions from "../components/itinerary/TermsConditions";
import ThemeSelection from "../components/itinerary/ThemeSelection";
import FinalItinerary from "../components/itinerary/FinalItinerary";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

export default function ItineraryBuilder() {
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
  } = useItinerary();
  const { api } = useApi();
  const handleSaveDraft = async () => {
    const lead_id = "test"; //clientData.lead_id;
    const contact_payload = clientData;

    const transformTransportPayload = (payload) => {
      const trains = payload.trains.map((v) => ({
        depFrom: v.depFrom,
        arrAt: v.arrAt,
        passengers: v.passengers,
        depDate: v.depDate,
        depTime: v.depTime,
        arrDate: v.arrDate,
        arrTime: v.arrTime,
        trainName: v.trainName,
        trainNo: v.trainNo,
        coach: v.coach,
        notes: v.notes,
      }));

      const buses = payload.buses.map((v) => ({
        depFrom: v.pickup,
        arrAt: v.dropoff,
        passengers: v.passengers,
        depDate: v.depDate,
        depTime: v.depTime,
        arrDate: v.arrDate,
        arrTime: v.arrTime,
        busName: v.busName,
        classType: v.classType,
        notes: v.notes,
      }));

      const grounds = payload.grounds.map((v) => ({
        pickup: v.pickup,
        dropoff: v.dropoff,
        passengers: v.passengers,
        depDate: v.depDate,
        depTime: v.depTime,
        arrDate: v.arrDate,
        arrTime: v.arrTime,
        vehicleType: v.vehicleType,
        notes: v.notes,
      }));

      const flights = payload.flights.map((v) => ({
        depFrom: v.depFrom,
        arrAt: v.arrAt,
        airline: v.airline,
        flightType: v.flightType,
        layovers: v.layovers,
        cabin: v.cabin,
        adults: v.adults,
        children: v.children,
        infants: v.infants,
        depDate: v.depDate,
        depTime: v.depTime,
        arrDate: v.arrDate,
        arrTime: v.arrTime,
        duration: v.duration,
        pricePerPerson: v.pricePerPerson,
        visaCountry: v.visaCountry,
        visaType: v.visaType,
        entryType: v.entryType,
        validity: v.validity,
        visaDuration: v.visaDuration,
        notes: v.notes,
      }));

      return {
        trains,
        buses,
        grounds,
        flights,
      };
    };
    const iternerary_dayplanner = dayPlannerData.map((v) => ({
      day: v.day,
      title: v.title,
      description: v.description,
      dayNumber: v.dayNumber,
    }));

    const iternerary_price = {
      items: priceData.items.map((v) => ({
        category: v.category,
        description: v.description,
        quantity: v.quantity,
        unitPrice: v.unitPrice,
      })),
      taxes: priceData.taxes,
      discount: priceData.discount,
    };
    const itinerary_inclexcl = inclExclData;
    const itinerary_terms = termsData;
    const itinerary_theme = selectedThemeId;
    const itinerary_payload = {
      itinerary_contact: contact_payload,
      itinerary_hotels: stayData.hotels,
      iternerary_transports: transformTransportPayload(transportData),
      iternerary_dayplanner: iternerary_dayplanner,
      iternerary_price: iternerary_price,
      itinerary_inclexcl: itinerary_inclexcl,
      itinerary_terms: itinerary_terms,
      itinerary_theme: itinerary_theme,
    };
    await api.itinerary.createDraftItinerary(lead_id, itinerary_payload);
  };

  const steps = [
    { label: "Client Details", id: 1, icon: <Person fontSize="small" /> },
    { label: "Hotels", id: 2, icon: <Hotel fontSize="small" /> },
    { label: "Transport", id: 3, icon: <Flight fontSize="small" /> },
    { label: "Day Planner", id: 4, icon: <CalendarMonth fontSize="small" /> },
    { label: "Price Details", id: 5, icon: <AttachMoney fontSize="small" /> },
    { label: "Incl & Excl", id: 6, icon: <ListAlt fontSize="small" /> },
    { label: "Terms & Con", id: 7, icon: <Gavel fontSize="small" /> },
    { label: "Template", id: 8, icon: <Style fontSize="small" /> },
    { label: "Review", id: 9, icon: <Visibility fontSize="small" /> },
  ];

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
        return <ThemeSelection />;
      case 9:
        return <FinalItinerary />;
      default:
        return <ClientDetails />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      {/* 🚨 STICKY TOP WRAPPER: This locks the Header & Stepper to the top */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: "#ffffff", // Solid background so scrolling content goes BEHIND it
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)", // Slight shadow for depth
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            p: { xs: 2, md: 5 },
            pb: { xs: 2, md: 2 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.5rem", md: "2.125rem" },
                color: "text.primary",
              }}
            >
              Itinerary Builder
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Craft bespoke travel experiences for your clientele.
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", gap: 1, width: { xs: "100%", md: "auto" } }}
          >
            <Button
              variant="outlined"
              startIcon={<Replay />}
              sx={{
                flexGrow: { xs: 1, md: 0 },
                color: "text.primary",
                borderColor: "divider",
              }}
            >
              Reset
            </Button>
            {step === 9 ? (
              <Button
                variant="contained"
                onClick={() => window.open("/preview", "_blank")}
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  bgcolor: "#00c6ff",
                  color: "#fff",
                  "&:hover": { bgcolor: "#00b4e6" },
                }}
              >
                Share PDF
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handleSaveDraft();
                }}
                variant="contained"
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  bgcolor: "#00c6ff",
                  color: "#fff",
                  "&:hover": { bgcolor: "#00b4e6" },
                }}
              >
                Save Draft
              </Button>
            )}
          </Box>
        </Box>

        {/* STEPPER */}
        <Box
          sx={{
            px: { xs: 2, md: 5 },
            display: "flex",
            overflowX: "auto",
            pb: 3,
            gap: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isPassed = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <Chip
                  label={s.label}
                  icon={s.icon}
                  onClick={() => (isPassed || isActive) && setStep(s.id)}
                  sx={{
                    bgcolor: isActive
                      ? "primary.main"
                      : isPassed
                        ? "background.default"
                        : "background.paper",
                    color: isActive
                      ? "#fff"
                      : isPassed
                        ? "text.primary"
                        : "text.secondary",
                    border: isPassed ? "1px solid" : "1px solid transparent",
                    borderColor: "divider",
                    borderRadius: 2,
                    px: 1,
                    py: { xs: 2, md: 2.5 },
                    fontWeight: isActive ? 700 : 600,
                    cursor: isPassed ? "pointer" : "default",
                    transition: "all 0.2s ease",
                    "& .MuiChip-icon": {
                      color: isActive
                        ? "#fff"
                        : isPassed
                          ? "text.primary"
                          : "text.secondary",
                    },
                    "&:hover": {
                      bgcolor: isPassed ? "background.default" : undefined,
                    },
                  }}
                />
                {idx < steps.length - 1 && (
                  <ChevronRight sx={{ color: "divider", mx: 0.5 }} />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>

      {/* 🚨 INNER SCROLL CONTENT AREA */}
      {/* We added a big pt (Padding Top) so it doesn't touch the stepper, and a massive pb (Padding Bottom) to clear your Profit/Cost bar! */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: step === 9 ? 0 : { xs: 2, md: 5 },
          pt: step === 9 ? 0 : { xs: 4, md: 6 }, // Pushes form down from the sticky header
          pb: step === 9 ? 0 : "160px", // Guaranteed clearance for your bottom fixed bar!
        }}
      >
        {renderStepContent()}
      </Box>
    </Box>
  );
}
