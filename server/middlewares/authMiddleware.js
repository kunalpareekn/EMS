import jwt from 'jsonwebtoken';
import Employee from '../models/employee.model.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employee = await Employee.findById(decoded.employeeId).select('+role email'); // Include role & email

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Validate email domain based on route
        const emailDomain = employee.email.split('@')[1];
        if (req.path === '/register' && emailDomain !== 'gmail.com') {
            return res.status(403).json({ message: 'Only Gmail addresses are allowed for registration' });
        } else if (req.path === '/login' && emailDomain !== 'gmail.com' && emailDomain !== 'paarsiv.com') {
            return res.status(403).json({ message: 'Only Gmail and Paarsiv email domains are allowed for login' });
        }

        // Add isAdmin helper
        employee.isAdmin = employee.role && employee.role.toLowerCase() === 'admin';
        
        req.employee = employee; // Attach the employee object to the request
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};

export default authMiddleware;