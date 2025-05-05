const { body, param, query } = require('express-validator');

const validateEmployeeRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('manager').trim().notEmpty().withMessage('Manager is required'),
    body('salary').isNumeric().withMessage('Salary must be a number'),
    body('jobCategory').trim().notEmpty().withMessage('Job category is required'),
    body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('department').trim().notEmpty().withMessage('Department is required')
];

const validateEmployeeUpdate = [
    param('id').isMongoId().withMessage('Invalid employee ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('manager').optional().trim().notEmpty().withMessage('Manager cannot be empty'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
    body('jobCategory').optional().trim().notEmpty().withMessage('Job category cannot be empty'),
    body('jobTitle').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
    body('position').optional().trim().notEmpty().withMessage('Position cannot be empty'),
    body('department').optional().trim().notEmpty().withMessage('Department cannot be empty')
];

const validateContactDetails = [
    body('phone1').trim().notEmpty().withMessage('Primary phone number is required'),
    body('personalEmail').isEmail().withMessage('Valid personal email is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('address').trim().notEmpty().withMessage('Address is required')
];

const validateFamilyDetails = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('relationship').trim().notEmpty().withMessage('Relationship is required'),
    body('phoneNo').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required')
];

const validateFinancialDetails = [
    body('bankName').trim().notEmpty().withMessage('Bank name is required'),
    body('accountNumber').trim().notEmpty().withMessage('Account number is required'),
    body('accountType').trim().notEmpty().withMessage('Account type is required'),
    body('ifscCode').trim().notEmpty().withMessage('IFSC code is required')
];

module.exports = {
    validateEmployeeRegistration,
    validateEmployeeUpdate,
    validateContactDetails,
    validateFamilyDetails,
    validateFinancialDetails
}; 