import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaveManagement.css';
import AdminLayout from './AdminLayout';

const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [statistics, setStatistics] = useState({
        totalLeaves: 0,
        leavesTaken: 0,
        remainingLeaves: 0,
        leavesByType: { sick: 0, annual: 0, casual: 0 }
    });

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Use the admin endpoint to fetch all leaves
            const response = await axios.get('http://localhost:5000/admin/leaves', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update to handle new response structure
            const { leaves, statistics } = response.data;
            setLeaves(leaves || []);
            setStatistics(statistics || {
                totalLeaves: 0,
                leavesTaken: 0,
                remainingLeaves: 0,
                leavesByType: { sick: 0, annual: 0, casual: 0 }
            });
            setError(null);
        } catch (error) {
            console.error('Error fetching leaves:', error);
            setError('Failed to fetch leaves. Please try again later.');
            setLeaves([]);
            setStatistics({
                totalLeaves: 0,
                leavesTaken: 0,
                remainingLeaves: 0,
                leavesByType: { sick: 0, annual: 0, casual: 0 }
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/leaves/${id}/status`, 
                { status: 'approved' },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            fetchLeaves();
        } catch (err) {
            setError('Failed to approve leave. Please try again.');
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason) {
            setError('Please provide a reason for rejection');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/leaves/${id}/status`, 
                { 
                    status: 'rejected',
                    rejectionReason: rejectReason 
                },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setRejectReason('');
            setSelectedLeaveId(null);
            fetchLeaves();
        } catch (err) {
            setError('Failed to reject leave. Please try again.');
        }
    };

    if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;
    if (error) return <AdminLayout><div className="text-red-500">{error}</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Leave Management</h1>
                
                {/* Statistics Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Total Leaves</h3>
                        <p className="text-2xl font-bold">{statistics.totalLeaves}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Leaves Taken</h3>
                        <p className="text-2xl font-bold">{statistics.leavesTaken}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Remaining Leaves</h3>
                        <p className="text-2xl font-bold">{statistics.remainingLeaves}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500">Pending Requests</h3>
                        <p className="text-2xl font-bold">
                            {leaves.filter(leave => leave.status === 'pending').length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded p-2"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(Number(e.target.value))}
                        className="border rounded p-2"
                    >
                        {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Leave Applications Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 border-b">Employee</th>
                                <th className="px-6 py-3 border-b">Type</th>
                                <th className="px-6 py-3 border-b">From</th>
                                <th className="px-6 py-3 border-b">To</th>
                                <th className="px-6 py-3 border-b">Status</th>
                                <th className="px-6 py-3 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave._id}>
                                    <td className="px-6 py-4 border-b">
                                        {leave.employeeName}
                                    </td>
                                    <td className="px-6 py-4 border-b capitalize">
                                        {leave.type}
                                    </td>
                                    <td className="px-6 py-4 border-b">
                                        {new Date(leave.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 border-b">
                                        {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 border-b">
                                        <span className={`px-2 py-1 rounded ${
                                            leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b">
                                        {leave.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(leave._id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => setSelectedLeaveId(leave._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Rejection Modal */}
                {selectedLeaveId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h3 className="text-lg font-bold mb-4">Reject Leave</h3>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter reason for rejection"
                                className="w-full p-2 border rounded mb-4"
                                rows="3"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedLeaveId(null);
                                        setRejectReason('');
                                    }}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReject(selectedLeaveId)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default LeaveManagement;