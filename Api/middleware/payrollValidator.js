const { body, param } = require('express-validator');

const validatePayrollCreation = [
    body('employeeId').isMongoId().withMessage('Invalid employee ID'),
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    body('year').isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),
    body('basicSalary').isNumeric().withMessage('Basic salary must be a number'),
    body('allowances').optional().isArray().withMessage('Allowances must be an array'),
    body('allowances.*.type').optional().trim().notEmpty().withMessage('Allowance type is required'),
    body('allowances.*.amount').optional().isNumeric().withMessage('Allowance amount must be a number'),
    body('deductions').optional().isArray().withMessage('Deductions must be an array'),
    body('deductions.*.type').optional().trim().notEmpty().withMessage('Deduction type is required'),
    body('deductions.*.amount').optional().isNumeric().withMessage('Deduction amount must be a number'),
    body('netSalary').isNumeric().withMessage('Net salary must be a number')
];

const validatePayrollUpdate = [
    param('id').isMongoId().withMessage('Invalid payroll ID'),
    body('month').optional().isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    body('year').optional().isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),
    body('basicSalary').optional().isNumeric().withMessage('Basic salary must be a number'),
    body('allowances').optional().isArray().withMessage('Allowances must be an array'),
    body('allowances.*.type').optional().trim().notEmpty().withMessage('Allowance type is required'),
    body('allowances.*.amount').optional().isNumeric().withMessage('Allowance amount must be a number'),
    body('deductions').optional().isArray().withMessage('Deductions must be an array'),
    body('deductions.*.type').optional().trim().notEmpty().withMessage('Deduction type is required'),
    body('deductions.*.amount').optional().isNumeric().withMessage('Deduction amount must be a number'),
    body('netSalary').optional().isNumeric().withMessage('Net salary must be a number')
];

module.exports = {
    validatePayrollCreation,
    validatePayrollUpdate
}; 