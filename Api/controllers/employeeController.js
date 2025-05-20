const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate token with employeeId instead of email
const generateToken = (employeeId) => {
    return jwt.sign({ employeeId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Register new employee
const registerEmployee = async (req, res) => {
    try {
        const {
            name, lastName, email, password,
            position, department, manager,
            jobTitle, jobCategory, salary
        } = req.body;

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const employee = new Employee({
            name,
            lastName,
            email,
            password: hashedPassword,
            position,
            department,
            manager,
            jobTitle,
            jobCategory,
            salary,
        });

        await employee.save();

        const token = generateToken(employee._id); // Use employeeId for token
        res.status(201).json({ message: 'Employee registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// Login employee
const loginEmployee = async (req, res) => {
    try {
        const { email, password } = req.body;

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the employee is active
        if (!employee.active) {
            return res.status(403).json({ message: 'Your account is inactive. Please contact HR or Admin.' });
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(employee._id);
        res.status(200).json({
            message: 'Login successfulllll',
            token,
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                position: employee.position,
                department: employee.department,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// Get the logged-in employee's data
const getLoggedInEmployee = async (req, res) => {
    try {
        const employee = req.employee; // from authMiddleware

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error in getLoggedInEmployee:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update employee details
const updateEmployeeDetails = async (req, res) => {
    try {
        const employeeId = req.employee._id; // From authMiddleware
        const updates = req.body;

        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updates, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee details', error: error.message });
    }
};

module.exports = {
    registerEmployee,
    loginEmployee,
    getLoggedInEmployee,
    updateEmployeeDetails,
};
