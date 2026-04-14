import React, { useState, useMemo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { 
  createTheme, ThemeProvider, CssBaseline, Box, IconButton, Stack, Typography, 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Select, MenuItem, TextField, Modal, Fade, Avatar, Card, CardContent, 
  Divider, Drawer, useMediaQuery, useTheme
} from '@mui/material';
import { 
  Home, Briefcase, Map as MapIcon, LogOut, Plus, X, Search, Trash2, ChevronLeft, 
  FilePlus, Lock, User, Menu as MenuIcon, Phone, MapPin
} from 'lucide-react';

// --- 1. RESPONSIVE THEME ---
const theme = createTheme({
  palette: {
    primary: { main: '#4F46E5' }, 
    secondary: { main: '#10B981' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h5: { fontWeight: 800 },
  },
  shape: { borderRadius: 12 }
});

// --- 2. RESPONSIVE SIDEBAR/DRAWER ---
const Navigation = ({ user, onLogout }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { path: '/', icon: <Home size={22}/>, label: 'Dashboard' },
    { path: '/leads', icon: <Briefcase size={22}/>, label: 'Leads' },
    { path: '/itinerary', icon: <MapIcon size={22}/>, label: 'Itinerary' }
  ];

  const NavContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, bgcolor: '#0F172A', color: 'white' }}>
      <Typography variant="h6" fontWeight={900} sx={{ mb: 6, color: 'primary.main' }}>D.</Typography>
      <Stack spacing={3} sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.path} title={item.label} placement="right">
            <IconButton 
              component={Link} to={item.path} 
              onClick={() => setMobileOpen(false)}
              sx={{ 
                color: 'white', p: 1.5,
                bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
      <IconButton onClick={onLogout} sx={{ color: '#FDA4AF' }}><LogOut size={22}/></IconButton>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zHeight: 1100, bgcolor: 'white', p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
          <IconButton onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>
          <Typography variant="subtitle1" fontWeight={800} sx={{ ml: 2 }}>DYNAMAVIC</Typography>
          <Avatar sx={{ ml: 'auto', width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.8rem' }}>{user?.name.charAt(0)}</Avatar>
          <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 80 } }}>
            <NavContent />
          </Drawer>
        </Box>
      ) : (
        <Box sx={{ width: 80, position: 'fixed', height: '100vh', zIndex: 1200 }}><NavContent /></Box>
      )}
    </>
  );
};

// --- 3. RESPONSIVE LEADS PAGE ---
const LeadsPage = ({ leads, setLeads }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.dest.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box sx={{ mt: { xs: 8, md: 0 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={4}>
        <Box>
          <Typography variant="h5">Leads</Typography>
          <Typography variant="body2" color="text.secondary">Total: {leads.length}</Typography>
        </Box>
        <Button variant="contained" fullWidth={{ xs: true, sm: false }} startIcon={<Plus size={18} />} onClick={() => setOpen(true)}>New Lead</Button>
      </Stack>

      <TextField 
        fullWidth placeholder="Search..." size="small"
        value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, bgcolor: 'white', borderRadius: 2 }}
        InputProps={{ startAdornment: <Search size={18} style={{ marginRight: 8, color: '#94A3B8' }} /> }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#F8FAFC' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 700, display: { xs: 'none', md: 'table-cell' } }}>Destination</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} hover onClick={() => navigate(`/leads/${row.id}`)} sx={{ cursor: 'pointer' }}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={700}>{row.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{row.id}</Typography>
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{row.dest}</TableCell>
                <TableCell>
                  <Box sx={{ px: 1, py: 0.5, bgcolor: '#ECFDF5', color: '#065F46', borderRadius: 1.5, fontSize: '0.65rem', fontWeight: 900, textAlign: 'center' }}>
                    {row.status.toUpperCase()}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* CREATE MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 400 }, bgcolor: 'white', p: 4, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight={800} mb={3}>Add Lead</Typography>
          <Stack spacing={2}>
            <TextField fullWidth label="Name" id="name_input" />
            <TextField fullWidth label="Phone" id="phone_input" />
            <TextField fullWidth label="Destination" id="dest_input" />
            <Button variant="contained" fullWidth onClick={() => {
                const n = document.getElementById('name_input').value;
                const p = document.getElementById('phone_input').value;
                const d = document.getElementById('dest_input').value;
                setLeads([{ id: 'L-'+Math.floor(1000+Math.random()*9000), name: n, phone: p, dest: d, status: 'In Progress' }, ...leads]);
                setOpen(false);
            }}>Save Lead</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

// --- 4. MAIN APP ---
export default function App() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([
    { id: 'L-9921', name: 'Alexander Pierce', phone: '123-456-7890', dest: 'Santorini, Greece', status: 'In Progress' }
  ]);

  if (!user) return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, #4F46E5, #312E81)', p: 2 }}>
        <Card sx={{ width: 400, p: 4, borderRadius: 6 }}>
          <Typography variant="h5" textAlign="center" mb={1} fontWeight={900}>Login</Typography>
          <TextField fullWidth label="Enter Name" sx={{ my: 3 }} id="login_name" />
          <Button variant="contained" fullWidth size="large" onClick={() => setUser({ name: document.getElementById('login_name').value })}>Enter Dashboard</Button>
        </Card>
      </Box>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navigation user={user} onLogout={() => setUser(null)} />
        <Box sx={{ flexGrow: 1, ml: { md: '80px' }, p: { xs: 2, md: 6 }, bgcolor: 'background.default' }}>
          <Routes>
            <Route path="/" element={<Typography variant="h4">Dashboard</Typography>} />
            <Route path="/leads" element={<LeadsPage leads={leads} setLeads={setLeads} />} />
            <Route path="/leads/:id" element={
               <Box sx={{ mt: { xs: 8, md: 0 } }}>
                 <Button startIcon={<ChevronLeft />} component={Link} to="/leads" sx={{ mb: 2 }}>Back</Button>
                 <Card sx={{ p: 2, borderRadius: 4 }}>
                    <Typography variant="h5" fontWeight={800}>Details</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="contained" color="secondary" fullWidth startIcon={<FilePlus />} component={Link} to="/itinerary">Create Itinerary</Button>
                 </Card>
               </Box>
            } />
            <Route path="/itinerary" element={<Typography variant="h4" sx={{ mt: { xs: 8, md: 0 } }}>Itinerary Builder</Typography>} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const Tooltip = ({ children }) => <>{children}</>; // Simple mock