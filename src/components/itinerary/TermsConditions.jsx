import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Button, Checkbox, FormControlLabel, 
  TextField, IconButton, Divider
} from '@mui/material';
import { 
  FormatBold, FormatItalic, FormatUnderlined, 
  FormatAlignLeft, FormatAlignCenter, FormatAlignRight,
  FormatColorText
} from '@mui/icons-material';

import { useItinerary } from '../../context/ItineraryContext'; 

// ==========================================
// 📝 PREDEFINED DEFAULT TEXTS
// ==========================================
const DEFAULT_TERMS = [
  "Review all itinerary details carefully before confirming your booking.",
  "Ensure your travel documents (passport, visa, insurance) are valid and up to date.",
  "Acknowledge that itinerary changes may occur due to unforeseen circumstances.",
  "Confirm that you have read and accepted the terms & conditions and privacy policy."
];

const DEFAULT_POLICIES = [
  "Be aware of cancellation timelines and applicable charges before booking.",
  "Understand that last-minute cancellations may result in higher fees or no refund.",
  "Allow processing time for eligible refunds as per policy guidelines.",
  "Accept that no-shows or unused services are non-refundable."
];

const DEFAULT_PAYMENTS = [
  "A 50% deposit is required at the time of booking to secure your reservation.",
  "The remaining balance must be paid in full 30 days prior to the departure date.",
  "Payments can be made via credit card, bank transfer, or secure online payment gateway.",
  "Late payments may result in the automatic cancellation of your booking."
];

const DEFAULT_PROTECTIONS = [
  "We strongly recommend purchasing comprehensive travel insurance for your trip.",
  "Travel protection plans cover trip cancellations, medical emergencies, and lost baggage.",
  "Insurance premiums are 100% non-refundable once the policy is issued.",
  "The agency is not liable for costs incurred due to travel disruptions if insurance is declined."
];


export default function TermsAndConditions() {
  const { termsData, setTermsData } = useItinerary();

  // ==========================================
  // 💾 STATE MANAGEMENT
  // ==========================================
  
  // Selected Items (Checked boxes)
  const [selectedTerms, setSelectedTerms] = useState(termsData?.terms || []);
  const [selectedPolicies, setSelectedPolicies] = useState(termsData?.policies || []);
  const [selectedPayments, setSelectedPayments] = useState(termsData?.payments || []);
  const [selectedProtections, setSelectedProtections] = useState(termsData?.protections || []);
  
  // Custom Added Items (From the text boxes)
  const [customTermsList, setCustomTermsList] = useState(termsData?.customTerms || []);
  const [customPoliciesList, setCustomPoliciesList] = useState(termsData?.customPolicies || []);
  const [customPaymentsList, setCustomPaymentsList] = useState(termsData?.customPayments || []);
  const [customProtectionsList, setCustomProtectionsList] = useState(termsData?.customProtections || []);

  // Text Box Inputs
  const [customTermInput, setCustomTermInput] = useState('');
  const [customPolicyInput, setCustomPolicyInput] = useState('');
  const [customPaymentInput, setCustomPaymentInput] = useState('');
  const [customProtectionInput, setCustomProtectionInput] = useState('');

  // Sync Everything to Global Context
  useEffect(() => {
    if (setTermsData) {
      setTermsData({
        terms: selectedTerms, 
        policies: selectedPolicies, 
        payments: selectedPayments, 
        protections: selectedProtections,
        customTerms: customTermsList, 
        customPolicies: customPoliciesList, 
        customPayments: customPaymentsList, 
        customProtections: customProtectionsList
      });
    }
  }, [
    selectedTerms, selectedPolicies, selectedPayments, selectedProtections, 
    customTermsList, customPoliciesList, customPaymentsList, customProtectionsList, 
    setTermsData
  ]);

  // ==========================================
  // 🛠️ UNIVERSAL HANDLERS
  // ==========================================
  
  // Toggles a single checkbox
  const handleToggle = (item, selectedList, setSelectedList) => {
    setSelectedList(prev => prev.includes(item) ? prev.filter(t => t !== item) : [...prev, item]);
  };

  // Handles "Select All"
  const handleSelectAll = (e, defaultList, customList, setSelectedList) => {
    if (e.target.checked) {
      setSelectedList([...defaultList, ...customList]);
    } else {
      setSelectedList([]);
    }
  };

  // Handles adding a custom typed rule
  const handleAddCustom = (input, setInput, customList, setCustomList, selectedList, setSelectedList) => {
    if (input.trim()) {
      setCustomList([...customList, input.trim()]);
      setSelectedList([...selectedList, input.trim()]); // Auto-check it
      setInput('');
    }
  };

  // Clears the entire page
  const handleClearAll = () => {
    setSelectedTerms([]); setSelectedPolicies([]); setSelectedPayments([]); setSelectedProtections([]);
    setCustomTermsList([]); setCustomPoliciesList([]); setCustomPaymentsList([]); setCustomProtectionsList([]);
    setCustomTermInput(''); setCustomPolicyInput(''); setCustomPaymentInput(''); setCustomProtectionInput('');
  };


  // ==========================================
  // 🧩 REUSABLE UI COMPONENTS
  // ==========================================
  
  const RichTextToolbar = () => (
    <Box sx={{ display: 'flex', gap: 1, p: 1, borderBottom: '1px solid #e2e8f0', bgcolor: '#f8fafc', alignItems: 'center' }}>
      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatBold fontSize="small" sx={{ color: '#475569' }} /></IconButton>
      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatItalic fontSize="small" sx={{ color: '#475569' }} /></IconButton>
      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatUnderlined fontSize="small" sx={{ color: '#475569' }} /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatAlignLeft fontSize="small" sx={{ color: '#475569' }} /></IconButton>
      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatAlignCenter fontSize="small" sx={{ color: '#475569' }} /></IconButton>
      <IconButton size="small" sx={{ borderRadius: 1 }}><FormatAlignRight fontSize="small" sx={{ color: '#475569' }} /></IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', px: 0.5 }}>
        <Box sx={{ width: 14, height: 14, bgcolor: '#0f172a', borderRadius: 0.5, mr: 0.5 }} />
        <FormatColorText fontSize="small" sx={{ color: '#94a3b8' }} />
      </Box>
    </Box>
  );

  // A reusable section block so we don't repeat the same layout 4 times
  const SectionBlock = ({ 
    title, defaultList, customList, selectedList, setSelectedList, 
    inputValue, setInputValue, setCustomList, buttonText 
  }) => {
    const isAllSelected = selectedList.length === (defaultList.length + customList.length) && (defaultList.length > 0);

    return (
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
        <Typography variant="subtitle1" fontWeight="800" color="#0f172a" mb={2}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          <FormControlLabel 
            control={<Checkbox checked={isAllSelected} onChange={(e) => handleSelectAll(e, defaultList, customList, setSelectedList)} sx={{ '&.Mui-checked': { color: '#0ea5e9' } }} />} 
            label={<Typography variant="body2" fontWeight="700" color="#0f172a">Select All</Typography>} 
          />
          
          {[...defaultList, ...customList].map((item, index) => (
            <FormControlLabel 
              key={`${title}-item-${index}`}
              control={<Checkbox checked={selectedList.includes(item)} onChange={() => handleToggle(item, selectedList, setSelectedList)} sx={{ '&.Mui-checked': { color: '#0ea5e9' } }} />} 
              label={<Typography variant="body2" color="#334155">{item}</Typography>} 
            />
          ))}
        </Box>

        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', mb: 2 }}>
          <RichTextToolbar />
          <TextField 
            fullWidth multiline rows={3} placeholder="Type custom terms here..." 
            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            sx={{ '& fieldset': { border: 'none' }, p: 1 }}
          />
        </Box>

        <Button 
          variant="contained" size="small" 
          onClick={() => handleAddCustom(inputValue, setInputValue, customList, setCustomList, selectedList, setSelectedList)}
          disabled={!inputValue.trim()}
          sx={{ bgcolor: '#0ea5e9', color: '#fff', fontWeight: 600, textTransform: 'none', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#0284c7' } }}
        >
          {buttonText}
        </Button>
      </Paper>
    );
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', pb: 12 }}>
      
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="900" color="#0f172a" mb={0.5}>Terms & Conditions</Typography>
          <Typography variant="body2" color="#64748b">
            Define all legal, payment, and protection terms for your client's trip
          </Typography>
        </Box>
        <Button 
          variant="outlined" size="small" onClick={handleClearAll}
          sx={{ borderColor: '#cbd5e1', color: '#475569', fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 3, bgcolor: '#fff' }}
        >
          Clear All
        </Button>
      </Box>

      {/* RENDER SECTIONS USING THE REUSABLE BLOCK */}
      <SectionBlock 
        title="Terms & Con" buttonText="Add Terms & Con"
        defaultList={DEFAULT_TERMS} customList={customTermsList} selectedList={selectedTerms}
        setSelectedList={setSelectedTerms} setCustomList={setCustomTermsList}
        inputValue={customTermInput} setInputValue={setCustomTermInput}
      />

      <SectionBlock 
        title="Cancellation Policy" buttonText="Add Policy"
        defaultList={DEFAULT_POLICIES} customList={customPoliciesList} selectedList={selectedPolicies}
        setSelectedList={setSelectedPolicies} setCustomList={setCustomPoliciesList}
        inputValue={customPolicyInput} setInputValue={setCustomPolicyInput}
      />

      <SectionBlock 
        title="Payment Terms" buttonText="Add Payment Term"
        defaultList={DEFAULT_PAYMENTS} customList={customPaymentsList} selectedList={selectedPayments}
        setSelectedList={setSelectedPayments} setCustomList={setCustomPaymentsList}
        inputValue={customPaymentInput} setInputValue={setCustomPaymentInput}
      />

      <SectionBlock 
        title="Travel Protection" buttonText="Add Protection Term"
        defaultList={DEFAULT_PROTECTIONS} customList={customProtectionsList} selectedList={selectedProtections}
        setSelectedList={setSelectedProtections} setCustomList={setCustomProtectionsList}
        inputValue={customProtectionInput} setInputValue={setCustomProtectionInput}
      />

    </Box>
  );
}