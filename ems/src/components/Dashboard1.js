import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard1.css";
import AdminLayout from './AdminLayout';

function Dashboard() {
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
            window.location.href = '/login'; // Update the path as per your application's routing
        });
    }
  }, []);

  return (
    <AdminLayout>
      <div className="main-content">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Employees</h3>
            <div className="stat-number">{employees.length}</div>
          </div>
          <div className="stat-card">
            <h3>Projects</h3>
            <div className="stat-number">{projects.length}</div>
          </div>
          <div className="stat-card">
            <h3>Payrolls</h3>
            <div className="stat-number">{payrolls.length}</div>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2>Projects</h2>
            <ul>
              {projects.map((project) => (
                <li key={project._id}>
                  {project.name} - {project.status} ({project.updatedAt})
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/add-project")} className="add-project-button">
              Add Project
            </button>
          </div>
          <div className="dashboard-section">
            <h2>Employees</h2>
            <ul>
              {employees.map((emp) => (
                <li key={emp._id}>
                  {emp.name} - {emp.position}
                  <button
                    onClick={() => navigate(`/employee/${emp._id}`)}
                    style={{
                      marginLeft: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/add-employee")} className="add-employee-button">
              Add Employee
            </button>
          </div>
        </div>
        <div className="dashboard-section">
          <h2>Payrolls</h2>
          <ul>
            {payrolls.map((payroll) => (
              <li key={payroll._id}>
                {payroll.employeeName} - {payroll.amount} ({payroll.status})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
