import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/admin/employees') // Updated endpoint
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error('Error fetching employees:', err));
    }, []);

    const handleAddEmployee = () => {
        navigate('/add-employee');
    };

    return (
        <div>
            <h1>Employee List</h1>
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/add">
                    <button style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Add Employee
                    </button>
                </Link>
            </div>
            <ul>
                {employees.map(emp => (
                    <li key={emp._id}>{emp.name} - {emp.position}</li>
                ))}
            </ul>
            <button onClick={handleAddEmployee} style={{ marginTop: '20px', backgroundColor: 'green', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px' }}>
                + Add Employee
            </button>
        </div>
    );
}

export default EmployeeList;
