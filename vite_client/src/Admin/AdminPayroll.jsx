import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../Layout/AdminLayout';

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

                const formattedData = Array.isArray(response.data) ? response.data : [];
                if (formattedData.length === 0) {
                    setError('No payroll data available for the selected period');
                } else {
                    setError(null);
                }

                setPayrollData(formattedData);
                setLoading(false);
            } catch (err) {
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

    return (
        <AdminLayout>
            <div className="p-5 max-w-screen-xl mx-auto">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-semibold text-gray-800">Employee Payroll</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-5 mb-5">
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700">Month</label>
                        <select
                            className="p-2 border border-gray-300 rounded-md text-sm"
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
                    <div className="flex flex-col gap-1">
                        <label className="font-medium text-gray-700">Year</label>
                        <select
                            className="p-2 border border-gray-300 rounded-md text-sm"
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
                    <div className="text-red-700 bg-red-100 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-gray-500 py-6">Loading payroll data...</div>
                ) : payrollData.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Allowance</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Leaves</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Net Salary</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payrollData.map((employee) => (
                                    <tr key={employee._id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4">{employee.name}</td>
                                        <td className="py-2 px-4">${employee.allowance}</td>
                                        <td className="py-2 px-4">{employee.leaves}</td>
                                        <td className="py-2 px-4">${employee.netSalary}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                                onClick={() => handleViewDetails(employee._id)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-600 bg-gray-100 p-4 rounded">
                        No payroll data available for the selected period
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPayroll;
