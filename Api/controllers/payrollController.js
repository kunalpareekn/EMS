const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

// Get payroll details for logged-in employee
exports.getEmployeePayroll = async (req, res) => {
    try {
        const employeeId = req.employee._id; // Get ID from authenticated employee
        const { month, year } = req.query;
        
        // First get employee details
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Get payroll data
        let payroll = await Payroll.findOne({
            employeeId,
            month,
            year
        }).populate('employeeId', 'name designation salary jobTitle department');

        if (!payroll) {
            // If no payroll exists, create a new one with default values
            payroll = new Payroll({
                employeeId,
                month,
                year,
                basicSalary: employee.salary,
                earnings: {
                    basicWage: employee.salary,
                    tax: 0,
                    pension: 0,
                    totalEarnings: employee.salary
                },
                deductions: {
                    basicWage: 0,
                    tax: 0,
                    pension: 0,
                    total: 0
                },
                total: {
                    basicWage: employee.salary,
                    tax: 0,
                    pension: 0,
                    total: employee.salary
                },
                status: 'Pending'
            });
            await payroll.save();
        }

        res.json(payroll);
    } catch (error) {
        console.error('Payroll Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update payroll details
exports.updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const payroll = await Payroll.findByIdAndUpdate(
            id, 
            updates,
            { new: true }
        ).populate('employeeId', 'name designation salary');

        if (!payroll) {
            return res.status(404).json({ message: 'Payroll not found' });
        }

        res.json(payroll);
    } catch (error) {
        console.error('Update Payroll Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all payrolls for a specific month and year
exports.getAllPayrolls = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        const payrolls = await Payroll.find({
            month,
            year
        }).populate('employeeId', 'name designation salary');

        res.json(payrolls);
    } catch (error) {
        console.error('Get All Payrolls Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all employees' payroll data for admin
exports.getAllEmployeesPayroll = async (req, res) => {
    try {
        // Get all employees who have a salary
        const employees = await Employee.find({ salary: { $exists: true } })
            .select('name salary');

        // Get current month and year if not provided
        const month = req.query.month || new Date().toLocaleString('default', { month: 'long' });
        const year = parseInt(req.query.year) || new Date().getFullYear();

        // Get payroll data for all employees
        const payrollPromises = employees.map(async (employee) => {
            const payroll = await Payroll.findOne({
                employeeId: employee._id,
                month,
                year
            });

            return {
                employeeId: employee._id,
                name: employee.name,
                allowance: payroll ? (payroll.earnings?.totalEarnings - payroll.deductions?.total || 0) : 0,
                leaves: payroll ? payroll.leaves.length : 0,
                netSalary: payroll ? payroll.total?.total || employee.salary : employee.salary
            };
        });

        const payrollData = await Promise.all(payrollPromises);
        res.json(payrollData);
    } catch (error) {
        console.error('Admin Payroll Error:', error);
        res.status(500).json({ message: error.message });
    }
}; 