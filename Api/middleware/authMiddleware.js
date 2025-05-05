const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employee = await Employee.findById(decoded.employeeId).select('+role'); // Include role field

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
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

module.exports = authMiddleware;
