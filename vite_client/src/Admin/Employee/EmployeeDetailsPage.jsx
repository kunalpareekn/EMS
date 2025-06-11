import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableHead
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchEmployeeDetails, 
  updateEmployeeStatus,
  clearEmployeeDetails
} from '../../context/employeeDetailsSlice';

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  
  const { 
    employee, 
    loading, 
    error,
    updatingStatus,
    statusUpdateError
  } = useSelector((state) => state.employeeDetails);

  useEffect(() => {
    dispatch(fetchEmployeeDetails(employeeId));
    
    return () => {
      dispatch(clearEmployeeDetails());
    };
  }, [dispatch, employeeId]);

  const handleStatusChangeClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmStatusChange = () => {
    dispatch(updateEmployeeStatus({
      employeeId: employee._id,
      active: !employee.active
    }));
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">
          {error}
          <Button onClick={() => navigate(-1)} sx={{ ml: 2 }}>Go Back</Button>
        </Alert>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box p={2}>
        <Alert severity="warning">
          Employee not found
          <Button onClick={() => navigate(-1)} sx={{ ml: 2 }}>Go Back</Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Employees
      </Button>

      {statusUpdateError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {statusUpdateError}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {employee.name} {employee.lastName}
        </Typography>
        
        <Button
          variant="contained"
          color={employee.active ? 'success' : 'error'}
          onClick={handleStatusChangeClick}
          disabled={updatingStatus}
          startIcon={
            <Chip 
              label={employee.active ? 'Active' : 'Inactive'} 
              color={employee.active ? 'success' : 'error'} 
              size="small"
            />
          }
        >
          {employee.active ? 'Set Inactive' : 'Set Active'}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Status Change
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to change the status of {employee.name} {employee.lastName} from {employee.active ? 'Active' : 'Inactive'} to {employee.active ? 'Inactive' : 'Active'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmStatusChange} 
            color={employee.active ? 'error' : 'success'} 
            autoFocus
            disabled={updatingStatus}
          >
            {updatingStatus ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rest of your component remains the same */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Basic Info */}
        <Paper sx={{ p: 2, flex: 1, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>Basic Information</Typography>
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell><strong>Email:</strong></TableCell>
                  <TableCell>{employee.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Personal Email:</strong></TableCell>
                  <TableCell>{employee.personalEmail}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Phone 1:</strong></TableCell>
                  <TableCell>{employee.phone1}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Phone 2:</strong></TableCell>
                  <TableCell>{employee.phone2}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Address:</strong></TableCell>
                  <TableCell>{employee.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Manager:</strong></TableCell>
                  <TableCell>{employee.manager}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Salary:</strong></TableCell>
                  <TableCell>${employee.salary?.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Job Title:</strong></TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Position:</strong></TableCell>
                  <TableCell>{employee.position}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Department:</strong></TableCell>
                  <TableCell>{employee.department}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Created At:</strong></TableCell>
                  <TableCell>{new Date(employee.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Financial Details */}
        {employee.financialDetails && (
          <Paper sx={{ p: 2, flex: 1, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>Financial Details</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Bank Name:</strong></TableCell>
                    <TableCell>{employee.financialDetails.bankName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Account Name:</strong></TableCell>
                    <TableCell>{employee.financialDetails.accountName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Account Number:</strong></TableCell>
                    <TableCell>{employee.financialDetails.accountNo}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>IFSC Code:</strong></TableCell>
                    <TableCell>{employee.financialDetails.ifsc}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>

      {/* Accordion sections for additional details */}
      <Box sx={{ mt: 3 }}>
        {/* Academic Records */}
        {employee.academicRecords?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Academic Records</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Institution</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.academicRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.institution}</TableCell>
                        <TableCell>{record.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Professional Qualifications */}
        {employee.professionalQualifications?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Professional Qualifications</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.professionalQualifications.map((qualification, index) => (
                      <TableRow key={index}>
                        <TableCell>{qualification.title}</TableCell>
                        <TableCell>{qualification.organization}</TableCell>
                        <TableCell>{qualification.duration}</TableCell>
                        <TableCell>{qualification.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Family Details */}
        {employee.familyDetails?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Family Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Relationship</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Occupation</TableCell>
                      <TableCell>Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.familyDetails.map((member, index) => (
                      <TableRow key={index}>
                        <TableCell>{member.fullName}</TableCell>
                        <TableCell>{member.relationship}</TableCell>
                        <TableCell>{member.phoneNo}</TableCell>
                        <TableCell>{member.occupation}</TableCell>
                        <TableCell>{member.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Next of Kins */}
        {employee.nextOfKins?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Next of Kins</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Relationship</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Occupation</TableCell>
                      <TableCell>Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.nextOfKins.map((kin, index) => (
                      <TableRow key={index}>
                        <TableCell>{kin.name}</TableCell>
                        <TableCell>{kin.relationship}</TableCell>
                        <TableCell>{kin.phone}</TableCell>
                        <TableCell>{kin.occupation}</TableCell>
                        <TableCell>{kin.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Guarantors */}
        {employee.guarantors?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Guarantors</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Relationship</TableCell>
                      <TableCell>Occupation</TableCell>
                      <TableCell>Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.guarantors.map((guarantor, index) => (
                      <TableRow key={index}>
                        <TableCell>{guarantor.name}</TableCell>
                        <TableCell>{guarantor.relationship}</TableCell>
                        <TableCell>{guarantor.occupation}</TableCell>
                        <TableCell>{guarantor.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Documents */}
        {employee.documents?.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Documents</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Document Type</TableCell>
                      <TableCell>File Name</TableCell>
                      <TableCell>Uploaded At</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.documents.map((doc, index) => (
                      <TableRow key={index}>
                        <TableCell>{doc.documentType}</TableCell>
                        <TableCell>{doc.fileName}</TableCell>
                        <TableCell>{new Date(doc.uploadedAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => window.open(`http://localhost:5000${doc.filePath}`, '_blank')}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeDetailsPage;