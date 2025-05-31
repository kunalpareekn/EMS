import Attendance from "../../models/attendance.model.js";

// Clock In (Max 3 times per day)
export const clockIn = async (req, res) => {
    try {
        const userId = req.employee._id;
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));

        // Check for any open session (clockIn without clockOut)
        const openSession = await Attendance.findOne({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay },
            clockOut: { $exists: false }
        });

        if (openSession) {
            return res.status(400).json({ message: "You must clock out before starting a new session." });
        }

        // Count today's sessions
        const todayClockIns = await Attendance.countDocuments({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (todayClockIns >= 3) {
            return res.status(400).json({ message: "Maximum of 3 clock-in sessions reached for today" });
        }

        const attendance = new Attendance({
            userId,
            date: startOfDay,
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

        // ❌ Prevent double clock-out
        if (attendance.clockOut) {
            return res.status(400).json({ message: "This session is already clocked out." });
        }

        const clockOutTime = new Date();
        attendance.clockOut = clockOutTime;

        await attendance.save(); // Triggers pre-save hook for time calculations
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Logs 
export const getLogs = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.employee._id;
        const query = { userId };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const logs = await Attendance.find(query).sort({ date: -1 }).limit(100);

        // Group by date
        const dailyStats = {};
        const sessions = []; // Add this array to store all sessions

        logs.forEach(log => {
            // Add each log to the sessions array
            sessions.push(log);
            
            const dateKey = log.date.toISOString().split("T")[0];
            if (!dailyStats[dateKey]) {
                dailyStats[dateKey] = {
                    sessions: [],
                    totalEffectiveHours: 0,
                    totalGrossHours: 0,
                    totalOvertime: 0,
                    lateArrivals: 0,
                    earlyDepartures: 0
                };
            }

            dailyStats[dateKey].sessions.push(log);
            dailyStats[dateKey].totalEffectiveHours += log.effectiveHours || 0;
            dailyStats[dateKey].totalGrossHours += log.grossHours || 0;
            dailyStats[dateKey].totalOvertime += log.overtimeHours || 0;

            if (log.isLateArrival) dailyStats[dateKey].lateArrivals += 1;
            if (log.isEarlyDeparture) dailyStats[dateKey].earlyDepartures += 1;
        });

        // Generate stats summary
        const dates = Object.keys(dailyStats);
        const summary = {
            totalDays: dates.length,
            avgEffectiveHours: 0,
            avgGrossHours: 0,
            totalLateArrivals: 0,
            totalEarlyDepartures: 0,
            totalOvertime: 0
        };

        dates.forEach(date => {
            const day = dailyStats[date];
            summary.avgEffectiveHours += day.totalEffectiveHours;
            summary.avgGrossHours += day.totalGrossHours;
            summary.totalLateArrivals += day.lateArrivals;
            summary.totalEarlyDepartures += day.earlyDepartures;
            summary.totalOvertime += day.totalOvertime;
        });

        if (dates.length) {
            summary.avgEffectiveHours = parseFloat((summary.avgEffectiveHours / dates.length).toFixed(2));
            summary.avgGrossHours = parseFloat((summary.avgGrossHours / dates.length).toFixed(2));
        }

        // Return sessions along with summary and dailyStats
        res.json({ 
            sessions, // Add this line
            summary, 
            dailyStats 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
