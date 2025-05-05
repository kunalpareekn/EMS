import React, { useEffect, useState } from 'react';
import './DailyReport.css';

function DailyReport() {
    const [report, setReport] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDailyReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/daily-report', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch daily report');
                }

                setReport(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyReport();
    }, []);

    if (loading) return <p>Loading daily report...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="daily-report">
            <h2>Daily Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Check-In Time</th>
                        <th>Check-Out Time</th>
                        <th>Total Working Hours</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {report.map((entry, index) => {
                        const totalHours = entry.totalWorkingTime / 3600; // Convert seconds to hours
                        return (
                            <tr key={index}>
                                <td>{entry.date}</td>
                                <td>{new Date(entry.checkInTime).toLocaleTimeString()}</td>
                                <td>{new Date(entry.checkOutTime).toLocaleTimeString()}</td>
                                <td>{totalHours.toFixed(2)} hrs</td>
                                <td style={{ color: totalHours >= 8 ? 'green' : 'red' }}>
                                    {totalHours >= 8 ? 'Matched' : 'Not Matched'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default DailyReport;
