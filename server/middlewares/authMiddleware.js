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
        console.log("Decoded Token:", decoded); // Debugging log

        const employeeId = decoded.employeeId || decoded._id;
        if (!employeeId) {
            return res.status(401).json({ message: 'Token missing employee identifier' });
        }

        const employee = await Employee.findById(employeeId).select('_id role email name lastName');
        console.log("Found Employee:", employee); // Debugging log

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.isAdmin = employee.role && employee.role.toLowerCase() === 'admin';

        req.employee = employee;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        return res.status(401).json({
            message: 'Invalid or expired token',
            error: error.message
        });
    }
};

export default authMiddleware;