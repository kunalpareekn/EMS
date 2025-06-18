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
  ListItemText,
  Autocomplete,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiEdit2, FiTrash2, FiSave, FiX, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useUpdateProject from '../../Hooks/useUpdateProject';
import useDeleteProject from '../../Hooks/useDeleteProject';
import { fetchEmployees } from '../../context/employeeSlice';
import useGetAllProjects from '../../Hooks/useGetAllProjects';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
    useGetAllProjects();
  // Project data
  const project = useSelector(store => 
    store.project?.allProjects?.find(p => p._id === id)
  );
  
  // Employees data
  const { employees, status: employeesStatus, error: employeesError } = useSelector((state) => ({
    employees: state.employees.employees || [],
    status: state.employees.status,
    error: state.employees.error
  }));
  
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({
    name: '',
    status: '',
    projectLeader: '',
    projectMembers: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  // Initialize data and fetch employees
  useEffect(() => {
    if (project) {
      setEditedProject({
        name: project.name,
        status: project.status,
        projectLeader: project.projectLeader?._id || '',
        projectMembers: project.projectMembers?.map(m => m._id) || []
      });
    }
    
    if (employeesStatus === 'idle') {
      dispatch(fetchEmployees());
    }
  }, [project, employeesStatus, dispatch]);

  if (!project) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="h6">Project not found</Typography>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberChange = (employeeId) => {
    setEditedProject(prev => {
      const currentMembers = [...prev.projectMembers];
      const index = currentMembers.indexOf(employeeId);
      
      if (index === -1) {
        // Add employee to members
        return {
          ...prev,
          projectMembers: [...currentMembers, employeeId]
        };
      } else {
        // Remove employee from members
        return {
          ...prev,
          projectMembers: currentMembers.filter(id => id !== employeeId)
        };
      }
    });
  };
  const handleBackToProject=()=>{
    navigate('/projects', { replace: true });
    useGetAllProjects();
  }

  const handleUpdate = async () => {
    try {
      // Prepare the data to send
      const projectData = {
        name: editedProject.name,
        status: editedProject.status,
        projectLeader: editedProject.projectLeader,
        projectMembers: editedProject.projectMembers
      };

      const result = await updateProject(project._id, projectData);
      if (result.success) {
        toast.success('Project updated successfully!');
        setIsEditing(false);
      } else {
        console.log(error)
        toast.error(result.message || 'Project updated');
      }
    } catch (error) {
      toast.error('An error occurred while updating the project');
      console.error('Update error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const result = await deleteProject(project._id);
        if (result.success) {
          toast.success('Project deleted successfully!');
          navigate('/projects', { replace: true });
        } else {
          toast.error(result.message || 'Failed to delete project');
        }
      } catch (error) {
        toast.error('An error occurred while deleting the project');
        console.error('Delete error:', error);
      }
    }
  };

  const getEmployeeName = (employee) => {
    return `${employee.name}`;
  };

  const getEmployeeById = (id) => {
    return employees.find(emp => emp._id === id);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button 
          onClick={() => navigate('/projects')}
          startIcon={<FiChevronLeft />}
          variant="outlined"
        >
          Back to Projects
        </Button>
        
        <Box display="flex" gap={2}>
          {!isEditing ? (
            <>
              <Button 
                onClick={() => setIsEditing(true)}
                startIcon={<FiEdit2 />}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
              <Button 
                onClick={handleDelete}
                startIcon={<FiTrash2 />}
                variant="contained"
                color="error"
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleUpdate}
                startIcon={<FiSave />}
                variant="contained"
                color="success"
              >
                Save
              </Button>
             
            </>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isEditing ? (
        <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Project Name"
              name="name"
              value={editedProject.name}
              onChange={handleInputChange}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={editedProject.status}
                onChange={handleInputChange}
                label="Status"
                required
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="On Hold">On Hold</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Project Leader</InputLabel>
              <Select
                name="projectLeader"
                value={editedProject.projectLeader}
                onChange={handleInputChange}
                label="Project Leader"
                required
              >
                {employees.map(employee => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {getEmployeeName(employee)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Project Members</InputLabel>
              <Select
                multiple
                name="projectMembers"
                value={editedProject.projectMembers}
                onChange={(e) => {
                  // For multi-select, the value is already an array
                  setEditedProject(prev => ({
                    ...prev,
                    projectMembers: e.target.value
                  }));
                }}
                label="Project Members"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((employeeId) => {
                      const employee = getEmployeeById(employeeId);
                      return employee ? (
                        <Chip key={employeeId} label={getEmployeeName(employee)} />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    <Checkbox checked={editedProject.projectMembers.indexOf(employee._id) > -1} />
                    <ListItemText primary={getEmployeeName(employee)} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom>{project.name}</Typography>
          
          <Box display="flex" gap={4} mb={3}>
            <Box>
              <Typography variant="subtitle1" color="text.secondary">Status</Typography>
              <Chip 
                label={project.status} 
                color={
                  project.status === 'Completed' ? 'success' :
                  project.status === 'In Progress' ? 'primary' :
                  project.status === 'On Hold' ? 'warning' : 'default'
                }
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle1" color="text.secondary">Manager</Typography>
              <Typography>
                {project.projectLeader ? getEmployeeName(project.projectLeader) : 'Not assigned'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" color="text.secondary">Start Date</Typography>
              <Typography>
                {new Date(project.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>Team Members</Typography>
          {project.projectMembers?.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {project.projectMembers.map((member) => (
                <Chip
                  key={member._id}
                  label={getEmployeeName(member)}
                  color="secondary"
                  variant="outlined"
                />
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No team members assigned</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default ProjectDetailPage;