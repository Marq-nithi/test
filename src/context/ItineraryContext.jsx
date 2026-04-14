import React, { createContext, useState, useContext, useEffect } from 'react';

const ItineraryContext = createContext();

export const useItinerary = () => useContext(ItineraryContext);

// Helper function to load saved data safely
const loadSavedData = () => {
  const saved = localStorage.getItem('atlas_itinerary_data');
  return saved ? JSON.parse(saved) : null;
};

export const ItineraryProvider = ({ children }) => {
  const savedData = loadSavedData();

  // Navigation & Theme
  const [step, setStep] = useState(savedData?.step || 1);
  const [selectedThemeId, setSelectedThemeId] = useState(savedData?.selectedThemeId || 'Pearl');

  // Global Settings
  const [settings, setSettings] = useState(savedData?.settings || {
    font: '"Inter", sans-serif',
    logo: null, 
    primaryColor: '#00c6ff',
    mode: 'light' 
  });

  // 1. Client Details
  const [clientData, setClientData] = useState(savedData?.clientData || {
    salutation: 'Mr', name: '', contact: '', email: '', 
    destination: '', hotelPref: '', handler: '', 
    dateFrom: '', dateTo: '', nights: 0, days: 0, adults: 0, children: 0, infant: 'no'
  });

  // 2. Stay Details
  const [stayData, setStayData] = useState(savedData?.stayData || {
    location: '', hotelName: '', roomCat: '', checkInDate: '', checkOutDate: '',
    rooms: 1, nights: 1, meals: { breakfast: false, lunch: false, dinner: false, allInclusive: false }
  });

  // 3. Transport Details
  const [transportData, setTransportData] = useState(savedData?.transportData || {
    type: 'flight', depFrom: '', arrAt: '', passengers: '', airline: '', flightNo: '', depDate: '', pickup: '', dropoff: '', vehicle: ''
  });

  // 4. Day Planner
  const [dayPlannerData, setDayPlannerData] = useState(savedData?.dayPlannerData || [
    { day: 1, title: '', description: '' }
  ]);

  // 5. Price Details
  const [priceData, setPriceData] = useState(savedData?.priceData || {
    items: [
      { id: Date.now(), category: 'Accommodation', description: '', quantity: 1, unitPrice: 0 }
    ],
    taxes: { gst: 18, serviceTax: 5 },
    discount: { type: 'Percentage (%)', value: 0 }
  });

  // 6. Inclusions & Exclusions
  const [inclExclData, setInclExclData] = useState(savedData?.inclExclData || {
    inclusions: { accommodation: false, guide: false, meals: false, optionalTours: false, taxes: false, travelInsurance: false },
    exclusions: { airfare: false, personalExpenses: false, tips: false, optionalTours: false, visaFees: false, travelInsurance: false },
  });

  // 7. Terms & Conditions
  const [termsData, setTermsData] = useState(savedData?.termsData || '');

  // --- Auto-Save Mechanism ---
  // Saves all your builder data every time you change something
  useEffect(() => {
    const dataToSave = {
      step, selectedThemeId, settings, clientData, stayData, 
      transportData, dayPlannerData, priceData, inclExclData, termsData
    };
    localStorage.setItem('atlas_itinerary_data', JSON.stringify(dataToSave));
  }, [step, selectedThemeId, settings, clientData, stayData, transportData, dayPlannerData, priceData, inclExclData, termsData]);

  // --- Dynamic Real-Time Budget Calculation ---
  const subtotal = priceData.items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)), 0);
  const gstAmount = subtotal * ((priceData.taxes.gst || 0) / 100);
  const serviceTaxAmount = subtotal * ((priceData.taxes.serviceTax || 0) / 100);
  const discountAmount = priceData.discount.type === 'Percentage (%)' 
    ? subtotal * ((priceData.discount.value || 0) / 100)
    : (priceData.discount.value || 0);
    
  const grandTotal = subtotal + gstAmount + serviceTaxAmount - discountAmount;

  const reviewData = { 
    budget: `$${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
  };

  // Step Handlers
  const handleNext = () => setStep((prev) => Math.min(prev + 1, 9));
  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <ItineraryContext.Provider value={{
      step, setStep, handleNext, handlePrev,
      settings, setSettings,
      clientData, setClientData,
      stayData, setStayData,
      transportData, setTransportData,
      dayPlannerData, setDayPlannerData,
      priceData, setPriceData,
      inclExclData, setInclExclData,
      termsData, setTermsData,
      selectedThemeId, setSelectedThemeId,
      reviewData
    }}>
      {children}
    </ItineraryContext.Provider>
  );
};