import Attendance from "../../models/attendance.model.js";

// Clock In
export const clockIn = async (req, res) => {
    try {
        const userId = req.employee._id; // ✅ use req.employee instead of req.user

        const existingAttendance = await Attendance.findOne({
            userId,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lt: new Date().setHours(23, 59, 59, 999)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: "Already clocked in for today" });
        }

        const attendance = new Attendance({
            userId,
            date: new Date(),
            clockIn: new Date(),
            workLocation: req.body.workLocation || "office"
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Clock Out
export const clockOut = async (req, res) => {
    try {
        const attendance = await Attendance.findOne({
            _id: req.params.id,
            userId: req.employee._id
        });

        if (!attendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        const clockOutTime = new Date();
        attendance.clockOut = clockOutTime;

        // ✅ Calculate effective hours
        const clockInTime = new Date(attendance.clockIn);
        const durationInMs = clockOutTime - clockInTime;
        const hoursWorked = durationInMs / (1000 * 60 * 60); // convert ms to hours
        attendance.effectiveHours = parseFloat(hoursWorked.toFixed(2));

        // ✅ Check if user clocked in on time (assume 9:00 AM is on time)
        const onTimeThreshold = new Date(clockInTime);
        onTimeThreshold.setHours(9, 0, 0, 0); // 9:00 AM

        attendance.isOnTime = clockInTime <= onTimeThreshold;

        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Attendance Stats
export const getStats = async (req, res) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const stats = await Attendance.aggregate([
            {
                $match: {
                    userId: req.employee._id,
                    date: { $gte: lastWeek }
                }
            },
            {
                $group: {
                    _id: null,
                    avgHours: { $avg: "$effectiveHours" },
                    onTimeCount: { $sum: { $cond: ["$isOnTime", 1, 0] } },
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
};

// Get Attendance Logs
export const getLogs = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { userId: req.employee._id };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const logs = await Attendance.find(query).sort({ date: -1 }).limit(30);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};