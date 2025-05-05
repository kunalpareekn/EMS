// Dashboard2.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard2.css';

function Dashboard2() {
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [checkInTime, setCheckInTime] = useState(null);
    const [timer, setTimer] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const navigate = useNavigate();

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

    const handleEditProfile = () => navigate('/profile-details');
    const handleViewReport = () => navigate('/attendance');

    const handleCheckIn = async () => {
        const now = new Date();
        setCheckInTime(now);
        setElapsedTime(0);
        setTimer(setInterval(() => setElapsedTime(prev => prev + 1), 1000));

        try {
            const token = localStorage.getItem('token');
            await fetch('/api/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ checkInTime: now }),
            });
        } catch (err) {
            console.error('Failed to save check-in time:', err);
        }
    };

    const handleCheckOut = async () => {
        const now = new Date();
        clearInterval(timer);
        setTimer(null);

        try {
            const token = localStorage.getItem('token');
            await fetch('/api/check-out', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ checkOutTime: now, totalWorkingTime: elapsedTime }),
            });
        } catch (err) {
            console.error('Failed to save check-out time:', err);
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <p>Loading dashboard...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="dashboard">
            <div className="header-card">
                <div className="profile-info">
                    <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
                        alt="Profile" 
                        className="profile-pic" 
                    />
                    <div>
                        <h2>{employee?.name || 'Kunal Pareek'}</h2>
                        <p>Salesforce Developer</p>
                    </div>
                </div>
                <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
            </div>

            <div className="check-section">
                <div className="welcome-text">
                    <p>Welcome Back !!!</p>
                    <h3>Mr./Ms. {employee?.name || 'Kunal'}</h3>
                    <img src="https://img.icons8.com/ios/100/clock--v1.png" alt="Clock Icon" />
                </div>
                {!checkInTime ? (
                    <div className="check-card" onClick={handleCheckIn}>Check IN</div>
                ) : (
                    <>
                        <div className="check-card" onClick={handleCheckOut}>Check Out</div>
                        <p className="timer-display">Timer: {formatTime(elapsedTime)}</p>
                    </>
                )}
                <button className="view-report-btn" onClick={handleViewReport}>Attendance</button>
            </div>

            <div className="main-grid">
                <div className="card announcements">
                    <h3>Announcement(s)</h3>
                    <ul>
                        <li>Welcome Saron - New staff joined</li>
                        <li>Sendoff for Project Manager</li>
                        <li>Marriage Alert</li>
                        <li>Office Space Update</li>
                    </ul>
                </div>

                <div className="card payslip">
                    <h3>April Pay slip breakdown</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Earnings</th><th>Amount</th><th>Deductions</th><th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Basic Wage</td><td>150,000</td><td>-30,000</td><td>120,000</td></tr>
                            <tr><td>Tax</td><td>15,000</td><td>-3,000</td><td>12,000</td></tr>
                            <tr><td>Pension</td><td>15,000</td><td>-3,000</td><td>12,000</td></tr>
                            <tr><td>Total Earnings</td><td>150,000</td><td>-36,000</td><td>114,000</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="card birthdays">
                    <h3>Birthdays</h3>
                    <ul>
                        <li>Biruk Kidan - April 25th <button>Send Wishes</button></li>
                        <li>Biruk Kidan - April 25th <button>Send Wishes</button></li>
                        <li>Biruk Kidan - April 25th <button>Send Wishes</button></li>
                    </ul>
                </div>

                <div className="card todos">
                    <h3>To-dos</h3>
                    <ul>
                        <li>Complete Onboarding Document Upload</li>
                        <li>Follow up on client documents</li>
                        <li>Design wireframes for LMS</li>
                        <li>Create case study for IT project</li>
                    </ul>
                </div>

                <div className="card leave-section">
                    <h3>Leave Management</h3>
                    <div className="leave-actions">
                        <button className="apply-leave-btn" onClick={() => navigate('/leave')}>Apply for Leave</button>
                        <div className="leave-stats">
                            <p>Pending Leaves: {employee?.pendingLeaves || 0}</p>
                            <p>Approved Leaves: {employee?.approvedLeaves || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard2;