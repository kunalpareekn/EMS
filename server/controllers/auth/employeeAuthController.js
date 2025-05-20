import Employee from '../../models/employee.model.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../helpers/utils.js';
import bcrypt from 'bcryptjs';

// Generate token with employeeId instead of email


// Register new employee
export const registerEmployee = async (req, res) => {
    try {
        const {
            name, lastName, email, password,
            position, department, manager,
            jobTitle, jobCategory, salary
        } = req.body;

        // Validate required fields
        if (!name || !lastName || !email || !password || !position || 
            !department || !manager || !jobTitle || !jobCategory || !salary) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate enum values
        const validPositions = ["Intern", "Junior", "Mid-Level", "Senior", "Lead", "Supervisor", "Manager", "Director", "VP", "CTO", "CFO", "CEO", "Developer"];
        if (!validPositions.includes(position)) {
            return res.status(400).json({ message: 'Invalid position value' });
        }

        // Check for existing employee
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new employee with only the provided fields
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
            role: 'employee' // Default role
        });

        await employee.save();

        const token = generateToken(employee._id);
        res.status(201).json({ 
            message: 'Employee registered successfully', 
            token,
            employee: {
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                position: employee.position
                // Other fields you want to return
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed',
            error: error.message,
            ...(error.errors && { detailedErrors: error.errors }) // Mongoose validation errors
        });
    }
};

// Login employee
export const loginEmployee = async (req, res) => {
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
export const getLoggedInEmployee = async (req, res) => {
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
export const updateEmployeeDetails = async (req, res) => {
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
