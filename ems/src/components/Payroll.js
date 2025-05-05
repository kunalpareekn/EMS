import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Box,
    Avatar,
    Alert,
    Grid
} from '@mui/material';

const Payroll = () => {
    const [payrollData, setPayrollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    setError('Please login to view payroll details');
                    setLoading(false);
                    return;
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                // Fetch employee details
                const employeeResponse = await axios.get('http://localhost:5000/api/employees/me', config);
                setEmployeeData(employeeResponse.data);

                // Fetch payroll data
                const payrollResponse = await axios.get(`http://localhost:5000/api/payroll/employee`, {
                    ...config,
                    params: {
                        month: currentMonth,
                        year: currentYear
                    }
                });
                setPayrollData(payrollResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || 'Error fetching payroll data');
                setLoading(false);
            }
        };

        fetchData();
    }, [currentMonth, currentYear]);

    if (loading) return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography>Loading...</Typography>
        </Container>
    );

    if (error) return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    );

    if (!payrollData || !employeeData) return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Alert severity="info">No payroll data available</Alert>
        </Container>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                {/* Header with Employee Info and Image */}
                <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
                    {/* Employee Image */}
                    <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {employeeData.profileImage ? (
                                <Avatar
                                    src={`http://localhost:5000/${employeeData.profileImage}`}
                                    sx={{ width: 200, height: 200 }}
                                />
                            ) : (
                                <Avatar
                                    sx={{ width: 200, height: 200, bgcolor: '#1976d2' }}
                                >
                                    {employeeData.name?.charAt(0)}
                                </Avatar>
                            )}
                        </Box>
                    </Grid>

                    {/* Employee Details */}
                    <Grid item xs={12} sm={9}>
                        <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        value={employeeData.name || ''}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Designation"
                                        value={employeeData.jobTitle || ''}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Basic Salary"
                                        value={employeeData.salary || ''}
                                        InputProps={{ readOnly: true }}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>

                {/* Pay Slip Breakdown */}
                <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 1, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {currentMonth} Pay slip breakdown
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Earnings</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell>Deductions</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Basic Wage</TableCell>
                                    <TableCell align="right">{payrollData.earnings?.basicWage || 0}</TableCell>
                                    <TableCell>{payrollData.deductions?.basicWage || 0}</TableCell>
                                    <TableCell align="right">{payrollData.total?.basicWage || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tax</TableCell>
                                    <TableCell align="right">{payrollData.earnings?.tax || 0}</TableCell>
                                    <TableCell>{payrollData.deductions?.tax || 0}</TableCell>
                                    <TableCell align="right">{payrollData.total?.tax || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Pension</TableCell>
                                    <TableCell align="right">{payrollData.earnings?.pension || 0}</TableCell>
                                    <TableCell>{payrollData.deductions?.pension || 0}</TableCell>
                                    <TableCell align="right">{payrollData.total?.pension || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><strong>Total Earnings</strong></TableCell>
                                    <TableCell align="right"><strong>{payrollData.earnings?.totalEarnings || 0}</strong></TableCell>
                                    <TableCell><strong>{payrollData.deductions?.total || 0}</strong></TableCell>
                                    <TableCell align="right"><strong>{payrollData.total?.total || 0}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Leaves Section */}
                <Box sx={{ backgroundColor: 'white', p: 3, borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                        {currentMonth} Leaves
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Day Description</TableCell>
                                    <TableCell>Reason</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payrollData.leaves && payrollData.leaves.length > 0 ? (
                                    payrollData.leaves.map((leave, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{leave.type}</TableCell>
                                            <TableCell>{leave.reason}</TableCell>
                                            <TableCell align="right">{leave.days}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">No leaves taken this month</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>
        </Container>
    );
};

export default Payroll; 