import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { 
  Map, ChevronRight, Replay, Person, Hotel, Flight, 
  CalendarMonth, AttachMoney, ListAlt, Gavel, Style, Visibility 
} from '@mui/icons-material';
import { useItinerary } from '../context/ItineraryContext';

// Import all 9 of our step components!
import ClientDetails from '../components/itinerary/ClientDetails';
import StayDetails from '../components/itinerary/StayDetails';
import TransportDetails from '../components/itinerary/TransportDetails';
import DayPlanner from '../components/itinerary/DayPlanner';
import PriceDetails from '../components/itinerary/PriceDetails';
import InclExcl from '../components/itinerary/InclExcl';
import TermsConditions from '../components/itinerary/TermsConditions';
import ThemeSelection from '../components/itinerary/ThemeSelection';
import FinalItinerary from '../components/itinerary/FinalItinerary';

export default function ItineraryBuilder() {
  const { step, setStep } = useItinerary();
  
  const steps = [
    { label: 'Client Details', id: 1, icon: <Person fontSize="small" /> },
    { label: 'Hotels', id: 2, icon: <Hotel fontSize="small" /> },
    { label: 'Transport', id: 3, icon: <Flight fontSize="small" /> },
    { label: 'Day Planner', id: 4, icon: <CalendarMonth fontSize="small" /> },
    { label: 'Price Details', id: 5, icon: <AttachMoney fontSize="small" /> },
    { label: 'Incl & Excl', id: 6, icon: <ListAlt fontSize="small" /> },
    { label: 'Terms & Con', id: 7, icon: <Gavel fontSize="small" /> },
    { label: 'Template', id: 8, icon: <Style fontSize="small" /> },
    { label: 'Review', id: 9, icon: <Visibility fontSize="small" /> }
  ];

  const renderStepContent = () => {
    switch(step) {
      case 1: return <ClientDetails />;
      case 2: return <StayDetails />;
      case 3: return <TransportDetails />;
      case 4: return <DayPlanner />;
      case 5: return <PriceDetails />;
      case 6: return <InclExcl />;
      case 7: return <TermsConditions />;
      case 8: return <ThemeSelection />;
      case 9: return <FinalItinerary />;
      default: return <ClientDetails />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* 🚨 STICKY TOP WRAPPER: This locks the Header & Stepper to the top */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        bgcolor: '#ffffff', // Solid background so scrolling content goes BEHIND it
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)' // Slight shadow for depth
      }}>
        
        {/* HEADER */}
        <Box sx={{ p: { xs: 2, md: 5 }, pb: { xs: 2, md: 2 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2.125rem' }, color: 'text.primary' }}>
              Itinerary Builder
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Craft bespoke travel experiences for your clientele.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
            <Button variant="outlined" startIcon={<Replay />} sx={{ flexGrow: { xs: 1, md: 0 }, color: 'text.primary', borderColor: 'divider' }}>
              Reset
            </Button>
            {step === 9 ? (
               <Button variant="contained" onClick={() => window.open('/preview', '_blank')} sx={{ flexGrow: { xs: 1, md: 0 }, bgcolor: '#00c6ff', color: '#fff', '&:hover': { bgcolor: '#00b4e6' } }}>
                 Share PDF
               </Button>
            ) : (
               <Button variant="contained" sx={{ flexGrow: { xs: 1, md: 0 }, bgcolor: '#00c6ff', color: '#fff', '&:hover': { bgcolor: '#00b4e6' } }}>
                 Save Draft
               </Button>
            )}
          </Box>
        </Box>

        {/* STEPPER */}
        <Box sx={{ px: { xs: 2, md: 5 }, display: 'flex', overflowX: 'auto', pb: 3, gap: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
          {steps.map((s, idx) => {
            const isActive = step === s.id;
            const isPassed = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <Chip 
                  label={s.label} icon={s.icon} onClick={() => (isPassed || isActive) && setStep(s.id)}
                  sx={{ 
                    bgcolor: isActive ? 'primary.main' : (isPassed ? 'background.default' : 'background.paper'), 
                    color: isActive ? '#fff' : (isPassed ? 'text.primary' : 'text.secondary'), 
                    border: isPassed ? '1px solid' : '1px solid transparent',
                    borderColor: 'divider',
                    borderRadius: 2, px: 1, py: { xs: 2, md: 2.5 }, 
                    fontWeight: isActive ? 700 : 600, 
                    cursor: isPassed ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    '& .MuiChip-icon': { color: isActive ? '#fff' : (isPassed ? 'text.primary' : 'text.secondary') },
                    '&:hover': { bgcolor: isPassed ? 'background.default' : undefined }
                  }} 
                />
                {idx < steps.length - 1 && <ChevronRight sx={{ color: 'divider', mx: 0.5 }} />}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>

      {/* 🚨 INNER SCROLL CONTENT AREA */}
      {/* We added a big pt (Padding Top) so it doesn't touch the stepper, and a massive pb (Padding Bottom) to clear your Profit/Cost bar! */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: step === 9 ? 0 : { xs: 2, md: 5 }, 
        pt: step === 9 ? 0 : { xs: 4, md: 6 }, // Pushes form down from the sticky header
        pb: step === 9 ? 0 : '160px' // Guaranteed clearance for your bottom fixed bar!
      }}>
        {renderStepContent()}
      </Box>
      
    </Box>
  );
}