import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGetAllProjects from "../Hooks/useGetAllProjects";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../context/employeeSlice";
import NotificationSender from "./NotificationSender";

function DashboardAdmin() {
  const projects = useSelector((state) => state.project.allProjects || []);
  const [payrolls, setPayrolls] = useState([]);
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  
  const { employees, status, error } = useSelector((state) => state.employees);
  const employeeCount = employees?.length || 0;

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        window.location.href = '/login';
      });
    }
  }, []);

  useGetAllProjects();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white p-6 flex flex-col justify-between fixed h-full">
        <div>
          <div className="text-center mb-8 pt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-3">
              <span className="text-3xl">👨‍💼</span>
            </div>
            <h3 className="text-xl font-semibold">{admin?.name || 'Admin'}</h3>
            <p className="text-indigo-200 text-sm">Administrator</p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs uppercase tracking-wider text-indigo-300 mb-3 px-3">Menu</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard-admin" className="flex items-center px-3 py-2 rounded-lg bg-indigo-800 text-white">
                  <span className="mr-3">📊</span> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/employees" className="flex items-center px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                  <span className="mr-3">👥</span> Employees
                </Link>
              </li>
              <li>
                <Link to="/projects" className="flex items-center px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                  <span className="mr-3">📋</span> Projects
                </Link>
              </li>
              <li>
                <Link to="/admin-payroll" className="flex items-center px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                  <span className="mr-3">💰</span> Payroll
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <button className="logout-button w-full bg-indigo-800 hover:bg-indigo-900 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center mb-4">
          <span className="mr-2">🚪</span> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Employees</h3>
                <p className="text-gray-800 text-2xl font-bold">{employeeCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Projects</h3>
                <p className="text-gray-800 text-2xl font-bold">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">Payrolls</h3>
                <p className="text-gray-800 text-2xl font-bold">{payrolls.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Send Announcement</h2>
          <NotificationSender />
        </div>

        {/* Projects and Employees Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Projects Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
              <button
                onClick={() => navigate("/add-project")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <span className="mr-1">+</span> Add Project
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-gray-500">{project.status}</div>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => navigate(`/project/${project._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length > 5 && (
                <div className="text-center mt-4">
                  <button 
                    onClick={() => navigate("/projects")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Projects →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Employees Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Recent Employees</h2>
              <button
                onClick={() => navigate("/add-employee")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center"
              >
                <span className="mr-1">+</span> Add Employee
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {employees.slice(0, 5)?.map((emp) => (
                    <tr key={emp._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div className="font-medium">{emp.name} {emp.lastName}</div>
                        <div className="text-sm text-gray-500">{emp.position}</div>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => navigate(`/employee/${emp._id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length > 5 && (
                <div className="text-center mt-4">
                  <button 
                    onClick={() => navigate("/employees")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All Employees →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Attendance</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/today-attendance")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
              >
                Today's Attendance
              </button>
              <Link to="/all-attendance-history">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-300"
                >
                  All Attendance Report
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Payrolls Section */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Payrolls</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {payrolls.slice(0, 5).map((payroll) => (
                  <tr key={payroll._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium">{payroll.employeeName}</div>
                      <div className="text-sm text-gray-500">${payroll.amount} • {payroll.status}</div>
                    </td>
                    <td className="text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {payrolls.length > 5 && (
              <div className="text-center mt-4">
                <button 
                  onClick={() => navigate("/admin-payroll")}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All Payrolls →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;