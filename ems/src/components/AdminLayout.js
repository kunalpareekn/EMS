import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';
import { jwtDecode } from 'jwt-decode';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [adminInfo, setAdminInfo] = useState({
        name: localStorage.getItem('adminName') || 'Admin',
        position: localStorage.getItem('adminPosition') || 'Administrator'
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedName = localStorage.getItem('adminName');
        const storedPosition = localStorage.getItem('adminPosition');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const name = storedName || decoded.name || 'Admin';
                const position = storedPosition || decoded.position || 'Administrator';
                
                // Update localStorage with the values
                localStorage.setItem('adminName', name);
                localStorage.setItem('adminPosition', position);
                
                setAdminInfo({
                    name: name,
                    position: position
                });
            } catch (error) {
                console.error('Error decoding token:', error);
                // If there's an error, still use localStorage values if available
                if (storedName && storedPosition) {
                    setAdminInfo({
                        name: storedName,
                        position: storedPosition
                    });
                }
            }
        }
    }, []);

    const handleLogout = () => {
        // Clear admin info from localStorage
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminPosition');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="dashboard-layout">
            <div className="sidebar">
                <div className="admin-profile">
                    <div className="admin-avatar">
                        {adminInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-info">
                        <h3>{adminInfo.name}</h3>
                        <p>{adminInfo.position}</p>
                    </div>
                </div>
                <div className="sidebar-sections">
                    <h4>Features</h4>
                    <ul className="sidebar-menu">
                        <li>
                            <Link to="/dashboard1" className={isActive('/dashboard1') ? 'active' : ''}>
                                <span className="icon">📊</span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/messages" className={isActive('/messages') ? 'active' : ''}>
                                <span className="icon">✉️</span>
                                <span>Messages</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/employee-status" className={isActive('/employee-status') ? 'active' : ''}>
                                <span className="icon">👥</span>
                                <span>Employee Status</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/documents" className={isActive('/documents') ? 'active' : ''}>
                                <span className="icon">📄</span>
                                <span>Documents</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/leave-management" className={isActive('/leave-management') ? 'active' : ''}>
                                <span className="icon">📅</span>
                                <span>Leave Management</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="sidebar-sections">
                    <h4>Organization</h4>
                    <ul className="sidebar-menu">
                        <li>
                            <Link to="/admin-payroll" className={isActive('/admin-payroll') ? 'active' : ''}>
                                <span className="icon">💼</span>
                                <span>Employee Payroll</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    <span className="icon">🚪</span>
                    <span>Log Out</span>
                </button>
            </div>
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout; 