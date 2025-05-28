import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '../Layout/AdminLayout';
import { getAllLeaves, updateLeave } from '../context/leaveSlice';

const LeaveManagement = () => {
  const dispatch = useDispatch();
  const { leaves, loading, error } = useSelector((state) => state.leave);

  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [selectedLeaveDetails, setSelectedLeaveDetails] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(getAllLeaves());
  }, [dispatch]);

  // When admin clicks "View Details"
  const handleViewDetails = (leaveId) => {
    const leave = leaves.find((l) => l._id === leaveId);
    setSelectedLeaveDetails(leave);
  };

  const handleApprove = (id) => {
    dispatch(updateLeave({ id, updatedData: { status: 'approved' } }));
  };

  const handleReject = (id) => {
    if (!rejectReason) return;
    dispatch(updateLeave({ id, updatedData: { status: 'rejected', rejectionReason: rejectReason } }));
    setRejectReason('');
    setSelectedLeaveId(null);
    setSelectedLeaveDetails(null);
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="text-center py-6">Loading...</div>
      </AdminLayout>
    );

  return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Leave Management</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-md">{error}</div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
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
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Leave Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {leaves
            .filter((leave) => filterStatus === 'all' || leave.status === filterStatus)
            .filter(
              (leave) => new Date(leave.startDate).getFullYear() === filterYear
            )
            .map((leave) => (
              <div
                key={leave._id}
                className={`bg-white p-4 rounded shadow border-l-4 ${
                  leave.status === 'approved'
                    ? 'border-green-500'
                    : leave.status === 'rejected'
                    ? 'border-red-500'
                    : 'border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Employee</p>
                    <p className="font-semibold">{leave.employeeName}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded uppercase ${
                      leave.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : leave.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="capitalize">{leave.leaveType}</p>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-500">From</p>
                  <p>{new Date(leave.startDate).toLocaleDateString()}</p>
                </div>
                <div className="mb-2">
                  <p className="text-sm text-gray-500">To</p>
                  <p>{new Date(leave.endDate).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  {leave.status === 'pending' && (
                    <>
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
                    </>
                  )}
                  <button
                    onClick={() => handleViewDetails(leave._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                  >
                    View Details
                  </button>
                </div>
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

        {/* Leave Details Modal */}
        {selectedLeaveDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Leave Details</h2>

              <p>
                <strong>Employee Name:</strong> {selectedLeaveDetails.employeeName}
              </p>
              <p>
                <strong>Department:</strong> {selectedLeaveDetails.employee.department}
              </p>
              <p>
                <strong>Leave Type:</strong> {selectedLeaveDetails.leaveType}
              </p>
              <p>
                <strong>Duration:</strong> {selectedLeaveDetails.duration} days
              </p>
              <p>
                <strong>From:</strong>{' '}
                {new Date(selectedLeaveDetails.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>To:</strong>{' '}
                {new Date(selectedLeaveDetails.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Resumption Date:</strong>{' '}
                {new Date(selectedLeaveDetails.resumptionDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Reason:</strong> {selectedLeaveDetails.reason || 'N/A'}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={`uppercase font-semibold ${
                    selectedLeaveDetails.status === 'approved'
                      ? 'text-green-600'
                      : selectedLeaveDetails.status === 'rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {selectedLeaveDetails.status}
                </span>
              </p>
              {selectedLeaveDetails.status === 'rejected' && selectedLeaveDetails.rejectionReason && (
                <p>
                  <strong>Rejection Reason:</strong> {selectedLeaveDetails.rejectionReason}
                </p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLeaveDetails(null)}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default LeaveManagement;
