import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../Layout/AdminLayout';

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
            const response = await axios.get('http://localhost:5000/admin/leaves', {
                headers: { Authorization: `Bearer ${token}` }
            });

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
        } catch {
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
        } catch {
            setError('Failed to reject leave. Please try again.');
        }
    };

    if (loading) return <AdminLayout><div className="text-center text-gray-600 py-6">Loading...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Leave Management</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">
                        {error}
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-600">Total Leaves</h3>
                        <p className="text-xl font-bold">{statistics.totalLeaves}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-600">Leaves Taken</h3>
                        <p className="text-xl font-bold">{statistics.leavesTaken}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-600">Remaining Leaves</h3>
                        <p className="text-xl font-bold">{statistics.remainingLeaves}</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-gray-600">Pending Requests</h3>
                        <p className="text-xl font-bold">{leaves.filter(l => l.status === 'pending').length}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border rounded px-4 py-2"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(Number(e.target.value))}
                        className="border rounded px-4 py-2"
                    >
                        {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return <option key={year} value={year}>{year}</option>;
                        })}
                    </select>
                </div>

                {/* Leave Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {leaves
                        .filter(leave => filterStatus === 'all' || leave.status === filterStatus)
                        .filter(leave => new Date(leave.startDate).getFullYear() === filterYear)
                        .map((leave) => (
                            <div
                                key={leave._id}
                                className={`bg-white p-4 rounded shadow border-l-4 ${
                                    leave.status === 'approved' ? 'border-green-500' :
                                    leave.status === 'rejected' ? 'border-red-500' :
                                    'border-yellow-500'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Employee</p>
                                        <p className="font-semibold">{leave.employeeName}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded uppercase ${
                                        leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                                        leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {leave.status}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="capitalize">{leave.type}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500">From</p>
                                    <p>{new Date(leave.startDate).toLocaleDateString()}</p>
                                </div>
                                <div className="mb-2">
                                    <p className="text-sm text-gray-500">To</p>
                                    <p>{new Date(leave.endDate).toLocaleDateString()}</p>
                                </div>

                                {leave.status === 'pending' && (
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleApprove(leave._id)}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => setSelectedLeaveId(leave._id)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>

                {/* Rejection Modal */}
                {selectedLeaveId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-lg font-bold mb-4">Reject Leave</h2>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full border rounded p-2 mb-4"
                                placeholder="Enter rejection reason"
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
