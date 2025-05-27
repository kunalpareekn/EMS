import React, { useState, useEffect } from 'react';
import { 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Checkbox,
  ListItemText
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEmployees } from '../../context/employeeSlice';
import useAddProject from '../../Hooks/useAddProject';

function AddProject() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Get employees from Redux store (matching your structure)
    const employeesObj = useSelector((state) => state.employees?.employees?.employees || {});
    const employees = employeesObj ? Object.values(employeesObj) : [];
    const employeesStatus = useSelector((state) => state.employees.status);
    const employeesError = useSelector((state) => state.employees.error);
    
    // Project submission status
    const projectStatus = useSelector((state) => state.project.status);
    const projectError = useSelector((state) => state.project.error);
    const addProject = useAddProject();

    const [form, setForm] = useState({ 
        name: '', 
        status: 'pending',
        projectLeader: [],
        projectMembers: []
    });
    
    const [error, setError] = useState('');

    // Fetch employees when component mounts
    useEffect(() => {
        if (employeesStatus === 'idle') {
            dispatch(fetchEmployees());
        }
    }, [employeesStatus, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLeaderSelect = (employeeId) => {
        if (form.projectLeader.includes(employeeId)) {
            setForm({
                ...form,
                projectLeader: form.projectLeader.filter(id => id !== employeeId)
            });
        } else {
            if (form.projectLeader.length >= 2) {
                setError('Maximum 2 leaders can be selected');
                return;
            }
            setForm({
                ...form,
                projectLeader: [...form.projectLeader, employeeId]
            });
        }
        setError('');
    };

    const handleMemberSelect = (employeeId) => {
        if (form.projectMembers.includes(employeeId)) {
            setForm({
                ...form,
                projectMembers: form.projectMembers.filter(id => id !== employeeId)
            });
        } else {
            setForm({
                ...form,
                projectMembers: [...form.projectMembers, employeeId]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate
        if (!form.name) {
            setError('Project name is required');
            return;
        }

        if (form.projectLeader.length === 0) {
            setError('Please select at least one project leader');
            return;
        }

        const result = await addProject(form);

        if (result.success) {
            navigate('/dashboard-admin');
        } else {
            setError(result.error?.message || 'Failed to add project');
        }
    };

    // Helper function to get employee name by ID
    const getEmployeeName = (id) => {
        const employee = employees.find(emp => emp._id === id);
        return employee ? `${employee.name} ${employee.lastName}` : '';
    };

    if (employeesStatus === 'loading') {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (employeesStatus === 'failed') {
        return (
            <Box p={2}>
                <Alert severity="error">
                    Error loading employees: {employeesError || 'Unknown error occurred'}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Add New Project</Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {projectStatus === 'loading' && (
                <Box display="flex" justifyContent="center" p={2}>
                    <CircularProgress />
                </Box>
            )}

            <Paper elevation={3} sx={{ padding: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Project Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Project Status</InputLabel>
                        <Select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            label="Project Status"
                            required
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="in-progress">In Progress</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="on-hold">On Hold</MenuItem>
                        </Select>
                    </FormControl>
                    
                    {/* Project Leaders Section */}
                    <Box mt={3}>
                        <Typography variant="h6" gutterBottom>
                            Project Leaders (Max 2)
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {form.projectLeader.map(id => (
                                <Chip
                                    key={id}
                                    label={getEmployeeName(id)}
                                    onDelete={() => handleLeaderSelect(id)}
                                    color="primary"
                                />
                            ))}
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Select Leaders</InputLabel>
                            <Select
                                multiple
                                value={form.projectLeader}
                                onChange={(e) => {
                                    // Handle selection changes
                                    const newLeaders = e.target.value;
                                    if (newLeaders.length <= 2) {
                                        setForm({...form, projectLeader: newLeaders});
                                    } else {
                                        setError('Maximum 2 leaders can be selected');
                                    }
                                }}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((id) => (
                                            <Chip key={id} label={getEmployeeName(id)} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {employees.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Checkbox checked={form.projectLeader.includes(employee._id)} />
                                        <ListItemText primary={`${employee.name} ${employee.lastName}`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    
                    {/* Project Members Section */}
                    <Box mt={3}>
                        <Typography variant="h6" gutterBottom>
                            Project Members
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {form.projectMembers.map(id => (
                                <Chip
                                    key={id}
                                    label={getEmployeeName(id)}
                                    onDelete={() => handleMemberSelect(id)}
                                    color="secondary"
                                />
                            ))}
                        </Box>
                        <FormControl fullWidth>
                            <InputLabel>Select Members</InputLabel>
                            <Select
                                multiple
                                value={form.projectMembers}
                                onChange={(e) => setForm({...form, projectMembers: e.target.value})}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((id) => (
                                            <Chip key={id} label={getEmployeeName(id)} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {employees.map((employee) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        <Checkbox checked={form.projectMembers.includes(employee._id)} />
                                        <ListItemText primary={`${employee.name} ${employee.lastName}`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    
                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit"
                            disabled={projectStatus === 'loading'}
                        >
                            {projectStatus === 'loading' ? 'Saving...' : 'Save Project'}
                        </Button>
                        
                        <Button 
                            component={Link}
                            to="/dashboard-admin"
                            variant="outlined"
                            color="secondary"
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default AddProject;