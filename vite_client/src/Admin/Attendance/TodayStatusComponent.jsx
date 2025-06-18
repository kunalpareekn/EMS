import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodayStatus } from '../../context/attendanceSlice';

const TodayStatusComponent = () => {
  const dispatch = useDispatch();
  const { todayStatus, loading, error } = useSelector((state) => state.attendance);

  useEffect(() => {
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  if (loading) return <div className="text-center py-8">Loading today's status...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  // Check if we have the nested data structure
  const statusData = todayStatus?.data || [];
  const counts = todayStatus?.counts || { present: 0, absent: 0, onBreak: 0 };

  // Group employees by status
  const presentEmployees = statusData.filter(emp => emp.status === 'present' && !emp.isOnBreak);
  const onBreakEmployees = statusData.filter(emp => emp.isOnBreak);
  const absentEmployees = statusData.filter(emp => emp.status === 'absent');

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '-';
    const time = new Date(timeString);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Today's Attendance Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <h3 className="text-gray-600 font-medium">Present</h3>
          <p className="text-2xl font-bold">{counts.present}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="text-gray-600 font-medium">Absent</h3>
          <p className="text-2xl font-bold">{counts.absent}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <h3 className="text-gray-600 font-medium">On Break</h3>
          <p className="text-2xl font-bold">{counts.onBreak}</p>
        </div>
      </div>

      {/* Present Employees Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Present Employees ({presentEmployees.length})</h3>
        {presentEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clock In</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {presentEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium">{emp.employee.name}</div>
                      <div className="text-sm text-gray-500">{emp.employee.position}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {emp.employee.department}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatTime(emp.clockIn)}
                      {emp.isLateArrival && (
                        <span className="ml-2 text-xs text-red-500">(Late)</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No employees are currently present</p>
        )}
      </div>

      {/* On Break Employees Section */}
      {onBreakEmployees.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4">Employees On Break ({onBreakEmployees.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Clock In</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Break Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {onBreakEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium">{emp.employee.name}</div>
                      <div className="text-sm text-gray-500">{emp.employee.position}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {emp.employee.department}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatTime(emp.clockIn)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {emp.currentBreakDuration} minutes
                      <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        On Break
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Absent Employees Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Absent Employees ({absentEmployees.length})</h3>
        {absentEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {absentEmployees.map((emp, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="font-medium">{emp.employee.name}</div>
                      <div className="text-sm text-gray-500">{emp.employee.email}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {emp.employee.department}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {emp.employee.position}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No employees are absent today</p>
        )}
      </div>
    </div>
  );
};

export default TodayStatusComponent;