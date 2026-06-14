import { DataGrid } from "@mui/x-data-grid";
import { useItineraryBuilderApi } from "../services/backendApi";
import { useEffect, useState, useMemo } from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Box, Typography } from "@mui/material";
import { Chip, Stack } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useItinerary } from "../context/ItineraryContext";

export function ItineraryLineItems() {
  const { api } = useApi();
  const [allNonDraft, setAllNonDraft] = useState([]);
  const [allDraft, setAllDraft] = useState([]);
  const { getAllItinerary, getItineraryDataById, deleteItinerary } =
    useItineraryBuilderApi();
  const itineraryContext = useItinerary();
  const {
    setStep,
    setClientData,
    setStayData,
    setTransportData,
    setDayPlannerData,
    setPriceData,
    setInclExclData,
    setTermsData,
    setVisaData,
    setSelectedThemeId,
    setShowAllItinerary,
  } = itineraryContext;

  const [showAllDraft, setShowAllDraft] = useState(false);

  useEffect(() => {
    getAllItinerary().then((data) => {
      setAllDraft(data.filter((v) => v.is_draft == 1));
      setAllNonDraft(data.filter((v) => v.is_draft != 1));
    });
  }, []);

  const handleSetItineraryData = (data) => {
    const contact = data.itinerary_contact;
    const hotels = data.itinerary_hotels;
    const transposrt = data.itinerary_transport;
    const transportParams = transposrt?.[0]?.params || {};
    const price = data.itinerary_price;
    const incExc = data.itinerary_inclexcl;
    const terms = data.itinerary_terms;
    const dayPlanner = data.itinerary_dayplanner;

    setClientData({
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
    });

    setStayData({
      hotels: hotels.map((hotel) => ({
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
    });

    setTransportData({
      trains: transportParams.trains || [],
      buses: transportParams.buses || [],
      grounds: transportParams.grounds || [],
      flights: transportParams.flights || [],
    });

    setPriceData(price);
    setInclExclData(incExc);
    setTermsData(terms);
    setSelectedThemeId(data.itinerary_themes.theme_id);
    setDayPlannerData(dayPlanner);

    setStep(1);
  };
  const handleContinueUse = async (id) => {
    const data = await getItineraryDataById(id);
    handleSetItineraryData(data);
    setShowAllItinerary(false);
  };
  const handleDelete = async (id) => {
    deleteItinerary(id).then(() => {
      getAllItinerary().then((data) => {
        setAllDraft(data.filter((v) => v.is_draft == 1));
        setAllNonDraft(data.filter((v) => v.is_draft != 1));
      });
    });
  };

  const columns = [
    {
      field: "clientName",
      headerName: "Client Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "destination",
      headerName: "Destination",
      flex: 1,
      minWidth: 150,
      valueGetter: (value) => value || "-",
    },
    {
      field: "dates",
      headerName: "Travel Dates",
      flex: 1,
      minWidth: 180,
      valueGetter: (value) => value || "-",
    },
    {
      field: "totalDays",
      headerName: "Total Days",
      type: "number",
      flex: 0.5,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      minWidth: 240,
      flex: 1,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {showAllDraft && (
            <>
              <Chip
                icon={<PlayArrowRoundedIcon />}
                label="Continue"
                color="primary"
                clickable
                onClick={() => {
                  handleContinueUse(params.id);
                }}
              />

              <Chip
                icon={<DeleteOutlineIcon />}
                label="Delete"
                color="error"
                clickable
                onClick={() => {
                  handleDelete(params.id);
                }}
              />
            </>
          )}
          {!showAllDraft && (
            <>
              <Chip
                icon={<EditNoteIcon />}
                label="Use"
                color="primary"
                clickable
                onClick={() => {
                  handleContinueUse(params.id);
                }}
              />
              <Chip
                icon={<DeleteOutlineIcon />}
                label="Delete"
                color="error"
                clickable
                onClick={() => {
                  handleDelete(params.id);
                }}
              />
            </>
          )}
        </Stack>
      ),
    },
  ];

  const rows = useMemo(() => {
    if (showAllDraft) return allDraft;
    else return allNonDraft;
  }, [allDraft, allNonDraft, showAllDraft]);

  return (
    <Box px={4} mt={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {showAllDraft ? "Showing Drafts" : "Showing All Shared PDFs"}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={showAllDraft}
              onChange={(event) => setShowAllDraft(event.target.checked)}
              inputProps={{
                "aria-label": "Show all drafts",
              }}
            />
          }
          label="Show All Drafts"
        />
      </Box>

      <DataGrid
        autoHeight
        getRowId={(row) => row.itinerary_id}
        rows={rows}
        disableRowSelectionOnClick
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            fontSize: "0.875rem",
          },
        }}
      />
    </Box>
  );
}
