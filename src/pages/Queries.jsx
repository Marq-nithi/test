import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Queries() {
  const [open, setOpen] = useState(false);
  const [queries, setQueries] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    destination: "",
    email: "",
    phone: "",
    adults: "",
    children: "",
    days: ""
  });

  // Open popup
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form
  const handleSubmit = () => {
    const newQuery = {
      id: queries.length + 1,
      ...formData
    };

    setQueries([...queries, newQuery]);

    // Reset form
    setFormData({
      name: "",
      date: "",
      destination: "",
      email: "",
      phone: "",
      adults: "",
      children: "",
      days: ""
    });

    handleClose();
  };

  // Delete query
  const handleDelete = (id) => {
    setQueries(queries.filter((q) => q.id !== id));
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>
        Queries Management
      </Typography>

      <Button variant="contained" onClick={handleOpen}>
        Create Queries
      </Button>

      {/* Table */}
      <Paper sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Adults</TableCell>
              <TableCell>Children</TableCell>
              <TableCell>No. of Days</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {queries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No Queries Found
                </TableCell>
              </TableRow>
            ) : (
              queries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>{query.id}</TableCell>
                  <TableCell>{query.name}</TableCell>
                  <TableCell>{query.date}</TableCell>
                  <TableCell>{query.destination}</TableCell>
                  <TableCell>{query.email}</TableCell>
                  <TableCell>{query.phone}</TableCell>
                  <TableCell>{query.adults}</TableCell>
                  <TableCell>{query.children}</TableCell>
                  <TableCell>{query.days}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(query.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Popup Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Query</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            label="Date"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Adults"
            name="adults"
            type="number"
            value={formData.adults}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Children"
            name="children"
            type="number"
            value={formData.children}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="No. of Days"
            name="days"
            type="number"
            value={formData.days}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
