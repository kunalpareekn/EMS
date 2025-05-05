import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import './AdminPayroll.css';

const AdminPayroll = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const navigate = useNavigate();

    const months = useMemo(() => [
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' }
    ], []);

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        const fetchPayrollData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please login to view payroll details');
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                // Convert month number to month name
                const monthName = months[selectedMonth].label;

                const response = await axios.get('http://localhost:5000/api/admin/payroll', {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        month: monthName,
                        year: selectedYear
                    }
                });

                if (!response.data) {
                    throw new Error('No data received from server');
                }

                const formattedData = Array.isArray(response.data) ? response.data : [];
                if (formattedData.length === 0) {
                    setError('No payroll data available for the selected period');
                } else {
                    setError(null);
                }

                setPayrollData(formattedData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching payroll data:', err);
                let errorMessage;
                
                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            errorMessage = 'Session expired. Please login again.';
                            navigate('/login');
                            break;
                        case 403:
                            errorMessage = 'Access denied. Only admin users can view payroll data.';
                            navigate('/');
                            break;
                        case 404:
                            errorMessage = 'No payroll data found for the selected period.';
                            break;
                        default:
                            errorMessage = err.response.data?.message || 'Failed to fetch payroll data';
                    }
                } else if (err.request) {
                    errorMessage = 'Unable to connect to server. Please check your connection.';
                } else {
                    errorMessage = err.message || 'An unexpected error occurred';
                }

                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchPayrollData();
    }, [selectedMonth, selectedYear, navigate, months]);

    const handleViewDetails = (employeeId) => {
        navigate(`/payroll/${employeeId}`);
    };

    if (loading) return (
        <AdminLayout>
            <div className="admin-payroll-container">
                <div className="loading">Loading payroll data...</div>
            </div>
        </AdminLayout>
    );

    if (error) return (
        <AdminLayout>
            <div className="admin-payroll-container">
                <div className="error-message">{error}</div>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="admin-payroll-container">
                <div className="admin-payroll-header">
                    <h2>Employee Payroll</h2>
                </div>

                <div className="admin-payroll-filters">
                    <div className="filter-group">
                        <label>Month</label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            disabled={loading}
                        >
                            {months.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Year</label>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            disabled={loading}
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading payroll data...</div>
                ) : payrollData.length > 0 ? (
                    <table className="payroll-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Allowance</th>
                                <th>Leaves</th>
                                <th>Net Salary</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrollData.map((employee) => (
                                <tr key={employee._id}>
                                    <td>{employee.name}</td>
                                    <td>${employee.allowance}</td>
                                    <td>{employee.leaves}</td>
                                    <td>${employee.netSalary}</td>
                                    <td>
                                        <button
                                            className="action-button view-button"
                                            onClick={() => handleViewDetails(employee._id)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">
                        No payroll data available for the selected period
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPayroll; 