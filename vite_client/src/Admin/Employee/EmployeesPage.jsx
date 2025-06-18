import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Box,
  Alert,
  TextField,
  IconButton
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../../context/employeeSlice';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employees, status, error } = useSelector((state) => state.employees);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Debounce the search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); 

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const handleRowClick = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  // Filter employees based on debounced search term
  const filteredEmployees = employees?.filter(employee => {
    if (!debouncedSearchTerm) return true;
    const fullName = `${employee.name} ${employee.lastName}`.toLowerCase();
    return fullName.includes(debouncedSearchTerm.toLowerCase());
  });

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box p={2}>
        <Alert severity="error">
          Error loading employees: {error || 'Unknown error occurred'}
        </Alert>
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h1 className='text-3xl font-bold'>Employees</h1>
        <TextField
          label="Search employees"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%', maxWidth: 400 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
            endAdornment: searchTerm && (
              <IconButton onClick={() => setSearchTerm('')}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees?.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow 
                  key={employee._id} 
                  hover 
                  onClick={() => handleRowClick(employee._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>{employee.name} {employee.lastName}</TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={employee.active ? 'Active' : 'Inactive'} 
                      color={employee.active ? 'success' : 'error'} 
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {debouncedSearchTerm ? 'No employees match your search' : 'No employees found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EmployeesPage;