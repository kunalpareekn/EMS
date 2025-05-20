const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const Payroll = require('../models/Payroll');
const registrationController = require('../controllers/registrationController');
const employeeController = require('../controllers/employeeController');
const payrollController = require('../controllers/payrollController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const leaveController = require('../controllers/leaveController');

// Import route files
const employeeRoutes = require('./employeeRoutes');
const authRoutes = require('./authRoutes');
const projectRoutes = require('./projectRoutes');
const payrollRoutes = require('./payrollRoutes');
const leaveRoutes = require('./leaveRoutes');
const attendanceRoutes = require('./attendancerouter');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Use the route files
router.use('/employees', employeeRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/payroll', payrollRoutes);
router.use('/leave', leaveRoutes);
router.use('/attendance', attendanceRoutes);

// ---------------- Employee Routes ---------------- //

// 🔒 Get logged-in employee's profile using JWT
router.get('/employees/me', authMiddleware, employeeController.getLoggedInEmployee);

// 🔒 Update logged-in employee's details using JWT
router.put('/employees/me', authMiddleware, employeeController.updateEmployeeDetails);

// 🌐 Get all employees or employee by email (for Admin use or testing)
router.get('/employees', async (req, res) => {
    try {
        const { email } = req.query;

        if (email) {
            const employee = await Employee.findOne({ email }).select('-password'); // Exclude password
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            return res.json(employee);
        }

        const employees = await Employee.find().select('-password'); // Exclude password
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
});

// ➕ Add a new employee
router.post('/employees', async (req, res) => {
    try {
        const { name, lastName, email, password, manager, salary, jobCategory, jobTitle, position, department } = req.body;

        // Validate required fields
        if (!name || !lastName || !email || !password || !manager || !salary || !jobCategory || !jobTitle || !position || !department) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: 'Error adding employee', error: error.message });
    }
});

// 🔍 Get employee by ID
router.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).select('-password'); // Exclude password
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee details', error: error.message });
    }
});

// ✏️ Update employee by ID
router.put('/employees/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee details', error: error.message });
    }
});

// 👤 Employee Registration & Login
router.post('/employees/register', employeeController.registerEmployee);
router.post('/employees/login', employeeController.loginEmployee);

// Save Contact Details for logged-in employee
router.post('/employees/me/contact-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id; // Get employee ID from authMiddleware
        const { phone1, phone2, personalEmail, city, address } = req.body;

        if (!phone1 || !personalEmail || !city || !address) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { phone1, phone2, personalEmail, city, address },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error in /employees/me/contact-details:', error.message); // Log the error
        res.status(500).json({ message: 'Error saving contact details', error: error.message });
    }
});
 
// Fetch Contact Details for logged-in employee
router.get('/employees/me/contact-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id; // Get employee ID from authMiddleware
        const employee = await Employee.findById(employeeId).select('phone1 phone2 personalEmail city address'); // Fetch contact details

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee); // Return contact details
    } catch (error) {
        console.error('Error in /employees/me/contact-details:', error.message); // Log the error
        res.status(500).json({ message: 'Error fetching contact details', error: error.message });
    }
});

// Save Family Details for logged-in employee
router.post('/employees/me/family-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const { fullName, relationship, phoneNo, address } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { familyDetails: { fullName, relationship, phoneNo, address } } },
            { new: true }
        );

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error saving family details', error: error.message });
    }
});

// Update Family Details for logged-in employee
router.put('/employees/me/family-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id; // Get employee ID from authMiddleware
        const { fullName, relationship, phoneNo, address } = req.body;

        if (!fullName || !relationship || !phoneNo || !address) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: { 'familyDetails.$[elem]': { fullName, relationship, phoneNo, address } } },
            { new: true, arrayFilters: [{ 'elem.fullName': fullName }] } // Update based on matching fullName
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Family details updated successfully', familyDetails: updatedEmployee.familyDetails });
    } catch (error) {
        console.error('Error in /employees/me/family-details:', error.message); // Log the error
        res.status(500).json({ message: 'Error updating family details', error: error.message });
    }
});

// Fetch Family Details for logged-in employee
router.get('/employees/me/family-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id; // Get employee ID from authMiddleware
        const employee = await Employee.findById(employeeId).select('familyDetails'); // Fetch family details

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ familyDetails: employee.familyDetails || [] }); // Return family details or an empty array
    } catch (error) {
        console.error('Error in /employees/me/family-details:', error.message); // Log the error
        res.status(500).json({ message: 'Error fetching family details', error: error.message });
    }
});

// Save Financial Details for logged-in employee
router.post('/employees/me/financial-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const financialDetails = req.body;

        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { financialDetails },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Financial details saved successfully', financialDetails: employee.financialDetails });
    } catch (error) {
        console.error('Error saving financial details:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/employees/me/financial-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ financialDetails: employee.financialDetails });
    } catch (error) {
        console.error('Error fetching financial details:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Save Next of Kin Details for logged-in employee
router.post('/employees/me/next-of-kin-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const { name, occupation, phone, relationship, address } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { nextOfKin: { name, occupation, phone, relationship, address } },
            { new: true }
        );

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error saving next of kin details', error: error.message });
    }
});

// Save Academic Records for logged-in employee
router.post('/employees/me/academic-records', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const { institution, details } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { academicRecords: { institution, details } } },
            { new: true }
        );

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error saving academic records', error: error.message });
    }
});

// Save Professional Qualifications for logged-in employee
router.post('/employees/me/professional-qualifications', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const { title, organization, duration, description } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { professionalQualifications: { title, organization, duration, description } } },
            { new: true }
        );

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error saving professional qualifications', error: error.message });
    }
});

// Fetch all employee details for admin
router.get('/admin/employees', async (req, res) => {
    try {
        const employees = await Employee.find().select('-password'); // Exclude sensitive data
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee details', error: error.message });
    }
});

// Fetch all details of an employee by ID (Admin use)
router.get('/admin/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).select('-password'); // Exclude sensitive data
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        console.log('Fetched Employee:', employee); // Log the fetched employee
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee details', error: error.message });
    }
});

// Approve an employee by ID (Admin use)
router.put('/admin/employees/:id/approve', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { approved: true }, // Set the approved field to true
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee approved successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Error approving employee', error: error.message });
    }
});

// Fetch approval status and documents for an employee
router.get('/employees/:id/documents', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id).select('documents approved');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ isApproved: employee.approved, documents: employee.documents });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ message: 'Error fetching documents', error: error.message });
    }
});

// Route to handle document upload
router.post('/employees/:id/upload-document', upload.single('document'), async (req, res) => {
    try {
        const { id } = req.params;
        const { documentType } = req.body;

        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (employee.approved) {
            return res.status(400).json({ message: 'Documents are already approved and cannot be updated' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        employee.documents.push({
            documentType,
            filePath: req.file.path,
            fileName: req.file.filename,
        });

        await employee.save();
        res.status(200).json({ message: 'File uploaded and saved successfully', document: req.file });
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).json({ message: 'Error uploading document', error: error.message });
    }
});

// ---------------- Project Routes ---------------- //

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
});

router.post('/projects', async (req, res) => {
    try {
        const { name, status } = req.body;
        const newProject = new Project({ name, status });
        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
});

// ---------------- Payroll Routes ---------------- //

router.get('/payrolls', async (req, res) => {
    try {
        const payrolls = await Payroll.find();
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payrolls', error: error.message });
    }
});

// Admin payroll route with authentication
router.get('/admin/payroll', authMiddleware, async (req, res) => {
    try {
        // Verify if user is admin
        if (!req.employee || !req.employee.role || req.employee.role.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { month, year } = req.query;

        // Get all employees who have a salary
        const employees = await Employee.find({ salary: { $exists: true } })
            .select('name salary');

        // Get payroll data for all employees
       // routes/admin.js or similar
router.get('/api/admin-payroll', authenticateToken, async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required' });
    }

    try {
        // Replace with actual query logic
        const payrollData = await Payroll.find({ month, year });

        if (!payrollData || payrollData.length === 0) {
            return res.status(404).json({ message: 'No payroll data found for the selected period.' });
        }

        res.status(200).json(payrollData);
    } catch (error) {
        console.error('Error fetching payroll:', error);
        res.status(500).json({ message: 'Server error fetching payroll data' });
    }
});

        const payrollData = await Promise.all(payrollPromises);
        res.json(payrollData);
    } catch (error) {
        console.error('Admin Payroll Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Updated payroll routes with authentication
router.get('/payroll/employee', authMiddleware, payrollController.getEmployeePayroll);
router.put('/payroll/:id', authMiddleware, payrollController.updatePayroll);
router.get('/payroll/all', authMiddleware, payrollController.getAllPayrolls);

// ---------------- General User Auth Routes ---------------- //



// ---------------- Leave Management Routes ---------------- //

// Apply for leave
router.post('/leaves', authMiddleware, leaveController.createLeave);

// Get my leaves
router.get('/leaves/me', authMiddleware, leaveController.getMyLeaves);

// Get all leaves (admin only)
router.get('/admin/leaves', authMiddleware, leaveController.getAllLeaves);

// Update leave status (admin only)
router.put('/admin/leaves/:leaveId/status', authMiddleware, leaveController.updateLeaveStatus);

// Get leave statistics
router.get('/leaves/statistics', authMiddleware, leaveController.getLeaveStatistics);
router.get('/leaves/statistics/:employeeId', authMiddleware, leaveController.getLeaveStatistics);

module.exports = router;
