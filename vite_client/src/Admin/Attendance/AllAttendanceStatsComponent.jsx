import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllAttendanceStats, 
  fetchEmployeeList, 
  fetchEmployeeAttendanceDetails,
  clearEmployeeDetails
} from '../../context/attendanceSlice';

const AllAttendanceStatsComponent = () => {
  const dispatch = useDispatch();
  const { 
    employeeList, 
    employeeDetails, 
    employeeStats,
    loading, 
    error 
  } = useSelector((state) => state.attendance);
  
  const [timeRange, setTimeRange] = useState('monthly');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    const params = { range: timeRange };
    if (timeRange === 'monthly') params.year = year;
    if (timeRange === 'daily') {
      params.year = year;
      params.month = month;
    }
    dispatch(fetchAllAttendanceStats(params));
    dispatch(fetchEmployeeList({ department: departmentFilter }));
  }, [dispatch, timeRange, year, month, departmentFilter]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployee(employeeId);
    setShowEmployeeDetails(true);
    dispatch(fetchEmployeeAttendanceDetails({ 
      employeeId,
      params: { 
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`
      }
    }));
  };

  const handleBackToList = () => {
    setShowEmployeeDetails(false);
    setSelectedEmployee(null);
    dispatch(clearEmployeeDetails());
  };

  if (loading) return <div className="text-center py-8">Loading statistics...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {!showEmployeeDetails ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Attendance</h2>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label htmlFor="timeRange" className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                id="timeRange"
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {timeRange !== 'yearly' && (
              <div className="flex items-center gap-2">
                <label htmlFor="year" className="text-sm font-medium text-gray-700">Year:</label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {timeRange === 'daily' && (
              <div className="flex items-center gap-2">
                <label htmlFor="month" className="text-sm font-medium text-gray-700">Month:</label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label htmlFor="department" className="text-sm font-medium text-gray-700">Department:</label>
              <select
                id="department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Employee List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeList.map((employee) => (
                    <tr key={employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{employee.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${employee.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {employee.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEmployeeSelect(employee._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div>
          <button 
            onClick={handleBackToList}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Employee List
          </button>

          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              {employeeDetails?.name} ({employeeDetails?.employeeId})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{employeeDetails?.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{employeeDetails?.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employeeDetails?.email}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Attendance Summary ({employeeStats?.period?.start?.substring(0, 4)} - {employeeStats?.period?.end?.substring(0, 4)})</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-500">Working Days</p>
                  <p className="text-xl font-bold">{employeeStats?.period?.workingDays}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-500">Present Days</p>
                  <p className="text-xl font-bold">{employeeStats?.statistics?.presentDays}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-500">Half Days</p>
                  <p className="text-xl font-bold">{employeeStats?.statistics?.halfDays}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-500">Absent Days</p>
                  <p className="text-xl font-bold">{employeeStats?.statistics?.absentDays}</p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-500">Attendance Rate</p>
                  <p className="text-xl font-bold">
                    {(employeeStats?.statistics?.attendanceRate * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <p className="text-sm text-gray-500">Total Overtime</p>
                  <p className="text-xl font-bold">{employeeStats?.statistics?.totalOvertime} hours</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4">Recent Attendance Records</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeStats?.recentRecords?.map((record, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.clockIn ? new Date(record.clockIn).toLocaleTimeString() : '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.clockOut ? new Date(record.clockOut).toLocaleTimeString() : '--'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.effectiveHours?.toFixed(2) || '--'} hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.overtimeHours?.toFixed(2) || '0'} hours
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAttendanceStatsComponent;