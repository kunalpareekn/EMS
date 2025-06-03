import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    clockIn: {
        type: Date,
        required: true,
    },
    clockOut: {
        type: Date,
    },
    effectiveHours: {
        type: Number,
        default: 0,
    },
    grossHours: {
        type: Number,
        default: 0,
    },
    overtimeHours: {
        type: Number,
        default: 0,
    },
    isOnTime: {
        type: Boolean,
        default: true,
    },
    isLateArrival: {
        type: Boolean,
        default: false,
    },
    isEarlyDeparture: {
        type: Boolean,
        default: false,
    },
    averageWorkHours: {  // Usually calculated from multiple entries
        type: Number,
        default: 0,
    },
    workLocation: {
        type: String,
        enum: ["office", "work_from_home"],
        default: "office",
    },
    status: {
        type: String,
        enum: ["present", "absent", "half-day"],
        default: "present",
    },
}, {
    timestamps: true,
});

attendanceSchema.pre("save", function (next) {
    if (this.clockIn) {
        const startOfDay = new Date(this.clockIn);
        startOfDay.setHours(0, 0, 0, 0);
        this.date = startOfDay;
    }

    if (this.clockIn && this.clockOut) {
        const durationMs = this.clockOut - this.clockIn;
        const hours = durationMs / (1000 * 60 * 60);
        const roundedHours = Math.round(hours * 100) / 100;

        this.grossHours = roundedHours;
        this.effectiveHours = roundedHours;

        // Mark late if clock-in is after 9:00 AM
        const nineAM = new Date(this.clockIn);
        nineAM.setHours(9, 0, 0, 0);
        this.isLateArrival = this.clockIn > nineAM;
        this.isOnTime = !this.isLateArrival;

        // Mark early departure if clock-out is before 5:00 PM
        const fivePM = new Date(this.clockIn);
        fivePM.setHours(17, 0, 0, 0);
        this.isEarlyDeparture = this.clockOut < fivePM;

        // Calculate overtime (anything over 8 hrs)
        this.overtimeHours = roundedHours > 8 ? Math.round((roundedHours - 8) * 100) / 100 : 0;
    }

    next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
