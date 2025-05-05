const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const adminMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find employee and check if they are an admin
        const employee = await Employee.findById(decoded.employeeId);
        
        if (!employee) {
            return res.status(401).json({ message: 'Employee not found' });
        }

        if (!employee.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        // Add employee to request object
        req.employee = employee;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
};

module.exports = adminMiddleware; 