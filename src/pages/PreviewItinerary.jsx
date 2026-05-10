import React from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { ArrowBack, Print } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';

// Import Themes
import Theme1Classic from '../components/itinerary/themes/Theme1Classic';
import Theme2Midnight from '../components/itinerary/themes/Theme2Midnight';
import Theme3Coastal from '../components/itinerary/themes/Theme3Coastal';

export default function PreviewItinerary() {
  const navigate = useNavigate();
  const context = useItinerary();

  // 1. SAFELY GRAB ALL DATA FROM CONTEXT
  const safeData = {
    client: context?.clientData || {},
    themeConfig: context?.themeConfig || {}, // Custom colors/images
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

  // 🚨 3. THE BULLETPROOF PRINT FUNCTION
  const handlePrint = () => {
    // This triggers the native browser print/save-to-pdf dialog instantly
    window.print();
  };

  // 4. DETERMINE WHICH THEME TO SHOW
  const theme = safeData.client?.theme || 'coastal'; // Defaulting to Coastal
  
  const renderTheme = () => {
    if (theme === 'midnight') return <Theme2Midnight data={safeData} math={math} />;
    if (theme === 'coastal') return <Theme3Coastal data={safeData} math={math} />;
    return <Theme1Classic data={safeData} math={math} />;
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
      {/* 🚨 FLOATING ACTION BUTTONS */}
      {/* We add the class "hide-on-print" so these disappear when the PDF is generating */}
      <Box 
        className="hide-on-print"
        sx={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', gap: 2, zIndex: 1000 }}
      >
        <Tooltip title="Back to Builder" placement="top">
          <Fab color="default" onClick={() => navigate(-1)} sx={{ bgcolor: '#fff' }}>
            <ArrowBack />
          </Fab>
        </Tooltip>
        <Tooltip title="Download PDF" placement="top">
          <Fab color="primary" onClick={handlePrint} sx={{ bgcolor: '#00c6ff', '&:hover': { bgcolor: '#00b4e6' } }}>
            <Print />
          </Fab>
        </Tooltip>
      </Box>

      {/* THEME RENDERER */}
      <Box sx={{ bgcolor: '#fff' }}>
        {renderTheme()}
      </Box>

      {/* 🚨 CSS MAGIC FOR PERFECT PDF EXPORT */}
      <style>
        {`
          @media print {
            /* 1. Hide the floating buttons completely */
            .hide-on-print { 
              display: none !important; 
            }
            
            /* 2. Force the browser to print background colors and images */
            body { 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
              background-color: white !important;
            }

            /* 3. Remove default browser margins, dates, and URLs from the PDF edges */
            @page { 
              size: auto;
              margin: 0mm; 
            }
          }
        `}
      </style>
    </Box>
  );
}