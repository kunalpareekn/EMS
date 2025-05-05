const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    manager: { type: String, required: true },
    salary: { type: Number, required: true },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },

    // Enums added below:
    jobCategory: {
        type: String,
        required: true,
        enum: [
            "Information Technology", "Human Resources", "Finance", "Marketing", "Sales", "Operations",
            "Customer Service", "Research and Development", "Engineering", "Legal", "Administration",
            "Management", "Design", "Product Management"
        ]
    },

    jobTitle: {
        type: String,
        required: true,
        enum: [
            "Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "HR Manager",
            "Financial Analyst", "Marketing Executive", "Sales Representative", "Product Manager",
            "QA Tester", "Customer Support Specialist", "UX/UI Designer", "Project Manager",
            "Legal Advisor", "Operations Coordinator", "Full Stack Developer"
        ]
    },

    position: {
        type: String,
        required: true,
        enum: [
            "Intern", "Junior", "Mid-Level", "Senior", "Lead", "Supervisor", "Manager",
            "Director", "VP", "CTO", "CFO", "CEO", "Developer" // Added "Developer"
        ]
    },

    department: {
        type: String,
        required: true,
        enum: [
            "Engineering", "HR", "Finance", "Sales", "Marketing", "IT Support", "Operations",
            "Customer Support", "Legal", "Product", "Research & Development", "Design", "Administration"
        ]
    },

    phone1: { type: String },
    phone2: { type: String },
    city: { type: String },
    address: { type: String },
    personalEmail: { type: String, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'] },

    nextOfKin: {
        name: { type: String, required: true },
        occupation: { type: String, required: true }, // Added required
        phone: { type: String, required: true },
        relationship: { type: String, required: true },
        address: { type: String, required: true }
    },

    guarantor: {
        name: { type: String, required: true },
        occupation: { type: String, required: true },
        phone: { type: String, required: true }
    },

    academicRecords: [
        {
            institution: { type: String, required: true },
            details: { type: String, required: true }
        }
    ],

    professionalQualifications: [
        {
            title: { type: String, required: true },
            organization: { type: String },
            duration: { type: String, required: true },
            description: { type: String }
        }
    ],

    familyDetails: [
        {
            fullName: { type: String, required: true },
            relationship: { type: String, required: true },
            phoneNo: { type: String, required: true },
            address: { type: String, required: true },
            occupation: { type: String } // Added occupation field
        }
    ],

    documents: [
        {
            documentType: { type: String, required: true },
            filePath: { type: String, required: true },
            fileName: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
        },
    ],

    financialDetails: {
        bankName: { type: String, required: true },
        ifsc: { type: String, required: true },
        accountNo: { type: String, required: true },
        accountName: { type: String, required: true }
    },

    active: { type: Boolean, default: true } // Auto-active when creating an account
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
