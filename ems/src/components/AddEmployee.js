import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AddEmployee.css';

function AddEmployee() {
    const [form, setForm] = useState({
        name: '',
        lastName: '',
        department: '',
        manager: '',
        jobTitle: '',
        jobCategory: '',
        email: '',
        password: '',
        position: '',
        salary: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const departments = [
        "Engineering", "HR", "Finance", "Sales", "Marketing", "IT Support", "Operations",
        "Customer Support", "Legal", "Product", "Research & Development", "Design", "Administration"
    ];

    const jobTitles = [
        "Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "HR Manager",
        "Financial Analyst", "Marketing Executive", "Sales Representative", "Product Manager",
        "QA Tester", "Customer Support Specialist", "UX/UI Designer", "Project Manager",
        "Legal Advisor", "Operations Coordinator", "Full Stack Developer"
    ];

    const jobCategories = [
        "Information Technology", "Human Resources", "Finance", "Marketing", "Sales", "Operations",
        "Customer Service", "Research and Development", "Engineering", "Legal", "Administration",
        "Management", "Design", "Product Management"
    ];

    const positions = [
        "Intern", "Junior", "Mid-Level", "Senior", "Lead", "Supervisor", "Manager",
        "Director", "VP", "CTO", "CFO", "CEO"
    ];

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/employees/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add employee');
            }

            navigate('/dashboard1');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="add-employee-container">
            <div className="sidebar">
                <div className="admin-profile">
                    <div className="admin-avatar">👤</div>
                    <div className="admin-info">
                        <h3>Xyz admin</h3>
                        <p>Admin</p>
                    </div>
                </div>
                <div className="sidebar-sections">
                    <h4>Features</h4>
                    <ul className="sidebar-menu">
                        <li><Link to="/dashboard1"><span className="icon">📊</span> Dashboard</Link></li>
                        <li><Link to="/messages"><span className="icon">✉️</span> Messages</Link></li>
                        <li><Link to="/employee-status"><span className="icon">👥</span> Employee Status</Link></li>
                        <li><Link to="/documents"><span className="icon">📄</span> Documents</Link></li>
                    </ul>
                </div>
                <div className="sidebar-sections">
                    <h4>Organization</h4>
                    <ul className="sidebar-menu">
                        <li><Link to="/employee-payroll"><span className="icon">💼</span> Employee Payroll</Link></li>
                    </ul>
                </div>
                <button className="logout-button">Log Out</button>
            </div>
            <div className="main-content">
                <h1 className="page-title">➕ Add Employee</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="add-employee-form">
                    <div className="form-row">
                        <input className="form-input" name="name" placeholder="Name" onChange={handleChange} required />
                        <input className="form-input" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <select className="form-select" name="department" onChange={handleChange} required>
                            <option value="">Select Department</option>
                            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                        <input className="form-input" name="manager" placeholder="Manager" onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <select className="form-select" name="jobTitle" onChange={handleChange} required>
                            <option value="">Select Job Title</option>
                            {jobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                        </select>
                        <select className="form-select" name="jobCategory" onChange={handleChange} required>
                            <option value="">Select Job Category</option>
                            {jobCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div className="form-row">
                        <input className="form-input" name="email" placeholder="E-Mail" type="email" onChange={handleChange} required />
                        <input className="form-input" name="password" placeholder="Password" type="password" onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <select className="form-select" name="position" onChange={handleChange} required>
                            <option value="">Select Position</option>
                            {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                        </select>
                        <input className="form-input" name="salary" placeholder="Salary" type="number" onChange={handleChange} required />
                    </div>
                    <button className="submit-button" type="submit">Add Employee</button>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;
