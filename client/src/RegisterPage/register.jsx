import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useValidation } from './validation'; // Importing the validation logic
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  // State to manage form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const { errors, validate } = useValidation(); // Using validation hook

  const navigate = useNavigate();

  // Handler to update form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate(formData)) {
      try {
        // Make the axios request after validation passes
        const response = await axios.post('http://localhost:3001/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // Check for success response
        if (response.status === 201) {
          setSuccessMessage('Registration successful!');
          setErrorMessage(''); // Clear any previous error messages
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          // Optionally, navigate to another route (like login page)
          navigate('/');
        }
      } catch (error) {
        // Handle the error based on the error response from the server
        if (error.response && error.response.status === 400) {
          setErrorMessage('Email already exists. Please use a different email.');
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
        }
        setSuccessMessage(''); // Clear any success messages
      }
    } else {
      setSuccessMessage('');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f0f2f5',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '80vw',
          maxWidth: '400px',
          p: 4,
          border: '2px solid #1976d2',
          borderRadius: '8px',
          boxShadow: 3,
          bgcolor: 'white',
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Register
        </Typography>

        {/* Show error message if any */}
        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Show success message if any */}
        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <TextField
          id="name"
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ width: '100%', mb: 2 }}
        />

        <TextField
          id="email"
          label="Email"
          type="email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          sx={{ width: '100%', mb: 2 }}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          sx={{ width: '100%', mb: 2 }}
        />

        <TextField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          sx={{ width: '100%', mb: 3 }}
        />

        <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', mt: 1 }}>
          Register
        </Button>
      </Box>
    </Box>
  );
}

export default RegistrationForm;
