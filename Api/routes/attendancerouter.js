const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/authMiddleware');

// Clock in
router.post('/clock-in', authMiddleware, async (req, res) => {
    try {
        const existingAttendance = await Attendance.findOne({
            userId: req.user._id,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Already clocked in for today' });
        }

        const attendance = new Attendance({
            userId: req.user._id,
            date: new Date(),
            clockIn: new Date(),
            workLocation: req.body.workLocation || 'office'
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Clock out
router.patch('/clock-out/:id', authMiddleware, async (req, res) => {
    try {
        const attendance = await Attendance.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        attendance.clockOut = new Date();
        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get attendance stats
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const stats = await Attendance.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: lastWeek }
                }
            },
            {
                $group: {
                    _id: null,
                    avgHours: { $avg: '$effectiveHours' },
                    onTimeCount: {
                        $sum: { $cond: ['$isOnTime', 1, 0] }
                    },
                    totalDays: { $sum: 1 }
                }
            }
        ]);

        res.json({
            avgHoursPerDay: stats[0]?.avgHours || 0,
            onTimePercentage: stats[0] ? (stats[0].onTimeCount / stats[0].totalDays) * 100 : 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get attendance logs
router.get('/logs', authMiddleware, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { userId: req.user._id };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const logs = await Attendance.find(query)
            .sort({ date: -1 })
            .limit(30);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 