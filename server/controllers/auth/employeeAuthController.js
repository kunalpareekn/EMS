import Employee from '../../models/employee.model.js';
import jwt from 'jsonwebtoken';
import { generateToken } from '../../helpers/utils.js';
import bcrypt from 'bcryptjs';

// Generate token with employeeId instead of email
import Payroll from '../../models/payroll.model.js'; // Make sure this path is correct


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

        // Validate position value
        const validPositions = ["Intern", "Junior", "Mid-Level", "Senior", "Lead", "Supervisor", "Manager", "Director", "VP", "CTO", "CFO", "CEO", "Developer"];
        if (!validPositions.includes(position)) {
            return res.status(400).json({ message: 'Invalid position value' });
        }

        // Check if employee already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the employee
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
            role: 'employee'
        });

        await employee.save();

        // Create associated default payroll
        const currentDate = new Date();
        const defaultPayroll = {
            employeeId: employee._id,
            month: currentDate.toLocaleString('default', { month: 'long' }),
            year: currentDate.getFullYear(),
            basicSalary: salary,
            earnings: {
                basicWage: salary,
                houseRentAllowance: 0,
                overtime: 0,
                gratuity: 0,
                specialAllowance: 0,
                pfEmployer: 0,
                esiEmployer: 0
            },
            deductions: {
                pfEmployee: 0,
                esiEmployee: 0,
                tax: 0,
                otherDeductions: 0
            },
            ctc: 0,
            inHandSalary: 0,
            status: 'Pending'
        };

        await Payroll.create(defaultPayroll);

        // Generate token and send response
        const token = generateToken(employee._id);
        res.status(201).json({ 
            message: 'Employee registered successfully', 
            token,
            employee: {
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                position: employee.position,
                jobTitle: employee.jobTitle
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed',
            error: error.message,
            ...(error.errors && { detailedErrors: error.errors })
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

        if (!employee.active) {
            return res.status(403).json({ message: 'Your account is inactive. Please contact HR or Admin.' });
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // ✅ Pass `res` and `role` so cookie gets set
        const token = generateToken(employee._id, "employee", res);

        res.status(200).json({
            message: 'Login successful',
            token,
            employee: {
                id: employee._id,
                name: employee.name,
                email: employee.email,
                position: employee.position,
                department: employee.department,
                jobTitle: employee.jobTitle
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

export const logoutEmployee = (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error: error.message });
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
//get all employees
export const getAllEmployees = async (req, res) => {
    try {
        const user = req.user || req.employee;

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const employees = await Employee.find().select('-password');
        res.status(200).json({ employees });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
    }
};
