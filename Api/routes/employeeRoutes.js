const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validator');
const {
    validateEmployeeRegistration,
    validateEmployeeUpdate,
    validateContactDetails,
    validateFamilyDetails,
    validateFinancialDetails
} = require('../middleware/employeeValidator');

// 🔒 Get logged-in employee's profile using JWT
router.get('/me', authMiddleware, employeeController.getLoggedInEmployee);

// 🔒 Update logged-in employee's details using JWT
router.put('/me', authMiddleware, employeeController.updateEmployeeDetails);

// 🌐 Get all employees or employee by email (for Admin use or testing)
router.get('/', async (req, res) => {
    try {
        const { email } = req.query;

        if (email) {
            const employee = await Employee.findOne({ email }).select('-password');
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            return res.json(employee);
        }

        const employees = await Employee.find().select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
});

// ➕ Add a new employee
router.post('/', validateEmployeeRegistration, validate, async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: 'Error adding employee', error: error.message });
    }
});

// 🔍 Get employee by ID
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee details', error: error.message });
    }
});

// ✏️ Update employee by ID
router.put('/:id', validateEmployeeUpdate, validate, async (req, res) => {
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

// Contact Details
router.post('/me/contact-details', authMiddleware, validateContactDetails, validate, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const { phone1, phone2, personalEmail, city, address } = req.body;

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
        res.status(500).json({ message: 'Error saving contact details', error: error.message });
    }
});

router.get('/me/contact-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const employee = await Employee.findById(employeeId).select('phone1 phone2 personalEmail city address');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact details', error: error.message });
    }
});

// Family Details
router.post('/me/family-details', authMiddleware, validateFamilyDetails, validate, async (req, res) => {
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

router.put('/me/family-details', authMiddleware, validateFamilyDetails, validate, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const { fullName, relationship, phoneNo, address } = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: { 'familyDetails.$[elem]': { fullName, relationship, phoneNo, address } } },
            { new: true, arrayFilters: [{ 'elem.fullName': fullName }] }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Family details updated successfully', familyDetails: updatedEmployee.familyDetails });
    } catch (error) {
        res.status(500).json({ message: 'Error updating family details', error: error.message });
    }
});

router.get('/me/family-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const employee = await Employee.findById(employeeId).select('familyDetails');

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ familyDetails: employee.familyDetails || [] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching family details', error: error.message });
    }
});

// Financial Details
router.post('/me/financial-details', authMiddleware, validateFinancialDetails, validate, async (req, res) => {
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
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/me/financial-details', authMiddleware, async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ financialDetails: employee.financialDetails });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 