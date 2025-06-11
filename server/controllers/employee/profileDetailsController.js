import Employee from '../../models/employee.model.js';
import mongoose from 'mongoose';

// Employee updates their additional information
export const updateEmployeeInfo = async (req, res) => {
    try {
        const employeeId = req.employee?._id; // Assuming the authenticated employee's ID is available
        const updateData = req.body;

        // Fields that cannot be updated through this endpoint
        const restrictedFields = [
            'name', 'lastName', 'email', 'password', 'position', 
            'department', 'manager', 'jobTitle', 'jobCategory', 
            'salary', 'role', 'active'
        ];

        // Check if update includes restricted fields
        const invalidUpdates = Object.keys(updateData).filter(
            field => restrictedFields.includes(field)
        );

        if (invalidUpdates.length > 0) {
            return res.status(400).json({
                message: `Cannot update restricted fields: ${invalidUpdates.join(', ')}`
            });
        }

        // Validate phone numbers if provided
        if (updateData.phone1) {
            if (!/^\d{10,15}$/.test(updateData.phone1)) {
                return res.status(400).json({ message: 'Phone1 must be 10-15 digits' });
            }
        }

        if (updateData.phone2) {
            if (!/^\d{10,15}$/.test(updateData.phone2)) {
                return res.status(400).json({ message: 'Phone2 must be 10-15 digits' });
            }
        }

        // Validate personal email if provided
        if (updateData.personalEmail) {
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(updateData.personalEmail)) {
                return res.status(400).json({ message: 'Please provide a valid personal email' });
            }
        }

        // Validate city if provided
        if (updateData.city) {
            if (typeof updateData.city !== 'string' || updateData.city.trim().length === 0) {
                return res.status(400).json({ message: 'Please provide a valid city name' });
            }
            // Optionally add more specific validation for city format if needed
        }

        // Update the employee document
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: updateData },
            { 
                new: true, 
                runValidators: true,
                // Ensure only allowed fields are updated
                fields: { 
                    password: 0, // Always exclude password
                    ...Object.fromEntries(restrictedFields.map(field => [field, 0]))
                }
            }
        ).select('-password');

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({
            message: 'Employee information updated successfully',
            employee: updatedEmployee
        });

    } catch (error) {
        console.error('Error updating employee info:', error);
        res.status(500).json({ 
            message: 'Failed to update employee information',
            error: error.message,
            ...(error.errors && { detailedErrors: error.errors })
        });
    }
};
// Employee adds academic records
export const addAcademicRecord = async (req, res) => {
    try {
        const employeeId = req.employee?._id;
        const { institution, details } = req.body;

        if (!institution || !details) {
            return res.status(400).json({ message: 'Institution and details are required' });
        }

        const newRecord = { institution, details };

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { academicRecords: newRecord } },
            { new: true }
        ).select('academicRecords');

        res.status(201).json({
            message: 'Academic record added successfully',
            academicRecords: updatedEmployee.academicRecords
        });

    } catch (error) {
        console.error('Error adding academic record:', error);
        res.status(500).json({ 
            message: 'Failed to add academic record',
            error: error.message
        });
    }
};

export const addGuarantorDetails = async (req, res) => {
    try {
        const employeeId = req.employee?._id;
        const { name, occupation, phoneNumber, relationship, address } = req.body;

        // Validate required fields
        if (!name || !occupation || !phoneNumber) {
            return res.status(400).json({ 
                message: 'Name, occupation and phone number are required' 
            });
        }

        // Validate phone number format
        if (!/^\d{10,15}$/.test(phoneNumber)) {
            return res.status(400).json({ 
                message: 'Phone number must be 10-15 digits' 
            });
        }

        const newGuarantor = { 
            name,
            occupation,
            phoneNumber,
            relationship: relationship || '',
            address: address || '',
            addedAt: new Date()
        };

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { guarantors: newGuarantor } },
            { new: true }
        ).select('guarantors');

        res.status(201).json({
            message: 'Guarantor details added successfully',
            guarantors: updatedEmployee.guarantors
        });

    } catch (error) {
        console.error('Error adding guarantor details:', error);
        res.status(500).json({ 
            message: 'Failed to add guarantor details',
            error: error.message
        });
    }
};
// Employee adds professional qualification
export const addProfessionalQualification = async (req, res) => {
    try {
        const employeeId = req.employee?._id;
        const { title, organization, duration, description } = req.body;

        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }

        const newQualification = { 
            title, 
            organization, 
            duration: duration || '', 
            description: description || '' 
        };

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { professionalQualifications: newQualification } },
            { new: true }
        ).select('professionalQualifications');

        res.status(201).json({
            message: 'Professional qualification added successfully',
            professionalQualifications: updatedEmployee.professionalQualifications
        });

    } catch (error) {
        console.error('Error adding professional qualification:', error);
        res.status(500).json({ 
            message: 'Failed to add professional qualification',
            error: error.message
        });
    }
};

export const addNextOfKin = async (req, res) => {
    try {
        const employeeId = req.employee?._id;
        const { name, occupation, phone, relationship, address } = req.body;

        // Validate required fields
        if (!name || !relationship || !phone) {
            return res.status(400).json({ 
                message: 'Name, relationship and phone are required' 
            });
        }

        // Validate phone number format
        if (!/^\d{10,15}$/.test(phone)) {
            return res.status(400).json({ 
                message: 'Phone must be 10-15 digits' 
            });
        }

        const newNextOfKin = {
            name,
            occupation: occupation || '',
            phone,
            relationship,
            address: address || '',
            addedAt: new Date()
        };

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { nextOfKins: newNextOfKin } },
            { new: true }
        ).select('nextOfKins');

        res.status(201).json({
            message: 'Next of kin added successfully',
            nextOfKins: updatedEmployee.nextOfKins
        });

    } catch (error) {
        console.error('Error adding next of kin:', error);
        res.status(500).json({ 
            message: 'Failed to add next of kin',
            error: error.message
        });
    }
};
// Employee adds family details
export const addFamilyDetail = async (req, res) => {
    try {
        const employeeId = req.employee?._id;
        const { fullName, relationship, phoneNo, address, occupation } = req.body;

        if (!fullName || !relationship) {
            return res.status(400).json({ message: 'Full name and relationship are required' });
        }

        const newFamilyMember = { 
            fullName, 
            relationship,
            phoneNo: phoneNo || '',
            address: address || '',
            occupation: occupation || ''
        };

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $push: { familyDetails: newFamilyMember } },
            { new: true }
        ).select('familyDetails');

        res.status(201).json({
            message: 'Family detail added successfully',
            familyDetails: updatedEmployee.familyDetails
        });

    } catch (error) {
        console.error('Error adding family detail:', error);
        res.status(500).json({ 
            message: 'Failed to add family detail',
            error: error.message
        });
    }
};

// Employee updates financial details
export const updateFinancialDetails = async (req, res) => {
    try {
        const employeeId = req.employee?._id;
        const { bankName, ifsc, accountNo, accountName } = req.body;

        if (!bankName || !ifsc || !accountNo || !accountName) {
            return res.status(400).json({ message: 'All financial details are required' });
        }

        // Basic validation
        if (!/^[A-Za-z0-9]{4,20}$/.test(ifsc)) {
            return res.status(400).json({ message: 'Invalid IFSC format' });
        }

        if (!/^\d{9,18}$/.test(accountNo)) {
            return res.status(400).json({ message: 'Account number must be 9-18 digits' });
        }

        const financialDetails = { bankName, ifsc, accountNo, accountName };

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { financialDetails },
            { new: true }
        ).select('financialDetails');

        res.status(200).json({
            message: 'Financial details updated successfully',
            financialDetails: updatedEmployee.financialDetails
        });

    } catch (error) {
        console.error('Error updating financial details:', error);
        res.status(500).json({ 
            message: 'Failed to update financial details',
            error: error.message
        });
    }
};

// Admin gets employee's additional information
export const getEmployeeInfoByAdmin = async (req, res) => {
    try {
        // Check if requester is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const { employeeId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }

        const employee = await Employee.findById(employeeId)
    .select('-password -active -role')
    .select('guarantors nextOfKins'); // explicitly include them if schema excludes by default


        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ employee });

    } catch (error) {
        console.error('Error fetching employee info:', error);
        res.status(500).json({ 
            message: 'Failed to fetch employee information',
            error: error.message
        });
    }
};


export const getEmployeeInfoByEmployee = async (req, res) => {
    try {
        // Extract employee ID from the authenticated cookie session
        const employeeId = req.employee?._id; // Assuming `req.employee` is set by your auth middleware

        // If no employee ID is found in the session, deny access
        if (!employeeId) {
            return res.status(401).json({ 
                message: 'Unauthorized. Please log in.' 
            });
        }

        // Optionally, if the endpoint allows fetching by ID (e.g., `/employees/:id`), restrict access
        const requestedId = req.params.employeeId;
        if (requestedId && requestedId !== employeeId.toString()) {
            return res.status(403).json({ 
                message: 'Forbidden. You can only access your own data.' 
            });
        }

        // Fetch employee data (exclude sensitive fields)
        const employee = await Employee.findById(employeeId)
            .select('-password -active -role -salary -manager') // Exclude sensitive data
            .select('+nextOfKins +guarantors'); // Explicitly include if needed

        if (!employee) {
            return res.status(404).json({ 
                message: 'Employee not found.' 
            });
        }

        res.status(200).json({
            message: 'Your information has been retrieved successfully.',
            employee,
        });

    } catch (error) {
        console.error('Error fetching employee info:', error);
        res.status(500).json({ 
            message: 'Failed to fetch employee data.',
            error: error.message,
        });
    }
};


// Employee uploads document 
export const addDocument = async (req, res) => {
    try {
        const employeeId = req.employee?._id;
        const { documentType, additionalInfo } = req.body;

        // Validate required fields
        if (!documentType || !req.file) {
            return res.status(400).json({ 
                message: 'Document type and file are required' 
            });
        }

        // Define allowed document types with their specific validations
        const ALLOWED_DOCUMENT_TYPES = {
            OFFER_LETTER: {
                mimeTypes: ['application/pdf'],
                maxSize: 2 * 1024 * 1024, // 2MB
                requiredFields: ['effectiveDate']
            },
            BIRTH_CERTIFICATE: {
                mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
                maxSize: 5 * 1024 * 1024 // 5MB
            },
            GUARANTOR_FORM: {
                mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                maxSize: 3 * 1024 * 1024, // 3MB
                requiredFields: ['guarantorName', 'guarantorContact']
            },
            DEGREE: {
                mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
                maxSize: 5 * 1024 * 1024, // 5MB
                requiredFields: ['institution', 'yearObtained']
            },
            CERTIFICATE: {
                mimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
                maxSize: 5 * 1024 * 1024 // 5MB
            }
        };

        // Validate document type
        if (!ALLOWED_DOCUMENT_TYPES[documentType]) {
            return res.status(400).json({
                message: 'Invalid document type',
                allowedTypes: Object.keys(ALLOWED_DOCUMENT_TYPES)
            });
        }

        const documentConfig = ALLOWED_DOCUMENT_TYPES[documentType];

        // Validate file type
        if (!documentConfig.mimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                message: 'Invalid file type for this document',
                allowedTypes: documentConfig.mimeTypes
            });
        }

        // Validate file size
        if (req.file.size > documentConfig.maxSize) {
            return res.status(400).json({
                message: `File too large. Max size: ${documentConfig.maxSize / (1024 * 1024)}MB`
            });
        }

        // Validate required fields for specific document types
        if (documentConfig.requiredFields) {
            const missingFields = documentConfig.requiredFields.filter(
                field => !additionalInfo || !additionalInfo[field]
            );
            
            if (missingFields.length > 0) {
                return res.status(400).json({
                    message: `Missing required fields for ${documentType}`,
                    missingFields
                });
            }
        }

        // Construct document metadata
        const newDocument = {
            documentType,
            filePath: `/uploads/documents/${req.file.filename}`,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedAt: new Date(),
            status: 'PENDING_REVIEW', // Initial status
            additionalInfo: additionalInfo || {}
        };

        // Update employee record
        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { 
                $push: { 
                    documents: {
                        $each: [newDocument],
                        $sort: { uploadedAt: -1 } // Keep documents sorted by upload date
                    } 
                } 
            },
            { 
                new: true,
                select: 'documents'
            }
        );

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: newDocument,
            documents: updatedEmployee.documents
        });

    } catch (error) {
        console.error('Error adding document:', error);
        
        // Clean up uploaded file if error occurred
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('Error deleting uploaded file:', err);
            }
        }

        res.status(500).json({ 
            message: 'Failed to upload document',
            error: error.message,
            ...(error.errors && { detailedErrors: error.errors })
        });
    }
};