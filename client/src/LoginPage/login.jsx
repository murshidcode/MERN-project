import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const result = await axios.post("http://localhost:3001/login", formData);
          if (result.data === "Success") {
              navigate("/table");
          } else {
              setError("Login failed: User does not exist");
          }
      } catch (err) {
          // Customizing the error message based on the response
          if (err.response) {
              // Check for specific status codes or messages from your backend
              if (err.response.status === 401) {
                  setError("Incorrect email or password. Please try again.");
              } else {
                  setError("An error occurred. Please try again.");
              }
          } else {
              setError("Unable to connect to the server. Please try again later.");
          }
      }
  
      // Reset form fields after submission
      setFormData({
          email: '',
          password: '',
      });
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
                    position: 'relative',
                }}
                noValidate
                autoComplete="off"
            >
                <Typography variant="h5" component="h1" gutterBottom sx={{mb:8,mt:2}}>
                    Log In
                </Typography>

                {error && <Typography color="error">{error}</Typography>} {/* Display error message */}

                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ width: '100%', mb: 2 }}
                />

                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ width: '100%', mb: 3 }}
                />

                <p>Don't have an account?
                    <Button
                        onClick={() => navigate("./register")}
                        sx={{
                            color: '#1976d2',
                            textTransform: 'none',
                        }}
                    >
                        Create an account
                    </Button>
                </p>

                <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', mt: 1 }}>
                    Log In
                </Button>
            </Box>
        </Box>
    );
}

export default LogIn;
