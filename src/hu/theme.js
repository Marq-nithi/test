import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2C2B80' }, // Sidebar Purple
    secondary: { main: '#1976D2' }, // Action Blue
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    success: { main: '#22C55E', light: '#DCFCE7' }, // "In Progress"
    warning: { main: '#EAB308', light: '#FEF9C3' }, // "Quote Created"
  },
  shape: { borderRadius: 8 },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, backgroundColor: '#F8FAFC', color: '#64748B' },
      },
    },
  },
});

export default theme;