import React from 'react';
import { useItinerary } from '../../context/ItineraryContext';

// Import our 3 unique layout components
import Theme1Classic from './themes/Theme1Classic';
import Theme2Midnight from './themes/Theme2Midnight';
import Theme3Coastal from './themes/Theme3Coastal';

export default function FinalItinerary() {
  const context = useItinerary();

  // Data Safety Net
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

  // Centralized Math Calculation
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

  // Route to the correct file based on the selected theme!
  const theme = safeData.client?.theme;

  if (theme === 'midnight') return <Theme2Midnight data={safeData} math={math} />;
  if (theme === 'coastal') return <Theme3Coastal data={safeData} math={math} />;
  
  // Default fallback
  return <Theme1Classic data={safeData} math={math} />;
}