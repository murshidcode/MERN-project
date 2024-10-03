import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Modal,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmployeesTable() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]); // State for storing employee data
  const [open, setOpen] = useState(false); // State for controlling modal visibility
  const [currentEmployee, setCurrentEmployee] = useState({ name: '', position: '', contact: '' }); // State for managing employee data
  const [isEditing, setIsEditing] = useState(false); // State to determine if editing or adding an employee
  const [message, setMessage] = useState('');

  axios.defaults.withCredentials = true;

  // Check if user is authenticated before loading the table
  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const res = await axios.get('http://localhost:3001/table');
        if (res.data.valid) {
          setMessage(res.data.message);
        } else {
          navigate('/');  // Redirect to login if user is not authorized
        }
      } catch (err) {
        console.error(err);
        navigate('/');  // Redirect to login on any error
      }
    };
  
    checkAuthorization();  // Call the function
  
    // We remove `navigate` from the dependency array to prevent unnecessary re-renders
  }, []);
  

  // Function to open the modal for adding a new employee
  const handleOpen = () => {
    setCurrentEmployee({ name: '', position: '', contact: '' }); // Reset current employee data
    setIsEditing(false); // Set editing state to false
    setOpen(true); // Open the modal
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { id, value } = e.target; // Get id and value from the input field
    setCurrentEmployee((prev) => ({ ...prev, [id]: value })); // Update current employee's field
  };

  // Function to handle form submission for adding/editing employee
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setEmployees((prev) => {
      if (isEditing) {
        // Update existing employee if in editing mode
        return prev.map(emp => emp.id === currentEmployee.id ? currentEmployee : emp);
      }
      // Add new employee if not in editing mode
      return [...prev, { ...currentEmployee, id: Date.now() }]; // Unique ID using timestamp
    });
    handleClose(); // Close the modal after submission
  };

  // Function to set the employee data for editing
  const handleEdit = (employee) => {
    setCurrentEmployee(employee); // Populate current employee with selected employee data
    setIsEditing(true); // Set editing mode to true
    setOpen(true); // Open the modal for editing
  };

  // Function to delete an employee
  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter(emp => emp.id !== id)); // Remove employee from the list based on ID
  };

  return (
    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>
       Employees Table
      </Typography>

      {/* Buttons: Add Employee and Log Out */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '75%', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Employee 
        </Button>
        <Button 
         variant="contained" 
         color="secondary" 
         onClick={() => {
           axios.post('http://localhost:3001/logout') // Make the logout request
              .then(() => {
              navigate('/'); // Redirect to login after successful logout
                })
             .catch((err) => {
             console.error('Logout error: ', err);
             });
             }}
              >
           Log Out
       </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          width: '75%', // Set width to 75%
          border: '1px solid #ccc', // Border for the table
          borderRadius: '4px', // Rounded corners
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.contact}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(employee)} color="primary">Edit</Button>
                  <Button onClick={() => handleDelete(employee.id)} color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditing ? 'Edit Employee' : 'Add Employee'}
          </Typography>
          <TextField
            id="name"
            label="Name"
            value={currentEmployee.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            id="position"
            label="Position"
            value={currentEmployee.position}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            id="contact"
            label="Contact"
            value={currentEmployee.contact}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default EmployeesTable;
