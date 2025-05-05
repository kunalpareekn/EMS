import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceDashboard.css';

const AttendanceDashboard = () => {
    const [attendanceStats, setAttendanceStats] = useState({
        avgHoursPerDay: 0,
        onTimePercentage: 0
    });
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        fetchAttendanceData();
        return () => clearInterval(timer);
    }, []);

    const fetchAttendanceData = async () => {
        try {
            const [statsRes, logsRes] = await Promise.all([
                axios.get('/api/attendance/stats'),
                axios.get('/api/attendance/logs')
            ]);
            setAttendanceStats(statsRes.data);
            setAttendanceLogs(logsRes.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setIsLoading(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleClockOut = async () => {
        try {
            const todayLog = attendanceLogs.find(log => 
                new Date(log.date).toDateString() === new Date().toDateString()
            );
            if (todayLog && !todayLog.clockOut) {
                await axios.patch(`/api/attendance/clock-out/${todayLog._id}`);
                fetchAttendanceData();
            }
        } catch (error) {
            console.error('Error clocking out:', error);
        }
    };

    const formatDuration = (hours) => {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        return `${h}h ${m}m`;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="attendance-dashboard">
            <div className="dashboard-header">
                <h1>Attendance Dashboard</h1>
                <div className="current-time">
                    {formatTime(currentTime)}
                    <div className="date">{formatDate(currentTime)}</div>
                </div>
            </div>

            <div className="stats-container">
                <div className="stats-card">
                    <h2>Attendance Stats</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <label>AVG HRS / DAY</label>
                            <div className="stat-value">{formatDuration(attendanceStats.avgHoursPerDay)}</div>
                        </div>
                        <div className="stat-item">
                            <label>ON TIME ARRIVAL</label>
                            <div className="stat-value">{Math.round(attendanceStats.onTimePercentage)}%</div>
                        </div>
                    </div>
                </div>

                <div className="action-card">
                    <button 
                        className="clock-out-btn"
                        onClick={handleClockOut}
                    >
                        Web Clock-out
                    </button>
                    <div className="work-status">
                        <span className="status-label">Work From Home</span>
                        <span className="status-label">On Duty</span>
                    </div>
                </div>
            </div>

            <div className="logs-container">
                <h2>Attendance Log</h2>
                <div className="log-filters">
                    <button className="active">30 DAYS</button>
                    <button>FEB</button>
                    <button>JAN</button>
                    <button>DEC</button>
                    <button>NOV</button>
                </div>
                <table className="log-table">
                    <thead>
                        <tr>
                            <th>DATE</th>
                            <th>ATTENDANCE VISUAL</th>
                            <th>EFFECTIVE HOURS</th>
                            <th>GROSS HOURS</th>
                            <th>ARRIVAL</th>
                            <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceLogs.map(log => (
                            <tr key={log._id}>
                                <td>{formatDate(new Date(log.date))}</td>
                                <td>
                                    <div className="time-bar">
                                        <div 
                                            className="time-indicator"
                                            style={{
                                                left: '30%',
                                                width: '40%'
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>{formatDuration(log.effectiveHours)}</td>
                                <td>{formatDuration(log.grossHours)}</td>
                                <td className={log.isOnTime ? 'on-time' : 'late'}>
                                    {log.isOnTime ? 'On Time' : 'Late'}
                                </td>
                                <td>
                                    <span className={`status-dot ${log.status}`} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceDashboard;