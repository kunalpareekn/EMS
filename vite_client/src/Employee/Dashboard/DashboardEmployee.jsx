import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Todo from './Todo';


  
function DashboardEmployee() {
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [checkInTime, setCheckInTime] = useState(null);
    const [timer, setTimer] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const navigate = useNavigate();
const user = useSelector((state) => state.auth.user);
    // useEffect(() => {
    //     const fetchEmployeeDetails = async () => {
    //         try {
    //             const token = localStorage.getItem('token');
    //             const email = localStorage.getItem('email');

    //             if (!token || !email) {
    //                 setError('User not authenticated.');
    //                 setLoading(false);
    //                 return;
    //             }

    //             const response = await fetch(`/api/employees?email=${encodeURIComponent(email)}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });

    //             const data = await response.json();

    //             if (!response.ok) {
    //                 throw new Error(data.message || 'Failed to fetch employee profile');
    //             }

    //             setEmployee(data);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchEmployeeDetails();
    // }, []);

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

    // if (loading) return <p className="p-4">Loading dashboard...</p>;
    // if (error) return <p className="text-red-500 p-4">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            {/* Header Card */}
            <div className="bg-emerald-200 rounded-xl p-5 mb-6 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800"> {user?.name || 'User'}</h2>
                        <p className="text-gray-600">Salesforce Developer</p>
                    </div>
                </div>
                <button 
                    onClick={handleEditProfile}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition"
                >
                    Edit Profile
                </button>
            </div>

            {/* Check In/Out Section */}
            <div className="bg-white rounded-xl p-5 mb-6 border-2 border-gray-200 flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col mb-4 md:mb-0">
                    <p className="text-emerald-400 text-lg">Welcome Back !!!</p>
                    <h3 className="text-gray-800 text-xl font-semibold">Mr./Ms. {employee?.name || 'Kunal'}</h3>
                    <img 
                        src="https://img.icons8.com/ios/100/clock--v1.png" 
                        alt="Clock Icon" 
                        className="w-12 h-12 mt-2"
                    />
                </div>
                
                <div className="flex flex-col items-center">
                    {!checkInTime ? (
                        <button 
                            onClick={handleCheckIn}
                            className="bg-emerald-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-500 transition cursor-pointer"
                        >
                            Check IN
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleCheckOut}
                                className="bg-emerald-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-500 transition cursor-pointer"
                            >
                                Check Out
                            </button>
                            <p className="text-gray-800 text-lg mt-2">Timer: {formatTime(elapsedTime)}</p>
                        </>
                    )}
                    <button 
                        onClick={handleViewReport}
                        className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition mt-4"
                    >
                        Attendance
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Announcements Card */}
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Announcement(s)</h3>
                    <ul className="space-y-2">
                        {['Welcome Saron - New staff joined', 'Sendoff for Project Manager', 'Marriage Alert', 'Office Space Update'].map((item, index) => (
                            <li key={index} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Payslip Card */}
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">April Pay slip breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-2 text-left">Earnings</th>
                                    <th className="p-2 text-left">Amount</th>
                                    <th className="p-2 text-left">Deductions</th>
                                    <th className="p-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Basic Wage', '150,000', '-30,000', '120,000'],
                                    ['Tax', '15,000', '-3,000', '12,000'],
                                    ['Pension', '15,000', '-3,000', '12,000'],
                                    ['Total Earnings', '150,000', '-36,000', '114,000']
                                ].map((row, index) => (
                                    <tr key={index} className="border-b border-gray-200">
                                        {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="p-2">{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Birthdays Card */}
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Birthdays</h3>
                    <ul className="space-y-2">
                        {[1, 2, 3].map((item) => (
                            <li key={item} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <span>Biruk Kidan - April 25th</span>
                                <button className="bg-emerald-400 text-white px-3 py-1 rounded hover:bg-emerald-500 transition">
                                    Send Wishes
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Todos Card */}
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                    <Todo/>
                </div>

                {/* Leave Management Card */}
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200">
                    <div className='flex justify-between gap-4 mb-4'>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Management</h3>
<button 
                            onClick={() => navigate('/my-leave')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            View Leaves
                        </button>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                        <button 
                            onClick={() => navigate('/leave')}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                            Apply for Leave
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardEmployee;