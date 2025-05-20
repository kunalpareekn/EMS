import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";
import "./Header.css";

const Header = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');

        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        navigate('/login');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <header className="header">
            <div className="logo">

                <img src={require('./media/paarsiv-white-png-web.png')} alt="Logo" className="logo-image" />

            </div>

            <nav className="nav-links">
                <a href={email.endsWith('@gmail.com') ? "/dashboard1" : email.endsWith('@paarsiv.com') ? "/dashboard2" : "#"}>
                    Dashboard
                </a>
                <a href={email.endsWith('@gmail.com') ? "/admin-payroll" : email.endsWith('@paarsiv.com') ? "/payroll" : "#"}>
                    Payroll
                </a>
                <a href={email.endsWith('@gmail.com') ? "/leave-management" : email.endsWith('@paarsiv.com') ? "/leave" : "#"}>
                    Leave
                </a>
            </nav>

            <div className="icons">
                <div className="icon">
                    <FaBell />
                    <span className="badge"></span>
                </div>
                <div className="icon">
                    <FaEnvelope />
                    <span className="badge"></span>
                </div>
                <div className="icon profile-dropdown">
                    <FaUserCircle className="profile-icon" onClick={toggleDropdown} />
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            {username && <span className="dropdown-username">Welcome, {username}</span>}
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
