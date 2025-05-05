import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard1 from './components/Dashboard1';
import Dashboard2 from './components/Dashboard2';
import Header from './Header'; // Import Header component
import AddEmployee from './components/AddEmployee'; // Import AddEmployee component
import EmployeeList from './components/EmployeeList'; // Import EmployeeList component
import AddProject from './components/AddProject'; // Import AddProject component
import EmployeeDetails from './components/EmployeeDetails'; // Import EmployeeDetails component
import ProfileDetails from './components/ProfileDetails'; // Import ProfileDetails component
import ContactDetails from './components/ContactDetails';
import ProfileSidebar from './components/ProfileSidebar'; // Import ProfileSidebar component
import NextOfKinDetails from './components/NextOfKinDetails';
import EducationQualifications from './components/EducationQualifications';
import GuarantorDetails from './components/GuarantorDetails';
import FamilyDetails from './components/FamilyDetails';
import JobDetails from './components/JobDetails';
import FinancialDetails from './components/FinancialDetails';
import DailyReport from './components/DailyReport'; // Import DailyReport component
import AttendanceDashboard from './components/AttendanceDashboard';
import Payroll from './components/Payroll';
import Leave from './components/Leave';
import LeaveManagement from './components/LeaveManagement';
import AdminPayroll from './components/AdminPayroll';

function App() {
    const location = useLocation();
    const hideHeaderRoutes = ['/', '/login', '/register']; // Routes where Header and Sidebar should not be shown
    const showSidebarRoutes = [
        '/profile-details',
        '/contact-details',
        '/next-of-kin-details',
        '/education-qualifications',
        '/guarantor-details',
        '/family-details',
        '/job-details',
        '/financial-details',
    ]; // Routes where ProfileSidebar should be shown

    const [activeSection, setActiveSection] = useState('Personal Details'); // Track active section

    return (
        <>
            {!hideHeaderRoutes.includes(location.pathname) && <Header />} {/* Conditionally render Header */}
            <div style={{ display: 'flex' }}>
                {showSidebarRoutes.includes(location.pathname) && (
                    <div style={{ width: '250px' }}>
                        <ProfileSidebar
                            activeSection={activeSection} // Pass active section
                            onSectionClick={setActiveSection} // Update active section
                        />
                    </div>
                )}
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Login />} /> {/* Set Login as the default route */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard1" element={<Dashboard1 />} />
                        <Route path="/dashboard2" element={<Dashboard2 />} />
                        <Route path="/add" element={<AddEmployee />} /> {/* Add route for AddEmployee */}
                        <Route path="/employee-list" element={<EmployeeList />} /> {/* Add route for EmployeeList */}
                        <Route path="/add-employee" element={<AddEmployee />} /> {/* Add route for AddEmployee */}
                        <Route path="/add-project" element={<AddProject />} /> {/* Add route for AddProject */}
                        <Route path="/employee/:id" element={<EmployeeDetails />} /> {/* Add route for EmployeeDetails */}
                        <Route path="/contact-details" element={<ContactDetails />} /> {/* Add route for ContactDetails */}
                        <Route path="/profile-details" element={<ProfileDetails />} /> {/* Add route for ProfileDetails */}
                        <Route path="/next-of-kin-details" element={<NextOfKinDetails />} />
                        <Route path="/education-qualifications" element={<EducationQualifications />} />
                        <Route path="/guarantor-details" element={<GuarantorDetails />} />
                        <Route path="/family-details" element={<FamilyDetails />} />
                        <Route path="/job-details" element={<JobDetails />} />
                        <Route path="/financial-details" element={<FinancialDetails />} />
                        <Route path="/leave" element={<Leave />} />
                        <Route path="/leave-management" element={<LeaveManagement />} />
                        <Route path="/daily-report" element={<DailyReport />} /> {/* Add route for DailyReport */}
                        <Route path="/attendance" element={<AttendanceDashboard />} />
                        <Route path="/payroll" element={<Payroll />} />
                        <Route path="/admin-payroll" element={<AdminPayroll />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
