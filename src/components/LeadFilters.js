// src/components/LeadFilters.js
import React from 'react';
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { Search, Plus, Filter } from 'lucide-react';

const LeadFilters = () => {
  const filterOptions = ["Assigned To", "Service Type", "Priority", "Status", "Source"];
  const dateOptions = ["From (dd-mm-yyyy)", "To (dd-mm-yyyy)"];

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
      
      {/* Search Input */}
      <TextField 
        placeholder="Search..." 
        size="small"
        sx={{ width: 200, bgcolor: 'white', borderRadius: 1 }}
        InputProps={{ startAdornment: <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} /> }}
      />

      {/* Dynamic Dropdown Filters */}
      {filterOptions.map(label => (
        <FormControl key={label} size="small" sx={{ width: 140 }}>
          <InputLabel>{label}</InputLabel>
          <Select defaultValue="" label={label} sx={{ bgcolor: 'white', borderRadius: 1 }}>
            <MenuItem value="">{`All ${label}`}</MenuItem>
          </Select>
        </FormControl>
      ))}

      {/* Date Filters (Placeholder) */}
      {dateOptions.map(dateLabel => (
        <TextField 
          key={dateLabel} 
          placeholder={dateLabel} 
          size="small" 
          sx={{ width: 150, bgcolor: 'white' }} 
        />
      ))}

      {/* Buttons */}
      <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
        <Button variant="text" size="small" color="textSecondary" sx={{ px: 2 }}>Clear All</Button>
        <Button variant="contained" size="small" color="primary" startIcon={<Plus size={18} />}>
          Add Lead
        </Button>
      </Stack>
    </Box>
  );
};

export default LeadFilters;