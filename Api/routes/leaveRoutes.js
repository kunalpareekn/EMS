const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const authMiddleware = require('../middleware/authMiddleware');
const adminOnlyMiddleware = require('../middleware/adminMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Admin-only: Get all leave requests
router.get('/', adminOnlyMiddleware, leaveController.getAllLeaves);

// Authenticated employee: Create a new leave request
router.post('/', leaveController.createLeave);

// Authenticated employee: Get their own leave requests
router.get('/my', leaveController.getMyLeaves);

// Admin-only: Approve or reject a leave request by updating its status
router.put('/:id/status', adminOnlyMiddleware, leaveController.updateLeaveStatus);

// Get leave statistics (self or admin viewing another employee)
router.get('/stats', leaveController.getLeaveStatistics);
router.get('/stats/:employeeId', leaveController.getLeaveStatistics);

module.exports = router;
