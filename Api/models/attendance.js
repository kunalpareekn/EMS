const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    clockIn: {
        type: Date,
        required: true
    },
    clockOut: {
        type: Date
    },
    effectiveHours: {
        type: Number,
        default: 0
    },
    grossHours: {
        type: Number,
        default: 0
    },
    isOnTime: {
        type: Boolean,
        default: true
    },
    workLocation: {
        type: String,
        enum: ['office', 'work_from_home'],
        default: 'office'
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'half-day'],
        default: 'present'
    }
}, {
    timestamps: true
});

// Calculate hours when clock out is updated
attendanceSchema.pre('save', function(next) {
    if (this.clockOut && this.clockIn) {
        const grossMs = this.clockOut - this.clockIn;
        this.grossHours = Math.round((grossMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
        this.effectiveHours = this.grossHours; // You can add logic for breaks/lunch here
    }
    next();
});

module.exports = mongoose.model('Attendance', attendanceSchema); 