import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AdminLayout from './AdminLayout';
import AdminLayout from '../Layout/AdminLayout';

function DashboardAdmin() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employees
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data));

    // Fetch projects
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));

    // Fetch payrolls
    fetch("/api/payrolls")
      .then((res) => res.json())
      .then((data) => setPayrolls(data));
  }, []);

  useEffect(() => {
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        // Redirect to the login page
        window.location.href = '/login';
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div>
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">👨‍💼</div>
            <h3 className="text-xl font-semibold">Admin Name</h3>
            <p className="text-gray-400 text-sm">Administrator</p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-2">Menu</h4>
            <ul className="space-y-4">
              <li><Link  to={"/dashboard"} className="flex items-center"><span className="mr-2">📊</span> Dashboard</Link></li>
              <li><Link  to={"/employees"} className="flex items-center"><span className="mr-2">👥</span> Employees</Link></li>
              <li><Link to={"/projects"}  className="flex items-center"><span className="mr-2">📋</span> Projects</Link></li>
              <li><Link to={"/admin-payroll"} className="flex items-center"><span className="mr-2">💰</span> Payroll</Link></li>
            </ul>
          </div>
        </div>
        
        <button className="logout-button bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-300">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <h3 className="text-gray-600 text-lg mb-2">Employees</h3>
            <p className="text-gray-800 text-3xl font-bold">{employees.length}</p>
          </div>
          
          <div className="flex-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <h3 className="text-gray-600 text-lg mb-2">Projects</h3>
            <p className="text-gray-800 text-3xl font-bold">{projects.length}</p>
          </div>
          
          <div className="flex-1 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
            <h3 className="text-gray-600 text-lg mb-2">Payrolls</h3>
            <p className="text-gray-800 text-3xl font-bold">{payrolls.length}</p>
          </div>
        </div>

        {/* Projects and Employees Sections */}
        <div className="flex gap-8 mb-8">
          {/* Projects Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
              <button 
                onClick={() => navigate("/add-project")} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
              >
                Add Project
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id} className="border-b border-gray-200">
                      <td className="py-3">
                        {project.name} - {project.status} ({project.updatedAt})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employees Section */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
              <button 
                onClick={() => navigate("/add-employee")} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300"
              >
                Add Employee
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="border-b border-gray-200">
                      <td className="py-3">
                        {emp.name} - {emp.position}
                        <button 
                          onClick={() => navigate(`/employee/${emp._id}`)}
                          className="ml-2 bg-blue-600 text-white py-1 px-3 rounded text-sm"
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
        </div>

        {/* Payrolls Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payrolls</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {payrolls.map((payroll) => (
                  <tr key={payroll._id} className="border-b border-gray-200">
                    <td className="py-3">
                      {payroll.employeeName} - {payroll.amount} ({payroll.status})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;