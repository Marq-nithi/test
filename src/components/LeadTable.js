import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Checkbox } from '@mui/material';

const rows = [
  { id: 'L107377', name: 'Person A', phone: '1234567890', type: 'Tour Package', assigned: 'Person A', quote: 'Q123', dest: 'Goa', status: 'In Progress' },
  { id: 'L107377', name: 'Person B', phone: '1234567890', type: 'Tour Package', assigned: 'Person A', quote: 'Q123', dest: 'Goa', status: 'Quote Created' },
  // ... duplicate rows as per image
];

const LeadTable = () => (
  <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #E2E8F0' }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox"><Checkbox /></TableCell>
          <TableCell>Lead ID</TableCell>
          <TableCell>Lead Name</TableCell>
          <TableCell>Phone Number</TableCell>
          <TableCell>Service Type</TableCell>
          <TableCell>Assigned To</TableCell>
          <TableCell>Quote ID</TableCell>
          <TableCell>Destination</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i} hover>
            <TableCell padding="checkbox"><Checkbox /></TableCell>
            <TableCell sx={{ color: '#1976D2', fontWeight: 600 }}>{row.id}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.phone}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>{row.assigned}</TableCell>
            <TableCell>{row.quote}</TableCell>
            <TableCell>{row.dest}</TableCell>
            <TableCell>
              <Chip 
                label={row.status} 
                size="small" 
                sx={{ 
                  fontWeight: 600, 
                  bgcolor: row.status === 'In Progress' ? '#DCFCE7' : '#FEF9C3',
                  color: row.status === 'In Progress' ? '#166534' : '#854D0E' 
                }} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default LeadTable;