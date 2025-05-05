const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

// Create a leave request
exports.createLeave = async (req, res) => {
    try {
        const { startDate, endDate, leaveType, reason } = req.body;
        const employeeId = req.employee._id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

        const leave = new Leave({
            employee: employeeId,
            employeeName: `${employee.name} ${employee.lastName}`,
            startDate,
            endDate,
            leaveType,
            reason,
            duration,
            resumptionDate: new Date(endDate),
            year: new Date(startDate).getFullYear(),
            status: 'pending'
        });

        await leave.save();
        res.status(201).json({ message: 'Leave application submitted successfully', leave });
    } catch (error) {
        console.error('Create Leave Error:', error);
        res.status(500).json({ message: 'Error submitting leave application', error: error.message });
    }
};

// Get all leaves (admin only)
exports.getAllLeaves = async (req, res) => {
    try {
        if (!req.employee.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { status, year } = req.query;
        let query = {};

        if (status) query.status = status;
        if (year) query.year = parseInt(year);

        const leaves = await Leave.find(query)
            .populate('employee', 'name email department')
            .sort({ createdAt: -1 });

        const statistics = {
            totalLeaves: 36,
            leavesTaken: leaves.filter(l => l.status === 'approved').reduce((acc, l) => acc + l.duration, 0),
            leavesByType: {
                sick: leaves.filter(l => l.leaveType === 'sick' && l.status === 'approved').reduce((acc, l) => acc + l.duration, 0),
                annual: leaves.filter(l => l.leaveType === 'annual' && l.status === 'approved').reduce((acc, l) => acc + l.duration, 0),
                casual: leaves.filter(l => l.leaveType === 'casual' && l.status === 'approved').reduce((acc, l) => acc + l.duration, 0)
            }
        };

        statistics.remainingLeaves = statistics.totalLeaves - statistics.leavesTaken;

        res.json({ leaves, statistics });
    } catch (error) {
        console.error('Get All Leaves Error:', error);
        res.status(500).json({ message: 'Error fetching leaves', error: error.message });
    }
};

// Get current user's leaves
exports.getMyLeaves = async (req, res) => {
    try {
        const employeeId = req.employee._id;
        const year = new Date().getFullYear();

        const leaves = await Leave.find({ employee: employeeId }).sort({ createdAt: -1 });

        const currentYearLeaves = leaves.filter(leave =>
            new Date(leave.startDate).getFullYear() === year &&
            leave.status === 'approved'
        );

        const statistics = {
            totalLeaves: 36,
            leavesTaken: currentYearLeaves.reduce((acc, leave) => acc + leave.duration, 0),
            leavesByType: {
                sick: currentYearLeaves.filter(l => l.leaveType === 'sick').reduce((acc, l) => acc + l.duration, 0),
                annual: currentYearLeaves.filter(l => l.leaveType === 'annual').reduce((acc, l) => acc + l.duration, 0),
                casual: currentYearLeaves.filter(l => l.leaveType === 'casual').reduce((acc, l) => acc + l.duration, 0)
            }
        };

        statistics.remainingLeaves = statistics.totalLeaves - statistics.leavesTaken;

        res.json({ leaves, statistics });
    } catch (error) {
        console.error('Get My Leaves Error:', error);
        res.status(500).json({ message: 'Error fetching your leaves', error: error.message });
    }
};

// Update leave status (approve/reject)
exports.updateLeaveStatus = async (req, res) => {
    try {
        if (!req.employee.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        const leave = await Leave.findById(id);
        if (!leave) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        leave.status = status;
        if (status === 'rejected' && rejectionReason) {
            leave.rejectionReason = rejectionReason;
        }

        await leave.save();
        res.json({ message: 'Leave status updated successfully', leave });
    } catch (error) {
        console.error('Update Leave Status Error:', error);
        res.status(500).json({ message: 'Error updating leave status', error: error.message });
    }
};

// Get leave statistics
exports.getLeaveStatistics = async (req, res) => {
    try {
        let employeeId = req.params.employeeId || req.employee._id;
        
        // If requesting another employee's stats, check if admin
        if (req.params.employeeId && !req.employee.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        const leaves = await Leave.find({ employeeId });
        
        const statistics = {
            totalLeaves: leaves.length,
            approvedLeaves: leaves.filter(l => l.status === 'approved').length,
            pendingLeaves: leaves.filter(l => l.status === 'pending').length,
            rejectedLeaves: leaves.filter(l => l.status === 'rejected').length,
            leavesByType: leaves.reduce((acc, leave) => {
                acc[leave.leaveType] = (acc[leave.leaveType] || 0) + 1;
                return acc;
            }, {})
        };

        res.json(statistics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave statistics', error: error.message });
    }
};
