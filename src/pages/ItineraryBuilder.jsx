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
import ThemeSelection from "../components/itinerary/ThemeSelection";
import FinalItinerary from "../components/itinerary/FinalItinerary";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useNavigate } from "react-router-dom";

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
    loadDrafts();
    getAllMasterEntries();
  }, []);

  const handleSaveDraft = async () => {
    console.log(clientData);
    const lead_id = clientData.lead_id;
    console.log(lead_id);
    const contact_payload = clientData;
    const transformStayPayload = (payload) => {
      const hotels = payload.hotels.map((v) => ({
        hotel_type: v.type || "main",
        location: v.location,
        hotel_name: v.hotelName,
        hotel_preference: v.hotelPref,
        room_category: v.roomCat,
        check_in_date: v.checkInDate,
        check_in_time: v.checkInTime,
        check_out_date: v.checkOutDate,
        check_out_time: v.checkOutTime,
        rooms: v.rooms,
        price: v.price,
        amenities: v.amenities,
        meal_plan_breakfast: v.meals?.breakfast || false,
        meal_plan_lunch: v.meals?.lunch || false,
        meal_plan_dinner: v.meals?.dinner || false,
        meal_plan_all_inc: v.meals?.allInclusive || false,
      }));
      return hotels;
    };

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
      images: (v.images || []).map((iv) => iv.id),
      meals: v.meals,
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

    const itinerary_payload = {
      itinerary_contact: contact_payload,
      itinerary_hotels: transformStayPayload(stayData),
      iternerary_transports: transformTransportPayload(transportData),
      iternerary_dayplanner,
      iternerary_price,
      itinerary_inclexcl: inclExclData,
      itinerary_terms: termsData === "" ? {} : termsData,
      itinerary_theme: selectedThemeId,
    };

    await api.itinerary.createDraftItinerary(lead_id, itinerary_payload);

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
  };

  const handleLoadDraft = async (draft) => {
    const itineraryId = draft?.itinerary_id || draft?.id;
    if (!itineraryId) return;

    const response = await getItineraryDataById(itineraryId);
    const fullData = response?.data ?? response ?? {};

    const contact = fullData?.itinerary_contact || {};
    const mappedClientData = {
      ...contact,
      title: contact.title || "",
      name: contact.name || "",
      contact: contact.phone ? String(contact.phone) : "",
      email: contact.email || "",
      budget: contact.budget ?? "",
      adults: contact.no_of_adults != null ? String(contact.no_of_adults) : "",
      children:
        contact.no_of_children != null ? String(contact.no_of_children) : "0",
      infants:
        contact.no_of_infants != null ? String(contact.no_of_infants) : "",
      destination: contact.dist_location || "",
      startDate: contact.start_date || "",
      endDate: contact.end_date || "",
      nights: contact.nights != null ? String(contact.nights) : "",
      days: contact.days != null ? String(contact.days) : "",
      queryHandledBy: contact.handled_by || "",
      status: contact.status || "",
      source: contact.source || "",
      trip_title: contact.trip_title || "",
    };

    const mappedStayData = {
      hotels: (fullData?.itinerary_hotels || []).map((hotel) => ({
        type: hotel.hotel_type || "main",
        location: hotel.location || "",
        hotelName: hotel.hotel_name || "",
        hotelPref: hotel.hotel_preference || "",
        roomCat: hotel.room_category || "",
        checkInDate: hotel.check_in_date || "",
        checkInTime: hotel.check_in_time || "",
        checkOutDate: hotel.check_out_date || "",
        checkOutTime: hotel.check_out_time || "",
        rooms: hotel.rooms ?? 1,
        price: hotel.price ?? "",
        amenities: hotel.amenities || [],
        meals: {
          breakfast: Boolean(hotel.meal_plan_breakfast),
          lunch: Boolean(hotel.meal_plan_lunch),
          dinner: Boolean(hotel.meal_plan_dinner),
          allInclusive: Boolean(hotel.meal_plan_all_inc),
        },
      })),
    };

    const transportParams = fullData?.itinerary_transport?.[0]?.params || {};
    const mappedTransportData = {
      trains: transportParams.trains || [],
      buses: transportParams.buses || [],
      grounds: transportParams.grounds || [],
      flights: transportParams.flights || [],
    };

    const mappedDayPlannerData = await Promise.all(
      (fullData?.itinerary_dayplanner || []).map(async (entry) => {
        const params = entry?.params || {};
        const imageIds = Array.isArray(params.images) ? params.images : [];
        const resolvedImages = await Promise.all(
          imageIds.map(async (imgId) => {
            if (!imgId) return null;
            const blob = await getBlob(imgId);
            return { id: imgId, url: blob?.url || "" };
          }),
        );
        return {
          day: params.day || 1,
          title: params.title || "",
          description: params.description || "",
          dayNumber: params.dayNumber || params.day || 1,
          images: resolvedImages.filter(Boolean),
          meals: Array.isArray(params.meals) ? params.meals : [],
          activities: params.activities || "",
          transport: params.transport || "Seat in Coach",
        };
      }),
    );

    const mappedPriceData = fullData?.itinerary_price || {
      items: [],
      taxes: { gst: 18, serviceTax: 5 },
      discount: { type: "Percentage (%)", value: 0 },
    };

    if (itineraryContext.setClientData)
      itineraryContext.setClientData(mappedClientData);
    if (itineraryContext.setStayData)
      itineraryContext.setStayData(mappedStayData);
    if (itineraryContext.setTransportData)
      itineraryContext.setTransportData(mappedTransportData);
    if (itineraryContext.setDayPlannerData)
      itineraryContext.setDayPlannerData(mappedDayPlannerData);
    if (itineraryContext.setPriceData)
      itineraryContext.setPriceData(mappedPriceData);
    if (itineraryContext.setInclExclData)
      itineraryContext.setInclExclData(
        fullData?.itinerary_inclexcl || { inclusions: {}, exclusions: {} },
      );
    if (itineraryContext.setTermsData)
      itineraryContext.setTermsData(fullData?.itinerary_terms || "");
    if (itineraryContext.setSelectedThemeId)
      itineraryContext.setSelectedThemeId(
        fullData?.itinerary_themes?.[0]?.theme_id || "Pearl",
      );
    setCurrentDraftId(draft.id);
    setOpenDraftModal(false);
    if (itineraryContext.setStep) itineraryContext.setStep(1);
  };

  const handleDeleteDraft = (id) => {
    setSavedDrafts(savedDrafts.filter((d) => d.id !== id));
    if (currentDraftId === id) setCurrentDraftId(null);
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
        return <ThemeSelection />;
      case 9:
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

    const canvas = await html2canvas(componentRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdfHeight = (imgHeight * pageWidth) / imgWidth;
    const pageHeightPx = (pageHeight * imgWidth) / pageWidth;

    if (pdfHeight <= pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    } else {
      let position = 0;
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        const canvasPage = document.createElement("canvas");
        canvasPage.width = imgWidth;
        canvasPage.height = Math.min(pageHeightPx, remainingHeight);

        const context = canvasPage.getContext("2d");
        context.drawImage(canvas, 0, -position);

        const pageData = canvasPage.toDataURL("image/png");
        const pageDataHeight = (canvasPage.height * pageWidth) / imgWidth;

        pdf.addImage(pageData, "PNG", 0, 0, pageWidth, pageDataHeight);

        remainingHeight -= canvasPage.height;
        position += canvasPage.height;

        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }

    pdf.save("component.pdf");
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
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          bgcolor: "#fff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 5 },
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Itinerary Builder
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Save progress as you build.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Badge badgeContent={savedDrafts.length} color="primary">
              <Button
                variant="outlined"
                startIcon={<FolderOpen />}
                onClick={async () => {
                  await loadDrafts();
                  setOpenDraftModal(true);
                }}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Drafts
              </Button>
            </Badge>

            {step < 8 && (
              <Button
                variant="contained"
                onClick={handleSaveDraft}
                sx={{
                  bgcolor: "#0f172a",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Save Draft
              </Button>
            )}

            {step === 9 && (
              <Button
                variant="contained"
                onClick={() => handleSharePdf()}
                sx={{
                  bgcolor: "#00c6ff",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Share PDF
              </Button>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            px: { xs: 2, md: 5 },
            display: "flex",
            overflowX: "auto",
            pb: 3,
            gap: 1,
          }}
        >
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <Chip
                label={s.label}
                icon={s.icon}
                onClick={() => setStep && setStep(s.id)}
                sx={{
                  bgcolor: step === s.id ? "primary.main" : "background.paper",
                  color: step === s.id ? "#fff" : "text.primary",
                  fontWeight: step === s.id ? 700 : 600,
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              />
              {idx < steps.length - 1 && (
                <ChevronRight sx={{ color: "divider" }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: step === 9 ? 0 : 5,
          pb: "160px",
        }}
      >
        {renderStepContent()}
      </Box>

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
            <Typography variant="h6" fontWeight="900">
              Saved Drafts
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenDraftModal(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: "#f8fafc" }}>
          {savedDrafts.length === 0 ? (
            <Typography
              sx={{ py: 4, textAlign: "center" }}
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
