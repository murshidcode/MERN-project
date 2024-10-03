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
    const [employees, setEmployees] = useState([]); 
    const [open, setOpen] = useState(false); 
    const [currentEmployee, setCurrentEmployee] = useState({ name: '', position: '', contact: '' }); 
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    axios.defaults.withCredentials = true;

    
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const res = await axios.get('http://localhost:3001/table');
                if (res.data.valid) {
                    setMessage(res.data.message);
                  
                    const employeeRes = await axios.get('http://localhost:3001/employee');
                    setEmployees(employeeRes.data); 
                } else {
                    navigate('/');  
                }
            } catch (err) {
                console.error(err);
                navigate('/');  
            }
        };
        checkAuthorization();
    }, [navigate]);

    const handleOpen = () => {
        setCurrentEmployee({ name: '', position: '', contact: '' });
        setIsEditing(false); 
        setOpen(true); 
    };

    const handleClose = () => {
        setOpen(false); 
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCurrentEmployee((prev) => ({ ...prev, [id]: value })); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            if (isEditing) {
               
                const response = await axios.put(`http://localhost:3001/employee/${currentEmployee.id}`, currentEmployee);
                setEmployees((prev) => 
                  prev.map(emp => emp._id === response.data._id ? response.data : emp) 
                );
            } else {
                
                const response = await axios.post('http://localhost:3001/employee', currentEmployee);
                setEmployees((prev) => [...prev, response.data]); 
            }
            handleClose(); 
        } catch (error) {
            console.error('Error saving employee data:', error); 
        }
    };

    const handleEdit = (employee) => {
        setCurrentEmployee({          
          id:employee._id,
          name:employee.name,
          position:employee.position,
          contact:employee.contact,
        });  
        setIsEditing(true); 
        setOpen(true); 
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/employee/${id}`); 
            setEmployees((prev) => prev.filter(emp => emp._id !== id)); 
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Employees Table
            </Typography>

           
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '75%', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Employee 
                </Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => {
                        axios.post('http://localhost:3001/logout') 
                            .then(() => {
                                navigate('/'); 
                            })
                            .catch((err) => {
                                console.error('Logout error: ', err);
                            });
                    }}
                >
                    Log Out
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ marginTop: 2, width: '75%', border: '1px solid #ccc', borderRadius: '4px' }}>
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
                            <TableRow key={employee._id}>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.position}</TableCell>
                                <TableCell>{employee.contact}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(employee)}>Edit</Button>
                                    <Button onClick={() => handleDelete(employee._id)}>Delete</Button>
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
