import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaEnvelope, FaUserCircle } from "react-icons/fa";

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
        <header className="flex justify-between items-center py-2 px-6 bg-gray-700 text-white shadow-md">
            <div className="flex items-center">
                {/* <img 
                    src={require('./media/paarsiv-white-png-web.png')} 
                    alt="Logo" 
                    className="h-9 w-auto" 
                /> */}
            </div>

            <nav className="flex gap-6">
                <a 
                    href={email.endsWith('@gmail.com') ? "/dashboard-admin" : email.endsWith('@paarsiv.com') ? "/dashboard-employee" : "#"}
                    className="text-white no-underline text-base transition-colors duration-300 pb-1 border-b-2 border-transparent hover:text-blue-400 hover:border-blue-400"
                >
                    Dashboard
                </a>
                <a 
                    href={email.endsWith('@gmail.com') ? "/admin-payroll" : email.endsWith('@paarsiv.com') ? "/employee-payroll" : "#"}
                    className="text-white no-underline text-base transition-colors duration-300 pb-1 border-b-2 border-transparent hover:text-blue-400 hover:border-blue-400"
                >
                    Payroll
                </a>
                <a 
                    href={email.endsWith('@gmail.com') ? "/leave-management" : email.endsWith('@paarsiv.com') ? "/leave" : "#"}
                    className="text-white no-underline text-base transition-colors duration-300 pb-1 border-b-2 border-transparent hover:text-blue-400 hover:border-blue-400"
                >
                    Leave
                </a>
            </nav>

            <div className="flex items-center gap-4">
                <div className="relative text-xl text-white cursor-pointer transition-transform duration-200 hover:scale-110">
                    <FaBell />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"></span>
                </div>
                <div className="relative text-xl text-white cursor-pointer transition-transform duration-200 hover:scale-110">
                    <FaEnvelope />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"></span>
                </div>
                <div className="relative">
                    <FaUserCircle 
                        className="text-2xl text-white cursor-pointer" 
                        onClick={toggleDropdown} 
                    />
                    {dropdownOpen && (
                        <div className="absolute top-full right-0 bg-white text-black border border-gray-300 rounded shadow-md p-2 z-50 flex flex-col items-start">
                            {username && (
                                <span className="text-sm font-bold text-gray-700 mb-1">
                                    Welcome, {username}
                                </span>
                            )}
                            <button 
                                className="bg-red-500 text-white border-none py-1 px-3 rounded text-sm cursor-pointer transition-colors duration-300 hover:bg-red-600"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;