import React, { createContext, useState, useContext, useEffect } from "react";
import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";
import { useNavigate } from "react-router-dom";
const ItineraryContext = createContext();

export const useItinerary = () => useContext(ItineraryContext);

// Helper function to load saved data safely
const loadSavedData = () => {
  const saved = localStorage.getItem("atlas_itinerary_data");
  return saved ? JSON.parse(saved) : null;
};

const sanitizeImagesForStorage = (images = []) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (typeof img === "string") {
        if (img.startsWith("data:") || img.startsWith("blob:")) return null;
        return img;
      }
      if (img && typeof img === "object") {
        if (img.id) return { id: img.id };
        if (img.url && typeof img.url === "string" && img.url.startsWith("http")) {
          return { url: img.url };
        }
      }
      return null;
    })
    .filter(Boolean);
};

const sanitizeDayPlannerForStorage = (days = []) => {
  if (!Array.isArray(days)) return days;
  return days.map((day) => ({
    ...day,
    images: sanitizeImagesForStorage(day?.images),
  }));
};

const getDefaultStayData = () => ({ hotels: [] });
const getDefaultTransportData = () => ({
  trains: [],
  buses: [],
  grounds: [],
  flights: [],
});
const getDefaultDayPlannerData = () => [{ day: 1, title: "", description: "" }];
const getDefaultPriceData = () => ({
  items: [
    {
      id: Date.now(),
      category: "Accommodation",
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ],
  taxes: { gst: 18, serviceTax: 5 },
  discount: { type: "Percentage (%)", value: 0 },
});
const getDefaultInclExclData = () => ({
  inclusions: {
    accommodation: false,
    guide: false,
    meals: false,
    optionalTours: false,
    taxes: false,
    travelInsurance: false,
  },
  exclusions: {
    airfare: false,
    personalExpenses: false,
    tips: false,
    optionalTours: false,
    visaFees: false,
    travelInsurance: false,
  },
});

export const ItineraryProvider = ({ children, onLogin }) => {
  const { api, login, setUser } = useApi();
  const savedData = loadSavedData();

  // Navigation & Theme
  const [step, setStep] = useState(savedData?.step || 1);
  const [selectedThemeId, setSelectedThemeId] = useState(
    savedData?.selectedThemeId || "Pearl",
  );
  const navigate = useNavigate();
  useEffect(() => {
    const connectionSession = async () => {
      const session = await api.auth.getUserSession();
      if (!session?.idToken) {
        navigate("/login");
        return;
      }
      await login(session.idToken);

      const user = await api.auth.loadUserDetails();
      setUser(user);

      onLogin?.();
    };
    connectionSession();
  }, []);

  // Global Settings
  const [settings, setSettings] = useState(
    savedData?.settings || {
      font: '"Inter", sans-serif',
      logo: null,
      primaryColor: "#00c6ff",
      mode: "light",
    },
  );

  // 1. Client Details
  // const [clientData, setClientData] = useState(savedData?.clientData || {
  //   salutation: 'Mr', name: '', contact: '', email: '',
  //   destination: '', hotelPref: '', handler: '',
  //   dateFrom: '', dateTo: '', nights: 0, days: 0, adults: 0, children: 0, infant: 'no'
  // });

  const [clientData, setClientData] = useState();

  // 2. Stay Details
  const [stayData, setStayData] = useState(
    savedData?.stayData || getDefaultStayData(),
  );

  // 3. Transport Details
  const [transportData, setTransportData] = useState(
    savedData?.transportData || getDefaultTransportData(),
  );

  // 4. Day Planner
  const [dayPlannerData, setDayPlannerData] = useState(
    savedData?.dayPlannerData || getDefaultDayPlannerData(),
  );

  // 5. Price Details
  const [priceData, setPriceData] = useState(
    savedData?.priceData || getDefaultPriceData(),
  );

  // 6. Inclusions & Exclusions
  const [inclExclData, setInclExclData] = useState(
    savedData?.inclExclData || getDefaultInclExclData(),
  );

  // 7. Terms & Conditions
  const [termsData, setTermsData] = useState(savedData?.termsData || {});

  // --- Auto-Save Mechanism ---
  // Saves all your builder data every time you change something
  useEffect(() => {
    const safeDayPlannerData = sanitizeDayPlannerForStorage(dayPlannerData);
    const dataToSave = {
      step,
      selectedThemeId,
      settings,
      clientData,
      stayData,
      transportData,
      dayPlannerData: safeDayPlannerData,
      priceData,
      inclExclData,
      termsData,
    };
    try {
      localStorage.setItem("atlas_itinerary_data", JSON.stringify(dataToSave));
    } catch (error) {
      if (error?.name === "QuotaExceededError") {
        const compactDataToSave = {
          ...dataToSave,
          dayPlannerData: safeDayPlannerData.map((day) => ({
            ...day,
            images: [],
          })),
        };
        localStorage.setItem(
          "atlas_itinerary_data",
          JSON.stringify(compactDataToSave),
        );
      } else {
        throw error;
      }
    }
  }, [
    step,
    selectedThemeId,
    settings,
    clientData,
    stayData,
    transportData,
    dayPlannerData,
    priceData,
    inclExclData,
    termsData,
  ]);

  // --- Dynamic Real-Time Budget Calculation ---
  const subtotal = priceData.items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );
  const gstAmount = subtotal * ((priceData.taxes.gst || 0) / 100);
  const serviceTaxAmount = subtotal * ((priceData.taxes.serviceTax || 0) / 100);
  const discountAmount =
    priceData.discount.type === "Percentage (%)"
      ? subtotal * ((priceData.discount.value || 0) / 100)
      : priceData.discount.value || 0;

  const grandTotal = subtotal + gstAmount + serviceTaxAmount - discountAmount;

  const reviewData = {
    budget: `$${grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };

  // Step Handlers
  const handleNext = () => setStep((prev) => Math.min(prev + 1, 9));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));
  const resetItineraryState = () => {
    setClientData({});
    setStayData(getDefaultStayData());
    setTransportData(getDefaultTransportData());
    setDayPlannerData(getDefaultDayPlannerData());
    setPriceData(getDefaultPriceData());
    setInclExclData(getDefaultInclExclData());
    setTermsData({});
    setSelectedThemeId("Pearl");
    setStep(1);
    localStorage.removeItem("atlas_itinerary_data");
  };

  return (
    <ItineraryContext.Provider
      value={{
        step,
        setStep,
        handleNext,
        handlePrev,
        settings,
        setSettings,
        clientData,
        setClientData,
        stayData,
        setStayData,
        transportData,
        setTransportData,
        dayPlannerData,
        setDayPlannerData,
        priceData,
        setPriceData,
        inclExclData,
        setInclExclData,
        termsData,
        setTermsData,
        selectedThemeId,
        setSelectedThemeId,
        reviewData,
        resetItineraryState,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};
