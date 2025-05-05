import React, { useState, useEffect } from 'react';
import './ProfileDetails.css';

function ProfileDetails() {
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const email = localStorage.getItem('email');

                if (!token || !email) {
                    setError('User not authenticated.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`/api/employees?email=${encodeURIComponent(email)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch employee profile');
                }

                setEmployee(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, []);

    if (loading) return <p className="loading">Loading dashboard...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="profile-container">
            <div className="profile-main">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {employee?.profilePicture ? (
                            <img src={employee.profilePicture} alt={`${employee.name}'s avatar`} />
                        ) : (
                            <img 
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
                                alt="Default avatar"
                            />
                        )}
                    </div>
                    <div className="profile-info">
                        <p className="label">Employee Name</p>
                        <h2>{employee?.name || 'Xyz Siz'}</h2>
                        
                        <div className="row">
                            <div className="column">
                                <p className="label">Department</p>
                                <p className="value">{employee?.department || 'Development'}</p>
                            </div>
                            <div className="column">
                                <p className="label">Manager</p>
                                <p className="value">{employee?.manager || 'Name of manager'}</p>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="column">
                                <p className="label">Job Title</p>
                                <p className="value">{employee?.position || 'Salesforce Developer'}</p>
                            </div>
                            <div className="column">
                                <p className="label">Job Category</p>
                                <p className="value">{employee?.jobCategory || 'Full time'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;