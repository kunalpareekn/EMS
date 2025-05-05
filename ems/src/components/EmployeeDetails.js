import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDetails.css';

function EmployeeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch employee details for admin
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`/api/admin/employees/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employee details');
                }
                const data = await response.json();
                console.log('Fetched Employee Data:', data); // Log the fetched data
                setEmployee(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length > 1) {
            setEmployee((prev) => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value,
                },
            }));
        } else {
            setEmployee((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee details');
            }

            navigate('/Dashboard1'); // Redirect to employee list after update
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!employee) {
        return <p>Loading...</p>;
    }

    return (
        <div className="employee-details-container">
            <h1>Edit Employee Details</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="employee-details-form">
                <input
                    name="name"
                    value={employee.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <input
                    name="lastName"
                    value={employee.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                />
                <input
                    name="email"
                    value={employee.email}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                    required
                />
                <input
                    name="position"
                    value={employee.position}
                    onChange={handleChange}
                    placeholder="Position"
                    required
                />
                <input
                    name="department"
                    value={employee.department}
                    onChange={handleChange}
                    placeholder="Department"
                    required
                />
                <input
                    name="salary"
                    value={employee.salary}
                    onChange={handleChange}
                    placeholder="Salary"
                    type="number"
                    required
                />
                <div className="status-container">
                    <label>
                        <input
                            type="radio"
                            name="active"
                            value="true"
                            checked={employee.active === true}
                            onChange={() => setEmployee((prev) => ({ ...prev, active: true }))}
                        />
                        Active
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="active"
                            value="false"
                            checked={employee.active === false}
                            onChange={() => setEmployee((prev) => ({ ...prev, active: false }))}
                        />
                        Inactive
                    </label>
                </div>
                {/* Render additional fields */}
                <h2>Financial Details</h2>
                <input
                    name="financialDetails.bankName"
                    value={employee.financialDetails?.bankName || ''}
                    onChange={handleChange}
                    placeholder="Bank Name"
                />
                <input
                    name="financialDetails.accountNo"
                    value={employee.financialDetails?.accountNo || ''}
                    onChange={handleChange}
                    placeholder="Account Number"
                />
                <input
                    name="financialDetails.ifsc"
                    value={employee.financialDetails?.ifsc || ''}
                    onChange={handleChange}
                    placeholder="IFSC Code"
                />
                <h2>Next of Kin</h2>
                <input
                    name="nextOfKin.name"
                    value={employee.nextOfKin?.name || ''}
                    onChange={handleChange}
                    placeholder="Name"
                />
                <input
                    name="nextOfKin.relationship"
                    value={employee.nextOfKin?.relationship || ''}
                    onChange={handleChange}
                    placeholder="Relationship"
                />
                <input
                    name="nextOfKin.phone"
                    value={employee.nextOfKin?.phone || ''}
                    onChange={handleChange}
                    placeholder="Phone"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Employee'}
                </button>
            </form>
        </div>
    );
}

export default EmployeeDetails;
