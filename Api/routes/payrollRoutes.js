const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const Payroll = require('../models/Payroll');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validator');
const { validatePayrollCreation, validatePayrollUpdate } = require('../middleware/payrollValidator');

// Get payroll details for an employee
router.get('/employee', payrollController.getEmployeePayroll);

// Update payroll details
router.put('/:id', payrollController.updatePayroll);

// Get all payrolls
router.get('/all', payrollController.getAllPayrolls);

// Get all payroll records
router.get('/', authMiddleware, async (req, res) => {
    try {
        const payrolls = await Payroll.find();
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payroll records', error: error.message });
    }
});

// Create a new payroll record
router.post('/', authMiddleware, validatePayrollCreation, validate, async (req, res) => {
    try {
        const newPayroll = new Payroll({
            employeeId: req.body.employeeId,
            month: req.body.month,
            year: req.body.year,
            basicSalary: req.body.basicSalary,
            allowances: req.body.allowances || [],
            deductions: req.body.deductions || [],
            netSalary: req.body.netSalary
        });

        await newPayroll.save();
        res.status(201).json(newPayroll);
    } catch (error) {
        res.status(400).json({ message: 'Error creating payroll record', error: error.message });
    }
});

// Get payroll record by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }
        res.json(payroll);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payroll record', error: error.message });
    }
});

// Update payroll record
router.put('/:id', authMiddleware, validatePayrollUpdate, validate, async (req, res) => {
    try {
        const updatedPayroll = await Payroll.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedPayroll) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }

        res.json(updatedPayroll);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payroll record', error: error.message });
    }
});

// Delete payroll record
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const payroll = await Payroll.findByIdAndDelete(req.params.id);
        if (!payroll) {
            return res.status(404).json({ message: 'Payroll record not found' });
        }
        res.json({ message: 'Payroll record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting payroll record', error: error.message });
    }
});

module.exports = router; 