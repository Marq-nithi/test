import React, { useRef } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { ArrowBack, Print } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useItinerary } from '../context/ItineraryContext';

// Import Themes
import Theme1Classic from '../components/itinerary/themes/Theme1Classic';
import Theme2Midnight from '../components/itinerary/themes/Theme2Midnight';
import Theme3Coastal from '../components/itinerary/themes/Theme3Coastal';

export default function PreviewItinerary() {
  const navigate = useNavigate();
  const context = useItinerary();
  const printRef = useRef();

  // 1. SAFELY GRAB ALL DATA FROM CONTEXT
  const safeData = {
    client: context?.clientData || {},
    stay: { hotels: Array.isArray(context?.stayData?.hotels) ? context.stayData.hotels : [] },
    transport: {
      types: context?.transportData?.types || {},
      flights: Array.isArray(context?.transportData?.flights) ? context.transportData.flights : [],
      trains: Array.isArray(context?.transportData?.trains) ? context.transportData.trains : [],
      grounds: Array.isArray(context?.transportData?.grounds) ? context.transportData.grounds : []
    },
    days: Array.isArray(context?.dayPlannerData) ? context.dayPlannerData : [],
    price: context?.priceData || { items: [], taxes: {}, discount: {} },
    inclExcl: { 
      inclusions: Array.isArray(context?.inclExclData?.inclusions) ? context.inclExclData.inclusions : [], 
      exclusions: Array.isArray(context?.inclExclData?.exclusions) ? context.inclExclData.exclusions : [] 
    },
    terms: Array.isArray(context?.termsData) ? context.termsData : []
  };

  // 2. CALCULATE PRICING MATH
  const safeItems = Array.isArray(safeData.price?.items) ? safeData.price.items : [];
  const subtotal = safeItems.reduce((sum, item) => sum + ((Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0)), 0);
  const gst = subtotal * ((Number(safeData.price?.taxes?.gst) || 0) / 100);
  const discount = safeData.price?.discount?.type === 'Percentage (%)' 
    ? subtotal * ((Number(safeData.price?.discount?.value) || 0) / 100) 
    : (Number(safeData.price?.discount?.value) || 0);
  
  const math = { 
    subtotal, 
    gst, 
    discount, 
    grandTotal: subtotal + gst - discount 
  };

  // 3. PRINT FUNCTION
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${safeData.client?.clientName || 'Client'}_Itinerary`,
    pageStyle: `@page { size: auto; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`
  });

  // 4. DETERMINE WHICH THEME TO SHOW
  const theme = safeData.client?.theme || 'coastal'; // Defaulting to Coastal for your screenshot
  
  const renderTheme = () => {
    if (theme === 'midnight') return <Theme2Midnight data={safeData} math={math} />;
    if (theme === 'coastal') return <Theme3Coastal data={safeData} math={math} />;
    return <Theme1Classic data={safeData} math={math} />;
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
      {/* FLOATING ACTION BUTTONS (Hidden during print) */}
      <Box sx={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', gap: 2, zIndex: 1000, '@media print': { display: 'none' } }}>
        <Tooltip title="Back to Builder" placement="top">
          <Fab color="default" onClick={() => navigate('/itinerary-builder')} sx={{ bgcolor: '#fff' }}>
            <ArrowBack />
          </Fab>
        </Tooltip>
        <Tooltip title="Print / PDF" placement="top">
          <Fab color="primary" onClick={handlePrint} sx={{ bgcolor: '#00c6ff', '&:hover': { bgcolor: '#00b4e6' } }}>
            <Print />
          </Fab>
        </Tooltip>
      </Box>

      {/* THEME RENDERER */}
      <Box ref={printRef}>
        {renderTheme()}
      </Box>

    </Box>
  );
}