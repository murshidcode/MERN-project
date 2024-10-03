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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const { errors, validate } = useValidation(); 

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate(formData)) {
      try {
        const response = await axios.post('http://localhost:3001/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 201) {
          setSuccessMessage('Registration successful!');
          setErrorMessage(''); 
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          navigate('/');
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessage('Email already exists. Please use a different email.');
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
        }
        setSuccessMessage('');
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

        {errorMessage && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

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
