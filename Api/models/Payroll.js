const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    basicSalary: {
        type: Number,
        required: true
    },
    earnings: {
        basicWage: Number,
        tax: Number,
        pension: Number,
        totalEarnings: Number
    },
    deductions: {
        basicWage: Number,
        tax: Number,
        pension: Number,
        total: Number
    },
    total: {
        basicWage: Number,
        tax: Number,
        pension: Number,
        total: Number
    },
    leaves: [{
        type: {
            type: String,
            enum: ['Sick', 'Casual', 'Vacation', 'Other'],
            required: true
        },
        reason: String,
        days: Number
    }],
    status: {
        type: String,
        enum: ['Pending', 'Processed', 'Paid'],
        default: 'Pending'
    },
    processedDate: Date,
    paidDate: Date
}, {
    timestamps: true
});

module.exports = mongoose.model('Payroll', payrollSchema);
