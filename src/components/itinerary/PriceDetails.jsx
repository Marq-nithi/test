import React from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Select, MenuItem, 
  Button, IconButton 
} from '@mui/material';
import { DeleteOutline, Add } from '@mui/icons-material';
import { useItinerary } from '../../context/ItineraryContext';

export default function PriceDetails() {
  const { priceData, setPriceData } = useItinerary();

  // --- HANDLERS ---
  const handleAddItem = () => {
    setPriceData({
      ...priceData,
      items: [
        ...priceData.items, 
        { id: Date.now(), category: 'Accommodation', description: '', quantity: 1, unitPrice: 0 }
      ]
    });
  };

  const handleRemoveItem = (id) => {
    setPriceData({
      ...priceData,
      items: priceData.items.filter(item => item.id !== id)
    });
  };

  const handleItemChange = (id, field, value) => {
    setPriceData({
      ...priceData,
      items: priceData.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const handleTaxChange = (field, value) => {
    setPriceData({ 
      ...priceData, 
      taxes: { ...priceData.taxes, [field]: Number(value) || 0 } 
    });
  };

  const handleDiscountChange = (field, value) => {
    setPriceData({ 
      ...priceData, 
      discount: { ...priceData.discount, [field]: field === 'value' ? Number(value) || 0 : value } 
    });
  };

  const handleClearAll = () => {
    setPriceData({
      items: [{ id: Date.now(), category: 'Accommodation', description: '', quantity: 1, unitPrice: 0 }],
      taxes: { gst: 0, serviceTax: 0 },
      discount: { type: 'Percentage (%)', value: 0 }
    });
  };

  // --- CALCULATIONS ---
  const subtotal = priceData.items.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)), 0);
  const gstAmount = subtotal * ((priceData.taxes.gst || 0) / 100);
  const serviceTaxAmount = subtotal * ((priceData.taxes.serviceTax || 0) / 100);
  
  const discountAmount = priceData.discount.type === 'Percentage (%)' 
    ? subtotal * ((priceData.discount.value || 0) / 100)
    : (priceData.discount.value || 0);

  const grandTotal = subtotal + gstAmount + serviceTaxAmount - discountAmount;

  const formatCurrency = (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const categories = ['Accommodation', 'Transportation', 'Trip Cost', 'Activities', 'Flight Cost', 'Train Cost'];

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>Price Details</Typography>
          <Typography variant="body2" color="text.secondary">Set the prices for your client's trip</Typography>
        </Box>
        <Button onClick={handleClearAll} variant="outlined" sx={{ color: '#1a1a1a', borderColor: '#e0e0e0', textTransform: 'none', fontWeight: 600 }}>
          Clear All
        </Button>
      </Box>

      {/* --- PRICE BREAKDOWN TABLE --- */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="700">Price Breakdown</Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={handleAddItem} sx={{ textTransform: 'none', fontWeight: 600, color: '#1a1a1a', borderColor: '#e0e0e0' }}>
            Add Item
          </Button>
        </Box>

        {/* Table Headers (Hidden on Mobile/Tablet) */}
        <Grid container spacing={2} sx={{ mb: 2, px: 1, display: { xs: 'none', md: 'flex' } }}>
          <Grid item md={3}><Typography variant="body2" color="text.secondary" fontWeight="600">Category</Typography></Grid>
          <Grid item md={3.5}><Typography variant="body2" color="text.secondary" fontWeight="600">Description</Typography></Grid>
          <Grid item md={1.5}><Typography variant="body2" color="text.secondary" fontWeight="600">Quantity</Typography></Grid>
          <Grid item md={1.5}><Typography variant="body2" color="text.secondary" fontWeight="600">Unit Price</Typography></Grid>
          <Grid item md={1.5}><Typography variant="body2" color="text.secondary" fontWeight="600">Total</Typography></Grid>
          <Grid item md={1}></Grid>
        </Grid>

        {/* Dynamic Rows with Perfect Bulletproof Grid Math */}
        {priceData.items.map((item) => {
          const rowTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
          return (
            <Grid container spacing={2} alignItems="center" key={item.id} sx={{ mb: { xs: 4, md: 2 }, borderBottom: { xs: '1px solid #eee', md: 'none' }, pb: { xs: 3, md: 0 } }}>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>Category</Typography>
                <Select fullWidth size="small" value={item.category} onChange={(e) => handleItemChange(item.id, 'category', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }}>
                  {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3.5}>
                <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>Description</Typography>
                <TextField fullWidth size="small" placeholder="Item description" value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }} />
              </Grid>
              
              <Grid item xs={6} sm={3} md={1.5}>
                <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>Quantity</Typography>
                <TextField fullWidth size="small" type="number" value={item.quantity === 0 ? '' : item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }} />
              </Grid>
              
              <Grid item xs={6} sm={3} md={1.5}>
                <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>Unit Price</Typography>
                <TextField fullWidth size="small" type="number" value={item.unitPrice === 0 ? '' : item.unitPrice} onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }} />
              </Grid>
              
              <Grid item xs={9} sm={4} md={1.5} sx={{ mt: { xs: 1, md: 0 } }}>
                <Typography variant="caption" sx={{ display: { xs: 'block', md: 'none' }, mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>Total</Typography>
                <Typography variant="body1" fontWeight="700">{formatCurrency(rowTotal)}</Typography>
              </Grid>
              
              <Grid item xs={3} sm={2} md={1} sx={{ textAlign: 'right', mt: { xs: 1, md: 0 }, pt: { xs: '26px !important', md: '16px !important' } }}>
                <IconButton onClick={() => handleRemoveItem(item.id)} sx={{ color: '#ef5350', border: '1px solid #ffebee', bgcolor: '#fffafb' }} size="small">
                  <DeleteOutline fontSize="small" />
                </IconButton>
              </Grid>

            </Grid>
          );
        })}
      </Paper>

      {/* --- TAXES & DISCOUNTS --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="700" mb={3}>% Taxes</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" mb={1} fontWeight="600">GST (%)</Typography>
                <TextField fullWidth size="small" type="number" value={priceData.taxes.gst} onChange={(e) => handleTaxChange('gst', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" mb={1} fontWeight="600">TCS(%)</Typography>
                <TextField fullWidth size="small" type="number" value={priceData.taxes.serviceTax} onChange={(e) => handleTaxChange('serviceTax', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, border: '1px solid #e0e0e0', borderRadius: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="700" mb={3}>$ Discount</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" mb={1} fontWeight="600">Discount Type</Typography>
                <Select fullWidth size="small" value={priceData.discount.type} onChange={(e) => handleDiscountChange('type', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }}>
                  <MenuItem value="Percentage (%)">Percentage (%)</MenuItem>
                  <MenuItem value="Fixed Amount ($)">Fixed Amount ($)</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" mb={1} fontWeight="600">{priceData.discount.type === 'Percentage (%)' ? 'Percentage Value' : 'Discount Amount'}</Typography>
                <TextField fullWidth size="small" type="number" value={priceData.discount.value} onChange={(e) => handleDiscountChange('value', e.target.value)} sx={{ bgcolor: '#f5f7fa', '& fieldset': { border: 'none' } }} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* --- SUMMARY CARD --- */}
      <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #bbdefb' }}>
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f4f9ff', borderLeft: '4px solid #42a5f5' }}>
          <Typography variant="h6" fontWeight="700" mb={2} color="#0d47a1">Summary</Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography color="text.secondary" fontWeight="500">Subtotal</Typography>
            <Typography fontWeight="700" color="#1a1a1a">{formatCurrency(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography color="text.secondary" fontWeight="500">GST ({priceData.taxes.gst}%)</Typography>
            <Typography fontWeight="700" color="#1a1a1a">{formatCurrency(gstAmount)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography color="text.secondary" fontWeight="500">Service Tax ({priceData.taxes.serviceTax}%)</Typography>
            <Typography fontWeight="700" color="#1a1a1a">{formatCurrency(serviceTaxAmount)}</Typography>
          </Box>
          {discountAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary" fontWeight="500">Discount ({priceData.discount.type === 'Percentage (%)' ? `${priceData.discount.value}%` : `$${priceData.discount.value}`})</Typography>
              <Typography fontWeight="700" color="#d32f2f">-{formatCurrency(discountAmount)}</Typography>
            </Box>
          )}
        </Box>
        
        {/* Grand Total Bar */}
        <Box sx={{ bgcolor: '#3949ab', color: 'white', p: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="700">Grand Total</Typography>
          <Typography variant="h4" fontWeight="800">{formatCurrency(grandTotal)}</Typography>
        </Box>
      </Paper>
    </Box>
  );
}