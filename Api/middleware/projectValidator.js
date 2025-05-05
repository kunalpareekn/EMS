const { body, param } = require('express-validator');

const validateProjectCreation = [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim().notEmpty().withMessage('Project description is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('teamMembers').optional().isArray().withMessage('Team members must be an array'),
    body('teamMembers.*').optional().isMongoId().withMessage('Invalid team member ID')
];

const validateProjectUpdate = [
    param('id').isMongoId().withMessage('Invalid project ID'),
    body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Project description cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
    body('teamMembers').optional().isArray().withMessage('Team members must be an array'),
    body('teamMembers.*').optional().isMongoId().withMessage('Invalid team member ID')
];

module.exports = {
    validateProjectCreation,
    validateProjectUpdate
}; 