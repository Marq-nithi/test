import React, { useRef } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import { ArrowBack, Download } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useItinerary } from '../context/ItineraryContext';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Theme1Classic from '../components/itinerary/themes/Theme1Classic';
import Theme2Midnight from '../components/itinerary/themes/Theme2Midnight';
import Theme3Coastal from '../components/itinerary/themes/Theme3Coastal';

export default function PreviewItinerary() {
  const navigate = useNavigate();
  const context = useItinerary();
  const liveScreenRef = useRef(null);

  const handlePrint = async () => {
    if (!liveScreenRef.current) return;

    try {
      // 1. Force wait for all images inside the ref to load
      const images = liveScreenRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
        })
      );

      // 2. Small delay to ensure React state has finished painting inputs
      await new Promise(resolve => setTimeout(resolve, 400));

      // 3. Take snapshot of the LIVE ref (not searching the whole document)
      const canvas = await html2canvas(liveScreenRef.current, {
        scale: 2, 
        useCORS: true, 
        allowTaint: false,
        backgroundColor: "#ffffff", 
        windowWidth: 1200, 
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdfWidth = 210; 
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width; 

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight], 
      });

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      
      const clientName = context?.clientData?.name ? context.clientData.name.trim().replace(/\s+/g, '_') : "Itinerary";
      pdf.save(`Itinerary_${clientName}.pdf`);
    } catch (error) {
      console.error("PDF Capture Error:", error);
    }
  };

  const theme = context?.clientData?.theme || 'coastal';
  
  // Directly use the context values so it always reads the "live" state
  const renderTheme = () => {
    if (theme === 'midnight') return <Theme2Midnight />;
    if (theme === 'coastal') return <Theme3Coastal />;
    return <Theme1Classic />;
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      
      <Box className="hide-on-print" sx={{ position: 'fixed', bottom: 32, right: 32, display: 'flex', gap: 2, zIndex: 1000 }}>
        <Tooltip title="Back to Builder"><Fab color="default" onClick={() => navigate(-1)}><ArrowBack /></Fab></Tooltip>
        <Tooltip title="Download PDF"><Fab color="primary" onClick={handlePrint}><Download /></Fab></Tooltip>
      </Box>

      {/* 🚨 THE REF ATTACHMENT HERE IS WHY IT NOW SHOWS CURRENT DATA */}
      <Box ref={liveScreenRef} sx={{ bgcolor: '#fff' }}>
        {renderTheme()}
      </Box>

      <style>{`
        @media print { .hide-on-print { display: none !important; } }
      `}</style>
    </Box>
  );
}